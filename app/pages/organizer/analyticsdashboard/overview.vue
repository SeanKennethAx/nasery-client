<template>
	<div>
		<div v-if="isLoading" class="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
			Loading your analytics...
		</div>

		<div v-else-if="errorMessage" class="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
			{{ errorMessage }}
		</div>

		<template v-else>
			<div class="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
				<div v-for="stat in stats" :key="stat.label"
					class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
					<div class="flex items-start justify-between gap-3">
						<span class="text-sm font-medium text-gray-500">{{ stat.label }}</span>
						<span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" :class="stat.iconBg">
							<IconBase :name="stat.icon" class="h-5 w-5" :class="stat.iconColor" />
						</span>
					</div>
					<div class="mt-3 text-3xl font-extrabold tracking-tight text-gray-950">
						{{ stat.value }}
					</div>
					<div class="mt-2 flex items-center gap-1 text-xs font-semibold" :class="stat.hasTrendIcon ? 'text-green-600' : 'text-gray-400'">
						<IconBase :name="stat.hasTrendIcon ? 'trending-up' : 'clock'" class="h-3.5 w-3.5" />
						<span>{{ stat.trend }}</span>
					</div>
				</div>
			</div>

			<div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
				<div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
					<h2 class="text-base font-bold text-gray-900">
						Inquiry Activity Distribution
					</h2>
					<p class="mb-2 text-sm text-gray-500">
						How you respond to matching inquiries
					</p>

					<ClientOnly>
						<apexchart v-if="distributionTotal > 0" type="donut" height="300"
							:options="distributionChartOptions" :series="distributionSeries" />
					</ClientOnly>
					<p v-if="distributionTotal === 0" class="py-16 text-center text-sm text-gray-400">
						No inquiry activity yet.
					</p>
				</div>

				<div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
					<h2 class="text-base font-bold text-gray-900">
						Recent Activity
					</h2>
					<p class="mb-5 text-sm text-gray-500">
						Latest bid and inquiry updates
					</p>

					<div v-if="recentActivity.length" class="divide-y divide-gray-100">
						<div v-for="item in recentActivity" :key="`${item.title}-${item.time}`"
							class="flex items-center gap-3 py-4 first:pt-0 last:pb-0">
							<span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" :class="statusStyle(item.status).bg">
								<IconBase :name="statusStyle(item.status).icon" class="h-4 w-4" :class="statusStyle(item.status).text" />
							</span>
							<div class="min-w-0 flex-1">
								<div class="truncate text-sm font-semibold text-gray-900">
									{{ item.title }}
								</div>
								<div class="text-xs text-gray-400">
									{{ formatRelativeTime(item.time) }}
								</div>
							</div>
							<span class="shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize"
								:class="[statusStyle(item.status).bg, statusStyle(item.status).text]">
								{{ item.status }}
							</span>
						</div>
					</div>
					<p v-else class="py-16 text-center text-sm text-gray-400">
						No recent activity yet.
					</p>
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

interface AnalyticsStats {
	total_bids: number
	win_rate: number | null
	avg_attendance_rate: number | null
	active_inquiries: number
}

interface DistributionRow {
	label: string
	value: number
}

interface AnalyticsActivity {
	title: string
	time: string
	status: 'won' | 'lost' | 'submitted' | 'withdrawn' | 'new'
}

interface AnalyticsOverviewResponse {
	data: {
		stats: AnalyticsStats
		distribution: DistributionRow[]
		recent_activity: AnalyticsActivity[]
	}
}

const isLoading = ref(false)
const errorMessage = ref('')
const analyticsStats = ref<AnalyticsStats | null>(null)
const distribution = ref<DistributionRow[]>([])
const recentActivity = ref<AnalyticsActivity[]>([])

const distributionColors: Record<string, string> = {
	Received: '#d97706',
	'Bid Submitted': '#285F6b',
	Ignored: '#6b7280',
}

const statusStyles: Record<AnalyticsActivity['status'], { bg: string, text: string, icon: string }> = {
	won: { bg: 'bg-green-50', text: 'text-green-700', icon: 'check-circle' },
	lost: { bg: 'bg-red-50', text: 'text-red-700', icon: 'x-circle' },
	submitted: { bg: 'bg-primary-50', text: 'text-primary-700', icon: 'clock' },
	withdrawn: { bg: 'bg-gray-100', text: 'text-gray-500', icon: 'x-circle' },
	new: { bg: 'bg-violet-50', text: 'text-violet-700', icon: 'calendar' },
}

function statusStyle(status: AnalyticsActivity['status']) {
	return statusStyles[status] ?? statusStyles.submitted
}

const stats = computed(() => {
	const data = analyticsStats.value

	return [
		{
			label: 'Total Bids Submitted',
			value: data ? String(data.total_bids) : '0',
			icon: 'file-text',
			iconBg: 'bg-primary-50',
			iconColor: 'text-primary-700',
			trend: data?.total_bids ? `${data.total_bids} all-time` : 'No bids yet',
			hasTrendIcon: Boolean(data?.total_bids),
		},
		{
			label: 'Win Rate',
			value: data?.win_rate !== null && data?.win_rate !== undefined ? `${data.win_rate}%` : '—',
			icon: 'trending-up',
			iconBg: 'bg-green-50',
			iconColor: 'text-green-600',
			trend: data?.win_rate !== null && data?.win_rate !== undefined ? 'Accepted vs. decided bids' : 'No decisions yet',
			hasTrendIcon: Boolean(data?.win_rate),
		},
		{
			label: 'Avg Attendance Rate',
			value: data?.avg_attendance_rate !== null && data?.avg_attendance_rate !== undefined ? `${data.avg_attendance_rate}%` : '—',
			icon: 'users',
			iconBg: 'bg-blue-50',
			iconColor: 'text-blue-600',
			trend: data?.avg_attendance_rate !== null && data?.avg_attendance_rate !== undefined ? 'Checked-in vs. issued tickets' : 'No ticketed events yet',
			hasTrendIcon: Boolean(data?.avg_attendance_rate),
		},
		{
			label: 'Active Inquiries',
			value: data ? String(data.active_inquiries) : '0',
			icon: 'clock',
			iconBg: 'bg-amber-50',
			iconColor: 'text-amber-600',
			trend: 'Awaiting your response',
			hasTrendIcon: false,
		},
	]
})

const distributionTotal = computed(() => distribution.value.reduce((sum, row) => sum + row.value, 0))
const distributionSeries = computed(() => distribution.value.map(row => row.value))

const distributionChartOptions = computed<ApexOptions>(() => ({
	chart: { type: 'donut', fontFamily: 'inherit' },
	labels: distribution.value.map(row => row.label),
	colors: distribution.value.map(row => distributionColors[row.label] ?? '#6b7280'),
	dataLabels: { enabled: false },
	stroke: { width: 2, colors: ['#fff'] },
	legend: { position: 'bottom', fontSize: '13px', fontWeight: 600, markers: { size: 8 }, itemMargin: { horizontal: 10 } },
	plotOptions: {
		pie: {
			donut: {
				size: '68%',
				labels: {
					show: true,
					total: {
						show: true,
						label: 'Total',
						color: '#111827',
						fontSize: '22px',
						fontWeight: 800,
						formatter: () => String(distributionTotal.value),
					},
					value: { fontSize: '22px', fontWeight: 800, color: '#111827' },
				},
			},
		},
	},
	tooltip: {
		y: {
			formatter: (value: number) => `${value} (${Math.round((value / distributionTotal.value) * 100)}%)`,
		},
	},
}))

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

function getApiErrorMessage(error: unknown, fallback: string): string {
	const apiError = error as { data?: { message?: string } }
	return apiError?.data?.message || fallback
}

async function loadAnalytics() {
	if (!token.value) return

	isLoading.value = true
	errorMessage.value = ''

	try {
		const response = await $fetch<AnalyticsOverviewResponse>(
			`${config.public.apiBaseURL}/organizer/analytics-overview`,
			{
				method: 'GET',
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${token.value}`,
				},
			},
		)

		analyticsStats.value = response.data.stats
		distribution.value = response.data.distribution
		recentActivity.value = response.data.recent_activity
	} catch (error: unknown) {
		errorMessage.value = getApiErrorMessage(error, 'Unable to load your analytics.')
	} finally {
		isLoading.value = false
	}
}

onMounted(() => {
	loadAnalytics()
})
</script>
