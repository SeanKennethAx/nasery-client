<template>
	<div>
		<div class="mb-6">
			<h1 class="text-2xl font-extrabold text-gray-900">Platform Overview</h1>
			<p class="mt-1 text-gray-500">A bird's-eye view of every organizer, event, and client on NaSeRy.</p>
		</div>

		<div class="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
			<div class="rounded-2xl border border-gray-200 bg-white p-5">
				<div class="flex items-start justify-between">
					<span class="text-sm text-gray-500">Total Organizers</span>
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
						<IconBase name="users" class="h-4 w-4" />
					</div>
				</div>
				<div class="mt-2 text-3xl font-extrabold text-gray-900">{{ organizerCount }}</div>
				<div class="mt-2 text-sm text-green-600">{{ activeOrganizerCount }} active</div>
			</div>
			<div class="rounded-2xl border border-gray-200 bg-white p-5">
				<div class="flex items-start justify-between">
					<span class="text-sm text-gray-500">Events Managed</span>
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
						<IconBase name="calendar" class="h-4 w-4" />
					</div>
				</div>
				<div class="mt-2 text-3xl font-extrabold text-gray-900">{{ totalEvents }}</div>
				<div class="mt-2 text-sm text-gray-500">Across all organizers</div>
			</div>
			<div class="rounded-2xl border border-gray-200 bg-white p-5">
				<div class="flex items-start justify-between">
					<span class="text-sm text-gray-500">Platform Revenue</span>
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-600">
						<IconBase name="cash" class="h-4 w-4" />
					</div>
				</div>
				<div class="mt-2 text-3xl font-extrabold text-gray-900">{{ totalRevenueFormatted }}</div>
				<div class="mt-2 text-sm text-gray-500">This year</div>
			</div>
			<div class="rounded-2xl border border-gray-200 bg-white p-5">
				<div class="flex items-start justify-between">
					<span class="text-sm text-gray-500">Avg. Organizer Rating</span>
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
						<IconBase name="star" class="h-4 w-4" />
					</div>
				</div>
				<div class="mt-2 text-3xl font-extrabold text-gray-900">{{ avgRating }}</div>
				<div class="mt-2 text-sm text-gray-500">Out of 5.0</div>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
			<div class="rounded-2xl border border-gray-200 bg-white p-6">
				<h2 class="text-base font-bold text-gray-900">Top Organizers</h2>
				<p class="mt-1 text-sm text-gray-500">Ranked by revenue generated</p>
				<div class="mt-5 divide-y divide-gray-100">
					<div v-for="org in topOrganizers" :key="org.email" class="flex items-center justify-between py-3">
						<div class="flex items-center gap-3">
							<div
								class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-700 text-xs font-bold text-white">
								{{ initialsOf(org.name) }}
							</div>
							<div>
								<div class="text-sm font-semibold text-gray-900">{{ org.name }}</div>
								<div class="text-xs text-gray-500">{{ org.events }} events</div>
							</div>
						</div>
						<span class="text-sm font-bold text-gray-900">{{ formatCurrency(org.revenue) }}</span>
					</div>
				</div>
			</div>

			<div class="rounded-2xl border border-gray-200 bg-white p-6">
				<h2 class="text-base font-bold text-gray-900">Recent Platform Activity</h2>
				<p class="mt-1 text-sm text-gray-500">Latest actions across all organizers</p>
				<div class="mt-5 space-y-4">
					<div v-for="item in recentActivity" :key="item.label" class="flex items-start gap-3">
						<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" :class="item.iconBg">
							<IconBase :name="item.icon" class="h-4 w-4" :class="item.iconColor" />
						</div>
						<div class="min-w-0">
							<div class="text-sm text-gray-900">{{ item.label }}</div>
							<div class="text-xs text-gray-400">{{ item.time }}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const allOrganizers = useOrganizers()
const organizers = computed(() => allOrganizers.value.filter((o) => o.status !== 'Pending'))

const organizerCount = computed(() => organizers.value.length)
const activeOrganizerCount = computed(() => organizers.value.filter((o) => o.status === 'Active').length)
const totalEvents = computed(() => organizers.value.reduce((sum, o) => sum + o.events.length, 0))
const totalRevenue = computed(() => organizers.value.reduce((sum, o) => sum + organizerRevenue(o), 0))
const avgRating = computed(() => (organizers.value.reduce((sum, o) => sum + o.rating, 0) / organizers.value.length).toFixed(1))

const totalRevenueFormatted = computed(() => formatCurrency(totalRevenue.value))

const topOrganizers = computed(() =>
	[...organizers.value]
		.map((o) => ({ name: o.name, email: o.email, events: o.events.length, revenue: organizerRevenue(o) }))
		.sort((a, b) => b.revenue - a.revenue)
		.slice(0, 4)
)

function initialsOf(name) {
	return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

const recentActivity = [
	{ label: 'Santos Events Co. published "Corporate Annual Gala"', time: '12 minutes ago', icon: 'calendar', iconBg: 'bg-primary-50', iconColor: 'text-primary-700' },
	{ label: 'EventPro Solutions won a bid for "STI College Intramurals"', time: '1 hour ago', icon: 'award', iconBg: 'bg-green-50', iconColor: 'text-green-600' },
	{ label: 'Premier Planners Davao was suspended for policy review', time: '3 hours ago', icon: 'x-circle', iconBg: 'bg-rose-50', iconColor: 'text-rose-600' },
	{ label: 'Fiesta Makers Inc. completed onboarding', time: '1 day ago', icon: 'check-circle', iconBg: 'bg-green-50', iconColor: 'text-green-600' },
	{ label: 'Grand Occasions PH updated their ticket tiers', time: '2 days ago', icon: 'tag', iconBg: 'bg-gray-100', iconColor: 'text-gray-500' }
]
</script>
