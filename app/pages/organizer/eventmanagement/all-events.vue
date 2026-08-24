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
				" class="cursor-pointer rounded-2xl border bg-white p-6 transition hover:border-primary-200 hover:shadow-sm"
				:class="[
					item.event
						? 'border-gray-200'
						: 'border-green-200',

					selectedEventId &&
						item.event?.id === selectedEventId
						? 'ring-2 ring-primary-500/30'
						: '',
				]" @click="openPlanningItem(item)">
				<div class="flex flex-wrap items-start justify-between gap-4">
					<div>
						<div v-if="!item.event"
							class="mb-2 text-xs font-semibold uppercase tracking-wide text-green-600">
							Client Awarded Your Bid
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

					<span v-else
						class="shrink-0 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
						Awarded
					</span>
				</div>

				<div v-if="item.quotation" class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
					<div class="rounded-xl bg-gray-50 p-4">
						<div class="text-xs text-gray-500">
							Accepted Package
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
							Agreed Amount
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

				<div v-if="item.event" class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
					<div>
						<div class="text-sm text-gray-500">
							Expected Guests
						</div>

						<div class="mt-1 text-2xl font-extrabold text-gray-900">
							{{
								item.event.expected_guests ??
								0
							}}
						</div>
					</div>

					<div>
						<div class="text-sm text-gray-500">
							Start Time
						</div>

						<div class="mt-1 text-2xl font-extrabold text-gray-900">
							{{
								item.event.start_time ||
								'—'
							}}
						</div>
					</div>

					<div>
						<div class="text-sm text-gray-500">
							End Time
						</div>

						<div class="mt-1 text-2xl font-extrabold text-gray-900">
							{{
								item.event.end_time ||
								'—'
							}}
						</div>
					</div>
				</div>

				<div class="mt-5">
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
						View Details
					</button>
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
			if (
				quotation.quotation_status !==
				'accepted'
			) {
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