<template>
	<div>
		<div class="mb-6">
			<h1 class="text-2xl font-extrabold text-gray-900">Preparation Tracking</h1>
			<p class="mt-1 text-gray-500">Live readiness overview for your upcoming event.</p>
		</div>

		<div class="mb-6 rounded-2xl bg-[#285F6b] p-5 text-white sm:p-6">
			<div class="flex flex-wrap items-start justify-between gap-6">
				<div class="min-w-0">
					<h2 class="text-lg font-bold">{{ event.title }}</h2>
					<div class="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/80">
						<span class="flex items-center gap-1.5">
							<IconBase name="calendar" class="h-4 w-4 shrink-0" />{{ event.date }}
						</span>
						<span class="flex items-center gap-1.5">
							<IconBase name="map-pin" class="h-4 w-4 shrink-0" />{{ event.venue }}
						</span>
						<span class="flex items-center gap-1.5">
							<IconBase name="users" class="h-4 w-4 shrink-0" />{{ event.guests }} guests
						</span>
						<span class="flex items-center gap-1.5">
							<IconBase name="peso" class="h-4 w-4 shrink-0" />{{ event.budget }}
						</span>
					</div>
				</div>
				<div class="flex flex-wrap items-center gap-x-6 gap-y-3">
					<div class="text-center">
						<div class="text-3xl font-extrabold">{{ event.daysAway }}</div>
						<div class="text-xs text-white/70">Days away</div>
					</div>
					<div class="border-white/20 pl-0 text-left sm:border-l sm:pl-6 sm:text-right">
						<div class="text-xs text-white/70">Organizer</div>
						<div class="text-sm font-semibold">{{ event.organizer }}</div>
					</div>
				</div>
			</div>
		</div>

		<div class="mb-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
			<div class="flex flex-wrap items-end justify-between gap-3">
				<div>
					<h3 class="text-base font-bold text-gray-900">Overall Readiness</h3>
					<p class="mt-0.5 text-sm text-gray-500">{{ doneCount }} of {{ totalCount }} tasks completed</p>
				</div>
				<div class="text-3xl font-extrabold text-[#285F6b]">{{ overallPercent }}%</div>
			</div>
			<div class="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
				<div class="h-full rounded-full bg-[#285F6b] transition-all" :style="{ width: overallPercent + '%' }" />
			</div>
		</div>

		<div class="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
			<div v-for="s in statusSummary" :key="s.label" class="rounded-2xl border border-gray-200 bg-white p-3.5 sm:p-4">
				<div class="flex items-center gap-2">
					<div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" :class="s.iconBg">
						<IconBase :name="s.icon" class="h-3.5 w-3.5" :class="s.iconColor" />
					</div>
					<span class="truncate text-sm text-gray-500">{{ s.label }}</span>
				</div>
				<div class="mt-2 text-2xl font-extrabold text-gray-900">{{ s.count }}</div>
			</div>
		</div>

		<div class="mb-6 divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white">
			<div v-for="cat in categories" :key="cat.id">
				<button type="button" class="flex w-full items-center gap-3 px-4 py-4 text-left hover:bg-gray-50 sm:gap-4 sm:px-6"
					@click="toggleCategory(cat.id)">
					<div
						class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
						<IconBase :name="cat.icon" class="h-4 w-4" />
					</div>
					<div class="min-w-0 flex-1">
						<div class="flex items-center justify-between gap-3">
							<span class="truncate text-sm font-bold text-gray-900">{{ cat.label }}</span>
							<span class="shrink-0 text-xs font-semibold text-gray-500">{{ doneIn(cat) }}/{{
								cat.tasks.length
								}}</span>
						</div>
						<div class="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
							<div class="h-full rounded-full bg-[#285F6b]" :style="{ width: percentOf(cat) + '%' }" />
						</div>
					</div>
					<IconBase name="chevron-down" class="h-4 w-4 shrink-0 text-gray-400 transition-transform"
						:class="expanded.has(cat.id) ? 'rotate-180' : ''" />
				</button>

				<div v-if="expanded.has(cat.id)" class="space-y-1 px-4 pb-4 sm:px-6">
					<div v-for="task in cat.tasks" :key="task.label"
						class="flex flex-col gap-2 rounded-xl px-3 py-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3"
						:class="task.status === 'blocked' ? 'bg-rose-50' : ''">
						<div class="flex min-w-0 items-center gap-3">
							<IconBase :name="statusIcon(task.status)" class="h-4 w-4 shrink-0"
								:class="statusIconColor(task.status)" />
							<div class="min-w-0">
								<div class="truncate text-sm font-medium text-gray-900">{{ task.label }}</div>
								<div v-if="task.sub" class="text-xs text-gray-400">{{ task.sub }}</div>
							</div>
						</div>
						<div class="flex items-center gap-3 pl-7 sm:shrink-0 sm:pl-0">
							<span class="text-xs text-gray-400">{{ formatShort(task.date) }}</span>
							<span class="rounded-full px-2.5 py-1 text-xs font-semibold"
								:class="statusBadgeClass(task.status)">
								{{ statusLabel(task.status) }}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
			<h3 class="mb-4 text-base font-bold text-gray-900">Upcoming Deadlines</h3>
			<div class="space-y-3">
				<div v-for="item in upcomingDeadlines" :key="item.category + item.label"
					class="flex flex-wrap items-center justify-between gap-2">
					<div class="flex min-w-0 items-center gap-3">
						<span class="h-2 w-2 shrink-0 rounded-full"
							:class="item.status === 'blocked' ? 'bg-rose-500' : 'bg-amber-500'" />
						<span class="truncate text-sm font-medium text-gray-900">{{ item.label }}</span>
						<span class="shrink-0 text-xs text-gray-400">{{ item.category }}</span>
					</div>
					<span class="shrink-0 text-xs font-semibold text-gray-500">{{ formatShort(item.date) }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'client' })

const event = {
	title: 'Santos–Reyes Wedding Reception',
	date: 'July 31, 2026',
	venue: 'Grand Ballroom, Makati',
	guests: 250,
	budget: '185,000',
	daysAway: 16,
	organizer: 'Santos Events Co.'
}

const categories = [
	{
		id: 'venue', label: 'Venue & Setup', icon: 'map-pin', tasks: [
			{ label: 'Venue booking confirmed', sub: 'Grand Ballroom, Makati', date: 'Jun 1, 2026', status: 'done' },
			{ label: 'Floor plan finalized', date: 'Jun 5, 2026', status: 'done' },
			{ label: 'Table & chair arrangement', date: 'Jul 18, 2026', status: 'in-progress' },
			{ label: 'Stage and podium setup', date: 'Jul 24, 2026', status: 'pending' },
			{ label: 'Signage & wayfinding installed', date: 'Jul 29, 2026', status: 'pending' }
		]
	},
	{
		id: 'catering', label: 'Catering & Food', icon: 'utensils', tasks: [
			{ label: 'Menu selection approved', date: 'Jun 12, 2026', status: 'done' },
			{ label: 'Dietary requirements collected', date: 'Jun 18, 2026', status: 'done' },
			{ label: 'Catering staff briefing', date: 'Jul 22, 2026', status: 'in-progress' },
			{ label: 'Food delivery schedule confirmed', date: 'Jul 27, 2026', status: 'pending' }
		]
	},
	{
		id: 'av', label: 'Audio / Visual', icon: 'mic', tasks: [
			{ label: 'Sound system booked', date: 'Jun 20, 2026', status: 'done' },
			{ label: 'Projector & screen setup', date: 'Jul 17, 2026', status: 'pending' },
			{ label: 'Sound system setup', date: 'Jul 19, 2026', status: 'in-progress' },
			{ label: 'Microphone check', date: 'Jul 23, 2026', status: 'in-progress' }
		]
	},
	{
		id: 'photo', label: 'Photography & Video', icon: 'camera', tasks: [
			{ label: 'Photographer contract signed', date: 'Jun 5, 2026', status: 'done' },
			{ label: 'Videographer contract signed', date: 'Jun 8, 2026', status: 'done' },
			{ label: 'Shot list reviewed', date: 'Jul 2, 2026', status: 'done' },
			{ label: 'Drone permit approval', date: 'Jul 26, 2026', status: 'pending' }
		]
	},
	{
		id: 'decor', label: 'Flowers & Décor', icon: 'sparkles', tasks: [
			{ label: 'Floral theme approved', date: 'Jun 15, 2026', status: 'done' },
			{ label: 'Vendor deposit paid', date: 'Jun 20, 2026', status: 'done' },
			{ label: 'Table centerpiece samples', date: 'Jul 21, 2026', status: 'in-progress' },
			{ label: 'Floral delivery', date: 'Jul 25, 2026', status: 'pending' }
		]
	},
	{
		id: 'entertainment', label: 'Entertainment', icon: 'music', tasks: [
			{ label: 'DJ booking confirmed', date: 'Jun 10, 2026', status: 'done' },
			{ label: 'Song playlist submitted', date: 'Jul 20, 2026', status: 'in-progress' },
			{ label: 'Emcee briefing', date: 'Jul 28, 2026', status: 'pending' }
		]
	},
	{
		id: 'logistics', label: 'Logistics', icon: 'truck', tasks: [
			{ label: 'Transportation arranged', date: 'Jun 25, 2026', status: 'done' },
			{ label: 'Parking coordination', date: 'Jul 18, 2026', status: 'pending' },
			{ label: 'Vendor load-in schedule', date: 'Jul 24, 2026', status: 'in-progress' }
		]
	},
	{
		id: 'admin', label: 'Admin & Compliance', icon: 'file-text', tasks: [
			{ label: 'Event permit filed', date: 'May 28, 2026', status: 'done' },
			{ label: 'Insurance certificate secured', date: 'Jun 2, 2026', status: 'done' },
			{ label: 'Guest RSVP list finalized', sub: 'Awaiting final headcount from client', date: 'Jul 17, 2026', status: 'blocked' },
			{ label: 'Vendor contracts filed', date: 'Jul 26, 2026', status: 'in-progress' }
		]
	}
]

const expanded = reactive(new Set(['venue', 'catering']))

function toggleCategory(id) {
	if (expanded.has(id)) expanded.delete(id)
	else expanded.add(id)
}

const allTasks = computed(() => categories.flatMap((cat) => cat.tasks.map((task) => ({ ...task, category: cat.label }))))

const doneCount = computed(() => allTasks.value.filter((t) => t.status === 'done').length)
const totalCount = computed(() => allTasks.value.length)
const overallPercent = computed(() => Math.round((doneCount.value / totalCount.value) * 100))

const statusSummary = computed(() => [
	{ label: 'Completed', count: allTasks.value.filter((t) => t.status === 'done').length, icon: 'check-circle', iconBg: 'bg-green-50', iconColor: 'text-green-600' },
	{ label: 'In Progress', count: allTasks.value.filter((t) => t.status === 'in-progress').length, icon: 'clock', iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
	{ label: 'Pending', count: allTasks.value.filter((t) => t.status === 'pending').length, icon: 'circle', iconBg: 'bg-gray-100', iconColor: 'text-gray-500' },
	{ label: 'Blocked', count: allTasks.value.filter((t) => t.status === 'blocked').length, icon: 'x-circle', iconBg: 'bg-rose-50', iconColor: 'text-rose-600' }
])

function doneIn(cat) {
	return cat.tasks.filter((t) => t.status === 'done').length
}

function percentOf(cat) {
	return Math.round((doneIn(cat) / cat.tasks.length) * 100)
}

function statusIcon(status) {
	if (status === 'done') return 'check-circle'
	if (status === 'blocked') return 'x-circle'
	if (status === 'in-progress') return 'clock'
	return 'circle'
}

function statusIconColor(status) {
	if (status === 'done') return 'text-green-600'
	if (status === 'blocked') return 'text-rose-600'
	if (status === 'in-progress') return 'text-amber-600'
	return 'text-gray-400'
}

function statusLabel(status) {
	if (status === 'done') return 'Done'
	if (status === 'in-progress') return 'In Progress'
	if (status === 'blocked') return 'Blocked'
	return 'Pending'
}

function statusBadgeClass(status) {
	if (status === 'done') return 'bg-green-50 text-green-700'
	if (status === 'in-progress') return 'bg-amber-50 text-amber-700'
	if (status === 'blocked') return 'bg-rose-100 text-rose-700'
	return 'border border-gray-200 text-gray-500'
}

const upcomingDeadlines = computed(() =>
	allTasks.value
		.filter((t) => t.status !== 'done')
		.sort((a, b) => new Date(a.date) - new Date(b.date))
		.slice(0, 5)
)

function formatShort(dateStr) {
	return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>
