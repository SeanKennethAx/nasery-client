<template>
	<div>
		<!-- Page Header -->
		<div class="mb-6">
			<p class="text-sm font-semibold text-primary-700">
				Client Portal
			</p>

			<h1 class="mt-1 text-2xl font-extrabold text-gray-900">
				Event Quotations
			</h1>

			<p class="mt-1 text-gray-500">
				Compare organizer quotations and select the best offer
				for your event.
			</p>
		</div>

		<!-- Loading -->
		<div v-if="isLoading" class="rounded-2xl border border-gray-200 bg-white p-10 text-center">
			<div class="text-sm text-gray-500">
				Loading quotations...
			</div>
		</div>

		<!-- Error -->
		<div v-else-if="errorMessage" class="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
			{{ errorMessage }}
		</div>

		<!-- Quotations -->
		<div v-else-if="quotations.length" class="space-y-5">
			<div v-for="quotation in quotations" :key="quotation.id"
				class="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6" :class="{
					'border-green-300 bg-green-50/30':
						quotation.quotation_status ===
						'accepted',
				}">
				<!-- Header -->
				<div class="flex flex-wrap items-start justify-between gap-4">
					<div class="flex items-start gap-3">
						<div
							class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 font-bold text-primary-700">
							{{
								organizerInitials(
									quotation
								)
							}}
						</div>

						<div>
							<h2 class="text-lg font-bold text-gray-900">
								{{
									organizerName(
										quotation
									)
								}}
							</h2>

							<p class="mt-0.5 text-sm text-gray-500">
								Organizer
							</p>
						</div>
					</div>

					<span class="rounded-full px-3 py-1 text-xs font-semibold" :class="statusClass(
						quotation.quotation_status
					)
						">
						{{
							formatStatus(
								quotation.quotation_status
							)
						}}
					</span>
				</div>

				<!-- Price -->
				<div class="mt-6 rounded-xl bg-gray-50 p-5">
					<div class="text-xs font-medium uppercase tracking-wide text-gray-500">
						Quotation Amount
					</div>

					<div class="mt-1 text-3xl font-extrabold text-gray-900">
						{{
							formatCurrency(
								quotation.quotation_amount
							)
						}}
					</div>
				</div>

				<!-- Package and Timeline -->
				<div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
					<div class="rounded-xl border border-gray-200 p-4">
						<div class="text-xs text-gray-500">
							Package / Offer Name
						</div>

						<div class="mt-1 font-semibold text-gray-900">
							{{
								quotation.package_name ||
								'Not specified'
							}}
						</div>
					</div>

					<div class="rounded-xl border border-gray-200 p-4">
						<div class="text-xs text-gray-500">
							Timeline / Lead Time
						</div>

						<div class="mt-1 font-semibold text-gray-900">
							{{
								quotation.timeline ||
								'Not specified'
							}}
						</div>
					</div>
				</div>

				<!-- Inclusions -->
				<div v-if="quotation.inclusions?.length" class="mt-5">
					<h3 class="text-sm font-bold text-gray-900">
						Inclusions / Services
					</h3>

					<div class="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
						<div v-for="item in quotation.inclusions" :key="item.id"
							class="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">
							<IconBase name="check-circle" class="h-4 w-4 shrink-0 text-green-600" />

							{{ item.description }}
						</div>
					</div>
				</div>

				<!-- Pitch -->
				<div v-if="quotation.quotation_details" class="mt-5 rounded-xl bg-gray-50 p-4">
					<h3 class="text-sm font-bold text-gray-900">
						Organizer's Pitch
					</h3>

					<p class="mt-2 text-sm leading-6 text-gray-600">
						{{ quotation.quotation_details }}
					</p>
				</div>

				<!-- Action -->
				<div class="mt-6 flex justify-end">
					<button v-if="
						quotation.quotation_status ===
						'pending'
					" type="button" class="flex items-center gap-2 rounded-xl bg-[#285F6b] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1f4a54] disabled:cursor-not-allowed disabled:opacity-60"
						:disabled="acceptingQuotationId ===
							quotation.id
							" @click="
								acceptQuotation(
									quotation
								)
								">
						<IconBase name="award" class="h-4 w-4" />

						{{
							acceptingQuotationId ===
								quotation.id
								? 'Accepting...'
								: 'Accept Quotation'
						}}
					</button>

					<div v-else-if="
						quotation.quotation_status ===
						'accepted'
					" class="flex items-center gap-2 rounded-xl bg-green-100 px-4 py-2.5 text-sm font-semibold text-green-700">
						<IconBase name="check-circle" class="h-4 w-4" />

						Selected Organizer
					</div>

					<div v-else-if="
						quotation.quotation_status ===
						'rejected'
					" class="rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-500">
						Not Selected
					</div>
				</div>
			</div>
		</div>

		<!-- Empty -->
		<div v-else
			class="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-24 text-center">
			<div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
				<IconBase name="file-text" class="h-7 w-7" />
			</div>

			<h2 class="mt-4 text-lg font-bold text-gray-900">
				No quotations yet
			</h2>

			<p class="mt-1 max-w-sm text-sm text-gray-500">
				Organizers have not submitted any quotations for this
				inquiry yet.
			</p>

		</div>
	</div>
</template>
<script setup lang="ts">
interface QuotationInclusion {
	id: number
	quotation_id: number
	description: string
}

interface OrganizerUser {
	id?: number
	firstname?: string
	middlename?: string | null
	lastname?: string
}

interface Organizer {
	id: number
	user_id?: number

	user?: OrganizerUser

	name?: string
	company_name?: string
}

interface Quotation {
	id: number
	inquiry_id: number
	organizer_id: number

	quotation_amount:
	| string
	| number

	package_name:
	string | null

	timeline:
	string | null

	quotation_details:
	string | null

	quotation_status:
	| 'pending'
	| 'accepted'
	| 'rejected'
	| 'withdrawn'

	organizer?: Organizer

	inclusions:
	QuotationInclusion[]

	created_at: string
	updated_at: string
}

interface QuotationResponse {
	data: Quotation[]
}

definePageMeta({
	layout: 'client',
})

const route = useRoute()

const config =
	useRuntimeConfig()

const {
	token,
	user,
	isAuthenticated,
} = useAuth('client')

const quotations =
	ref<Quotation[]>([])

const isLoading =
	ref(false)

const errorMessage =
	ref('')

const acceptingQuotationId =
	ref<number | null>(null)

const inquiryId =
	computed(() => {
		const value =
			route.query.inquiry

		if (
			typeof value !== 'string'
		) {
			return null
		}

		const id =
			Number(value)

		return Number.isFinite(id)
			? id
			: null
	})

function organizerName(
	quotation: Quotation
): string {
	const organizer =
		quotation.organizer

	if (!organizer) {
		return 'Organizer'
	}

	const organizerUser =
		organizer.user

	if (organizerUser) {
		const fullName = [
			organizerUser.firstname,
			organizerUser.middlename,
			organizerUser.lastname,
		]
			.filter(Boolean)
			.join(' ')

		if (fullName) {
			return fullName
		}
	}

	return (
		organizer.company_name ||
		organizer.name ||
		'Organizer'
	)
}

function organizerInitials(
	quotation: Quotation
): string {
	const name =
		organizerName(quotation)

	const words =
		name
			.split(' ')
			.filter(Boolean)

	if (words.length === 0) {
		return 'OR'
	}

	const firstWord =
		words[0] ?? ''

	const lastWord =
		words[
		words.length - 1
		] ?? ''

	if (words.length === 1) {
		return firstWord
			.charAt(0)
			.toUpperCase()
	}

	return (
		firstWord
			.charAt(0)
			.toUpperCase() +
		lastWord
			.charAt(0)
			.toUpperCase()
	)
}

function formatCurrency(
	value: string | number
): string {
	const amount =
		Number(value)

	if (
		Number.isNaN(amount)
	) {
		return '₱0.00'
	}

	return new Intl.NumberFormat(
		'en-PH',
		{
			style: 'currency',
			currency: 'PHP',
			minimumFractionDigits: 2,
		}
	).format(amount)
}

function formatStatus(
	status:
		Quotation['quotation_status']
): string {
	switch (status) {
		case 'accepted':
			return 'Accepted'

		case 'rejected':
			return 'Not Selected'

		case 'withdrawn':
			return 'Withdrawn'

		default:
			return 'Pending'
	}
}

function statusClass(
	status:
		Quotation['quotation_status']
): string {
	switch (status) {
		case 'accepted':
			return (
				'bg-green-100 ' +
				'text-green-700'
			)

		case 'rejected':
			return (
				'bg-gray-100 ' +
				'text-gray-500'
			)

		case 'withdrawn':
			return (
				'bg-red-50 ' +
				'text-red-600'
			)

		default:
			return (
				'bg-amber-50 ' +
				'text-amber-700'
			)
	}
}

async function loadQuotations() {
	errorMessage.value = ''

	if (
		!isAuthenticated.value ||
		!token.value ||
		!user.value
	) {
		errorMessage.value =
			'You are not authenticated.'

		return
	}

	if (!inquiryId.value) {
		errorMessage.value =
			'No inquiry was selected.'

		return
	}

	isLoading.value = true

	try {
		const response =
			await $fetch<QuotationResponse>(
				`${config.public.apiBaseURL}/inquiries/${inquiryId.value}/quotations`,
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

		quotations.value =
			response.data ?? []

	} catch (error: unknown) {
		console.error(
			'Failed to load quotations:',
			error
		)

		const apiError =
			error as {
				data?: {
					message?: string
				}
			}

		errorMessage.value =
			apiError.data?.message ??
			'Unable to load quotations.'

	} finally {
		isLoading.value = false
	}
}

async function acceptQuotation(
	quotation: Quotation
) {
	const confirmed =
		window.confirm(
			`Accept the quotation from ${organizerName(quotation)} for ${formatCurrency(quotation.quotation_amount)}?`
		)

	if (!confirmed) {
		return
	}

	acceptingQuotationId.value =
		quotation.id

	try {
		await $fetch(
			`${config.public.apiBaseURL}/quotations/${quotation.id}/accept`,
			{
				method: 'POST',

				headers: {
					Accept:
						'application/json',

					Authorization:
						`Bearer ${token.value}`,
				},
			}
		)

		await loadQuotations()

	} catch (error: unknown) {
		console.error(
			'Failed to accept quotation:',
			error
		)

		const apiError =
			error as {
				data?: {
					message?: string
				}
			}

		window.alert(
			apiError.data?.message ??
			'Unable to accept quotation.'
		)

	} finally {
		acceptingQuotationId.value =
			null
	}
}

onMounted(() => {
	loadQuotations()
})
</script>