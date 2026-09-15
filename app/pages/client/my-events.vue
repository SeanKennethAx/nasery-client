<template>
	<div>
		<div v-if="showQuotations && selectedEvent">
			<div class="mb-5">
				<button type="button"
					class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
					@click="backToMyEvents">
					<IconBase name="arrow-left" class="h-4 w-4" />
					Back to My Events
				</button>
			</div>

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
							:disabled="acceptingQuotationId === quotation.id" @click="requestQuotationAcceptance(quotation)">
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

			<header class="mb-6 overflow-hidden rounded-3xl border border-primary-100 bg-white shadow-sm">
				<div class="flex flex-col gap-6 px-5 py-6 sm:px-7 lg:flex-row lg:items-center lg:justify-between">
					<div class="max-w-2xl">
						<div class="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-primary-700">
							<span class="h-1.5 w-1.5 rounded-full bg-primary-600"></span>
							Your event workspace
						</div>
						<h1 class="text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl">
							Welcome back, {{ clientName }}
						</h1>
						<p class="mt-2 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
							Track every inquiry, compare organizer offers, and move your event forward from one place.
						</p>
					</div>

					<button type="button"
						class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#285F6b] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#1f4a54] focus:outline-none focus:ring-4 focus:ring-primary-100 sm:w-auto"
						@click="navigateTo('/client/post-event')">
						<IconBase name="plus" class="h-4 w-4" />
						Post a new inquiry
					</button>
				</div>

				<div class="grid border-t border-gray-100 bg-gray-50/70 sm:grid-cols-3">
					<div v-for="(step, index) in eventJourneySteps" :key="step.title"
						class="flex items-center gap-3 border-b border-gray-100 px-5 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 sm:px-7">
						<span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-xs font-extrabold text-primary-700 shadow-sm ring-1 ring-gray-200">
							{{ index + 1 }}
						</span>
						<div>
							<p class="text-sm font-bold text-gray-900">{{ step.title }}</p>
							<p class="mt-0.5 text-xs text-gray-500">{{ step.description }}</p>
						</div>
					</div>
				</div>
			</header>

			<div class="mb-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
				<div v-for="stat in stats" :key="stat.label"
					class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
					<div class="flex items-center justify-between gap-3">
						<div>
							<p class="text-xs font-semibold text-gray-500 sm:text-sm">{{ stat.label }}</p>
							<p class="mt-2 text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl">{{ stat.value }}</p>
						</div>
						<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" :class="stat.iconBg">
							<IconBase :name="stat.icon" class="h-5 w-5" :class="stat.iconColor" />
						</div>
					</div>
				</div>
			</div>

			<div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h2 class="text-xl font-extrabold text-gray-950">Your events</h2>
					<p class="mt-1 text-sm text-gray-500">Choose an event to review offers or continue planning.</p>
				</div>

				<div class="flex max-w-full gap-1 overflow-x-auto rounded-xl bg-gray-100 p-1">
					<button v-for="filter in eventFilters" :key="filter.value" type="button"
						class="whitespace-nowrap rounded-lg px-3 py-2 text-xs font-bold transition"
						:class="eventFilter === filter.value ? 'bg-white text-gray-950 shadow-sm' : 'text-gray-500 hover:text-gray-800'"
						@click="eventFilter = filter.value">
						{{ filter.label }}
						<span class="ml-1 text-[11px] text-gray-400">{{ eventFilterCount(filter.value) }}</span>
					</button>
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
			<div v-else-if="filteredEvents.length" class="grid gap-4 xl:grid-cols-2">
				<article v-for="event in filteredEvents" :key="event.id"
					class="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md">
					<div class="flex items-stretch">
						<div class="flex w-20 shrink-0 flex-col items-center justify-center border-r border-gray-100 bg-primary-50/70 px-2 py-5 text-center sm:w-24">
							<span class="text-[11px] font-extrabold uppercase tracking-[0.15em] text-primary-700">{{ eventMonth(event.event_date) }}</span>
							<span class="mt-1 text-3xl font-black leading-none text-gray-950">{{ eventDay(event.event_date) }}</span>
							<span class="mt-2 text-[11px] font-semibold text-gray-500">{{ event.event_type }}</span>
						</div>

						<div class="min-w-0 flex-1 p-4 sm:p-5">
							<div class="flex items-start justify-between gap-3">
								<div class="min-w-0">
									<h3 class="truncate text-base font-extrabold text-gray-950 sm:text-lg">{{ event.event_title || `${event.event_type} Inquiry` }}</h3>
									<p class="mt-1 flex items-start gap-1.5 text-xs leading-5 text-gray-500 sm:text-sm">
										<IconBase name="map-pin" class="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-600" />
										<span class="line-clamp-2">{{ event.location }}</span>
									</p>
								</div>

								<span class="shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold" :class="eventStatusClass(event)">
									{{ eventStatusLabel(event) }}
								</span>
							</div>

							<div class="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
								<div class="rounded-xl bg-gray-50 px-3 py-2.5">
									<p class="text-[11px] font-semibold text-gray-400">Guests</p>
									<p class="mt-0.5 text-sm font-bold text-gray-900">{{ event.expected_guests }}</p>
								</div>
								<div class="rounded-xl bg-gray-50 px-3 py-2.5">
									<p class="text-[11px] font-semibold text-gray-400">Budget</p>
									<p class="mt-0.5 truncate text-sm font-bold text-gray-900">{{ event.budget_range }}</p>
								</div>
								<div class="col-span-2 rounded-xl bg-gray-50 px-3 py-2.5 sm:col-span-1">
									<p class="text-[11px] font-semibold text-gray-400">Offers</p>
									<p class="mt-0.5 text-sm font-bold text-gray-900">{{ event.quotations_count }} received</p>
								</div>
							</div>

							<div class="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
								<div class="flex min-w-0 items-center gap-2 text-xs text-gray-500">
									<span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
										<IconBase :name="event.status === 'awarded' ? 'check-circle' : event.quotations_count ? 'file-text' : 'clock'" class="h-3.5 w-3.5" />
									</span>
									<span class="truncate">{{ eventProgressCopy(event) }}</span>
								</div>

								<button type="button"
									class="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#285F6b] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#1f4a54]"
									@click="viewQuotations(event)">
									{{ eventActionLabel(event) }}
									<IconBase name="arrow-right" class="h-3.5 w-3.5" />
								</button>
							</div>
						</div>
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
					{{ clientEvents.length ? 'No events in this stage' : 'No event inquiries yet' }}
				</h2>

				<p class="mt-1 max-w-sm text-sm text-gray-500">
					{{ clientEvents.length
						? 'Choose another filter to see the rest of your events.'
						: 'Post your first event inquiry and qualified organizers will submit quotations for you to review.' }}
				</p>

				<button v-if="!clientEvents.length" type="button"
					class="mt-5 flex items-center gap-2 rounded-xl bg-[#285F6b] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f4a54]"
					@click="navigateTo('/client/post-event')">
					<IconBase name="plus" class="h-4 w-4" />
					Post My First Event
				</button>

				<button v-else type="button" class="mt-5 text-sm font-bold text-primary-700 hover:text-primary-900"
					@click="eventFilter = 'all'">
					View all events
				</button>
			</div>
		</div>

		<Teleport to="body">
			<Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
				enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in"
				leave-from-class="opacity-100" leave-to-class="opacity-0">
				<div v-if="confirmationQuotation" class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
					role="dialog" aria-modal="true" aria-labelledby="accept-quotation-title" @click.self="closeQuotationConfirmation">
					<div class="w-full max-w-md overflow-hidden rounded-3xl border border-white/70 bg-white shadow-2xl">
						<div class="relative bg-gradient-to-br from-[#285F6b] to-[#173d45] px-6 pb-7 pt-6 text-white">
							<button type="button" aria-label="Close confirmation"
								class="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
								:disabled="acceptingQuotationId !== null" @click="closeQuotationConfirmation">
								<IconBase name="x" class="h-4 w-4" />
							</button>
							<div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
								<IconBase name="award" class="h-6 w-6" />
							</div>
							<p class="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-white/65">Final selection</p>
							<h2 id="accept-quotation-title" class="mt-1 text-2xl font-extrabold tracking-tight">Accept this quotation?</h2>
							<p class="mt-2 text-sm leading-6 text-white/75">This organizer will be awarded your event and the other quotations will be closed.</p>
						</div>

						<div class="p-6">
							<div class="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
								<div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#285F6b]/10 font-bold text-[#285F6b]">
									{{ organizerInitials(confirmationQuotation) }}
								</div>
								<div class="min-w-0 flex-1">
									<p class="truncate font-bold text-gray-900">{{ organizerName(confirmationQuotation) }}</p>
									<p class="mt-0.5 text-xs text-gray-500">{{ confirmationQuotation.package_name || 'Custom Package' }}</p>
								</div>
								<p class="shrink-0 text-lg font-extrabold text-[#285F6b]">{{ formatQuotationCurrency(confirmationQuotation.quotation_amount) }}</p>
							</div>

							<div class="mt-6 grid grid-cols-2 gap-3">
								<button type="button" class="h-12 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
									:disabled="acceptingQuotationId !== null" @click="closeQuotationConfirmation">Keep reviewing</button>
								<button type="button" class="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#285F6b] text-sm font-bold text-white shadow-lg shadow-[#285F6b]/20 transition hover:bg-[#1f4a54] disabled:cursor-wait disabled:opacity-60"
									:disabled="acceptingQuotationId !== null" @click="acceptQuotation(confirmationQuotation)">
									<IconBase :name="acceptingQuotationId !== null ? 'refresh-cw' : 'check-circle'" :class="['h-4 w-4', acceptingQuotationId !== null && 'animate-spin']" />
									{{ acceptingQuotationId !== null ? 'Accepting...' : 'Yes, accept offer' }}
								</button>
							</div>
						</div>
					</div>
				</div>
			</Transition>
		</Teleport>

		<FormsConfirmationModal :open="quotationAccepted" variant="success" eyebrow="Organizer confirmed"
			title="Quotation accepted successfully"
			description="This organizer is now assigned to your event. You can open the event workspace now or stay here."
			confirm-label="Open event details" cancel-label="Stay on My Events"
			@cancel="quotationAccepted = false" @confirm="openAcceptedEvent">
			<div v-if="selectedEvent" class="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
				<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#285F6b]/10 text-[#285F6b]">
					<IconBase name="calendar" class="h-5 w-5" />
				</div>
				<div class="min-w-0">
					<p class="truncate font-extrabold text-gray-900">{{ selectedEvent.event_title || `${selectedEvent.event_type} event` }}</p>
					<p class="mt-0.5 text-xs font-semibold text-emerald-700">Planning can begin</p>
				</div>
			</div>
		</FormsConfirmationModal>
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
	meta: {
		current_page: number
		last_page: number
		total: number
	}
}

type NotificationFilter = 'all' | 'unread'
type EventFilter = 'all' | 'open' | 'offers' | 'awarded'

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
	middleware: ['client'],
})

const config = useRuntimeConfig()

const {
	firstName,
	token,
	user,
	isAuthenticated,
} = useAuth()

const clientName = computed(() => {
	return firstName.value || 'Client'
})

const clientEvents = ref<ClientInquiry[]>([])
const notifications = ref<ClientNotification[]>([])
const unreadNotificationCount = ref(0)
const notificationFilter = ref<NotificationFilter>('all')
const notificationPage = ref(1)
const notificationLastPage = ref(1)
const isLoadingNotifications = ref(false)
const notificationActionId = ref<string | null>(null)
const notificationFilters: Array<{ label: string; value: NotificationFilter }> = [
	{ label: 'All', value: 'all' },
	{ label: 'Unread', value: 'unread' },
]
const eventFilter = ref<EventFilter>('all')
const eventFilters: Array<{ label: string; value: EventFilter }> = [
	{ label: 'All', value: 'all' },
	{ label: 'Awaiting', value: 'open' },
	{ label: 'Offers ready', value: 'offers' },
	{ label: 'Confirmed', value: 'awarded' },
]
const eventJourneySteps = [
	{ title: 'Post an inquiry', description: 'Share your event details' },
	{ title: 'Compare offers', description: 'Choose the right organizer' },
	{ title: 'Plan with confidence', description: 'Track your confirmed event' },
]

const isLoading = ref(false)
const errorMessage = ref('')

const showQuotations = ref(false)
const selectedEvent = ref<ClientInquiry | null>(null)

const quotations = ref<Quotation[]>([])
const isLoadingQuotations = ref(false)
const quotationError = ref('')
const acceptingQuotationId = ref<number | null>(null)
const confirmationQuotation = ref<Quotation | null>(null)
const quotationAccepted = ref(false)

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

function eventMonth(dateStr: string): string {
	if (!dateStr) return 'TBD'

	const date = dateStr.includes('T')
		? new Date(dateStr)
		: new Date(`${dateStr}T00:00:00`)

	return date.toLocaleDateString('en-US', { month: 'short' })
}

function eventDay(dateStr: string): string {
	if (!dateStr) return '—'

	const date = dateStr.includes('T')
		? new Date(dateStr)
		: new Date(`${dateStr}T00:00:00`)

	return date.toLocaleDateString('en-US', { day: '2-digit' })
}

function eventStatusLabel(event: ClientInquiry): string {
	if (event.status === 'awarded') return 'Confirmed'
	if (event.status === 'cancelled') return 'Cancelled'
	if (event.quotations_count > 0) return 'Offers ready'
	return 'Awaiting offers'
}

function eventStatusClass(event: ClientInquiry): string {
	if (event.status === 'awarded') return 'border-green-200 bg-green-50 text-green-700'
	if (event.status === 'cancelled') return 'border-red-200 bg-red-50 text-red-600'
	if (event.quotations_count > 0) return 'border-blue-200 bg-blue-50 text-blue-700'
	return 'border-amber-200 bg-amber-50 text-amber-700'
}

function eventProgressCopy(event: ClientInquiry): string {
	if (event.status === 'awarded') return 'Organizer selected — continue planning'
	if (event.status === 'cancelled') return 'This inquiry has been cancelled'
	if (event.quotations_count > 0) return `${event.quotations_count} organizer offer${event.quotations_count === 1 ? '' : 's'} ready to compare`
	return 'Shared with matching organizers'
}

function eventActionLabel(event: ClientInquiry): string {
	if (event.status === 'awarded') return 'Open event'
	if (event.quotations_count > 0) return 'Review offers'
	return 'View status'
}

function matchesEventFilter(event: ClientInquiry, filter: EventFilter): boolean {
	if (filter === 'awarded') return event.status === 'awarded'
	if (filter === 'offers') return event.status !== 'awarded' && event.quotations_count > 0
	if (filter === 'open') return event.status !== 'awarded' && event.status !== 'cancelled' && event.quotations_count === 0
	return true
}

function eventFilterCount(filter: EventFilter): number {
	return clientEvents.value.filter(event => matchesEventFilter(event, filter)).length
}

const filteredEvents = computed(() =>
	clientEvents.value.filter(event => matchesEventFilter(event, eventFilter.value)),
)

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

async function loadNotifications(
	page = 1,
	append = false,
) {
	if (!token.value) {
		return
	}

	isLoadingNotifications.value = true

	try {
		const response =
			await $fetch<NotificationResponse>(
				`${config.public.apiBaseURL}/notifications`,
				{
					method: 'GET',
					query: {
						filter: notificationFilter.value,
						page,
						per_page: 10,
					},
					headers: {
						Accept:
							'application/json',
						Authorization:
							`Bearer ${token.value}`,
					},
				},
			)

		notifications.value = append
			? [...notifications.value, ...(response.data ?? [])]
			: response.data ?? []

		unreadNotificationCount.value =
			response.unread_count ?? 0

		notificationPage.value =
			response.meta?.current_page ?? page

		notificationLastPage.value =
			response.meta?.last_page ?? 1
	} catch (error) {
		console.error(
			'Failed to load notifications:',
			error,
		)
	} finally {
		isLoadingNotifications.value = false
	}
}

async function setNotificationFilter(
	filter: NotificationFilter,
) {
	if (notificationFilter.value === filter) {
		return
	}

	notificationFilter.value = filter
	await loadNotifications()
}

async function loadMoreNotifications() {
	if (
		isLoadingNotifications.value ||
		notificationPage.value >= notificationLastPage.value
	) {
		return
	}

	await loadNotifications(
		notificationPage.value + 1,
		true,
	)
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

async function toggleNotificationRead(
	notification: ClientNotification,
) {
	if (!token.value || notificationActionId.value) {
		return
	}

	notificationActionId.value = notification.id

	try {
		await $fetch(
			`${config.public.apiBaseURL}/notifications/${notification.id}/${notification.read_at ? 'unread' : 'read'}`,
			{
				method: 'POST',
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${token.value}`,
				},
			},
		)

		await loadNotifications()
	} catch (error) {
		console.error('Failed to update notification:', error)
	} finally {
		notificationActionId.value = null
	}
}

async function removeNotification(
	notificationId: string,
) {
	if (!token.value || notificationActionId.value) {
		return
	}

	notificationActionId.value = notificationId

	try {
		await $fetch(
			`${config.public.apiBaseURL}/notifications/${notificationId}`,
			{
				method: 'DELETE',
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${token.value}`,
				},
			},
		)

		await loadNotifications()
	} catch (error) {
		console.error('Failed to remove notification:', error)
	} finally {
		notificationActionId.value = null
	}
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
	confirmationQuotation.value = null
}

function requestQuotationAcceptance(quotation: Quotation) {
	confirmationQuotation.value = quotation
}

function closeQuotationConfirmation() {
	if (acceptingQuotationId.value !== null) {
		return
	}

	confirmationQuotation.value = null
}

function openAcceptedEvent() {
	quotationAccepted.value = false

	if (!selectedEvent.value) return

	navigateTo({
		path: '/client/event-details',
		query: { inquiry: selectedEvent.value.id },
	})
}

async function acceptQuotation(
	quotation: Quotation,
) {
	if (!token.value) {
		quotationError.value = 'Your session has expired. Please log in again.'
		confirmationQuotation.value = null

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

		confirmationQuotation.value = null

		if (selectedEvent.value) {
			const selectedEventId =
				selectedEvent.value.id

			const updatedEvent =
				clientEvents.value.find(
					event =>
						event.id ===
						selectedEventId,
				)

			if (updatedEvent) {
				selectedEvent.value =
					updatedEvent
			}
		}

		quotationAccepted.value = true

	} catch (error: unknown) {
		console.error(
			'Failed to accept quotation:',
			error,
		)

		const apiError =
			error as {
				statusCode?: number
				status?: number

				response?: {
					status?: number
					_data?: {
						message?: string
					}
				}

				data?: {
					message?: string
				}

				message?: string
			}

		const statusCode =
			apiError.statusCode ??
			apiError.status ??
			apiError.response?.status

		const backendMessage =
			apiError.data?.message ??
			apiError.response?._data?.message

		if (statusCode === 401) {
			quotationError.value = 'Your session has expired. Please log in again.'
			confirmationQuotation.value = null

			return
		}

		if (statusCode === 403) {
			quotationError.value = backendMessage ??
				'You are not authorized to accept this quotation.'
			confirmationQuotation.value = null

			return
		}

		if (backendMessage) {
			quotationError.value = backendMessage
			confirmationQuotation.value = null

			return
		}

		quotationError.value = 'Unable to accept quotation. Please try again.'
		confirmationQuotation.value = null

	} finally {
		acceptingQuotationId.value =
			null
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

	if (
		user.value.role !==
		'client'
	) {
		errorMessage.value =
			'This account is not a client account.'

		return
	}

	isLoading.value = true

	try {
		console.log(
			'Loading client inquiries...'
		)

		console.log(
			'Current user:',
			user.value
		)

		console.log(
			'API URL:',
			`${config.public.apiBaseURL}/inquiries/client`
		)

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

		console.log(
			'Client inquiries response:',
			response
		)

		clientEvents.value =
			response.data ?? []

	} catch (error: unknown) {
		console.error(
			'Failed to load client inquiries:',
			error
		)

		const apiError =
			error as {
				statusCode?: number
				status?: number

				response?: {
					status?: number

					_data?: {
						message?: string
					}
				}

				data?: {
					message?: string
				}

				message?: string
			}

		const statusCode =
			apiError.statusCode ??
			apiError.status ??
			apiError.response?.status

		const backendMessage =
			apiError.data?.message ??
			apiError.response?._data?.message

		console.error(
			'Inquiry API status:',
			statusCode
		)

		console.error(
			'Inquiry API message:',
			backendMessage
		)
		if (statusCode === 401) {
			errorMessage.value =
				'Your session has expired. Please log in again.'

			return
		}
		if (statusCode === 403) {
			errorMessage.value =
				backendMessage ??
				'You are not authorized to view these inquiries.'

			return
		}
		if (backendMessage) {
			errorMessage.value =
				backendMessage

			return
		}
		if (apiError.message) {
			errorMessage.value =
				apiError.message

			return
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

onMounted(() => {
	loadClientInquiries()
})
</script>
