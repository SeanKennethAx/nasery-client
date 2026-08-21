<template>
	<div>
		<!-- Matching Inquiries Intro -->
		<div class="mb-5 rounded-2xl border border-primary-100 bg-primary-50/70 p-4 sm:p-5">
			<div class="flex items-start gap-3">
				<div
					class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-primary-700 shadow-sm">
					<IconBase name="bell" class="h-5 w-5" />
				</div>

				<div class="min-w-0">
					<h2 class="text-sm font-bold text-gray-900">
						Matched opportunities for your services
					</h2>

					<p class="mt-1 text-sm leading-6 text-gray-600">
						You only see inquiries that match your
						<strong class="font-semibold text-gray-800">service tags</strong>.
						Review the event details and submit a competitive offer when you're ready.
					</p>
				</div>
			</div>
		</div>

		<!-- Loading -->
		<div v-if="isLoading" class="rounded-2xl border border-gray-200 bg-white p-10 text-center">
			<div class="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 text-primary-700">
				<IconBase name="refresh-cw" class="h-5 w-5 animate-spin" />
			</div>

			<p class="mt-3 text-sm font-medium text-gray-600">
				Loading matching inquiries...
			</p>
		</div>

		<!-- Error -->
		<div v-else-if="errorMessage" class="rounded-2xl border border-red-200 bg-red-50 p-4">
			<div class="flex items-start gap-3">
				<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-red-500">
					<IconBase name="alert-circle" class="h-5 w-5" />
				</div>

				<div>
					<div class="text-sm font-bold text-red-800">
						Unable to load matching inquiries
					</div>

					<p class="mt-1 text-sm text-red-700">
						{{ errorMessage }}
					</p>
				</div>
			</div>
		</div>

		<!-- Matching Inquiries -->
		<div v-else-if="inquiries.length" class="space-y-4">
			<article v-for="inquiry in inquiries" :key="inquiry.id"
				class="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md">
				<div class="p-5 sm:p-6">
					<!-- Top row -->
					<div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
						<div class="min-w-0">
							<div class="flex flex-wrap items-center gap-2.5">
								<div
									class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
									<IconBase :name="eventTypeIcon(inquiry.event_type)" class="h-5 w-5" />
								</div>

								<div class="min-w-0">
									<div class="flex flex-wrap items-center gap-2">
										<h3 class="truncate text-lg font-bold text-gray-900">
											{{ inquiry.event_title || `${inquiry.event_type} Inquiry` }}
										</h3>

										<span
											class="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
											<IconBase name="check-circle" class="h-3.5 w-3.5" />
											Matched
										</span>
									</div>

									<div class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500">
										<span>
											Posted by
											<span class="font-semibold text-gray-700">
												{{ clientName(inquiry) }}
											</span>
										</span>

										<span class="text-gray-300">•</span>

										<span>{{ formatDate(inquiry.created_at) }}</span>
									</div>
								</div>
							</div>
						</div>

						<div v-if="offerError"
							class="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
							{{ offerError }}
						</div>

						<div v-if="offerSuccess" class="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
							<div class="flex items-start gap-3">
								<IconBase name="check-circle" class="mt-0.5 h-5 w-5 shrink-0 text-green-600" />

								<div>
									<p class="text-sm font-bold text-green-800">
										Quotation submitted successfully
									</p>

									<p class="mt-0.5 text-sm text-green-700">
										Your quotation has been sent to the client.
									</p>
								</div>
							</div>
						</div>
					</div>

					<!-- Match line -->
					<div class="mt-5 flex flex-wrap items-center gap-2">
						<span class="text-xs font-semibold uppercase tracking-wide text-gray-400">
							Matched service
						</span>

						<span class="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
							{{ inquiry.event_type }}
						</span>
					</div>

					<!-- Details -->
					<div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
						<div class="rounded-xl border border-gray-100 bg-gray-50/80 p-4">
							<div class="flex items-center gap-2 text-xs font-medium text-gray-500">
								<IconBase name="calendar" class="h-4 w-4 text-primary-700" />
								Event Date
							</div>

							<div class="mt-2 text-sm font-bold text-gray-900">
								{{ formatDate(inquiry.event_date) }}
							</div>
						</div>

						<div class="rounded-xl border border-gray-100 bg-gray-50/80 p-4">
							<div class="flex items-center gap-2 text-xs font-medium text-gray-500">
								<IconBase name="map-pin" class="h-4 w-4 text-primary-700" />
								Location
							</div>

							<div class="mt-2 truncate text-sm font-bold text-gray-900">
								{{ inquiry.location }}
							</div>
						</div>

						<div class="rounded-xl border border-gray-100 bg-gray-50/80 p-4">
							<div class="flex items-center gap-2 text-xs font-medium text-gray-500">
								<IconBase name="users" class="h-4 w-4 text-primary-700" />
								Guests
							</div>

							<div class="mt-2 text-sm font-bold text-gray-900">
								{{ inquiry.expected_guests }}
							</div>
						</div>

						<div class="rounded-xl border border-gray-100 bg-gray-50/80 p-4">
							<div class="flex items-center gap-2 text-xs font-medium text-gray-500">
								<IconBase name="cash" class="h-4 w-4 text-primary-700" />
								Budget
							</div>

							<div class="mt-2 text-sm font-bold text-gray-900">
								{{ inquiry.budget_range }}
							</div>
						</div>
					</div>

					<!-- Client note -->
					<div v-if="inquiry.additional_details" class="mt-4 rounded-xl border border-gray-100 bg-white p-4">
						<div
							class="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
							<IconBase name="message-square" class="h-3.5 w-3.5" />
							Client notes
						</div>

						<p class="text-sm leading-6 text-gray-600">
							{{ inquiry.additional_details }}
						</p>
					</div>
				</div>

				<!-- Actions -->
				<div
					class="flex flex-col gap-3 border-t border-gray-100 bg-gray-50/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
					<p class="text-xs text-gray-500">
						Submit a detailed offer to improve your chances of being selected.
					</p>

					<div class="flex flex-col gap-2 sm:flex-row">
						<button type="button"
							class="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50">
							<IconBase name="message" class="h-4 w-4" />
							Ask Question
						</button>

						<button type="button"
							class="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-900"
							@click="openOfferForm(inquiry)">
							<IconBase name="send" class="h-4 w-4" />
							Submit Offer
						</button>
					</div>
				</div>
			</article>
		</div>

		<!-- Empty -->
		<div v-else class="rounded-2xl border-2 border-dashed border-gray-200 bg-white px-6 py-16 text-center">
			<div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
				<IconBase name="search" class="h-6 w-6" />
			</div>

			<h2 class="mt-4 text-lg font-bold text-gray-900">
				No matching inquiries yet
			</h2>

			<p class="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
				When a client posts an inquiry that matches your service tags,
				it will appear here automatically.
			</p>
		</div>

		<!-- Offer Overlay -->
		<Transition name="fade">
			<div v-if="showOfferForm" class="fixed inset-0 z-40 bg-gray-900/40" @click="closeOfferForm" />
		</Transition>

		<!-- Offer Form -->
		<!-- Offer Overlay -->
		<Transition name="fade">
			<div v-if="showOfferForm" class="fixed inset-0 z-40 bg-gray-900/40" @click="closeOfferForm" />
		</Transition>

		<!-- Offer Form -->
		<Transition name="slide">
			<div v-if="showOfferForm"
				class="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl">
				<!-- Header -->
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

					<button type="button" class="text-gray-400 hover:text-gray-600" :disabled="isSubmittingOffer"
						@click="closeOfferForm">
						<IconBase name="x" class="h-5 w-5" />
					</button>
				</div>

				<!-- Body -->
				<div class="flex-1 overflow-y-auto px-6 py-5">

					<!-- Error -->
					<div v-if="offerError"
						class="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
						<IconBase name="alert-circle" class="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

						<div>
							<p class="text-sm font-semibold text-red-800">
								Unable to submit quotation
							</p>

							<p class="mt-0.5 text-sm text-red-700">
								{{ offerError }}
							</p>
						</div>
					</div>

					<!-- Success -->
					<div v-if="offerSuccess"
						class="mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
						<IconBase name="check-circle" class="mt-0.5 h-5 w-5 shrink-0 text-green-600" />

						<div>
							<p class="text-sm font-semibold text-green-800">
								Quotation submitted successfully
							</p>

							<p class="mt-0.5 text-sm text-green-700">
								Your quotation has been sent to the client.
							</p>
						</div>
					</div>

					<div>
						<FormsLabel text="Event / Inquiry Title" />

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
						<FormsLabel text="Your Quotation Amount" required />

						<FormsTextField v-model="offerForm.budget" icon="cash" placeholder="e.g. ₱240,000" />

						<p class="mt-1 text-xs text-gray-400">
							Enter one final quotation amount.
						</p>
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

				<!-- Footer -->
				<div class="flex shrink-0 gap-3 border-t border-gray-200 px-6 py-4">
					<FormsButton variant="secondary" class="flex-1" :disabled="isSubmittingOffer"
						@click="closeOfferForm">
						Cancel
					</FormsButton>

					<FormsButton class="flex-1" :disabled="isSubmittingOffer ||
						!!offerSuccess
						" @click="submitOffer">
						<IconBase :name="isSubmittingOffer
							? 'refresh-cw'
							: offerSuccess
								? 'check-circle'
								: 'send'
							" class="h-4 w-4" :class="{
								'animate-spin':
									isSubmittingOffer,
							}" />

						{{
							isSubmittingOffer
								? 'Submitting...'
								: offerSuccess
									? 'Submitted'
									: 'Submit Offer'
						}}
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
	quotations_count?: number
	client?: InquiryClient
}

interface MatchingInquiryResponse {
	message?: string
	data: MatchingInquiry[]
}

interface SubmitQuotationResponse {
	message: string
	data: unknown
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
		() => 0,
	)

const isLoading =
	ref(false)

const errorMessage =
	ref('')

const showOfferForm =
	ref(false)

const selectedInquiryId =
	ref<number | null>(null)

const isSubmittingOffer =
	ref(false)

const offerError =
	ref('')

const offerSuccess =
	ref('')

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

const offerForm =
	reactive(
		emptyOfferForm(),
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
				},
			)

		inquiries.value =
			response.data ?? []

		matchingInquiryCount.value =
			response.data?.length ?? 0
	} catch (error: unknown) {
		console.error(
			'Failed to load matching inquiries:',
			error,
		)

		inquiries.value = []

		matchingInquiryCount.value = 0

		if (
			typeof error === 'object' &&
			error !== null
		) {
			const apiError =
				error as {
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
			'Unable to load matching inquiries.'
	} finally {
		isLoading.value = false
	}
}

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
	type: string,
): string {
	return (
		eventTypeIcons[type] ??
		'sparkles'
	)
}

function clientName(
	inquiry: MatchingInquiry,
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
	dateString: string,
): string {
	if (!dateString) {
		return ''
	}

	const date =
		dateString.includes('T')
			? new Date(dateString)
			: new Date(
				`${dateString}T00:00:00`,
			)

	return date.toLocaleDateString(
		'en-US',
		{
			month: 'long',
			day: 'numeric',
			year: 'numeric',
		},
	)
}

function openOfferForm(
	inquiry: MatchingInquiry,
) {
	Object.assign(
		offerForm,
		emptyOfferForm(),
	)

	selectedInquiryId.value =
		inquiry.id

	offerError.value = ''
	offerSuccess.value = ''

	offerForm.title =
		inquiry.event_title ||
		`${inquiry.event_type} Inquiry`

	offerForm.eventType =
		inquiry.event_type

	offerForm.eventDate =
		inquiry.event_date.substring(
			0,
			10,
		)

	offerForm.location =
		inquiry.location

	offerForm.guests =
		String(
			inquiry.expected_guests,
		)

	showOfferForm.value = true
}

function closeOfferForm() {
	if (
		isSubmittingOffer.value
	) {
		return
	}

	showOfferForm.value = false

	selectedInquiryId.value = null

	offerError.value = ''
	offerSuccess.value = ''

	Object.assign(
		offerForm,
		emptyOfferForm(),
	)
}

function addInclusion() {
	offerForm.inclusions.push('')
}

async function submitOffer() {
	if (
		!selectedInquiryId.value
	) {
		offerError.value =
			'No inquiry was selected.'

		return
	}

	if (!token.value) {
		offerError.value =
			'Your session has expired. Please log in again.'

		return
	}

	if (
		!offerForm.budget.trim()
	) {
		offerError.value =
			'Please enter your quotation amount.'

		return
	}

	const quotationAmount =
		Number(
			offerForm.budget
				.replace(
					/[₱,\s]/g,
					'',
				),
		)

	if (
		Number.isNaN(
			quotationAmount,
		) ||
		quotationAmount <= 0
	) {
		offerError.value =
			'Please enter a valid quotation amount.'

		return
	}

	offerError.value = ''
	offerSuccess.value = ''

	isSubmittingOffer.value = true

	try {
		const response =
			await $fetch<SubmitQuotationResponse>(
				`${config.public.apiBaseURL}/organizer/quotations`,
				{
					method: 'POST',

					headers: {
						Accept:
							'application/json',

						Authorization:
							`Bearer ${token.value}`,
					},

					body: {
						inquiry_id:
							selectedInquiryId.value,

						quotation_amount:
							quotationAmount,

						package_name:
							offerForm.packageName
								.trim() ||
							null,

						timeline:
							offerForm.timeline
								.trim() ||
							null,

						quotation_details:
							offerForm.pitch
								.trim() ||
							null,

						inclusions:
							offerForm.inclusions
								.map(
									item =>
										item.trim(),
								)
								.filter(
									Boolean,
								),
					},
				},
			)

		console.log(
			'Quotation submitted:',
			response,
		)

		offerSuccess.value =
			response.message ||
			'Quotation submitted successfully.'

		/*
		 * Refresh matching inquiries
		 * so quotation count updates.
		 */
		await loadMatchingInquiries()

		/*
		 * Keep success message visible
		 * before closing the drawer.
		 */
		window.setTimeout(
			() => {
				showOfferForm.value =
					false

				selectedInquiryId.value =
					null

				Object.assign(
					offerForm,
					emptyOfferForm(),
				)

				offerSuccess.value =
					''
			},
			1500,
		)
	} catch (error: unknown) {
		console.error(
			'Failed to submit quotation:',
			error,
		)

		if (
			typeof error === 'object' &&
			error !== null
		) {
			const apiError =
				error as {
					statusCode?: number
					status?: number

					data?: {
						message?: string

						errors?: Record<
							string,
							string[]
						>
					}
				}

			if (
				apiError.data?.message
			) {
				offerError.value =
					apiError.data.message

				return
			}

			const validationErrors =
				apiError.data?.errors

			if (
				validationErrors
			) {
				const firstError =
					Object.values(
						validationErrors,
					)[0]?.[0]

				if (firstError) {
					offerError.value =
						firstError

					return
				}
			}
		}

		offerError.value =
			'Unable to submit your quotation. Please try again.'
	} finally {
		isSubmittingOffer.value =
			false
	}
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