<template>
	<div class="rounded-2xl border border-gray-200 bg-white p-6">
		<div v-if="isLoading" class="py-10 text-center text-sm text-gray-500">
			Loading preparation checklist...
		</div>

		<div v-else-if="errorMessage" class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
			{{ errorMessage }}
		</div>

		<template v-else-if="event">
			<div class="mb-6">
				<h2 class="text-lg font-bold text-gray-900">
					Dynamic Preparation Tracking
				</h2>

				<p class="text-sm text-gray-500">
					Track preparation progress for
					<span class="font-semibold text-gray-700">
						{{ event.name }}
					</span>
				</p>
			</div>

			<div class="mb-1 flex items-center justify-between">
				<span class="text-base font-bold text-gray-900">
					Overall Event Readiness
				</span>

				<span class="text-2xl font-extrabold text-gray-900">
					{{ readinessPercent }}%
				</span>
			</div>

			<div class="relative mb-6 h-8 w-full overflow-hidden rounded-full bg-gray-100">
				<div class="h-full rounded-full bg-primary-700 transition-all duration-200" :style="{
					width:
						readinessPercent +
						'%',
				}" />

				<span class="absolute inset-0 flex items-center justify-center text-sm font-semibold" :class="readinessPercent >= 45
					? 'text-white'
					: 'text-gray-700'
					">
					{{ completedCount }}/{{ checklist.length }}
					completed
				</span>
			</div>

			<div v-if="checklist.length" class="space-y-3">
				<div v-for="item in checklist" :key="item.id"
					class="flex w-full items-center gap-3 rounded-xl border border-gray-200 px-4 py-3.5 transition hover:bg-gray-50">
					<button type="button" class="flex flex-1 items-center gap-3 text-left" :disabled="updatingItemId === item.id
						" @click="toggleItem(item)">
						<IconBase v-if="item.is_completed" name="check-circle"
							class="h-5 w-5 shrink-0 text-green-600" />

						<span v-else class="h-5 w-5 shrink-0 rounded-full border-2 border-gray-300" />

						<span class="flex-1 text-sm font-medium" :class="item.is_completed
							? 'text-gray-400 line-through'
							: 'text-gray-900'
							">
							{{ item.label }}
						</span>

						<IconBase v-if="
							updatingItemId ===
							item.id
						" name="refresh-cw" class="h-4 w-4 animate-spin text-gray-400" />
					</button>

					<button type="button"
						class="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
						:disabled="deletingItemId === item.id
							" @click="
								removeChecklistItem(
									item,
								)
								">
						<IconBase :name="deletingItemId === item.id
							? 'refresh-cw'
							: 'trash'
							" class="h-4 w-4" :class="{
								'animate-spin':
									deletingItemId ===
									item.id,
							}" />
					</button>
				</div>
			</div>

			<div v-else class="rounded-xl border border-dashed border-gray-300 p-8 text-center">
				<p class="text-sm text-gray-500">
					No preparation items yet.
				</p>
			</div>

			<div class="mt-5">
				<button v-if="!showAddForm" type="button"
					class="flex items-center gap-2 rounded-xl bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
					@click="
						showAddForm =
						true
						">
					<IconBase name="plus" class="h-4 w-4" />

					Add Checklist Item
				</button>

				<div v-else class="rounded-xl border border-gray-200 bg-gray-50 p-4">
					<label class="mb-1.5 block text-sm font-semibold text-gray-700">
						Checklist Item
					</label>

					<input v-model="newItemLabel" type="text" placeholder="e.g. Final supplier confirmation"
						class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15"
						:disabled="isAddingItem" @keyup.enter="
							addChecklistItem
						" />

					<div class="mt-3 flex justify-end gap-2">
						<button type="button"
							class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
							:disabled="isAddingItem" @click="cancelAddItem">
							Cancel
						</button>

						<button type="button"
							class="flex items-center gap-2 rounded-lg bg-[#285F6b] px-3 py-2 text-sm font-semibold text-white hover:bg-[#1f4a54] disabled:cursor-not-allowed disabled:opacity-60"
							:disabled="isAddingItem ||
								!newItemLabel.trim()
								" @click="
									addChecklistItem
								">
							<IconBase v-if="isAddingItem" name="refresh-cw" class="h-4 w-4 animate-spin" />

							{{
								isAddingItem
									? 'Adding...'
									: 'Add Item'
							}}
						</button>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
interface OrganizerEvent {
	id: number
	name: string
	event_type?: string
	event_date?: string | null
	location?: string | null
	expected_guests?: number | null
	start_time?: string | null
	end_time?: string | null
	status?: string
}

interface PreparationItem {
	id: number
	event_id: number
	label: string
	is_completed: boolean
	created_at?: string
	updated_at?: string
}

type EventResponse =
	| OrganizerEvent
	| {
		data: OrganizerEvent
	}

interface PreparationListResponse {
	data: PreparationItem[]
}

interface PreparationItemResponse {
	message?: string
	data: PreparationItem
}

interface ApiErrorResponse {
	data?: {
		message?: string
		errors?: Record<string, string[]>
	}
}

function getApiErrorMessage(
	error: unknown,
	fallback: string,
): string {
	const apiError =
		error as ApiErrorResponse

	const validationError =
		Object.values(
			apiError.data?.errors ?? {},
		)[0]?.[0]

	return (
		validationError ??
		apiError.data?.message ??
		fallback
	)
}

definePageMeta({
	layout: 'dashboard',
	middleware: ['organizer'],
})

const route =
	useRoute()

const config =
	useRuntimeConfig()

const {
	token,
} = useAuth()

const event =
	ref<OrganizerEvent | null>(null)

const checklist =
	ref<PreparationItem[]>([])

const isLoading =
	ref(false)

const isAddingItem =
	ref(false)

const updatingItemId =
	ref<number | null>(null)

const deletingItemId =
	ref<number | null>(null)

const errorMessage =
	ref('')

const showAddForm =
	ref(false)

const newItemLabel =
	ref('')

/*
 * ============================================================
 * SELECTED EVENT
 * ============================================================
 */

const eventId =
	computed<number | null>(() => {
		const value =
			route.query.event

		if (
			typeof value !==
			'string'
		) {
			return null
		}

		const id =
			Number(value)

		return Number.isFinite(id)
			? id
			: null
	})

/*
 * ============================================================
 * READINESS
 * ============================================================
 */

const completedCount =
	computed(() =>
		checklist.value.filter(
			item =>
				item.is_completed,
		).length,
	)

const readinessPercent =
	computed(() => {
		if (
			!checklist.value.length
		) {
			return 0
		}

		return Math.round(
			(
				completedCount.value /
				checklist.value.length
			) *
			100,
		)
	})

/*
 * ============================================================
 * RESPONSE HELPER
 * ============================================================
 */

function extractEvent(
	response: EventResponse,
): OrganizerEvent {
	if (
		typeof response === 'object' &&
		response !== null &&
		'data' in response
	) {
		return (
			response as {
				data: OrganizerEvent
			}
		).data
	}

	return response as OrganizerEvent
}

/*
 * ============================================================
 * LOAD EVENT + PREPARATION ITEMS
 * ============================================================
 */

async function loadPreparation() {
	errorMessage.value =
		''

	if (!token.value) {
		errorMessage.value =
			'You are not authenticated.'

		return
	}

	if (!eventId.value) {
		await navigateTo(
			'/organizer/eventmanagement/all-events',
			{
				replace: true,
			},
		)

		return
	}

	isLoading.value =
		true

	try {
		const [
			eventResponse,
			preparationResponse,
		] = await Promise.all([
			$fetch<EventResponse>(
				`${config.public.apiBaseURL}/organizer/events/${eventId.value}`,
				{
					method:
						'GET',

					headers: {
						Accept:
							'application/json',

						Authorization:
							`Bearer ${token.value}`,
					},
				},
			),

			$fetch<PreparationListResponse>(
				`${config.public.apiBaseURL}/organizer/events/${eventId.value}/preparation-items`,
				{
					method:
						'GET',

					headers: {
						Accept:
							'application/json',

						Authorization:
							`Bearer ${token.value}`,
					},
				},
			),
		])

		event.value =
			extractEvent(
				eventResponse,
			)

		checklist.value =
			preparationResponse.data ??
			[]

	} catch (error: unknown) {
		console.error(
			'Failed to load preparation tracking:',
			error,
		)

		errorMessage.value =
			getApiErrorMessage(
				error,
				'Unable to load preparation tracking.',
			)

	} finally {
		isLoading.value =
			false
	}
}

/*
 * ============================================================
 * TOGGLE CHECKLIST ITEM
 * ============================================================
 */

async function toggleItem(
	item: PreparationItem,
) {
	if (
		!token.value ||
		!eventId.value
	) {
		return
	}

	if (
		updatingItemId.value !==
		null
	) {
		return
	}

	updatingItemId.value =
		item.id

	errorMessage.value =
		''

	try {
		const response =
			await $fetch<PreparationItemResponse>(
				`${config.public.apiBaseURL}/organizer/events/${eventId.value}/preparation-items/${item.id}`,
				{
					method:
						'PUT',

					headers: {
						Accept:
							'application/json',

						Authorization:
							`Bearer ${token.value}`,
					},

					body: {
						is_completed:
							!item.is_completed,
					},
				},
			)

		const index =
			checklist.value.findIndex(
				checklistItem =>
					checklistItem.id ===
					item.id,
			)

		if (
			index !== -1
		) {
			checklist.value[
				index
			] =
				response.data
		}

	} catch (error: unknown) {
		console.error(
			'Failed to update checklist item:',
			error,
		)

		errorMessage.value =
			getApiErrorMessage(
				error,
				'Unable to update checklist item.',
			)

	} finally {
		updatingItemId.value =
			null
	}
}

/*
 * ============================================================
 * ADD CHECKLIST ITEM
 * ============================================================
 */

async function addChecklistItem() {
	if (
		!token.value ||
		!eventId.value
	) {
		return
	}

	const label =
		newItemLabel.value.trim()

	if (!label) {
		return
	}

	isAddingItem.value =
		true

	errorMessage.value =
		''

	try {
		const response =
			await $fetch<PreparationItemResponse>(
				`${config.public.apiBaseURL}/organizer/events/${eventId.value}/preparation-items`,
				{
					method:
						'POST',

					headers: {
						Accept:
							'application/json',

						Authorization:
							`Bearer ${token.value}`,
					},

					body: {
						label,
					},
				},
			)

		checklist.value.push(
			response.data,
		)

		newItemLabel.value =
			''

		showAddForm.value =
			false

	} catch (error: unknown) {
		console.error(
			'Failed to add checklist item:',
			error,
		)

		errorMessage.value =
			getApiErrorMessage(
				error,
				'Unable to add checklist item.',
			)

	} finally {
		isAddingItem.value =
			false
	}
}

function cancelAddItem() {
	if (
		isAddingItem.value
	) {
		return
	}

	newItemLabel.value =
		''

	showAddForm.value =
		false
}
async function removeChecklistItem(
	item: PreparationItem,
) {
	if (
		!token.value ||
		!eventId.value
	) {
		return
	}

	if (
		deletingItemId.value !==
		null
	) {
		return
	}

	const confirmed =
		window.confirm(
			`Remove "${item.label}" from this event checklist?`,
		)

	if (!confirmed) {
		return
	}

	deletingItemId.value =
		item.id

	errorMessage.value =
		''

	try {
		await $fetch(
			`${config.public.apiBaseURL}/organizer/events/${eventId.value}/preparation-items/${item.id}`,
			{
				method:
					'DELETE',

				headers: {
					Accept:
						'application/json',

					Authorization:
						`Bearer ${token.value}`,
				},
			},
		)

		checklist.value =
			checklist.value.filter(
				checklistItem =>
					checklistItem.id !==
					item.id,
			)

	} catch (error: unknown) {
		console.error(
			'Failed to delete checklist item:',
			error,
		)

		errorMessage.value =
			getApiErrorMessage(
				error,
				'Unable to delete checklist item.',
			)

	} finally {
		deletingItemId.value =
			null
	}
}

watch(
	eventId,
	() => {
		showAddForm.value =
			false

		newItemLabel.value =
			''

		loadPreparation()
	},
)

onMounted(() => {
	loadPreparation()
})
</script>