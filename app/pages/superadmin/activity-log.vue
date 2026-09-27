<template>
	<div>
		<div class="mb-6">
			<h1 class="text-2xl font-extrabold tracking-tight text-gray-950">Activity Log</h1>
			<p class="mt-1 text-gray-500">A live feed of organizer, client, and event activity across NaSeRy.</p>
		</div>

		<div v-if="isLoading" class="rounded-2xl border border-gray-100 bg-white p-10 text-center text-sm text-gray-500">
			Loading activity...
		</div>

		<div v-else-if="errorMessage" class="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
			{{ errorMessage }}
		</div>

		<div v-else-if="!activity.length"
			class="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white px-6 py-24 text-center">
			<div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
				<IconBase name="clipboard-list" class="h-7 w-7" />
			</div>
			<h2 class="mt-4 text-lg font-bold text-gray-900">No activity yet</h2>
			<p class="mt-1 max-w-sm text-sm text-gray-500">
				Once organizers and clients start using the platform, their activity will show up here.
			</p>
		</div>

		<div v-else class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
			<div class="space-y-1">
				<div v-for="(item, index) in activity" :key="index"
					class="flex items-start gap-3 rounded-xl px-2 py-3 transition hover:bg-gray-50">
					<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
						:class="activityStyle(item.type).iconBg">
						<IconBase :name="item.icon" class="h-4 w-4" :class="activityStyle(item.type).iconColor" />
					</div>
					<div class="min-w-0 flex-1">
						<div class="text-sm text-gray-900">{{ item.label }}</div>
						<div class="mt-0.5 text-xs text-gray-400">{{ formatDateTime(item.at) }}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { superAdminService, type AdminActivityItem } from '~/services/superAdminService'

definePageMeta({
	layout: 'superadmin',
	middleware: ['superadmin'],
})

const { token } = useAuth('superadmin')

const activity = ref<AdminActivityItem[]>([])
const isLoading = ref(false)
const errorMessage = ref('')

async function loadActivity() {
	if (!token.value) {
		return
	}

	isLoading.value = true
	errorMessage.value = ''

	try {
		const response = await superAdminService.getActivity(token.value)
		activity.value = response.data
	} catch (error: unknown) {
		errorMessage.value = getApiErrorMessage(error, 'Unable to load the activity log.')
	} finally {
		isLoading.value = false
	}
}

function getApiErrorMessage(error: unknown, fallback: string): string {
	const apiError = error as { data?: { message?: string } }
	return apiError?.data?.message || fallback
}

function formatDateTime(value: string) {
	return new Date(value).toLocaleString('en-US', {
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
	})
}

const activityStyles: Record<string, { iconBg: string, iconColor: string }> = {
	organizer_joined: { iconBg: 'bg-primary-50', iconColor: 'text-primary-700' },
	client_joined: { iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
	quotation_accepted: { iconBg: 'bg-green-50', iconColor: 'text-green-600' },
	quotation_rejected: { iconBg: 'bg-red-50', iconColor: 'text-red-600' },
	event_created: { iconBg: 'bg-gray-100', iconColor: 'text-gray-500' },
	event_activity: { iconBg: 'bg-violet-50', iconColor: 'text-violet-600' },
	review_received: { iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
}

function activityStyle(type: string) {
	return activityStyles[type] ?? { iconBg: 'bg-gray-100', iconColor: 'text-gray-500' }
}

onMounted(() => {
	loadActivity()
})
</script>
