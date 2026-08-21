<template>
	<div>
		<!-- ===================================================== -->
		<!-- QUOTATION COMPARISON VIEW -->
		<!-- ===================================================== -->
		<div v-if="showQuotations && selectedEvent">
			<div class="mb-5">
				<button type="button"
					class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
					@click="backToMyEvents">
					<IconBase name="arrow-left" class="h-4 w-4" />
					Back to My Events
				</button>
			</div>

			<!-- Loading quotations -->
			<div v-if="isLoadingQuotations" class="rounded-2xl border border-gray-200 bg-white p-10 text-center">
				<div class="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 text-primary-700">
					<IconBase name="refresh-cw" class="h-5 w-5 animate-spin" />
				</div>

				<p class="mt-3 text-sm font-medium text-gray-500">
					Loading quotations...
				</p>
			</div>

			<!-- Quotation error -->
			<div v-else-if="quotationError"
				class="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
				{{ quotationError }}
			</div>

			<!-- Organizer quotations -->
			<div v-else-if="quotations.length" class="space-y-5">
				<article v-for="quotation in quotations" :key="quotation.id"
					class="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6" :class="{
						'border-green-300 bg-green-50/30':
							quotation.quotation_status === 'accepted',
					}">
					<div class="flex flex-wrap items-start justify-between gap-4">
						<div class="flex items-start gap-3">
							<div
								class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 font-bold text-primary-700">
								{{ organizerInitials(quotation) }}
							</div>

							<div>
								<h2 class="text-lg font-bold text-gray-900">
									{{ organizerName(quotation) }}
								</h2>

								<p class="mt-0.5 text-sm text-gray-500">
									Organizer
								</p>
							</div>
						</div>

						<span class="rounded-full px-3 py-1 text-xs font-semibold"
							:class="statusClass(quotation.quotation_status)">
							{{ formatStatus(quotation.quotation_status) }}
						</span>
					</div>

					<div class="mt-6 rounded-xl bg-gray-50 p-5">
						<div class="text-xs font-medium uppercase tracking-wide text-gray-500">
							Quotation Amount
						</div>

						<div class="mt-1 text-3xl font-extrabold text-gray-900">
							{{ formatQuotationCurrency(quotation.quotation_amount) }}
						</div>
					</div>

					<div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
						<div class="rounded-xl border border-gray-200 p-4">
							<div class="text-xs text-gray-500">
								Package / Offer Name
							</div>

							<div class="mt-1 font-semibold text-gray-900">
								{{ quotation.package_name || 'Not specified' }}
							</div>
						</div>

						<div class="rounded-xl border border-gray-200 p-4">
							<div class="text-xs text-gray-500">
								Timeline / Lead Time
							</div>

							<div class="mt-1 font-semibold text-gray-900">
								{{ quotation.timeline || 'Not specified' }}
							</div>
						</div>
					</div>

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

					<div v-if="quotation.quotation_details" class="mt-5 rounded-xl bg-gray-50 p-4">
						<h3 class="text-sm font-bold text-gray-900">
							Organizer's Pitch
						</h3>

						<p class="mt-2 text-sm leading-6 text-gray-600">
							{{ quotation.quotation_details }}
						</p>
					</div>

					<div class="mt-6 flex justify-end">
						<button v-if="quotation.quotation_status === 'pending'" type="button"
							class="flex items-center gap-2 rounded-xl bg-[#285F6b] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f4a54] disabled:cursor-not-allowed disabled:opacity-60"
							:disabled="acceptingQuotationId === quotation.id" @click="acceptQuotation(quotation)">
							<IconBase name="award" class="h-4 w-4" />

							{{
								acceptingQuotationId === quotation.id
									? 'Accepting...'
									: 'Accept Quotation'
							}}
						</button>

						<div v-else-if="quotation.quotation_status === 'accepted'"
							class="flex items-center gap-2 rounded-xl bg-green-100 px-4 py-2.5 text-sm font-semibold text-green-700">
							<IconBase name="check-circle" class="h-4 w-4" />
							Selected Organizer
						</div>

						<div v-else-if="quotation.quotation_status === 'rejected'"
							class="rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-500">
							Not Selected
						</div>

						<div v-else-if="quotation.quotation_status === 'withdrawn'"
							class="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600">
							Withdrawn
						</div>
					</div>
				</article>
			</div>

			<!-- No quotations -->
			<div v-else class="rounded-2xl border border-gray-200 bg-white px-6 py-20 text-center">
				<div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
					<IconBase name="file-text" class="h-6 w-6" />
				</div>

				<h2 class="mt-4 text-lg font-bold text-gray-900">
					No quotations found
				</h2>

				<p class="mt-1 text-sm text-gray-500">
					No organizer quotations are available for this event yet.
				</p>
			</div>
		</div>

		<!-- ===================================================== -->
		<!-- NORMAL MY EVENTS DASHBOARD -->
		<!-- ===================================================== -->
		<div v-else>
			<!-- Notifications -->
			<div v-if="notifications.length"
				class="mb-6 overflow-hidden rounded-2xl border border-blue-100 bg-blue-50/70">
				<div class="flex items-center justify-between gap-3 border-b border-blue-100 px-4 py-3 sm:px-5">
					<div class="flex items-center gap-2">
						<IconBase name="bell" class="h-4 w-4 text-blue-700" />

						<span class="text-sm font-bold text-gray-900">
							Notifications
						</span>

						<span v-if="unreadNotificationCount > 0"
							class="rounded-full bg-blue-700 px-2 py-0.5 text-xs font-bold text-white">
							{{ unreadNotificationCount }}
						</span>
					</div>

					<button v-if="unreadNotificationCount > 0" type="button"
						class="text-xs font-semibold text-blue-700 hover:text-blue-900"
						@click="markAllNotificationsAsRead">
						Mark all as read
					</button>
				</div>

				<button v-for="notification in notifications.slice(0, 3)" :key="notification.id" type="button"
					class="flex w-full items-start gap-3 border-b border-blue-100/70 px-4 py-3 text-left last:border-b-0 hover:bg-blue-50 sm:px-5"
					:class="{ 'bg-white/70': !notification.read_at }" @click="openNotification(notification)">
					<span class="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" :class="notification.read_at
						? 'bg-gray-300'
						: 'bg-blue-600'
						"></span>

					<div class="min-w-0 flex-1">
						<p class="text-sm font-semibold text-gray-900">
							{{
								notification.data.message ||
								'You received a new quotation.'
							}}
						</p>

						<p class="mt-1 text-xs text-gray-500">
							{{ notification.data.event_title || 'Event inquiry' }}

							<span v-if="notification.data.quotation_amount">
								·
								{{
									formatCurrency(
										notification.data.quotation_amount,
									)
								}}
							</span>
						</p>
					</div>

					<span class="shrink-0 text-xs text-gray-400">
						{{ formatRelativeTime(notification.created_at) }}
					</span>
				</button>
			</div>

			<!-- Header -->
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
					class="flex w-full items-center justify-center gap-2 rounded-xl bg-[#285F6b] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f4a54] sm:w-auto sm:shrink-0"
					@click="navigateTo('/client/post-event')">
					<IconBase name="plus" class="h-4 w-4 shrink-0" />
					Post New Event
				</button>
			</div>

			<!-- Dashboard Stats -->
			<div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
				<div v-for="stat in stats" :key="stat.label"
					class="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
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
			<div v-if="isLoading"
				class="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
				Loading your inquiries...
			</div>

			<!-- Error -->
			<div v-else-if="errorMessage" class="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
				{{ errorMessage }}
			</div>

			<!-- Events -->
			<div v-else-if="clientEvents.length" class="space-y-4">
				<article v-for="event in clientEvents" :key="event.id"
					class="rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-gray-300 sm:p-6">
					<div class="flex flex-wrap items-start justify-between gap-3">
						<div class="flex min-w-0 items-start gap-3">
							<div
								class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
								<IconBase :name="eventTypeIcon(event.event_type)" class="h-5 w-5" />
							</div>

							<div class="min-w-0">
								<h3 class="truncate text-base font-bold text-gray-900">
									{{ event.event_title || `${event.event_type} Inquiry` }}
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

						<span v-if="event.status === 'awarded'"
							class="shrink-0 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
							Awarded
						</span>

						<span v-else-if="event.quotations_count > 0"
							class="shrink-0 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
							{{ event.quotations_count }}
							{{
								event.quotations_count === 1
									? 'quotation'
									: 'quotations'
							}}
							received
						</span>

						<span v-else
							class="shrink-0 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-600">
							Awaiting quotations
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

						<p class="mt-1 text-sm leading-6 text-gray-700">
							{{ event.additional_details }}
						</p>
					</div>

					<div v-if="
						event.quotations_count > 0 ||
						event.status === 'awarded'
					" class="mt-4 flex justify-end">
						<button type="button"
							class="flex items-center gap-2 rounded-xl bg-[#285F6b] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f4a54]"
							@click="viewQuotations(event)">
							<IconBase :name="event.status === 'awarded'
								? 'calendar'
								: 'file-text'
								" class="h-4 w-4" />

							{{
								event.status === 'awarded'
									? 'View Event Details'
									: 'View Quotations'
							}}
						</button>
					</div>
				</article>
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
					submit quotations for you to review.
				</p>

				<button type="button"
					class="mt-5 flex items-center gap-2 rounded-xl bg-[#285F6b] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f4a54]"
					@click="navigateTo('/client/post-event')">
					<IconBase name="plus" class="h-4 w-4" />
					Post My First Event
				</button>
			</div>
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
	status:
	| 'open'
	| 'receiving_quotations'
	| 'awarded'
	| 'cancelled'
	awarded_quotation_id: number | null
	quotations_count: number
	created_at: string
	updated_at: string
}

interface ClientInquiryResponse {
	data: ClientInquiry[]
}

interface NotificationData {
	type?: string
	quotation_id?: number
	inquiry_id?: number
	event_title?: string
	organizer_name?: string
	quotation_amount?: string | number
	message?: string
}

interface ClientNotification {
	id: string
	type: string
	data: NotificationData
	read_at: string | null
	created_at: string
	updated_at: string
}

interface NotificationResponse {
	data: ClientNotification[]
	unread_count: number
}

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
	quotation_amount: string | number
	package_name: string | null
	timeline: string | null
	quotation_details: string | null
	quotation_status:
	| 'pending'
	| 'accepted'
	| 'rejected'
	| 'withdrawn'
	organizer?: Organizer
	inclusions: QuotationInclusion[]
	created_at: string
	updated_at: string
}

interface QuotationResponse {
	data: Quotation[]
}

definePageMeta({
	layout: 'client',
})

const config = useRuntimeConfig()

const {
	firstName,
	token,
	user,
	isAuthenticated,
} = useAuth('client')

const clientName = computed(() => {
	return firstName.value || 'Client'
})

const clientEvents = ref<ClientInquiry[]>([])
const notifications = ref<ClientNotification[]>([])
const unreadNotificationCount = ref(0)

const isLoading = ref(false)
const errorMessage = ref('')

const showQuotations = ref(false)
const selectedEvent = ref<ClientInquiry | null>(null)

const quotations = ref<Quotation[]>([])
const isLoadingQuotations = ref(false)
const quotationError = ref('')
const acceptingQuotationId = ref<number | null>(null)

const eventTypeIcons: Record<string, string> = {
	Wedding: 'heart',
	Corporate: 'briefcase',
	Birthday: 'gift',
	Debut: 'star',
	Concert: 'music',
	Conference: 'users',
	Reunion: 'users',
	Seminar: 'award',
}

function eventTypeIcon(type: string): string {
	return eventTypeIcons[type] ?? 'sparkles'
}

function formatDate(dateStr: string): string {
	if (!dateStr) {
		return ''
	}

	const date = dateStr.includes('T')
		? new Date(dateStr)
		: new Date(`${dateStr}T00:00:00`)

	return date.toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	})
}

function formatCurrency(
	value: string | number,
): string {
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

function formatQuotationCurrency(
	value: string | number,
): string {
	const amount = Number(value)

	if (Number.isNaN(amount)) {
		return '₱0.00'
	}

	return new Intl.NumberFormat('en-PH', {
		style: 'currency',
		currency: 'PHP',
		minimumFractionDigits: 2,
	}).format(amount)
}

function formatRelativeTime(
	dateString: string,
): string {
	const timestamp =
		new Date(dateString).getTime()

	const diff =
		Math.max(
			0,
			Date.now() - timestamp,
		)

	const minutes =
		Math.floor(diff / 60000)

	if (minutes < 1) {
		return 'Just now'
	}

	if (minutes < 60) {
		return `${minutes}m ago`
	}

	const hours =
		Math.floor(minutes / 60)

	if (hours < 24) {
		return `${hours}h ago`
	}

	const days =
		Math.floor(hours / 24)

	return `${days}d ago`
}

function organizerName(
	quotation: Quotation,
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
	quotation: Quotation,
): string {
	const words =
		organizerName(quotation)
			.split(' ')
			.filter(Boolean)

	if (!words.length) {
		return 'OR'
	}

	if (words.length === 1) {
		return (
			words[0]
				?.charAt(0)
				.toUpperCase() ||
			'OR'
		)
	}

	const first =
		words[0] ?? ''

	const last =
		words[
		words.length - 1
		] ?? ''

	return (
		first.charAt(0).toUpperCase() +
		last.charAt(0).toUpperCase()
	)
}

function formatStatus(
	status: Quotation['quotation_status'],
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
	status: Quotation['quotation_status'],
): string {
	switch (status) {
		case 'accepted':
			return 'bg-green-100 text-green-700'

		case 'rejected':
			return 'bg-gray-100 text-gray-500'

		case 'withdrawn':
			return 'bg-red-50 text-red-600'

		default:
			return 'bg-amber-50 text-amber-700'
	}
}

async function loadNotifications() {
	if (!token.value) {
		return
	}

	try {
		const response =
			await $fetch<NotificationResponse>(
				`${config.public.apiBaseURL}/notifications`,
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

		notifications.value =
			response.data ?? []

		unreadNotificationCount.value =
			response.unread_count ?? 0
	} catch (error) {
		console.error(
			'Failed to load notifications:',
			error,
		)
	}
}

async function markNotificationAsRead(
	notificationId: string,
) {
	if (!token.value) {
		return
	}

	await $fetch(
		`${config.public.apiBaseURL}/notifications/${notificationId}/read`,
		{
			method: 'POST',
			headers: {
				Accept:
					'application/json',
				Authorization:
					`Bearer ${token.value}`,
			},
		},
	)
}

async function markAllNotificationsAsRead() {
	if (!token.value) {
		return
	}

	try {
		await $fetch(
			`${config.public.apiBaseURL}/notifications/read-all`,
			{
				method: 'POST',
				headers: {
					Accept:
						'application/json',
					Authorization:
						`Bearer ${token.value}`,
				},
			},
		)

		await loadNotifications()
	} catch (error) {
		console.error(
			'Failed to mark notifications as read:',
			error,
		)
	}
}

async function openNotification(
	notification: ClientNotification,
) {
	try {
		if (!notification.read_at) {
			await markNotificationAsRead(
				notification.id,
			)
		}

		await loadNotifications()

		const inquiryId =
			notification.data.inquiry_id

		if (!inquiryId) {
			return
		}

		const event =
			clientEvents.value.find(
				item =>
					item.id === inquiryId,
			)

		if (event) {
			await viewQuotations(event)
		}
	} catch (error) {
		console.error(
			'Failed to open notification:',
			error,
		)
	}
}

async function loadQuotations() {
	quotationError.value = ''

	if (
		!isAuthenticated.value ||
		!token.value ||
		!user.value
	) {
		quotationError.value =
			'You are not authenticated.'

		return
	}

	if (!selectedEvent.value) {
		quotationError.value =
			'No inquiry was selected.'

		return
	}

	isLoadingQuotations.value = true

	try {
		const response =
			await $fetch<QuotationResponse>(
				`${config.public.apiBaseURL}/inquiries/${selectedEvent.value.id}/quotations`,
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

		quotations.value =
			response.data ?? []
	} catch (error: unknown) {
		console.error(
			'Failed to load quotations:',
			error,
		)

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

			if (apiError.data?.message) {
				quotationError.value =
					apiError.data.message

				return
			}
		}

		quotationError.value =
			'Unable to load quotations.'
	} finally {
		isLoadingQuotations.value = false
	}
}

async function viewQuotations(
	event: ClientInquiry,
) {
	if (event.status === 'awarded') {
		await navigateTo({
			path: '/client/event-details',
			query: {
				inquiry: event.id,
			},
		})

		return
	}

	selectedEvent.value = event
	showQuotations.value = true

	quotations.value = []
	quotationError.value = ''

	await loadQuotations()
}

function backToMyEvents() {
	showQuotations.value = false
	selectedEvent.value = null
	quotations.value = []
	quotationError.value = ''
	acceptingQuotationId.value = null
}

async function acceptQuotation(
	quotation: Quotation,
) {
	if (!token.value) {
		window.alert(
			'Your session has expired. Please log in again.',
		)

		return
	}

	const confirmed =
		window.confirm(
			`Accept the quotation from ${organizerName(
				quotation,
			)} for ${formatQuotationCurrency(
				quotation.quotation_amount,
			)}?`,
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
			},
		)

		await Promise.all([
			loadQuotations(),
			loadClientInquiries(),
		])

		if (selectedEvent.value) {
			const updatedEvent =
				clientEvents.value.find(
					event =>
						event.id ===
						selectedEvent.value?.id,
				)

			if (updatedEvent) {
				selectedEvent.value =
					updatedEvent
			}
		}

		window.alert(
			'Quotation accepted successfully. This organizer has been selected for your event.',
		)
	} catch (error: unknown) {
		console.error(
			'Failed to accept quotation:',
			error,
		)

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

			window.alert(
				apiError.data?.message ??
				'Unable to accept quotation.',
			)

			return
		}

		window.alert(
			'Unable to accept quotation.',
		)
	} finally {
		acceptingQuotationId.value = null
	}
}

async function loadClientInquiries() {
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

	if (user.value.role !== 'client') {
		errorMessage.value =
			'This account is not a client account.'

		return
	}

	isLoading.value = true

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
				},
			)

		clientEvents.value =
			response.data ?? []
	} catch (error: unknown) {
		console.error(
			'Failed to load client inquiries:',
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
					}
				}

			const statusCode =
				apiError.statusCode ??
				apiError.status

			if (statusCode === 401) {
				errorMessage.value =
					'Your client session has expired. Please log in again.'

				return
			}

			if (statusCode === 403) {
				errorMessage.value =
					'You are not authorized to view these inquiries.'

				return
			}

			if (apiError.data?.message) {
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

const stats = computed(() => {
	const receivingQuotations =
		clientEvents.value.filter(
			event =>
				event.status ===
				'receiving_quotations' &&
				event.quotations_count > 0,
		).length

	const awardedEvents =
		clientEvents.value.filter(
			event =>
				event.status === 'awarded',
		).length

	const openEvents =
		clientEvents.value.filter(
			event =>
				event.status === 'open' ||
				event.status ===
				'receiving_quotations',
		).length

	return [
		{
			label: 'Total Inquiries',
			value: clientEvents.value.length,
			icon: 'file-text',
			iconBg: 'bg-gray-100',
			iconColor: 'text-gray-500',
		},
		{
			label: 'Receiving Quotations',
			value: receivingQuotations,
			icon: 'sparkles',
			iconBg: 'bg-blue-50',
			iconColor: 'text-blue-600',
		},
		{
			label: 'Awarded Events',
			value: awardedEvents,
			icon: 'award',
			iconBg: 'bg-green-50',
			iconColor: 'text-green-600',
		},
		{
			label: 'Open Events',
			value: openEvents,
			icon: 'clock',
			iconBg: 'bg-amber-50',
			iconColor: 'text-amber-600',
		},
	]
})

onMounted(async () => {
	await Promise.all([
		loadClientInquiries(),
		loadNotifications(),
	])
})
</script>
