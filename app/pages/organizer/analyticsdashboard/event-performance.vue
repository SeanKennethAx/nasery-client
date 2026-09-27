<template>
	<div>
		<div v-if="isLoading" class="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
			Loading your event performance...
		</div>

		<div v-else-if="errorMessage" class="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
			{{ errorMessage }}
		</div>

		<template v-else>
			<div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
				<h2 class="text-base font-bold text-gray-900">
					Event Attendance Trends
				</h2>
				<p class="mb-4 text-sm text-gray-500">
					Monthly attendance vs no-show rates, last 6 months
				</p>

				<template v-if="hasMonthlyActivity">
					<ClientOnly>
						<apexchart type="line" height="320" :options="chartOptions" :series="chartSeries" />
					</ClientOnly>
				</template>
				<p v-else class="py-16 text-center text-sm text-gray-400">
					No ticketed events in the last 6 months yet.
				</p>
			</div>

			<div class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
				<div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
					<div class="flex items-start justify-between gap-3">
						<div>
							<div class="text-sm font-semibold text-gray-900">Avg Capacity Fill</div>
							<div class="text-xs text-gray-400">Per event</div>
						</div>
						<span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50">
							<IconBase name="users" class="h-5 w-5 text-primary-700" />
						</span>
					</div>
					<div class="mt-3 text-3xl font-extrabold tracking-tight text-gray-950">
						{{ avgCapacityFill !== null ? `${avgCapacityFill}%` : '—' }}
					</div>
				</div>

				<div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
					<div class="flex items-start justify-between gap-3">
						<div>
							<div class="text-sm font-semibold text-gray-900">Avg No-Show Rate</div>
							<div class="text-xs text-gray-400">Per event</div>
						</div>
						<span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50">
							<IconBase name="x-circle" class="h-5 w-5 text-amber-600" />
						</span>
					</div>
					<div class="mt-3 text-3xl font-extrabold tracking-tight text-amber-600">
						{{ avgNoShowRate !== null ? `${avgNoShowRate}%` : '—' }}
					</div>
				</div>

				<div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
					<div class="flex items-start justify-between gap-3">
						<div>
							<div class="text-sm font-semibold text-gray-900">Total Events</div>
							<div class="text-xs text-gray-400">Organized</div>
						</div>
						<span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
							<IconBase name="calendar" class="h-5 w-5 text-blue-600" />
						</span>
					</div>
					<div class="mt-3 text-3xl font-extrabold tracking-tight text-gray-950">
						{{ totalEvents }}
					</div>
				</div>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'

definePageMeta({ layout: 'dashboard' })

const { token } = useAuth('organizer')
const config = useRuntimeConfig()

interface MonthlyEventRow {
	label: string
	attendance_rate: number
	no_show_rate: number
}

interface EventPerformanceResponse {
	data: {
		monthly: MonthlyEventRow[]
		avg_capacity_fill: number | null
		avg_no_show_rate: number | null
		total_events: number
	}
}

const isLoading = ref(false)
const errorMessage = ref('')
const monthly = ref<MonthlyEventRow[]>([])
const avgCapacityFill = ref<number | null>(null)
const avgNoShowRate = ref<number | null>(null)
const totalEvents = ref(0)

const hasMonthlyActivity = computed(() => monthly.value.some(row => row.attendance_rate > 0 || row.no_show_rate > 0))

const chartSeries = computed(() => [
	{ name: 'Attendance %', data: monthly.value.map(row => row.attendance_rate) },
	{ name: 'No-Show %', data: monthly.value.map(row => row.no_show_rate) },
])

const chartOptions = computed<ApexOptions>(() => ({
	chart: { type: 'line', toolbar: { show: false }, fontFamily: 'inherit' },
	colors: ['#285F6b', '#d97706'],
	stroke: { curve: 'smooth', width: 2.5 },
	markers: { size: 4, strokeWidth: 2, strokeColors: '#fff', hover: { size: 6 } },
	dataLabels: { enabled: false },
	grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
	legend: { position: 'bottom', fontSize: '13px', fontWeight: 600, markers: { size: 8 } },
	xaxis: {
		categories: monthly.value.map(row => row.label),
		axisBorder: { show: false },
		axisTicks: { show: false },
		labels: { style: { colors: '#6b7280', fontSize: '13px', fontWeight: 600 } },
	},
	yaxis: {
		min: 0,
		max: 100,
		labels: { style: { colors: '#9ca3af', fontSize: '11px' }, formatter: (value: number) => `${Math.round(value)}%` },
	},
	tooltip: { shared: true, intersect: false, y: { formatter: (value: number) => `${value}%` } },
}))

function getApiErrorMessage(error: unknown, fallback: string): string {
	const apiError = error as { data?: { message?: string } }
	return apiError?.data?.message || fallback
}

async function loadEventPerformance() {
	if (!token.value) return

	isLoading.value = true
	errorMessage.value = ''

	try {
		const response = await $fetch<EventPerformanceResponse>(
			`${config.public.apiBaseURL}/organizer/event-performance`,
			{
				method: 'GET',
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${token.value}`,
				},
			},
		)

		monthly.value = response.data.monthly
		avgCapacityFill.value = response.data.avg_capacity_fill
		avgNoShowRate.value = response.data.avg_no_show_rate
		totalEvents.value = response.data.total_events
	} catch (error: unknown) {
		errorMessage.value = getApiErrorMessage(error, 'Unable to load your event performance.')
	} finally {
		isLoading.value = false
	}
}

onMounted(() => {
	loadEventPerformance()
})
</script>
