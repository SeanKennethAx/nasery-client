<template>
	<div>
		<div v-if="isLoading" class="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
			Loading live events...
		</div>

		<div v-else-if="errorMessage" class="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
			{{ errorMessage }}
		</div>

		<div v-else-if="!events.length" class="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-14 text-center">
			<IconBase name="calendar" class="mx-auto h-7 w-7 text-gray-400" />
			<p class="mt-3 text-sm font-semibold text-gray-700">No events yet</p>
			<p class="mx-auto mt-1 max-w-sm text-xs text-gray-500">
				Create an event in Event Management to see its live check-in activity here.
			</p>
		</div>

		<template v-else>
			<div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div class="w-full sm:max-w-sm">
					<FormsSelect v-model="selectedEventId" :options="eventOptions" :can-clear="false"
						placeholder="Select an event" />
				</div>
				<span v-if="selectedEvent" class="inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
					:class="eventStatusClass(selectedEvent.status)">
					<span v-if="selectedEvent.status === 'ongoing'" class="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
					{{ formatEventStatus(selectedEvent.status) }}
				</span>
			</div>

			<div v-if="selectedEvent.status !== 'ongoing'" class="mb-5 flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4">
				<IconBase name="clock" class="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
				<p class="text-sm leading-6 text-amber-800">
					This event is marked <strong>{{ formatEventStatus(selectedEvent.status) }}</strong>, not "Ongoing" yet — the numbers below are still real, but check-in activity typically only starts once you mark the event Ongoing in Event Management.
				</p>
			</div>

			<div class="mb-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
				<h2 class="text-base font-bold text-gray-900">{{ selectedEvent.name }}</h2>
				<p class="mb-6 text-sm text-gray-500">Real-time event analytics</p>

				<div class="mb-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
					<div>
						<span class="text-sm text-gray-500">Checked In</span>
						<div class="mt-1 text-3xl font-extrabold text-gray-900">
							{{ summary.checked_in }}
						</div>
					</div>
					<div>
						<span class="text-sm text-gray-500">Registered</span>
						<div class="mt-1 text-3xl font-extrabold text-gray-900">
							{{ summary.total_registered }}</div>
					</div>
					<div>
						<span class="text-sm text-gray-500">Walk-ins</span>
						<div class="mt-1 text-3xl font-extrabold text-gray-900">
							{{ summary.walk_ins }}
						</div>
					</div>
					<div>
						<span class="text-sm text-gray-500">Capacity Fill</span>
						<div class="mt-1 text-3xl font-extrabold text-gray-900">
							{{ summary.capacity_percent }}%
						</div>
					</div>
				</div>

				<div class="grid grid-cols-1 items-center gap-6 sm:grid-cols-2">
					<ClientOnly>
						<apexchart type="radialBar" height="260" :options="gaugeOptions" :series="gaugeSeries" />
					</ClientOnly>

					<div class="space-y-5">
						<div>
							<div class="mb-1 flex items-center justify-between text-sm">
								<span class="font-semibold text-gray-900">Check-in Progress</span>
								<span class="text-gray-500">{{ summary.checked_in }} / {{ summary.total_registered }}</span>
							</div>
							<div class="h-2 w-full overflow-hidden rounded-full bg-gray-100">
								<div class="h-full rounded-full bg-[#16a34a]" :style="{ width: checkinProgress + '%' }" />
							</div>
						</div>
						<div>
							<div class="mb-1 flex items-center justify-between text-sm">
								<span class="font-semibold text-gray-900">Overall Capacity</span>
								<span class="text-gray-500">{{ summary.total_registered }} / {{ summary.capacity }}</span>
							</div>
							<div class="h-2 w-full overflow-hidden rounded-full bg-gray-100">
								<div class="h-full rounded-full bg-[#285F6b]" :style="{ width: summary.capacity_percent + '%' }" />
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
				<h2 class="text-base font-bold text-gray-900">
					Live Check-in Activity
				</h2>
				<p class="mb-5 text-sm text-gray-500">
					Recent attendee check-ins
				</p>
				<div v-if="checkinActivity.length" class="divide-y divide-gray-100">
					<div v-for="person in checkinActivity" :key="person.id"
						class="flex items-center gap-3 py-4 first:pt-0 last:pb-0">
						<IconBase name="user" class="h-5 w-5 shrink-0 text-gray-400" />
						<div class="min-w-0 flex-1">
							<div class="truncate text-sm font-semibold text-gray-900">
								{{ person.name }}
							</div>
							<div class="text-xs text-gray-400">
								{{ formatRelativeTime(person.checked_in_at) }}</div>
						</div>
						<span class="shrink-0 rounded-full px-3 py-1 text-xs font-semibold" :class="badgeClass(person.badge)">
							{{ person.badge }}
						</span>
					</div>
				</div>
				<p v-else class="py-8 text-center text-sm text-gray-400">No check-ins yet.</p>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'

definePageMeta({ layout: 'dashboard' })

const { token } = useAuth('organizer')
const config = useRuntimeConfig()

interface OrganizerEvent {
	id: number
	name: string
	status: string
}

interface TicketType {
	name: string
}

interface Attendee {
	id: number
	name: string
	ticket_type: TicketType | null
	source: string
	status: string
	checked_in_at: string | null
}

interface AttendeeSummary {
	total_registered: number
	checked_in: number
	walk_ins: number
	capacity: number
	capacity_percent: number
}

const isLoading = ref(false)
const errorMessage = ref('')
const events = ref<OrganizerEvent[]>([])
const selectedEventId = ref<number | null>(null)
const summary = ref<AttendeeSummary>({ total_registered: 0, checked_in: 0, walk_ins: 0, capacity: 0, capacity_percent: 0 })
const checkinActivity = ref<Array<{ id: number, name: string, checked_in_at: string, badge: string }>>([])

const selectedEvent = computed(() => events.value.find(event => event.id === selectedEventId.value) ?? null)
const eventOptions = computed(() => events.value.map(event => ({ value: event.id, label: `${event.name} (${formatEventStatus(event.status)})` })))

const checkinProgress = computed(() => {
	if (!summary.value.total_registered) return 0
	return Math.round((summary.value.checked_in / summary.value.total_registered) * 1000) / 10
})

const gaugeSeries = computed(() => [checkinProgress.value, summary.value.capacity_percent])

const gaugeOptions = computed<ApexOptions>(() => ({
	chart: { type: 'radialBar', fontFamily: 'inherit' },
	labels: ['Check-in', 'Capacity'],
	colors: ['#16a34a', '#285F6b'],
	stroke: { lineCap: 'round' },
	plotOptions: {
		radialBar: {
			hollow: { size: '42%' },
			track: { background: '#f1f5f9', strokeWidth: '100%' },
			dataLabels: {
				name: { fontSize: '12px', fontWeight: 700, color: '#6b7280' },
				value: { fontSize: '20px', fontWeight: 800, color: '#111827', formatter: (value: number) => `${value}%` },
				total: {
					show: true,
					label: 'Check-in',
					fontSize: '12px',
					fontWeight: 700,
					color: '#6b7280',
					formatter: () => `${checkinProgress.value}%`,
				},
			},
		},
	},
	legend: { show: true, position: 'bottom', fontSize: '13px', fontWeight: 600, markers: { size: 8 } },
}))

function getApiErrorMessage(error: unknown, fallback: string): string {
	const apiError = error as { data?: { message?: string } }
	return apiError?.data?.message || fallback
}

function authHeaders() {
	return { Accept: 'application/json', Authorization: `Bearer ${token.value}` }
}

function badgeClass(badge: string) {
	if (badge === 'Walk-in') return 'bg-amber-50 text-amber-700'
	if (badge.toLowerCase().includes('vip')) return 'bg-primary-50 text-primary-700'
	return 'bg-gray-100 text-gray-600'
}

function formatEventStatus(status: string): string {
	if (!status) return 'Draft'
	return status.charAt(0).toUpperCase() + status.slice(1)
}

function eventStatusClass(status: string): string {
	switch (status) {
		case 'published':
		case 'confirmed':
			return 'bg-green-50 text-green-700'
		case 'ongoing':
			return 'bg-green-50 text-green-700'
		case 'completed':
			return 'bg-gray-100 text-gray-600'
		case 'cancelled':
			return 'bg-red-50 text-red-600'
		default:
			return 'bg-gray-100 text-gray-600'
	}
}

function formatRelativeTime(dateString: string) {
	const diffMs = Date.now() - new Date(dateString).getTime()
	const minutes = Math.floor(diffMs / 60000)
	if (minutes < 1) return 'Just now'
	if (minutes < 60) return `${minutes}m ago`
	const hours = Math.floor(minutes / 60)
	if (hours < 24) return `${hours}h ago`
	const days = Math.floor(hours / 24)
	return `${days}d ago`
}

async function loadEvents() {
	if (!token.value) return

	isLoading.value = true
	errorMessage.value = ''

	try {
		const eventsResponse = await $fetch<{ data: OrganizerEvent[] } | OrganizerEvent[]>(
			`${config.public.apiBaseURL}/organizer/events`,
			{ method: 'GET', headers: authHeaders() },
		)

		events.value = Array.isArray(eventsResponse) ? eventsResponse : eventsResponse.data ?? []

		if (!events.value.length) {
			isLoading.value = false
			return
		}

		const ongoing = events.value.find(event => event.status === 'ongoing')
		const active = events.value.find(event => !['completed', 'cancelled'].includes(event.status))
		selectedEventId.value = (ongoing ?? active ?? events.value[0]).id

		await loadEventData()
	} catch (error: unknown) {
		errorMessage.value = getApiErrorMessage(error, 'Unable to load your events.')
		isLoading.value = false
	}
}

async function loadEventData() {
	if (!token.value || !selectedEventId.value) return

	isLoading.value = true
	errorMessage.value = ''

	try {
		const [summaryResponse, attendeesResponse] = await Promise.all([
			$fetch<{ data: AttendeeSummary }>(
				`${config.public.apiBaseURL}/organizer/events/${selectedEventId.value}/attendee-summary`,
				{ method: 'GET', headers: authHeaders() },
			),
			$fetch<{ data: Attendee[] }>(
				`${config.public.apiBaseURL}/organizer/events/${selectedEventId.value}/attendees`,
				{ method: 'GET', headers: authHeaders() },
			),
		])

		summary.value = summaryResponse.data

		checkinActivity.value = (attendeesResponse.data ?? [])
			.filter((attendee): attendee is Attendee & { checked_in_at: string } => Boolean(attendee.checked_in_at))
			.sort((a, b) => new Date(b.checked_in_at).getTime() - new Date(a.checked_in_at).getTime())
			.slice(0, 8)
			.map(attendee => ({
				id: attendee.id,
				name: attendee.name,
				checked_in_at: attendee.checked_in_at,
				badge: attendee.source === 'walk_in' ? 'Walk-in' : (attendee.ticket_type?.name || 'General'),
			}))
	} catch (error: unknown) {
		errorMessage.value = getApiErrorMessage(error, 'Unable to load live event data.')
	} finally {
		isLoading.value = false
	}
}

watch(selectedEventId, async (newId, oldId) => {
	if (newId === oldId || !newId) return
	await loadEventData()
})

onMounted(() => {
	loadEvents()
})
</script>
