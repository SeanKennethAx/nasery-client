<template>
	<div>
		<SuperadminPageHeader />

		<div v-if="errorMessage" class="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
			{{ errorMessage }}
		</div>

		<div class="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
			<SuperadminStatCard label="Total Events" :value="events.length" icon="calendar" tone="primary"
				:hint="`${countByStatus('draft')} drafts, ${countByStatus('published')} published`" />
			<SuperadminStatCard label="Published" :value="countByStatus('published')" icon="check-circle" tone="blue"
				:hint="`${percentOf(countByStatus('published'))}% of all events`" />
			<SuperadminStatCard label="Completed" :value="countByStatus('completed')" icon="award" tone="gray"
				:hint="`${percentOf(countByStatus('completed'))}% completion rate`" />
			<SuperadminStatCard label="Total Value" :value="formatCurrency(totalRevenue)" icon="cash" tone="green"
				value-class="text-green-600" :hint="`${formatCurrency(avgRevenue)} avg. per event`" />
		</div>

		<div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
			<div class="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
				<div class="w-full lg:max-w-md">
					<FormsTextField v-model="search" icon="search" placeholder="Search events, organizers, clients..." />
				</div>

				<div class="flex flex-wrap items-center gap-2">
					<button v-for="filter in statusFilters" :key="filter.value" type="button"
						class="rounded-full px-3 py-1.5 text-xs font-semibold transition" :class="statusFilter === filter.value
							? 'bg-primary-700 text-white'
							: 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
							" @click="statusFilter = filter.value">
						{{ filter.label }}
						<span class="ml-1" :class="statusFilter === filter.value ? 'text-white/70' : 'text-gray-400'">{{ filter.value === 'all' ? events.length : countByStatus(filter.value) }}</span>
					</button>
				</div>
			</div>

			<div class="mb-5 flex items-center justify-end gap-2">
				<span class="text-xs font-semibold uppercase tracking-wide text-gray-400">Sort by</span>
				<button v-for="option in sortOptions" :key="option.value" type="button"
					class="rounded-full px-3 py-1.5 text-xs font-semibold transition" :class="sortBy === option.value
						? 'bg-primary-700 text-white'
						: 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
						" @click="sortBy = option.value">
					{{ option.label }}
				</button>
			</div>

			<div v-if="isLoading" class="py-10 text-center text-sm text-gray-500">
				Loading events...
			</div>

			<div v-else-if="!events.length" class="py-10 text-center text-sm text-gray-400">
				{{ search.trim() ? 'No events match your search.' : 'No events found.' }}
			</div>

			<div v-else class="overflow-x-auto">
				<table class="w-full text-left text-sm">
					<thead>
						<tr
							class="border-b border-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-400">
							<th class="pb-3 pr-4">Event</th>
							<th class="pb-3 pr-4">Organizer</th>
							<th class="pb-3 pr-4">Client</th>
							<th class="pb-3 pr-4">Date</th>
							<th class="pb-3 pr-4">Tickets</th>
							<th class="pb-3 pr-4">Value</th>
							<th class="pb-3">Status</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-100">
						<tr v-for="event in sortedEvents" :key="event.id" class="group cursor-pointer transition hover:bg-gray-50"
							@click="navigateTo(`/superadmin/organizers/${event.organizer_id}`)">
							<td class="py-3.5 pr-4">
								<div class="font-semibold text-gray-900 transition group-hover:text-primary-700">{{ event.name }}</div>
								<div v-if="event.event_type" class="mt-0.5 text-xs text-gray-400">{{ event.event_type }} · {{ event.expected_guests }} guests</div>
							</td>
							<td class="py-3.5 pr-4">
								<div class="flex items-center gap-2">
									<SuperadminAvatar :name="event.organizer" size="sm" />
									<span class="text-gray-700">{{ event.organizer }}</span>
								</div>
							</td>
							<td class="py-3.5 pr-4">
								<div class="flex items-center gap-2">
									<SuperadminAvatar :name="event.client" tone="blue" size="sm" />
									<span class="text-gray-700">{{ event.client }}</span>
								</div>
							</td>
							<td class="py-3.5 pr-4 text-gray-500">{{ formatDate(event.event_date) }}</td>
							<td class="py-3.5 pr-4">
								<div class="text-gray-700">{{ event.tickets_sold }}/{{ event.capacity || '—' }}</div>
								<div v-if="event.capacity" class="mt-1 h-1.5 w-20 overflow-hidden rounded-full bg-gray-100">
									<div class="h-full rounded-full bg-primary-600"
										:style="{ width: `${Math.min(100, Math.round((event.tickets_sold / event.capacity) * 100))}%` }" />
								</div>
							</td>
							<td class="py-3.5 pr-4 font-semibold text-gray-900">{{ formatCurrency(event.revenue) }}</td>
							<td class="py-3.5">
								<span class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
									:class="statusClass(event.status)">
									{{ formatStatus(event.status) }}
								</span>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { superAdminService, type AdminPlatformEvent } from '~/services/superAdminService'

definePageMeta({
	layout: 'superadmin',
	middleware: ['superadmin'],
})

const { token } = useAuth('superadmin')

const events = ref<AdminPlatformEvent[]>([])
const isLoading = ref(false)
const errorMessage = ref('')
const search = ref('')
const statusFilter = ref('all')

type SortField = 'date' | 'value' | 'tickets'

const sortBy = ref<SortField>('date')
const sortOptions: Array<{ label: string, value: SortField }> = [
	{ label: 'Date', value: 'date' },
	{ label: 'Value', value: 'value' },
	{ label: 'Tickets Sold', value: 'tickets' },
]

let searchTimeout: ReturnType<typeof setTimeout> | null = null

const statusFilters = [
	{ label: 'All', value: 'all' },
	{ label: 'Draft', value: 'draft' },
	{ label: 'Published', value: 'published' },
	{ label: 'Completed', value: 'completed' },
	{ label: 'Cancelled', value: 'cancelled' },
]

const totalRevenue = computed(() => events.value.reduce((sum, e) => sum + e.revenue, 0))
const avgRevenue = computed(() => (events.value.length ? Math.round(totalRevenue.value / events.value.length) : 0))

function countByStatus(status: string) {
	return events.value.filter(e => e.status === status).length
}

function percentOf(count: number) {
	if (!events.value.length) return 0
	return Math.round((count / events.value.length) * 100)
}

const sortedEvents = computed(() => {
	const list = [...events.value]

	if (sortBy.value === 'value') {
		return list.sort((a, b) => b.revenue - a.revenue)
	}

	if (sortBy.value === 'tickets') {
		return list.sort((a, b) => b.tickets_sold - a.tickets_sold)
	}

	return list.sort((a, b) => {
		const aTime = a.event_date ? new Date(a.event_date).getTime() : 0
		const bTime = b.event_date ? new Date(b.event_date).getTime() : 0
		return bTime - aTime
	})
})

async function loadEvents() {
	if (!token.value) {
		return
	}

	isLoading.value = true
	errorMessage.value = ''

	try {
		const response = await superAdminService.getEvents(token.value, search.value.trim(), statusFilter.value)
		events.value = response.data
	} catch (error: unknown) {
		errorMessage.value = getApiErrorMessage(error, 'Unable to load events.')
	} finally {
		isLoading.value = false
	}
}

function getApiErrorMessage(error: unknown, fallback: string): string {
	const apiError = error as { data?: { message?: string } }
	return apiError?.data?.message || fallback
}

function formatCurrency(amount: number) {
	if (amount >= 1000000) return `₱${(amount / 1000000).toFixed(1)}M`
	if (amount >= 1000) return `₱${(amount / 1000).toFixed(0)}K`
	return `₱${amount}`
}

function formatDate(value: string | null) {
	if (!value) return 'Not scheduled'
	return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatStatus(status: string) {
	return status.charAt(0).toUpperCase() + status.slice(1)
}

function statusClass(status: string) {
	switch (status) {
		case 'completed':
			return 'bg-gray-100 text-gray-600'
		case 'published':
		case 'ongoing':
			return 'bg-primary-50 text-primary-700'
		case 'cancelled':
			return 'bg-red-50 text-red-600'
		default:
			return 'bg-amber-50 text-amber-700'
	}
}

watch(search, () => {
	if (searchTimeout) clearTimeout(searchTimeout)
	searchTimeout = setTimeout(loadEvents, 350)
})

watch(statusFilter, () => {
	loadEvents()
})

onMounted(() => {
	loadEvents()
})
</script>
