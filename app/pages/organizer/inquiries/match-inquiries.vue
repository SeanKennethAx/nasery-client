<template>
	<div>
		<div class="mb-6 flex items-start gap-3 rounded-xl bg-primary-50 p-4 text-sm text-gray-700">
			<IconBase name="bell" class="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

			<p>
				You only see inquiries that match your
				<strong>service tags</strong>.
				Submit detailed offers to win events.
			</p>
		</div>

		<!-- Loading -->
		<div v-if="isLoading"
			class="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
			Loading matching inquiries...
		</div>

		<!-- Error -->
		<div v-else-if="errorMessage" class="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
			{{ errorMessage }}
		</div>

		<div v-else-if="inquiries.length" class="space-y-5">
			<div v-for="inquiry in inquiries" :key="inquiry.id" class="rounded-2xl border border-gray-200 bg-white p-6">
				<div class="flex items-start justify-between gap-4">
					<div>
						<div class="flex flex-wrap items-center gap-2">
							<h3 class="text-lg font-bold text-gray-900">
								{{
									inquiry.event_title ||
									inquiry.event_type + ' Inquiry'
								}}
							</h3>

							<span
								class="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">
								<IconBase name="check-circle" class="h-3.5 w-3.5" />

								Matched
							</span>
						</div>

						<div class="mt-1 text-sm text-gray-400">
							Posted by

							<span class="font-semibold text-gray-600">
								{{ clientName(inquiry) }}
							</span>

							&bull;

							{{ formatDate(inquiry.created_at) }}
						</div>
					</div>

					<span
						class="shrink-0 rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-500">
						{{ inquiry.offers_count ?? 0 }}
						offers
					</span>
				</div>

				<p v-if="inquiry.additional_details" class="mt-3 text-sm text-gray-600">
					{{ inquiry.additional_details }}
				</p>

				<p class="mt-1 text-sm font-medium text-primary-700">
					Matches: {{ inquiry.event_type }}
				</p>

				<div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
					<div class="rounded-lg bg-gray-50 p-3">
						<div class="flex items-center gap-1.5 text-xs text-gray-500">
							<IconBase name="calendar" class="h-3.5 w-3.5" />

							Event Date
						</div>

						<div class="mt-1 text-sm font-bold text-gray-900">
							{{ formatDate(inquiry.event_date) }}
						</div>
					</div>

					<div class="rounded-lg bg-gray-50 p-3">
						<div class="flex items-center gap-1.5 text-xs text-gray-500">
							<IconBase name="map-pin" class="h-3.5 w-3.5" />

							Location
						</div>

						<div class="mt-1 text-sm font-bold text-gray-900">
							{{ inquiry.location }}
						</div>
					</div>

					<div class="rounded-lg bg-gray-50 p-3">
						<div class="flex items-center gap-1.5 text-xs text-gray-500">
							<IconBase name="users" class="h-3.5 w-3.5" />

							Guests
						</div>

						<div class="mt-1 text-sm font-bold text-gray-900">
							{{ inquiry.expected_guests }}
						</div>
					</div>

					<div class="rounded-lg bg-gray-50 p-3">
						<div class="flex items-center gap-1.5 text-xs text-gray-500">
							<IconBase name="cash" class="h-3.5 w-3.5" />

							Budget
						</div>

						<div class="mt-1 text-sm font-bold text-gray-900">
							{{ inquiry.budget_range }}
						</div>
					</div>
				</div>

				<div class="mt-5 flex gap-3">
					<button type="button"
						class="flex items-center gap-2 rounded-xl bg-primary-700 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-900"
						@click="openOfferForm(inquiry)">
						<IconBase name="send" class="h-4 w-4" />

						Submit Offer
					</button>

					<button type="button"
						class="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
						<IconBase name="message" class="h-4 w-4" />

						Ask Question
					</button>
				</div>
			</div>
		</div>

		<!-- Empty -->
		<div v-else class="rounded-2xl border-2 border-dashed border-gray-200 bg-white px-6 py-16 text-center">
			<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
				<IconBase name="search" class="h-5 w-5" />
			</div>

			<h2 class="mt-4 text-lg font-bold text-gray-900">
				No matching inquiries
			</h2>

			<p class="mt-1 text-sm text-gray-500">
				Add service tags to your organizer profile to receive
				matching client inquiries.
			</p>
		</div>

		<!-- Offer Overlay -->
		<Transition name="fade">
			<div v-if="showOfferForm" class="fixed inset-0 z-40 bg-gray-900/40" @click="closeOfferForm" />
		</Transition>

		<!-- Offer Form -->
		<Transition name="slide">
			<div v-if="showOfferForm"
				class="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl">
				<div class="flex shrink-0 items-start justify-between border-b border-gray-200 px-6 py-5">
					<div class="flex items-start gap-3">
						<div
							class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-700 text-white">
							<IconBase name="file-text" class="h-5 w-5" />
						</div>

						<div>
							<h2 class="text-base font-bold text-gray-900">
								New Offer
							</h2>

							<p class="text-sm text-gray-500">
								Fill in your event offer details
							</p>
						</div>
					</div>

					<button type="button" class="text-gray-400 hover:text-gray-600" @click="closeOfferForm">
						<IconBase name="x" class="h-5 w-5" />
					</button>
				</div>

				<div class="flex-1 overflow-y-auto px-6 py-5">
					<div class="mt-4">
						<FormsLabel text="Event / Inquiry Title" required />

						<FormsTextField v-model="offerForm.title" disabled />
					</div>

					<div class="mt-4 grid grid-cols-2 gap-3">
						<div>
							<FormsLabel text="Event Type" />

							<FormsTextField v-model="offerForm.eventType" disabled />
						</div>

						<div>
							<FormsLabel text="Event Date" />

							<FormsTextField v-model="offerForm.eventDate" type="date" disabled />
						</div>
					</div>

					<div class="mt-4 grid grid-cols-2 gap-3">
						<div>
							<FormsLabel text="Location / Area" />

							<FormsTextField v-model="offerForm.location" disabled />
						</div>

						<div>
							<FormsLabel text="Expected Guests" />

							<FormsTextField v-model="offerForm.guests" type="number" disabled />
						</div>
					</div>

					<div class="mt-4">
						<FormsLabel text="Your Quoted Budget / Price Range" required />

						<FormsTextField v-model="offerForm.budget" icon="cash" placeholder="e.g. ₱150,000 – ₱250,000" />
					</div>

					<div class="mt-4">
						<FormsLabel text="Package / Offer Name" />

						<FormsTextField v-model="offerForm.packageName"
							placeholder="e.g. Full Coordination Premium Package" />
					</div>

					<div class="mt-4">
						<FormsLabel text="Timeline / Lead Time" />

						<FormsTextField v-model="offerForm.timeline" icon="clock"
							placeholder="e.g. 3 months lead time" />
					</div>

					<label class="mb-1.5 mt-4 block text-sm font-semibold text-gray-700">
						Inclusions / Services
					</label>

					<div class="space-y-2">
						<FormsTextField v-for="(_, index) in offerForm.inclusions" :key="index"
							v-model="offerForm.inclusions[index]" :placeholder="`Inclusion ${index + 1}`" />
					</div>

					<button type="button" class="mt-2 flex items-center gap-1 text-sm font-semibold text-primary-700"
						@click="addInclusion">
						<IconBase name="plus" class="h-3.5 w-3.5" />

						Add Inclusion
					</button>

					<label class="mb-1.5 mt-5 block text-sm font-semibold text-gray-700">
						Your pitch to the client
					</label>

					<textarea v-model="offerForm.pitch" rows="4"
						placeholder="Introduce yourself and explain why you're the best fit for this event..."
						class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15" />
				</div>

				<div class="flex shrink-0 gap-3 border-t border-gray-200 px-6 py-4">
					<FormsButton variant="secondary" class="flex-1" @click="closeOfferForm">
						Cancel
					</FormsButton>

					<FormsButton class="flex-1" @click="submitOffer">
						<IconBase name="send" class="h-4 w-4" />

						Submit Offer
					</FormsButton>
				</div>
			</div>
		</Transition>
	</div>
</template>

<script setup lang="ts">
interface InquiryUser {
	id: number
	firstname: string
	middlename: string | null
	lastname: string
}

interface InquiryClient {
	id: number
	user_id: number
	user?: InquiryUser
}

interface MatchingInquiry {
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
	offers_count?: number
	client?: InquiryClient
}

interface MatchingInquiryResponse {
	message?: string
	data: MatchingInquiry[]
}

definePageMeta({
	layout: 'dashboard',
})

const {
	token,
} = useAuth()

const config = useRuntimeConfig()

const inquiries =
	ref<MatchingInquiry[]>([])

const matchingInquiryCount =
	useState<number>(
		'matchingInquiryCount',
		() => 0
	)

const isLoading = ref(false)

const errorMessage = ref('')

const showOfferForm = ref(false)

const selectedInquiryId =
	ref<number | null>(null)

function emptyOfferForm() {
	return {
		title: '',
		eventType: '',
		eventDate: '',
		location: '',
		guests: '',
		budget: '',
		packageName: '',
		timeline: '',
		inclusions: [''],
		pitch: '',
	}
}

const offerForm = reactive(
	emptyOfferForm()
)

async function loadMatchingInquiries() {
	if (!token.value) {
		errorMessage.value =
			'You are not authenticated.'

		inquiries.value = []

		matchingInquiryCount.value = 0

		return
	}

	isLoading.value = true
	errorMessage.value = ''

	try {
		const response =
			await $fetch<MatchingInquiryResponse>(
				`${config.public.apiBaseURL}/organizer/inquiries/matching`,
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

		inquiries.value =
			response.data

		matchingInquiryCount.value =
			response.data.length

	} catch (error: unknown) {
		console.error(
			'Failed to load matching inquiries:',
			error
		)

		inquiries.value = []

		matchingInquiryCount.value = 0

		if (
			typeof error === 'object' &&
			error !== null
		) {
			const apiError = error as {
				data?: {
					message?: string
				}
			}

			if (apiError.data?.message) {
				errorMessage.value =
					apiError.data.message

				return
			}
		}

		errorMessage.value =
			'Unable to load matching inquiries.'
	} finally {
		isLoading.value = false
	}
}

function clientName(
	inquiry: MatchingInquiry
): string {
	const clientUser =
		inquiry.client?.user

	if (!clientUser) {
		return 'Client'
	}

	return [
		clientUser.firstname,
		clientUser.middlename,
		clientUser.lastname,
	]
		.filter(Boolean)
		.join(' ')
}

function formatDate(
	dateString: string
): string {
	if (!dateString) {
		return ''
	}

	const date =
		dateString.includes('T')
			? new Date(dateString)
			: new Date(
				`${dateString}T00:00:00`
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

function openOfferForm(
	inquiry: MatchingInquiry
) {
	Object.assign(
		offerForm,
		emptyOfferForm()
	)

	selectedInquiryId.value =
		inquiry.id

	offerForm.title =
		inquiry.event_title ||
		`${inquiry.event_type} Inquiry`

	offerForm.eventType =
		inquiry.event_type

	offerForm.eventDate =
		inquiry.event_date.substring(
			0,
			10
		)

	offerForm.location =
		inquiry.location

	offerForm.guests =
		String(
			inquiry.expected_guests
		)

	showOfferForm.value = true
}

function closeOfferForm() {
	showOfferForm.value = false

	selectedInquiryId.value = null
}

function addInclusion() {
	offerForm.inclusions.push('')
}

function submitOffer() {
	console.log(
		'Selected Inquiry:',
		selectedInquiryId.value
	)

	console.log(
		'Offer:',
		offerForm
	)

	closeOfferForm()
}

onMounted(() => {
	loadMatchingInquiries()
})
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
	transition: transform 0.25s ease;
}

.slide-enter-from,
.slide-leave-to {
	transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>