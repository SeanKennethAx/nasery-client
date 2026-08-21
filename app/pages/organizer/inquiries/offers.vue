<template>
	<div>
		<div v-if="isLoading"
			class="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
			Loading your offers...
		</div>

		<div v-else-if="errorMessage" class="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
			{{ errorMessage }}
		</div>

		<div v-else-if="offers.length" class="space-y-5">
			<article v-for="offer in offers" :key="offer.id" class="rounded-2xl border border-gray-200 bg-white p-6">
				<div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<h3 class="text-lg font-bold text-gray-900">
							{{ offer.inquiry?.event_title || `${offer.inquiry?.event_type || 'Event'} Inquiry` }}
						</h3>

						<p class="mt-1 text-sm text-gray-500">
							{{ offer.package_name || 'Custom quotation' }}
						</p>
					</div>

					<span class="shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
						:class="statusBadgeClass(offer.quotation_status)">
						{{ statusLabel(offer.quotation_status) }}
					</span>
				</div>

				<div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
					<div class="rounded-lg bg-gray-50 p-3">
						<div class="text-xs text-gray-500">
							Offer Amount
						</div>

						<div class="mt-1 text-lg font-bold text-primary-700">
							{{ formatCurrency(offer.quotation_amount) }}
						</div>
					</div>

					<div class="rounded-lg bg-gray-50 p-3">
						<div class="text-xs text-gray-500">
							Submitted
						</div>

						<div class="mt-1 text-sm font-bold text-gray-900">
							{{ formatDate(offer.created_at) }}
						</div>
					</div>

					<div class="rounded-lg bg-gray-50 p-3">
						<div class="text-xs text-gray-500">
							Status
						</div>

						<div class="mt-1 text-sm font-bold" :class="statusTextClass(offer.quotation_status)">
							{{ statusLabel(offer.quotation_status) }}
						</div>
					</div>
				</div>

				<div v-if="offer.timeline || offer.quotation_details" class="mt-4 grid gap-3 sm:grid-cols-2">
					<div v-if="offer.timeline" class="rounded-lg border border-gray-100 p-3">
						<div class="text-xs font-semibold uppercase tracking-wide text-gray-400">
							Timeline
						</div>

						<p class="mt-1 text-sm text-gray-700">
							{{ offer.timeline }}
						</p>
					</div>

					<div v-if="offer.quotation_details" class="rounded-lg border border-gray-100 p-3">
						<div class="text-xs font-semibold uppercase tracking-wide text-gray-400">
							Pitch
						</div>

						<p class="mt-1 text-sm leading-6 text-gray-700">
							{{ offer.quotation_details }}
						</p>
					</div>
				</div>

				<div v-if="offer.inclusions?.length" class="mt-4">
					<div class="mb-2 text-xs font-semibold tracking-wide text-gray-400">
						INCLUSIONS
					</div>

					<ul class="space-y-2">
						<li v-for="inclusion in offer.inclusions" :key="inclusion.id"
							class="flex items-start gap-2 text-sm text-gray-600">
							<span class="mt-0.5 text-primary-700">✓</span>
							<span>{{ inclusion.description }}</span>
						</li>
					</ul>
				</div>

				<div class="mt-5 flex flex-wrap gap-3">
					<button v-if="offer.quotation_status === 'accepted'" type="button"
						class="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
						<IconBase name="arrow-right" class="h-4 w-4" />
						Start Event Planning
					</button>

					<button v-else-if="offer.quotation_status === 'pending'" type="button"
						class="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
						<IconBase name="message" class="h-4 w-4" />
						Message Client
					</button>

					<button type="button"
						class="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
						View Full Proposal
					</button>
				</div>
			</article>
		</div>

		<div v-else class="rounded-2xl border-2 border-dashed border-gray-200 bg-white px-6 py-16 text-center">
			<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
				<IconBase name="file-text" class="h-5 w-5" />
			</div>

			<h2 class="mt-4 text-lg font-bold text-gray-900">
				No offers submitted yet
			</h2>

			<p class="mt-1 text-sm text-gray-500">
				Your submitted quotations will appear here.
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
interface OfferInclusion {
	id: number
	quotation_id: number
	description: string
}

interface OfferInquiry {
	id: number
	event_title: string | null
	event_type: string
	event_date: string
	location: string
}

interface OrganizerOffer {
	id: number
	inquiry_id: number
	organizer_id: number
	quotation_amount: string | number
	package_name: string | null
	timeline: string | null
	quotation_details: string | null
	quotation_status: 'pending' | 'accepted' | 'rejected'
	created_at: string
	updated_at: string
	inclusions?: OfferInclusion[]
	inquiry?: OfferInquiry
}

interface OrganizerOffersResponse {
	data: OrganizerOffer[]
}

definePageMeta({
	layout: 'dashboard',
})

const { token } = useAuth()
const config = useRuntimeConfig()

const offers = ref<OrganizerOffer[]>([])
const isLoading = ref(false)
const errorMessage = ref('')

function statusLabel(status: OrganizerOffer['quotation_status']): string {
	if (status === 'accepted') return 'Won'
	if (status === 'rejected') return 'Lost'
	return 'Pending'
}

function statusBadgeClass(status: OrganizerOffer['quotation_status']) {
	if (status === 'accepted') return 'bg-green-50 text-green-700'
	if (status === 'rejected') return 'bg-red-50 text-red-600'
	return 'bg-gray-100 text-gray-600'
}

function statusTextClass(status: OrganizerOffer['quotation_status']) {
	if (status === 'accepted') return 'text-green-600'
	if (status === 'rejected') return 'text-red-600'
	return 'text-gray-700'
}

function formatCurrency(value: string | number): string {
	const amount = Number(value)

	if (Number.isNaN(amount)) {
		return String(value)
	}

	return new Intl.NumberFormat('en-PH', {
		style: 'currency',
		currency: 'PHP',
		maximumFractionDigits: 0,
	}).format(amount)
}

function formatDate(dateString: string): string {
	if (!dateString) return ''

	return new Date(dateString).toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	})
}

async function loadOffers() {
	if (!token.value) {
		errorMessage.value = 'You are not authenticated.'
		return
	}

	isLoading.value = true
	errorMessage.value = ''

	try {
		const response = await $fetch<OrganizerOffersResponse>(
			`${config.public.apiBaseURL}/organizer/quotations`,
			{
				method: 'GET',
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${token.value}`,
				},
			},
		)

		offers.value = response.data ?? []
	} catch (error: unknown) {
		console.error('Failed to load organizer offers:', error)

		if (typeof error === 'object' && error !== null) {
			const apiError = error as {
				data?: {
					message?: string
				}
			}

			if (apiError.data?.message) {
				errorMessage.value = apiError.data.message
				return
			}
		}

		errorMessage.value = 'Unable to load your offers.'
	} finally {
		isLoading.value = false
	}
}

onMounted(() => {
	loadOffers()
})
</script>
