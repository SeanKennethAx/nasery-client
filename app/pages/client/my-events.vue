<template>
	<div>
		<div class="mb-6 flex flex-wrap items-start justify-between gap-3">
			<div>
				<p class="text-sm font-semibold text-primary-700">
					Client Portal
				</p>

				<h1 class="mt-1 text-2xl font-extrabold text-gray-900">
					Hi there, {{ clientName }} &#128075;
				</h1>

				<p class="mt-1 text-gray-500">
					Post an event inquiry and let organizers come to you.
				</p>
			</div>

			<button type="button"
				class="flex w-full items-center justify-center gap-2 rounded-xl bg-[#285F6b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1f4a54] sm:w-auto sm:shrink-0"
				@click="navigateTo('/client/post-event')">
				<IconBase name="plus" class="h-4 w-4 shrink-0" />

				Post New Event
			</button>
		</div>

		<div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
			<div v-for="stat in stats" :key="stat.label" class="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
				<div class="flex items-start justify-between">
					<span class="text-sm text-gray-500">
						{{ stat.label }}
					</span>

					<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" :class="stat.iconBg">
						<IconBase :name="stat.icon" class="h-4 w-4" :class="stat.iconColor" />
					</div>
				</div>

				<div class="mt-2 text-3xl font-extrabold text-gray-900">
					{{ stat.value }}
				</div>
			</div>
		</div>

		<!-- Loading -->
		<div v-if="isLoading" class="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
			Loading your inquiries...
		</div>

		<!-- Error -->
		<div v-else-if="errorMessage" class="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
			{{ errorMessage }}
		</div>

		<!-- Inquiry Cards -->
		<div v-else-if="clientEvents.length" class="space-y-4">
			<div v-for="event in clientEvents" :key="event.id"
				class="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
				<div class="flex flex-wrap items-start justify-between gap-3">
					<div class="flex min-w-0 items-start gap-3">
						<div
							class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
							<IconBase :name="eventTypeIcon(event.event_type)" class="h-5 w-5" />
						</div>

						<div class="min-w-0">
							<h3 class="truncate text-base font-bold text-gray-900">
								{{
									event.event_title ||
									event.event_type + ' Inquiry'
								}}
							</h3>

							<p class="mt-0.5 text-sm text-gray-500">
								{{ event.event_type }}
								&bull;
								{{ formatDate(event.event_date) }}
								&bull;
								{{ event.location }}
							</p>
						</div>
					</div>

					<span
						class="shrink-0 rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600">
						Awaiting bids
					</span>
				</div>

				<div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
					<div class="rounded-lg bg-gray-50 p-3">
						<div class="text-xs text-gray-500">
							Guests
						</div>

						<div class="mt-1 text-sm font-bold text-gray-900">
							{{ event.expected_guests }}
						</div>
					</div>

					<div class="rounded-lg bg-gray-50 p-3">
						<div class="text-xs text-gray-500">
							Budget
						</div>

						<div class="mt-1 truncate text-sm font-bold text-gray-900">
							{{ event.budget_range }}
						</div>
					</div>
				</div>

				<div v-if="event.additional_details" class="mt-4 rounded-lg bg-gray-50 p-3">
					<div class="text-xs text-gray-500">
						Additional Details
					</div>

					<p class="mt-1 text-sm text-gray-700">
						{{ event.additional_details }}
					</p>
				</div>
			</div>
		</div>

		<!-- Empty State -->
		<div v-else
			class="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50/60 px-5 py-16 text-center sm:px-6 sm:py-20">
			<div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
				<IconBase name="sparkles" class="h-6 w-6" />
			</div>

			<h2 class="mt-4 text-lg font-bold text-gray-900">
				No event inquiries yet
			</h2>

			<p class="mt-1 max-w-sm text-sm text-gray-500">
				Post your first event inquiry and qualified organizers will
				submit bids for you to review.
			</p>

			<button type="button"
				class="mt-5 flex items-center gap-2 rounded-xl bg-[#285F6b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1f4a54]"
				@click="navigateTo('/client/post-event')">
				<IconBase name="plus" class="h-4 w-4" />

				Post My First Event
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
interface ClientInquiry {
	id: number
	client_id: number
	event_title: string | null
	event_type: string
	event_date: string
	location: string
	expected_guests: number
	budget_range: string
	additional_details: string | null
	created_at: string
	updated_at: string
}

interface ClientInquiryResponse {
	data: ClientInquiry[]
}

definePageMeta({
	layout: 'client',
})

const {
	firstName,
	token,
} = useAuth()

const config = useRuntimeConfig()

const clientName = computed(() => {
	return firstName.value || 'Client'
})

const clientEvents =
	ref<ClientInquiry[]>([])

const isLoading = ref(false)

const errorMessage = ref('')

const eventTypeIcons:
	Record<string, string> = {
	Wedding: 'heart',
	Corporate: 'briefcase',
	Birthday: 'gift',
	Debut: 'star',
	Concert: 'music',
	Conference: 'users',
	Reunion: 'users',
	Seminar: 'award',
}

function eventTypeIcon(
	type: string
): string {
	return (
		eventTypeIcons[type] ??
		'sparkles'
	)
}

function formatDate(
	dateStr: string
): string {
	if (!dateStr) {
		return ''
	}

	const date =
		dateStr.includes('T')
			? new Date(dateStr)
			: new Date(
				`${dateStr}T00:00:00`
			)

	return date.toLocaleDateString(
		'en-US',
		{
			month: 'long',
			day: 'numeric',
			year: 'numeric',
		}
	)
}

async function loadClientInquiries() {
	if (!token.value) {
		errorMessage.value =
			'You are not authenticated.'

		return
	}

	isLoading.value = true
	errorMessage.value = ''

	try {
		const response =
			await $fetch<ClientInquiryResponse>(
				`${config.public.apiBaseURL}/inquiries/client`,
				{
					method: 'GET',

					headers: {
						Accept:
							'application/json',

						Authorization:
							`Bearer ${token.value}`,
					},
				}
			)

		clientEvents.value =
			response.data

	} catch (error: unknown) {
		console.error(
			'Failed to load client inquiries:',
			error
		)

		if (
			typeof error === 'object' &&
			error !== null
		) {
			const apiError = error as {
				data?: {
					message?: string
				}
			}

			if (
				apiError.data?.message
			) {
				errorMessage.value =
					apiError.data.message

				return
			}
		}

		errorMessage.value =
			'Unable to load your inquiries.'
	} finally {
		isLoading.value = false
	}
}

onMounted(() => {
	loadClientInquiries()
})

const stats = computed(() => [
	{
		label: 'Total Inquiries',

		value:
			clientEvents.value.length,

		icon:
			'file-text',

		iconBg:
			'bg-gray-100',

		iconColor:
			'text-gray-500',
	},

	{
		label: 'Receiving Bids',

		value: 0,

		icon:
			'sparkles',

		iconBg:
			'bg-gray-100',

		iconColor:
			'text-gray-500',
	},

	{
		label: 'Awarded Events',

		value: 0,

		icon:
			'award',

		iconBg:
			'bg-green-50',

		iconColor:
			'text-green-600',
	},

	{
		label: 'Open Events',

		value:
			clientEvents.value.length,

		icon:
			'clock',

		iconBg:
			'bg-amber-50',

		iconColor:
			'text-amber-600',
	},
])
</script>