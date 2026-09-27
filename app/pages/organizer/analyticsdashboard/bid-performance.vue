<template>
	<div>
		<div v-if="isLoading" class="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
			Loading your bid performance...
		</div>

		<div v-else-if="errorMessage" class="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
			{{ errorMessage }}
		</div>

		<template v-else>
			<div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
				<h2 class="text-base font-bold text-gray-900">
					Bid Performance Trends
				</h2>
				<p class="mb-4 text-sm text-gray-500">
					Monthly bid win/loss decisions, last 6 months
				</p>

				<template v-if="hasMonthlyActivity">
					<ClientOnly>
						<apexchart type="bar" height="320" :options="chartOptions" :series="chartSeries" />
					</ClientOnly>
				</template>
				<p v-else class="py-16 text-center text-sm text-gray-400">
					No bid decisions in the last 6 months yet.
				</p>
			</div>

			<div class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
				<div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
					<div class="flex items-start justify-between gap-3">
						<div>
							<div class="text-sm font-semibold text-gray-900">Total Bids</div>
							<div class="text-xs text-gray-400">All time</div>
						</div>
						<span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50">
							<IconBase name="file-text" class="h-5 w-5 text-primary-700" />
						</span>
					</div>
					<div class="mt-3 text-3xl font-extrabold tracking-tight text-gray-950">
						{{ totalBids }}
					</div>
				</div>

				<div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
					<div class="flex items-start justify-between gap-3">
						<div>
							<div class="text-sm font-semibold text-gray-900">Bids Won</div>
							<div class="text-xs text-gray-400">All time</div>
						</div>
						<span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50">
							<IconBase name="check-circle" class="h-5 w-5 text-primary-700" />
						</span>
					</div>
					<div class="mt-3 text-3xl font-extrabold tracking-tight text-primary-700">
						{{ bidsWon }}
					</div>
				</div>

				<div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
					<div class="flex items-start justify-between gap-3">
						<div>
							<div class="text-sm font-semibold text-gray-900">Bids Lost</div>
							<div class="text-xs text-gray-400">All time</div>
						</div>
						<span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50">
							<IconBase name="x-circle" class="h-5 w-5 text-amber-600" />
						</span>
					</div>
					<div class="mt-3 text-3xl font-extrabold tracking-tight text-amber-600">
						{{ bidsLost }}
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

interface MonthlyBidRow {
	label: string
	won: number
	lost: number
}

interface BidPerformanceResponse {
	data: {
		monthly: MonthlyBidRow[]
		total_bids: number
		bids_won: number
		bids_lost: number
	}
}

const isLoading = ref(false)
const errorMessage = ref('')
const monthly = ref<MonthlyBidRow[]>([])
const totalBids = ref(0)
const bidsWon = ref(0)
const bidsLost = ref(0)

const hasMonthlyActivity = computed(() => monthly.value.some(row => row.won > 0 || row.lost > 0))

const chartSeries = computed(() => [
	{ name: 'Won Bids', data: monthly.value.map(row => row.won) },
	{ name: 'Lost Bids', data: monthly.value.map(row => row.lost) },
])

const chartOptions = computed<ApexOptions>(() => ({
	chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit' },
	colors: ['#285F6b', '#d97706'],
	plotOptions: {
		bar: {
			columnWidth: '55%',
			borderRadius: 4,
			borderRadiusApplication: 'end',
		},
	},
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
		labels: { style: { colors: '#9ca3af', fontSize: '11px' }, formatter: (value: number) => Math.round(value).toString() },
	},
	tooltip: { shared: true, intersect: false },
}))

function getApiErrorMessage(error: unknown, fallback: string): string {
	const apiError = error as { data?: { message?: string } }
	return apiError?.data?.message || fallback
}

async function loadBidPerformance() {
	if (!token.value) return

	isLoading.value = true
	errorMessage.value = ''

	try {
		const response = await $fetch<BidPerformanceResponse>(
			`${config.public.apiBaseURL}/organizer/bid-performance`,
			{
				method: 'GET',
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${token.value}`,
				},
			},
		)

		monthly.value = response.data.monthly
		totalBids.value = response.data.total_bids
		bidsWon.value = response.data.bids_won
		bidsLost.value = response.data.bids_lost
	} catch (error: unknown) {
		errorMessage.value = getApiErrorMessage(error, 'Unable to load your bid performance.')
	} finally {
		isLoading.value = false
	}
}

onMounted(() => {
	loadBidPerformance()
})
</script>
