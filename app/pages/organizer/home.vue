<template>
	<div>
		<div class="mb-6 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-50 p-8">
			<h1 class="text-3xl font-extrabold text-gray-900">
				{{ greeting }}, {{ organizerFirstName }} 👋
			</h1>

			<p class="mt-1.5 text-gray-500">
				Here's what's happening with your events today
			</p>
		</div>

		<div class="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
			<div v-for="stat in stats" :key="stat.label" class="rounded-2xl border border-gray-200 bg-white p-5">
				<div class="mb-3 flex items-center justify-between">
					<span class="text-sm text-gray-500">
						{{ stat.label }}
					</span>

					<IconBase :name="stat.icon" class="h-[18px] w-[18px] text-gray-400" />
				</div>

				<div class="text-3xl font-extrabold text-gray-900">
					{{ stat.value }}
				</div>

				<div class="mt-2 flex items-center gap-1 text-sm text-gray-500">
					<IconBase v-if="stat.hasTrendIcon" name="trending-up" class="h-3.5 w-3.5 text-green-600" />

					<span :class="stat.hasTrendIcon
						? 'text-green-600'
						: 'text-gray-500'
						">
						{{ stat.trend }}
					</span>
				</div>
			</div>
		</div>

		<div class="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-5">
			<div class="rounded-2xl border border-gray-200 bg-white p-6 lg:col-span-3">
				<div class="mb-5 flex items-start justify-between">
					<div>
						<h2 class="text-base font-bold text-gray-900">
							Recent Activity
						</h2>

						<p class="text-sm text-gray-500">
							Your latest updates and notifications
						</p>
					</div>

					<IconBase name="bell" class="h-5 w-5 text-gray-400" />
				</div>

				<div class="space-y-3">
					<div v-for="item in recentActivity" :key="item.title"
						class="flex items-center justify-between rounded-xl border border-gray-200 p-4">
						<div>
							<div class="text-sm font-semibold text-gray-900">
								{{ item.title }}
							</div>

							<div class="mt-1 text-xs text-gray-400">
								{{ item.time }}
							</div>
						</div>

						<button type="button"
							class="flex shrink-0 items-center gap-1 text-sm font-semibold text-gray-700 hover:text-primary-700">
							{{ item.action }}

							<IconBase name="arrow-right" class="h-4 w-4" />
						</button>
					</div>
				</div>
			</div>

			<div class="rounded-2xl border border-gray-200 bg-white p-6 lg:col-span-2">
				<div class="mb-5">
					<h2 class="text-base font-bold text-gray-900">
						Upcoming Events
					</h2>

					<p class="text-sm text-gray-500">
						Your scheduled events and preparation status
					</p>
				</div>

				<div class="space-y-5">
					<div v-for="event in upcomingEvents" :key="event.name">
						<div class="mb-1.5 flex items-start justify-between">
							<div class="text-sm font-semibold text-gray-900">
								{{ event.name }}
							</div>

							<span class="shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold" :class="event.progress >= 80
								? 'bg-gray-900 text-white'
								: 'bg-gray-100 text-gray-700'
								">
								{{ event.progress }}%
							</span>
						</div>

						<div class="mb-2 text-xs text-gray-400">
							{{ event.date }}
							&bull;
							{{ event.guests }} guests
						</div>

						<div class="mb-1 flex items-center justify-between text-xs text-gray-400">
							<span>
								Preparation Progress
							</span>

							<span>
								{{ event.progress }}%
							</span>
						</div>

						<div class="h-2 w-full overflow-hidden rounded-full bg-gray-100">
							<div class="h-full rounded-full bg-gray-900" :style="{
								width: event.progress + '%',
							}" />
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="mb-6 rounded-2xl border border-gray-200 bg-white p-6">
			<h2 class="text-base font-bold text-gray-900">
				Quick Actions
			</h2>

			<p class="mb-5 text-sm text-gray-500">
				Common tasks to help you get started
			</p>

			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<button v-for="action in quickActions" :key="action.label" type="button"
					class="rounded-xl border border-gray-200 p-5 text-left hover:border-primary-300 hover:bg-primary-50/40">
					<IconBase :name="action.icon" class="mb-3 h-5 w-5 text-gray-700" />

					<div class="text-sm font-semibold text-gray-900">
						{{ action.label }}
					</div>

					<div class="text-xs text-gray-400">
						{{ action.sub }}
					</div>
				</button>
			</div>
		</div>

		<div class="rounded-2xl border border-blue-100 bg-blue-50/60 p-6">
			<div class="mb-2 flex items-center gap-2">
				<IconBase name="check-circle" class="h-5 w-5 text-blue-600" />

				<h2 class="text-base font-bold text-gray-900">
					Platform Status
				</h2>
			</div>

			<p class="text-sm text-gray-600">
				All systems operational. You're receiving real-time
				notifications for matching inquiries based on your service
				tags and location preferences.
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
definePageMeta({
	layout: 'dashboard',
})
const {
	firstName,
	user,
	isAuthenticated,
} = useAuth('organizer')

const organizerFirstName = computed(() => {
	return firstName.value || 'Organizer'
})

onMounted(() => {
	if (
		!isAuthenticated.value ||
		!user.value
	) {
		console.warn(
			'Organizer is not authenticated.'
		)

		return
	}

	if (
		user.value.role !== 'organizer'
	) {
		console.warn(
			'Authenticated user is not an organizer.'
		)
	}
})

const greeting = computed(() => {
	const hour =
		new Date().getHours()

	if (hour < 12) {
		return 'Good morning'
	}

	if (hour < 18) {
		return 'Good afternoon'
	}

	return 'Good evening'
})
const stats = [
	{
		label:
			'Active Events',

		value:
			'8',

		icon:
			'calendar',

		trend:
			'+2 from last month',

		hasTrendIcon:
			true,
	},
	{
		label:
			'Pending Offers',

		value:
			'5',

		icon:
			'clock',

		trend:
			'3 new inquiries',

		hasTrendIcon:
			false,
	},
	{
		label:
			'Win Rate',

		value:
			'72.7%',

		icon:
			'trending-up',

		trend:
			'+5.2% this month',

		hasTrendIcon:
			true,
	},
	{
		label:
			'Total Revenue',

		value:
			'₱2.4M',

		icon:
			'cash',

		trend:
			'This quarter',

		hasTrendIcon:
			true,
	},
]

const recentActivity = [
	{
		title:
			'New matching inquiry: 18th Debut Birthday Party',

		time:
			'2 hours ago',

		action:
			'Submit Offer',
	},
	{
		title:
			'Congratulations! You won: STI College of Davao Intrammurals',

		time:
			'1 day ago',

		action:
			'Start Planning',
	},
	{
		title:
			'Event check-in starts in 3 days: Product Launch',

		time:
			'2 days ago',

		action:
			'View Details',
	},
]
const upcomingEvents = [
	{
		name:
			'Tech Conference 2026',

		date:
			'June 15, 2026',

		guests:
			1000,

		progress:
			85,
	},
	{
		name:
			'STI College of Davao Social Night',

		date:
			'July 20, 2026',

		guests:
			500,

		progress:
			45,
	},
	{
		name:
			'Wedding',

		date:
			'August 5, 2026',

		guests:
			200,

		progress:
			30,
	},
]

/*
|--------------------------------------------------------------------------
| QUICK ACTIONS
|--------------------------------------------------------------------------
*/
const quickActions = [
	{
		label:
			'View Inquiries',

		sub:
			'3 new matches',

		icon:
			'bell',
	},
	{
		label:
			'Create Event',

		sub:
			'Start planning',

		icon:
			'calendar',
	},
	{
		label:
			'Check Attendance',

		sub:
			'QR scanning',

		icon:
			'users',
	},
	{
		label:
			'View Analytics',

		sub:
			'Performance',

		icon:
			'award',
	},
]
</script>