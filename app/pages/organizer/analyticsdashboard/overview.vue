<template>
	<div>
		<div class="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
			<div v-for="stat in stats" :key="stat.label" class="rounded-2xl border border-gray-200 bg-white p-5">
				<span class="text-sm text-gray-500">
					{{ stat.label }}
				</span>
				<div class="mt-2 text-3xl font-extrabold text-gray-900">
					{{ stat.value }}
				</div>
				<div class="mt-2 flex items-center gap-1 text-sm">
					<IconBase :name="stat.hasTrendIcon ? 'trending-up' : 'clock'" class="h-3.5 w-3.5"
						:class="stat.hasTrendIcon ? 'text-green-600' : 'text-gray-400'" />
					<span :class="stat.hasTrendIcon ? 'text-green-600' : 'text-gray-500'">
						{{ stat.trend }}</span>
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
			<div class="rounded-2xl border border-gray-200 bg-white p-6">
				<h2 class="text-base font-bold text-gray-900">
					Inquiry Activity Distribution
				</h2>
				<p class="mb-10 text-sm text-gray-500">
					How you respond to inquiries
				</p>

				<div class="relative mx-auto mb-10 h-52 w-52">
					<div class="h-full w-full rounded-full" :style="pieStyle" />
					<span class="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-semibold"
						:style="{ color: distribution[0].color }">
						{{ distribution[0].label }}: {{ distribution[0].value }}
					</span>
					<span class="absolute -bottom-8 left-0 whitespace-nowrap text-sm font-semibold"
						:style="{ color: distribution[1].color }">
						{{ distribution[1].label }}: {{ distribution[1].value }}
					</span>
					<span class="absolute -right-28 top-1/2 -translate-y-1/2 whitespace-nowrap text-sm font-semibold"
						:style="{ color: distribution[2].color }">
						{{ distribution[2].label }}: {{ distribution[2].value }}
					</span>
				</div>
			</div>

			<div class="rounded-2xl border border-gray-200 bg-white p-6">
				<h2 class="text-base font-bold text-gray-900">
					Recent Activity
				</h2>
				<p class="mb-5 text-sm text-gray-500">
					Latest bid and event updates
				</p>
				<div class="divide-y divide-gray-100">
					<div v-for="item in recentActivity" :key="item.title"
						class="flex items-center gap-3 py-4 first:pt-0 last:pb-0">
						<IconBase :name="item.icon" :class="item.iconColor" class="h-5 w-5 shrink-0" />
						<div class="min-w-0 flex-1">
							<div class="text-sm font-semibold text-gray-900">
								{{ item.title }}
							</div>
							<div class="text-xs text-gray-400">
								{{ item.time }}
							</div>
						</div>
						<span class="shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
							:class="item.status === 'won' ? 'bg-gray-900 text-white' : 'border border-gray-200 text-gray-700'">
							{{ item.status }}
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const stats = [
	{ label: 'Total Bids Submitted', value: '87', trend: '+12% from last month', hasTrendIcon: true },
	{ label: 'Win Rate', value: '72.7%', trend: '+5.2% from last month', hasTrendIcon: true },
	{ label: 'Avg Attendance Rate', value: '89.8%', trend: '+2.8% from last month', hasTrendIcon: true },
	{ label: 'Active Inquiries', value: '12', trend: 'Awaiting response', hasTrendIcon: false }
]

const distribution = [
	{ label: 'Received', value: 45, color: '#2a78d6' },
	{ label: 'Bid Submitted', value: 38, color: '#0ca30c' },
	{ label: 'Ignored', value: 7, color: '#d03b3b' }
]

const distributionTotal = distribution.reduce((sum, d) => sum + d.value, 0)

const pieStyle = computed(() => {
	let cumulative = 0
	const stops = distribution.map((d) => {
		const start = (cumulative / distributionTotal) * 100
		cumulative += d.value
		const end = (cumulative / distributionTotal) * 100
		return `${d.color} ${start}% ${end}%`
	})
	return { background: `conic-gradient(${stops.join(', ')})` }
})

const recentActivity = [
	{ title: 'STI College of Davao Intrammurals', time: '2 hours ago', status: 'won', icon: 'check-circle', iconColor: 'text-green-600' },
	{ title: 'Wedding Reception', time: '5 hours ago', status: 'submitted', icon: 'clock', iconColor: 'text-blue-600' },
	{ title: 'Product Launch', time: '1 day ago', status: 'lost', icon: 'x-circle', iconColor: 'text-red-600' },
	{ title: '18th Debut Birthday Party', time: '2 days ago', status: 'new', icon: 'calendar', iconColor: 'text-violet-600' }
]
</script>
