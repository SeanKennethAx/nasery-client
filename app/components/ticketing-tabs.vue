<template>
	<div>
		<div class="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
			<div>
				<h1 class="text-2xl font-extrabold text-gray-900">
					Registration, Ticketing &amp; Attendance
				</h1>

				<p class="mt-1 text-gray-500">
					Manage tickets, payments, and attendee check-in
				</p>
			</div>

			<div v-if="selectedEvent" class="flex items-center gap-2">
				<div
					class="flex items-center gap-2 rounded-full bg-[#285F6b]/10 px-3 py-1.5 text-xs font-semibold text-[#285F6b]">
					<span class="h-2 w-2 rounded-full bg-[#285F6b]" />

					{{ selectedEvent.name }}
				</div>

				<button type="button"
					class="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-sm transition hover:border-[#285F6b]/30 hover:bg-[#285F6b]/5 hover:text-[#285F6b]"
					title="Clear selected event" aria-label="Clear selected event" @click="clearSelectedEvent">
					<IconBase name="x" class="h-4 w-4" />
				</button>
			</div>
		</div>

		<div class="mb-6">
			<div class="mb-2 flex items-center justify-between gap-3">
				<label class="block text-sm font-semibold text-gray-700">
					Select Event
				</label>

				<button v-if="selectedEvent" type="button"
					class="flex items-center gap-1.5 text-xs font-semibold text-gray-500 transition hover:text-[#285F6b]"
					@click="clearSelectedEvent">
					<IconBase name="arrow-left" class="h-3.5 w-3.5" />

					Choose another event
				</button>
			</div>

			<div class="relative">
				<button type="button"
					class="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-left shadow-sm transition hover:border-[#285F6b]/40 hover:shadow-md focus:border-[#285F6b] focus:outline-none focus:ring-4 focus:ring-[#285F6b]/10"
					@click="
						showEventSelector =
						!showEventSelector
						">
					<div v-if="selectedEvent" class="flex min-w-0 items-center gap-3">
						<div
							class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#285F6b]/10 text-[#285F6b]">
							<IconBase name="calendar" class="h-5 w-5" />
						</div>

						<div class="min-w-0">
							<p class="truncate text-sm font-bold text-gray-900">
								{{ selectedEvent.name }}
							</p>

							<div class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
								<span class="flex items-center gap-1">
									<IconBase name="calendar" class="h-3.5 w-3.5" />

									{{
										formatEventDate(
											selectedEvent.event_date,
										)
									}}
								</span>

								<span v-if="
									selectedEvent.location
								" class="flex items-center gap-1">
									<IconBase name="map-pin" class="h-3.5 w-3.5" />

									{{
										selectedEvent.location
									}}
								</span>
							</div>
						</div>
					</div>

					<div v-else class="flex items-center gap-3">
						<div
							class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
							<IconBase name="calendar" class="h-5 w-5" />
						</div>

						<div>
							<p class="text-sm font-semibold text-gray-700">
								Choose an event
							</p>

							<p class="mt-0.5 text-xs text-gray-400">
								Select an event to manage ticketing and attendance
							</p>
						</div>
					</div>

					<IconBase name="chevron-down" class="h-5 w-5 shrink-0 text-gray-400 transition-transform" :class="{
						'rotate-180':
							showEventSelector,
					}" />
				</button>

				<Transition name="dropdown">
					<div v-if="showEventSelector"
						class="absolute left-0 right-0 z-50 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-gray-200 bg-white p-2 shadow-xl">
						<button v-for="event in organizerEvents" :key="event.id" type="button"
							class="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-gray-50"
							:class="selectedEventId ===
								event.id
								? 'bg-[#285F6b]/5'
								: ''
								" @click="
									selectEvent(
										event,
									)
									">
							<div
								class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#285F6b]/10 text-[#285F6b]">
								<IconBase name="calendar" class="h-4 w-4" />
							</div>

							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-3">
									<p class="truncate text-sm font-bold text-gray-900">
										{{ event.name }}
									</p>

									<span class="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold" :class="eventStatusClass(
										event.status,
									)
										">
										{{
											formatEventStatus(
												event.status,
											)
										}}
									</span>
								</div>

								<div class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
									<span class="flex items-center gap-1">
										<IconBase name="calendar" class="h-3.5 w-3.5" />

										{{
											formatEventDate(
												event.event_date,
											)
										}}
									</span>

									<span v-if="
										event.location
									" class="flex items-center gap-1">
										<IconBase name="map-pin" class="h-3.5 w-3.5" />

										{{
											event.location
										}}
									</span>
								</div>
							</div>

							<IconBase v-if="
								selectedEventId ===
								event.id
							" name="check-circle" class="h-5 w-5 shrink-0 text-[#285F6b]" />
						</button>

						<div v-if="
							!organizerEvents.length
						" class="px-4 py-8 text-center">
							<IconBase name="calendar" class="mx-auto h-6 w-6 text-gray-400" />

							<p class="mt-2 text-sm font-semibold text-gray-700">
								No events available
							</p>

							<p class="mt-1 text-xs text-gray-400">
								Configure an event first.
							</p>
						</div>
					</div>
				</Transition>
			</div>
		</div>

		<div class="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
			<div class="rounded-2xl border border-gray-200 bg-white p-5">
				<div class="flex items-start justify-between gap-3">
					<div>
						<span class="text-sm text-gray-500">
							Total Registered
						</span>

						<div class="mt-2 text-3xl font-extrabold text-gray-900">
							{{
								selectedEventId
									? summary.total_registered
									: '—'
							}}
						</div>

						<div class="mt-2 text-sm text-gray-500">
							Issued attendee tickets
						</div>
					</div>

					<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
						<IconBase name="users" class="h-5 w-5" />
					</div>
				</div>
			</div>

			<div class="rounded-2xl border border-gray-200 bg-white p-5">
				<div class="flex items-start justify-between gap-3">
					<div>
						<span class="text-sm text-gray-500">
							Checked In
						</span>

						<div class="mt-2 text-3xl font-extrabold text-gray-900">
							{{
								selectedEventId
									? summary.checked_in
									: '—'
							}}
						</div>

						<div class="mt-2 text-sm text-gray-500">
							Attendees admitted
						</div>
					</div>

					<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
						<IconBase name="check-circle" class="h-5 w-5" />
					</div>
				</div>
			</div>

			<div class="rounded-2xl border border-gray-200 bg-white p-5">
				<div class="flex items-start justify-between gap-3">
					<div>
						<span class="text-sm text-gray-500">
							Walk-ins
						</span>

						<div class="mt-2 text-3xl font-extrabold text-gray-900">
							{{
								selectedEventId
									? summary.walk_ins
									: '—'
							}}
						</div>

						<div class="mt-2 text-sm text-gray-500">
							Paid on-site registrations
						</div>
					</div>

					<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
						<IconBase name="user-plus" class="h-5 w-5" />
					</div>
				</div>
			</div>

			<div class="rounded-2xl border border-gray-200 bg-white p-5">
				<div class="flex items-start justify-between gap-3">
					<div>
						<span class="text-sm text-gray-500">
							Capacity Status
						</span>

						<div class="mt-2 flex items-end gap-2">
							<div class="text-3xl font-extrabold text-gray-900">
								{{
									selectedEventId
										? `${summary.capacity_percent}%`
										: '—'
								}}
							</div>
						</div>

						<div class="mt-2 text-sm text-gray-500">
							<span v-if="
								selectedEventId
							">
								{{
									summary.total_registered
								}}/{{
									summary.capacity
								}}
							</span>

							<span v-else>
								Select an event
							</span>
						</div>
					</div>

					<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
						<IconBase name="bar-chart" class="h-5 w-5" />
					</div>
				</div>

				<div v-if="
					selectedEventId &&
					summary.capacity > 0
				" class="mt-4 h-1.5 overflow-hidden rounded-full bg-gray-100">
					<div class="h-full rounded-full bg-[#285F6b] transition-all" :style="{
						width: `${summary.capacity_percent}%`,
					}" />
				</div>
			</div>
		</div>

		<div v-if="summaryError" class="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
			{{ summaryError }}
		</div>

		<div class="mb-6 inline-flex flex-wrap gap-1 rounded-xl bg-gray-100 p-1">
			<NuxtLink v-for="tab in tabs" :key="tab.label" :to="tab.to"
				class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold" :class="route.path === tab.path
					? 'bg-white text-gray-900 shadow-sm'
					: 'text-gray-500 hover:text-gray-700'
					">
				<IconBase :name="tab.icon" class="h-4 w-4" />

				{{ tab.label }}
			</NuxtLink>
		</div>
	</div>
</template>

<script setup lang="ts">
interface OrganizerEvent {
	id: number
	name: string
	event_type: string
	event_date: string | null
	location: string | null
	status: string
}

interface AttendeeSummary {
	total_registered: number
	checked_in: number
	walk_ins: number
	capacity: number
	capacity_percent: number
}

type OrganizerEventsResponse =
	| OrganizerEvent[]
	| {
		data: OrganizerEvent[]
	}

interface AttendeeSummaryResponse {
	data: AttendeeSummary
}

interface ApiErrorResponse {
	data?: {
		message?: string
		errors?: Record<
			string,
			string[]
		>
	}
}

const route =
	useRoute()

const router =
	useRouter()

const config =
	useRuntimeConfig()

const {
	token,
} = useAuth()

const organizerEvents =
	useState<OrganizerEvent[]>(
		'ticketingOrganizerEvents',
		() => [],
	)

const selectedEventId =
	useState<number | null>(
		'ticketingSelectedEventId',
		() => null,
	)

const selectedEvent =
	computed<OrganizerEvent | null>(
		() => {
			if (
				!selectedEventId.value
			) {
				return null
			}

			return (
				organizerEvents.value.find(
					event =>
						event.id ===
						selectedEventId.value,
				) ?? null
			)
		},
	)

const summary =
	useState<AttendeeSummary>(
		'ticketingAttendeeSummary',
		() => ({
			total_registered: 0,
			checked_in: 0,
			walk_ins: 0,
			capacity: 0,
			capacity_percent: 0,
		}),
	)

const showEventSelector =
	ref(false)

const summaryError =
	ref('')

const tabs =
	computed(() => {
		const eventQuery =
			selectedEventId.value
				? {
					event:
						selectedEventId.value,
				}
				: {}

		return [
			{
				label: 'Attendees',

				path:
					'/organizer/ticketattendance/attendees',

				to: {
					path:
						'/organizer/ticketattendance/attendees',

					query:
						eventQuery,
				},

				icon:
					'users',
			},

			{
				label:
					'QR Check-in',

				path:
					'/organizer/ticketattendance/qr-checkin',

				to: {
					path:
						'/organizer/ticketattendance/qr-checkin',

					query:
						eventQuery,
				},

				icon:
					'qr-code',
			},

			{
				label:
					'Walk-in Counter',

				path:
					'/organizer/ticketattendance/walkin-counter',

				to: {
					path:
						'/organizer/ticketattendance/walkin-counter',

					query:
						eventQuery,
				},

				icon:
					'user-plus',
			},

			{
				label:
					'Attendance Report',

				path:
					'/organizer/ticketattendance/attendance-report',

				to: {
					path:
						'/organizer/ticketattendance/attendance-report',

					query:
						eventQuery,
				},

				icon:
					'clipboard-list',
			},
		]
	})

function resetSummary() {
	summary.value = {
		total_registered: 0,
		checked_in: 0,
		walk_ins: 0,
		capacity: 0,
		capacity_percent: 0,
	}
}

function getApiErrorMessage(
	error: unknown,
	fallback: string,
): string {
	const apiError =
		error as ApiErrorResponse

	const validationMessage =
		Object.values(
			apiError.data?.errors ??
			{},
		)[0]?.[0]

	return (
		validationMessage ??
		apiError.data?.message ??
		fallback
	)
}

async function loadOrganizerEvents() {
	if (!token.value) {
		return
	}

	try {
		const response =
			await $fetch<OrganizerEventsResponse>(
				`${config.public.apiBaseURL}/organizer/events`,
				{
					method:
						'GET',

					headers: {
						Accept:
							'application/json',

						Authorization:
							`Bearer ${token.value}`,
					},
				},
			)

		organizerEvents.value =
			Array.isArray(response)
				? response
				: response.data ?? []

		const queryEvent =
			route.query.event

		if (
			typeof queryEvent ===
			'string'
		) {
			const parsed =
				Number(queryEvent)

			const exists =
				organizerEvents.value.some(
					event =>
						event.id ===
						parsed,
				)

			if (
				Number.isFinite(parsed) &&
				exists
			) {
				selectedEventId.value =
					parsed

				return
			}
		}

		selectedEventId.value =
			null

		resetSummary()

	} catch (error: unknown) {
		console.error(
			'Failed to load organizer events:',
			error,
		)

		summaryError.value =
			getApiErrorMessage(
				error,
				'Unable to load organizer events.',
			)
	}
}

async function loadSummary() {
	if (
		!token.value ||
		!selectedEventId.value
	) {
		resetSummary()

		return
	}

	summaryError.value =
		''

	try {
		const response =
			await $fetch<AttendeeSummaryResponse>(
				`${config.public.apiBaseURL}/organizer/events/${selectedEventId.value}/attendee-summary`,
				{
					method:
						'GET',

					headers: {
						Accept:
							'application/json',

						Authorization:
							`Bearer ${token.value}`,
					},
				},
			)

		summary.value =
			response.data

	} catch (error: unknown) {
		console.error(
			'Failed to load ticketing summary:',
			error,
		)

		summaryError.value =
			getApiErrorMessage(
				error,
				'Unable to load ticketing summary.',
			)
	}
}

async function selectEvent(
	event: OrganizerEvent,
) {
	showEventSelector.value =
		false

	selectedEventId.value =
		event.id

	await syncEventQuery(
		event.id,
	)
}

async function clearSelectedEvent() {
	showEventSelector.value =
		false

	selectedEventId.value =
		null

	resetSummary()

	summaryError.value =
		''

	const remainingQuery = {
		...route.query,
	}

	delete remainingQuery.event

	await router.replace({
		path:
			route.path,

		query:
			remainingQuery,
	})
}

async function syncEventQuery(
	eventId: number,
) {
	await router.replace({
		path:
			route.path,

		query: {
			...route.query,

			event:
				String(eventId),
		},
	})
}

function formatEventDate(
	value: string | null,
): string {
	if (!value) {
		return 'Date not set'
	}

	const date =
		new Date(
			value.includes('T')
				? value
				: `${value}T00:00:00`,
		)

	return date.toLocaleDateString(
		'en-US',
		{
			month:
				'short',

			day:
				'numeric',

			year:
				'numeric',
		},
	)
}

function formatEventStatus(
	status: string,
): string {
	if (!status) {
		return 'Draft'
	}

	return (
		status.charAt(0).toUpperCase() +
		status.slice(1)
	)
}

function eventStatusClass(
	status: string,
): string {
	switch (status) {
		case 'published':
		case 'confirmed':
			return 'bg-green-50 text-green-700'

		case 'ongoing':
			return 'bg-blue-50 text-blue-700'

		case 'completed':
			return 'bg-gray-100 text-gray-600'

		case 'cancelled':
			return 'bg-red-50 text-red-600'

		default:
			return 'bg-gray-100 text-gray-600'
	}
}

watch(
	selectedEventId,
	async (
		newEventId,
		oldEventId,
	) => {
		if (
			newEventId ===
			oldEventId
		) {
			return
		}

		if (!newEventId) {
			resetSummary()

			return
		}

		await loadSummary()
	},
)

watch(
	() =>
		route.query.event,

	async value => {
		if (
			typeof value !==
			'string'
		) {
			if (
				selectedEventId.value !==
				null
			) {
				selectedEventId.value =
					null
			}

			resetSummary()

			return
		}

		const parsed =
			Number(value)

		if (
			!Number.isFinite(parsed)
		) {
			selectedEventId.value =
				null

			resetSummary()

			return
		}

		const exists =
			organizerEvents.value.some(
				event =>
					event.id ===
					parsed,
			)

		if (
			organizerEvents.value.length &&
			!exists
		) {
			selectedEventId.value =
				null

			resetSummary()

			return
		}

		if (
			selectedEventId.value !==
			parsed
		) {
			selectedEventId.value =
				parsed
		}
	},
)

onMounted(async () => {
	await loadOrganizerEvents()

	if (
		selectedEventId.value
	) {
		await loadSummary()
	}
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
	transition:
		opacity 0.15s ease,
		transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
	opacity: 0;
	transform: translateY(-6px);
}
</style>