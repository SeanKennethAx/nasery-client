<template>
	<div class="space-y-5">
		<div v-if="isLoading" class="flex items-center gap-2 text-sm text-gray-500">
			<IconBase name="refresh-cw" class="h-4 w-4 animate-spin" />
			Refreshing events...
		</div>

		<div v-if="errorMessage && !planningItems.length"
			class="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
			{{ errorMessage }}
		</div>

		<div v-else-if="planningItems.length" class="space-y-5">
			<article v-for="item in planningItems" :key="item.key" :id="item.event
				? `event-${item.event.id}`
				: `quotation-${item.quotation?.id}`
				" class="cursor-pointer overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md"
				:class="[
					item.event
						? 'border-gray-200'
						: item.quotation?.quotation_status === 'accepted' ? 'border-green-200' : 'border-amber-200',

					selectedEventId &&
						item.event?.id === selectedEventId
						? 'ring-2 ring-primary-500/30'
						: '',
				]" @click="openPlanningItem(item)">
				<div class="h-1" :class="item.event ? 'bg-primary-700' : item.quotation?.quotation_status === 'accepted' ? 'bg-emerald-500' : 'bg-amber-400'" />
				<div class="p-6">
				<div class="flex flex-wrap items-start justify-between gap-4">
					<div>
						<div v-if="!item.event"
							class="mb-2 text-xs font-semibold uppercase tracking-wide" :class="item.quotation?.quotation_status === 'accepted' ? 'text-green-600' : 'text-amber-600'">
							{{ item.quotation?.quotation_status === 'accepted' ? 'Client awarded your bid' : 'Offer awaiting client decision' }}
						</div>

						<h3 class="text-lg font-bold text-gray-900">
							{{ item.name }}
						</h3>

						<p class="mt-1 text-sm text-gray-500">
							{{ formatDate(item.eventDate) }}

							<template v-if="item.location">
								&bull;
								{{ item.location }}
							</template>
						</p>
					</div>

					<span v-if="item.event" class="shrink-0 rounded-full px-3 py-1 text-xs font-semibold" :class="item.event.status === 'published'
						? 'bg-gray-900 text-white'
						: 'border border-gray-200 bg-white text-gray-600'
						">
						{{
							formatEventStatus(
								item.event.status,
							)
						}}
					</span>

					<span v-else class="shrink-0 rounded-full border px-3 py-1 text-xs font-semibold"
						:class="item.quotation?.quotation_status === 'accepted' ? 'border-green-200 bg-green-50 text-green-700' : 'border-amber-200 bg-amber-50 text-amber-700'">
						{{ item.quotation?.quotation_status === 'accepted' ? 'Awarded' : 'Pending offer' }}
					</span>
				</div>

				<div v-if="item.quotation" class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
					<div class="rounded-xl bg-gray-50 p-4">
						<div class="text-xs text-gray-500">
							{{ item.quotation.quotation_status === 'accepted' ? 'Accepted Package' : 'Proposed Package' }}
						</div>

						<div class="mt-1 font-bold text-gray-900">
							{{
								item.quotation.package_name ||
								'Custom Package'
							}}
						</div>
					</div>

					<div class="rounded-xl bg-gray-50 p-4">
						<div class="text-xs text-gray-500">
							{{ item.quotation.quotation_status === 'accepted' ? 'Agreed Amount' : 'Offer Amount' }}
						</div>

						<div class="mt-1 font-bold text-primary-700">
							{{
								formatCurrency(
									item.quotation
										.quotation_amount,
								)
							}}
						</div>
					</div>

					<div class="rounded-xl bg-gray-50 p-4">
						<div class="text-xs text-gray-500">
							Timeline
						</div>

						<div class="mt-1 font-bold text-gray-900">
							{{
								item.quotation.timeline ||
								'Not specified'
							}}
						</div>
					</div>
				</div>

				<div class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
					<div class="rounded-xl border border-gray-100 bg-gray-50/70 p-4">
						<div class="text-sm text-gray-500">
							Expected Guests
						</div>

						<div class="mt-1 text-2xl font-extrabold text-gray-900">
							{{
								item.event?.expected_guests ?? item.quotation?.inquiry?.expected_guests ??
								0
							}}
						</div>
					</div>

					<div class="rounded-xl border border-gray-100 bg-gray-50/70 p-4">
						<div class="text-sm text-gray-500">
							Start Time
						</div>

						<div class="mt-1 text-2xl font-extrabold text-gray-900">
							{{
								formatTime(item.startTime)
							}}
						</div>
					</div>

					<div class="rounded-xl border border-gray-100 bg-gray-50/70 p-4">
						<div class="text-sm text-gray-500">
							End Time
						</div>

						<div class="mt-1 text-2xl font-extrabold text-gray-900">
							{{
								formatTime(item.endTime)
							}}
						</div>
					</div>
				</div>

				<div v-if="item.event || item.quotation?.quotation_status === 'accepted'" class="mt-5">
					<div class="mb-1 flex items-center justify-between text-sm">
						<span class="font-semibold text-gray-900">
							Event Readiness
						</span>

						<span class="text-gray-500">
							{{ readiness(item) }}%
						</span>
					</div>

					<div class="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
						<div class="h-full rounded-full bg-[#285F6b] transition-all" :style="{
							width:
								`${readiness(item)}%`,
						}" />
					</div>
				</div>

				<div class="mt-5 flex flex-wrap gap-3">
					<button v-if="item.event" type="button"
						class="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
						@click.stop="
							editEvent(item.event)
							">
						<IconBase name="edit" class="h-4 w-4" />

						Edit
					</button>

					<button type="button"
						class="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
						@click.stop="
							openPlanningItem(item)
							">
						{{ item.quotation?.quotation_status === 'pending' && !item.event ? 'View Offer' : 'View Details' }}
					</button>
				</div>
				</div>
			</article>
		</div>

		<div v-else-if="!isLoading"
			class="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
			<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
				<IconBase name="calendar" class="h-5 w-5" />
			</div>

			<h3 class="mt-4 font-bold text-gray-900">
				No events yet
			</h3>

			<p class="mt-1 text-sm text-gray-500">
				Won client quotations and manually created events
				will appear here.
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
interface OrganizerEvent {
	id: number
	inquiry_id: number | null
	quotation_id: number | null

	name: string
	event_type: string
	description: string | null

	event_date: string | null
	location: string | null

	expected_guests: number | null

	start_time: string | null
	end_time: string | null

	status: string
}

interface OfferInquiry {
	id: number

	event_title: string | null
	event_type: string

	event_date: string
	start_time: string | null
	end_time: string | null
	location: string

	expected_guests?: number
}

interface OrganizerQuotation {
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

	inquiry?: OfferInquiry

	event?: OrganizerEvent | null
}

interface EventResponse {
	data: OrganizerEvent[]
}

interface QuotationResponse {
	data: OrganizerQuotation[]
}

interface PlanningItem {
	key: string

	name: string

	eventDate: string | null
	startTime: string | null
	endTime: string | null

	location: string | null

	event: OrganizerEvent | null

	quotation: OrganizerQuotation | null
}

interface ActivityTimelineEvent {
	key: string
	eventId: number | null
	quotationId: number | null
	name: string
	eventType: string
	eventDate: string | null
	location: string | null
	status: string
	hasRealEvent: boolean
}

definePageMeta({
	layout: 'dashboard',
	middleware: ['organizer'],
})

const config =
	useRuntimeConfig()

const route =
	useRoute()

const {
	token,
} = useAuth()

const selectedEventId =
	computed<number | null>(() => {
		const value =
			route.query.event

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
const events =
	useState<OrganizerEvent[]>(
		'organizerEvents',
		() => [],
	)

const quotations =
	useState<OrganizerQuotation[]>(
		'organizerEventQuotations',
		() => [],
	)

const hasLoadedEvents =
	useState<boolean>(
		'organizerEventsLoaded',
		() => false,
	)

const activityTimelineEvents =
	useState<ActivityTimelineEvent[]>(
		'organizerActivityTimelineEvents',
		() => [],
	)

const isLoading =
	ref(false)

const errorMessage =
	ref('')

const planningItems =
	computed<PlanningItem[]>(() => {
		const items:
			PlanningItem[] = []

		for (
			const event of
			events.value
		) {
			const quotation =
				quotations.value.find(
					item =>
						item.id ===
						event.quotation_id,
				) ?? null

			items.push({
				key:
					`event-${event.id}`,

				name:
					event.name,

				eventDate:
					event.event_date,

				startTime: event.start_time,
				endTime: event.end_time,

				location:
					event.location,

				event,

				quotation,
			})
		}
		for (
			const quotation of
			quotations.value
		) {
			if (['rejected', 'withdrawn'].includes(quotation.quotation_status)) {
				continue
			}

			const alreadyHasEvent =
				events.value.some(
					event =>
						event.quotation_id ===
						quotation.id,
				)

			if (alreadyHasEvent) {
				continue
			}

			items.push({
				key:
					`quotation-${quotation.id}`,

				name:
					quotation.inquiry
						?.event_title ||
					`${quotation.inquiry
						?.event_type ||
					'Event'} Event`,

				eventDate:
					quotation.inquiry
						?.event_date ??
					 null,

				startTime: quotation.inquiry?.start_time ?? null,
				endTime: quotation.inquiry?.end_time ?? null,

				location:
					quotation.inquiry
						?.location ??
					null,

				event:
					null,

				quotation,
			})
		}

		return items
	})

function syncActivityTimelineEvents() {
	activityTimelineEvents.value =
		planningItems.value.map(
			item => ({
				key: item.key,
				eventId: item.event?.id ?? null,
				quotationId: item.quotation?.id ?? null,
				name: item.name,
				eventType:
					item.event?.event_type ??
					item.quotation?.inquiry?.event_type ??
					'Event',
				eventDate: item.eventDate,
				location: item.location,
				status: item.event
					? item.event.status
					: 'awarded',
				hasRealEvent: Boolean(item.event),
			}),
		)
}

function formatDate(
	dateString: string | null,
): string {
	if (!dateString) {
		return 'Date not set'
	}

	const date =
		new Date(
			dateString.includes('T')
				? dateString
				: `${dateString}T00:00:00`,
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

function formatTime(value: string | null): string {
	if (!value) return 'Not set'
	const [hours, minutes] = value.substring(0, 5).split(':').map(Number)
	return new Intl.DateTimeFormat('en-PH', { hour: 'numeric', minute: '2-digit' })
		.format(new Date(2000, 0, 1, hours, minutes))
}

function formatCurrency(
	value: string | number,
): string {
	const amount =
		Number(value)

	if (
		Number.isNaN(amount)
	) {
		return String(value)
	}

	return new Intl.NumberFormat(
		'en-PH',
		{
			style: 'currency',
			currency: 'PHP',
			maximumFractionDigits: 0,
		},
	).format(amount)
}

function formatEventStatus(
	status: string,
): string {
	if (!status) {
		return 'Draft'
	}

	return (
		status
			.charAt(0)
			.toUpperCase() +
		status.slice(1)
	)
}

function readiness(
	item: PlanningItem,
): number {
	if (!item.event) {
		return 20
	}

	let score = 20

	if (
		item.event.name
	) {
		score += 10
	}

	if (
		item.event.event_date
	) {
		score += 10
	}

	if (
		item.event.location
	) {
		score += 15
	}

	if (
		item.event.expected_guests
	) {
		score += 10
	}

	if (
		item.event.start_time
	) {
		score += 10
	}

	if (
		item.event.end_time
	) {
		score += 10
	}

	if (
		item.event.description
	) {
		score += 5
	}

	return Math.min(
		score,
		100,
	)
}


async function loadEvents(
	options: {
		silent?: boolean
	} = {},
) {
	if (!token.value) {
		errorMessage.value =
			'You are not authenticated.'

		return
	}
	const shouldShowLoading =
		!options.silent &&
		!hasLoadedEvents.value

	if (shouldShowLoading) {
		isLoading.value = true
	}

	errorMessage.value = ''

	try {
		const [
			eventResponse,
			quotationResponse,
		] = await Promise.all([
			$fetch<EventResponse>(
				`${config.public.apiBaseURL}/organizer/events`,
				{
					method: 'GET',

					headers: {
						Accept:
							'application/json',

						Authorization:
							`Bearer ${token.value}`,
					},
				},
			),

			$fetch<QuotationResponse>(
				`${config.public.apiBaseURL}/organizer/quotations`,
				{
					method: 'GET',

					headers: {
						Accept:
							'application/json',

						Authorization:
							`Bearer ${token.value}`,
					},
				},
			),
		])
		events.value =
			eventResponse.data ?? []

		quotations.value =
			quotationResponse.data ?? []

		hasLoadedEvents.value =
			true

		syncActivityTimelineEvents()

		await scrollToSelectedEvent()

	} catch (error: unknown) {
		console.error(
			'Failed to load event management data:',
			error,
		)

		const apiError =
			error as {
				data?: {
					message?: string
				}
			}

		errorMessage.value =
			apiError.data?.message ??
			'Unable to load events.'

	} finally {
		isLoading.value =
			false
	}
}

async function scrollToSelectedEvent() {
	if (
		!selectedEventId.value
	) {
		return
	}

	if (
		import.meta.server
	) {
		return
	}

	await nextTick()

	const element =
		document.getElementById(
			`event-${selectedEventId.value}`,
		)

	if (!element) {
		return
	}

	element.scrollIntoView({
		behavior:
			'smooth',

		block:
			'center',
	})
}
async function openPlanningItem(
	item: PlanningItem,
) {
	if (item.event) {
		await viewEvent(
			item.event,
		)

		return
	}
	if (!item.quotation) {
		return
	}

	if (item.quotation.quotation_status === 'pending') {
		await navigateTo('/organizer/inquiries/offers')
		return
	}

	await navigateTo({
		path:
			'/organizer/eventmanagement/event-details',

		query: {
			quotation:
				item.quotation.id,
		},
	})
}

async function viewEvent(
	event: OrganizerEvent,
) {
	await navigateTo({
		path:
			'/organizer/eventmanagement/event-details',

		query: {
			event:
				event.id,
		},
	})
}

async function editEvent(
	event: OrganizerEvent,
) {
	await navigateTo({
		path:
			'/organizer/eventmanagement/event-details',

		query: {
			event:
				event.id,

			mode:
				'edit',
		},
	})
}

watch(
	() =>
		route.query.event,

	() => {
		scrollToSelectedEvent()
	},
)

watch(
	[
		events,
		quotations,
	],
	() => {
		syncActivityTimelineEvents()
	},
	{
		deep: true,
	},
)

onMounted(async () => {
	if (
		!hasLoadedEvents.value
	) {
		await loadEvents()

		return
	}
	await loadEvents({
		silent:
			true,
	})
})
</script>
