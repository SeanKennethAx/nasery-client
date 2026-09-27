<template>
	<div>
		<SuperadminPageHeader />

		<div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
			<h2 class="text-lg font-bold text-gray-900">Event Tags</h2>
			<p class="mt-1 text-sm text-gray-500">
				Manage the event tags organizers can select on their profile. These tags are also what client
				inquiries are matched against.
			</p>

			<form class="mt-5 flex flex-col gap-3 sm:flex-row" @submit.prevent="createTag">
				<div class="flex-1">
					<FormsTextField v-model="newTagName" placeholder="e.g. Gala Night" :disabled="isCreating" />
				</div>
				<button type="submit"
					class="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60"
					:disabled="isCreating || !newTagName.trim()">
					<IconBase :name="isCreating ? 'refresh-cw' : 'plus'" class="h-4 w-4" :class="{ 'animate-spin': isCreating }" />
					Add Tag
				</button>
			</form>

			<p v-if="formError" class="mt-3 text-sm text-red-600">{{ formError }}</p>

			<div v-if="isLoading" class="mt-8 py-10 text-center text-sm text-gray-500">
				Loading event tags...
			</div>

			<div v-else-if="errorMessage" class="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
				{{ errorMessage }}
			</div>

			<div v-else-if="!tags.length" class="mt-8 rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-400">
				No event tags yet. Add one above to get started.
			</div>

			<div v-else class="mt-6 divide-y divide-gray-100 border-t border-gray-100">
				<div v-for="tag in tags" :key="tag.id" class="flex items-center gap-3 py-3.5">
					<span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
						<IconBase name="tag" class="h-4 w-4" />
					</span>

					<div class="min-w-0 flex-1">
						<FormsTextField v-if="editingId === tag.id" v-model="editingName" :disabled="isSavingEdit" />
						<span v-else class="text-sm font-semibold text-gray-900">{{ tag.name }}</span>
					</div>

					<div v-if="editingId === tag.id" class="flex shrink-0 items-center gap-2">
						<button type="button" class="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-50" :disabled="isSavingEdit" @click="cancelEdit">
							Cancel
						</button>
						<button type="button" class="rounded-lg bg-primary-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-primary-800 disabled:opacity-60" :disabled="isSavingEdit || !editingName.trim()" @click="saveEdit(tag)">
							{{ isSavingEdit ? 'Saving...' : 'Save' }}
						</button>
					</div>
					<div v-else class="flex shrink-0 items-center gap-2">
						<button type="button" :aria-label="`Edit ${tag.name}`" class="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700" @click="startEdit(tag)">
							<IconBase name="edit" class="h-4 w-4" />
						</button>
						<button type="button" :aria-label="`Remove ${tag.name}`" class="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600" :disabled="deletingId === tag.id" @click="removeTag(tag)">
							<IconBase :name="deletingId === tag.id ? 'refresh-cw' : 'trash'" class="h-4 w-4" :class="{ 'animate-spin': deletingId === tag.id }" />
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { superAdminService, type AdminEventTag } from '~/services/superAdminService'

definePageMeta({
	layout: 'superadmin',
	middleware: ['superadmin'],
})

const { token } = useAuth('superadmin')

const tags = ref<AdminEventTag[]>([])
const isLoading = ref(false)
const errorMessage = ref('')

const newTagName = ref('')
const isCreating = ref(false)
const formError = ref('')

const editingId = ref<number | null>(null)
const editingName = ref('')
const isSavingEdit = ref(false)

const deletingId = ref<number | null>(null)

function getApiErrorMessage(error: unknown, fallback: string): string {
	const apiError = error as { data?: { message?: string, errors?: Record<string, string[]> } }
	const validationMessage = Object.values(apiError?.data?.errors ?? {})[0]?.[0]
	return validationMessage ?? apiError?.data?.message ?? fallback
}

async function loadTags() {
	if (!token.value) return

	isLoading.value = true
	errorMessage.value = ''

	try {
		const response = await superAdminService.getEventTags(token.value)
		tags.value = response.data
	} catch (error: unknown) {
		errorMessage.value = getApiErrorMessage(error, 'Unable to load event tags.')
	} finally {
		isLoading.value = false
	}
}

async function createTag() {
	if (!token.value || !newTagName.value.trim()) return

	isCreating.value = true
	formError.value = ''

	try {
		const response = await superAdminService.createEventTag(token.value, newTagName.value.trim())
		tags.value = [...tags.value, response.data].sort((a, b) => a.name.localeCompare(b.name))
		newTagName.value = ''
	} catch (error: unknown) {
		formError.value = getApiErrorMessage(error, 'Unable to create event tag.')
	} finally {
		isCreating.value = false
	}
}

function startEdit(tag: AdminEventTag) {
	editingId.value = tag.id
	editingName.value = tag.name
}

function cancelEdit() {
	editingId.value = null
	editingName.value = ''
}

async function saveEdit(tag: AdminEventTag) {
	if (!token.value || !editingName.value.trim()) return

	isSavingEdit.value = true
	errorMessage.value = ''

	try {
		const response = await superAdminService.updateEventTag(token.value, tag.id, editingName.value.trim())
		const index = tags.value.findIndex(item => item.id === tag.id)
		if (index !== -1) tags.value[index] = response.data
		tags.value.sort((a, b) => a.name.localeCompare(b.name))
		cancelEdit()
	} catch (error: unknown) {
		errorMessage.value = getApiErrorMessage(error, 'Unable to update event tag.')
	} finally {
		isSavingEdit.value = false
	}
}

async function removeTag(tag: AdminEventTag) {
	if (!token.value || deletingId.value !== null) return

	const confirmed = window.confirm(`Remove the "${tag.name}" tag? Organizers who already selected it will keep it on their profile, but it will no longer be selectable.`)
	if (!confirmed) return

	deletingId.value = tag.id
	errorMessage.value = ''

	try {
		await superAdminService.deleteEventTag(token.value, tag.id)
		tags.value = tags.value.filter(item => item.id !== tag.id)
	} catch (error: unknown) {
		errorMessage.value = getApiErrorMessage(error, 'Unable to remove event tag.')
	} finally {
		deletingId.value = null
	}
}

onMounted(() => {
	loadTags()
})
</script>
