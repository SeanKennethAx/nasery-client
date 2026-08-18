<template>
	<div class="mx-auto max-w-3xl">
		<NuxtLink to="/client/my-events"
			class="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-700">
			<IconBase name="arrow-right" class="h-4 w-4 rotate-180" />

			Back to Dashboard
		</NuxtLink>

		<h1 class="text-2xl font-extrabold text-gray-900">
			Post an Event Inquiry
		</h1>

		<p class="mt-1 text-gray-500">
			Fill in your event details. Qualified organizers will submit bids for your review.
		</p>

		<div class="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
			<FormsLabel text="Event Title" hint="(optional)" />

			<FormsTextField v-model="form.title" placeholder="e.g. Marlo & Rena Wedding" />

			<label class="mb-2 mt-5 block text-sm font-semibold text-gray-700">
				Event Type
				<span class="text-rose-500">*</span>
			</label>

			<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
				<button v-for="type in eventTypes" :key="type.value" type="button"
					class="flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-center" :class="form.eventType === type.value
							? 'border-[#285F6b] bg-primary-50 ring-1 ring-[#285F6b]'
							: 'border-gray-200 text-gray-600 hover:bg-gray-50'
						" @click="form.eventType = type.value">
					<div class="flex h-9 w-9 items-center justify-center rounded-lg" :class="form.eventType === type.value
							? 'bg-[#285F6b] text-white'
							: 'bg-gray-100 text-gray-500'
						">
						<IconBase :name="type.icon" class="h-4 w-4" />
					</div>

					<span class="text-sm font-semibold" :class="form.eventType === type.value
							? 'text-[#285F6b]'
							: 'text-gray-700'
						">
						{{ type.value }}
					</span>
				</button>
			</div>

			<div class="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div>
					<FormsLabel text="Event Date" required />

					<FormsTextField v-model="form.date" type="date" icon="calendar" required />
				</div>

				<div>
					<FormsLabel text="Location" required />

					<FormsTextField v-model="form.location" icon="map-pin" placeholder="City / venue area" required />
				</div>
			</div>

			<div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div>
					<FormsLabel text="Expected Guests" required />

					<FormsTextField v-model="form.guests" type="number" min="1" icon="users" placeholder="e.g. 150"
						required />
				</div>

				<div>
					<label class="mb-1.5 block text-sm font-semibold text-gray-700">
						Budget Range
						<span class="text-rose-500">*</span>
					</label>

					<div class="relative">
						<IconBase name="peso"
							class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

						<select v-model="form.budget"
							class="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-8 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15">
							<option value="" disabled>
								Select range
							</option>

							<option v-for="range in budgetRanges" :key="range" :value="range">
								{{ range }}
							</option>
						</select>

						<IconBase name="chevron-down"
							class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
					</div>
				</div>
			</div>

			<label class="mb-1.5 mt-4 block text-sm font-semibold text-gray-700">
				Additional Details

				<span class="font-normal text-gray-400">
					(theme, special requests, etc.)
				</span>
			</label>

			<textarea v-model="form.details" rows="4"
				placeholder="Describe your vision, preferred theme, special requests, or anything organizers should know..."
				class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15" />

			<!-- Error Message -->
			<div v-if="errorMessage"
				class="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
				{{ errorMessage }}
			</div>

			<button type="button"
				class="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#285F6b] py-3.5 text-sm font-bold text-white hover:bg-[#1f4a54] disabled:cursor-not-allowed disabled:opacity-60"
				:disabled="!isValid || isSubmitting" @click="submitInquiry">
				<template v-if="isSubmitting">
					Submitting Inquiry...
				</template>

				<template v-else>
					<IconBase name="send" class="h-4 w-4" />

					Submit Inquiry &amp; Find Organizers
				</template>
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
interface CreateInquiryPayload {
	event_title?: string
	event_type: string
	event_date: string
	location: string
	expected_guests: number
	budget_range: string
	additional_details?: string
}

interface CreateInquiryResponse {
	message: string

	data: {
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
}

definePageMeta({
	layout: 'client',
})

const {
	token,
} = useAuth()

const config = useRuntimeConfig()

const eventTypes = [
	{
		value: 'Wedding',
		icon: 'heart',
	},
	{
		value: 'Corporate',
		icon: 'briefcase',
	},
	{
		value: 'Birthday',
		icon: 'gift',
	},
	{
		value: 'Debut',
		icon: 'star',
	},
	{
		value: 'Concert',
		icon: 'music',
	},
	{
		value: 'Conference',
		icon: 'users',
	},
	{
		value: 'Reunion',
		icon: 'users',
	},
	{
		value: 'Seminar',
		icon: 'award',
	},
]

const budgetRanges = [
	'Under ₱50,000',
	'₱50,000 – ₱150,000',
	'₱150,000 – ₱300,000',
	'₱300,000 – ₱500,000',
	'₱500,000 – ₱800,000',
	'Over ₱800,000',
]

const form = reactive({
	title: '',
	eventType: '',
	date: '',
	location: '',
	guests: '',
	budget: '',
	details: '',
})

const isSubmitting = ref(false)

const errorMessage = ref('')

const isValid = computed(() => {
	return Boolean(
		form.eventType &&
		form.date &&
		form.location.trim() &&
		form.guests &&
		Number(form.guests) > 0 &&
		form.budget
	)
})

async function submitInquiry() {
	if (!isValid.value) {
		return
	}

	if (!token.value) {
		errorMessage.value =
			'You are not authenticated.'

		return
	}

	isSubmitting.value = true
	errorMessage.value = ''

	try {
		const payload: CreateInquiryPayload = {
			event_type:
				form.eventType,

			event_date:
				form.date,

			location:
				form.location.trim(),

			expected_guests:
				Number(form.guests),

			budget_range:
				form.budget,
		}

		if (form.title.trim()) {
			payload.event_title =
				form.title.trim()
		}

		if (form.details.trim()) {
			payload.additional_details =
				form.details.trim()
		}

		await $fetch<CreateInquiryResponse>(
			`${config.public.apiBaseURL}/inquiries`,
			{
				method: 'POST',

				headers: {
					Accept:
						'application/json',

					'Content-Type':
						'application/json',

					Authorization:
						`Bearer ${token.value}`,
				},

				body:
					payload,
			}
		)

		await navigateTo(
			'/client/my-events'
		)

	} catch (error: unknown) {
		console.error(
			'Failed to submit inquiry:',
			error
		)

		if (
			typeof error === 'object' &&
			error !== null
		) {
			const apiError = error as {
				data?: {
					message?: string
					errors?: Record<
						string,
						string[]
					>
				}
			}

			if (apiError.data?.errors) {
				const firstError =
					Object
						.values(
							apiError.data.errors
						)
						.flat()
						.at(0)

				if (firstError) {
					errorMessage.value =
						String(firstError)

					return
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
			'Unable to submit your inquiry. Please try again.'

	} finally {
		isSubmitting.value = false
	}
}
</script>