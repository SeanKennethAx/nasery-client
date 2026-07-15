<template>
	<div>
		<div class="mb-1 text-xs font-semibold text-primary-700">Organizer Portal</div>
		<h1 class="text-2xl font-extrabold text-gray-900">Activity Timeline</h1>
		<p class="mt-1 mb-6 text-gray-500">Full activity log across all your managed events</p>

		<div class="flex gap-6">
			<div class="w-72 shrink-0 space-y-2">
				<div class="mb-1 text-xs font-semibold tracking-wide text-gray-400">EVENTS</div>

				<button type="button"
					class="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold"
					:class="selectedEvent === null ? 'bg-[#285F6b] text-white' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'"
					@click="selectedEvent = null">
					<span>All Events</span>
					<span class="rounded-full px-2 py-0.5 text-xs font-bold"
						:class="selectedEvent === null ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'">
						{{ totalActivities }}
					</span>
				</button>

				<button v-for="ev in events" :key="ev.name" type="button"
					class="w-full rounded-xl border px-4 py-3 text-left hover:bg-gray-50"
					:class="selectedEvent === ev.name ? 'border-[#285F6b] bg-[#285F6b]/5' : 'border-gray-200'"
					@click="selectedEvent = ev.name">
					<div class="flex items-center justify-between gap-2">
						<span class="truncate text-sm font-bold text-gray-900">{{ ev.name }}</span>
						<span class="shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold" :class="eventBadgeClass(ev.status)">
							{{ ev.status }}
						</span>
					</div>
					<div class="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500">
						<IconBase name="calendar" class="h-3.5 w-3.5" /> {{ ev.date }}
					</div>
					<div class="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
						<IconBase name="map-pin" class="h-3.5 w-3.5" /> {{ ev.venue }}
					</div>
				</button>
			</div>

			<div class="min-w-0 flex-1">
				<div class="mb-4 flex items-center gap-3">
					<div class="relative flex-1">
						<IconBase name="search"
							class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
						<input v-model="searchQuery" type="text" placeholder="Search activities..."
							class="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15" />
					</div>
					<IconBase name="filter" class="h-4 w-4 shrink-0 text-gray-400" />
					<div class="flex shrink-0 gap-2">
						<button v-for="f in statusFilters" :key="f" type="button"
							class="rounded-lg px-3 py-2 text-sm font-semibold"
							:class="selectedStatus === f ? 'bg-[#285F6b] text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'"
							@click="selectedStatus = f">
							{{ f }}
						</button>
					</div>
				</div>

				<div class="mb-4 flex items-center justify-between">
					<div class="flex gap-2">
						<span class="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">{{ doneCount }} Completed</span>
						<span class="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">{{ inProgressCount }} In Progress</span>
						<span class="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">{{ pendingCount }} Pending</span>
					</div>
					<span class="text-sm text-gray-400">{{ totalActivities }} activities</span>
				</div>

				<Transition name="fade-slide" mode="out-in">
					<div :key="selectedEvent || 'all'">
						<div v-if="selectedEventData"
							class="mb-5 flex items-center justify-between rounded-xl bg-[#285F6b] px-5 py-4 text-white">
							<div>
								<div class="text-base font-bold">{{ selectedEventData.name }}</div>
								<div class="mt-1 flex items-center gap-3 text-xs text-white/70">
									<span class="flex items-center gap-1"><IconBase name="calendar" class="h-3.5 w-3.5" /> {{ selectedEventData.date }}</span>
									<span class="flex items-center gap-1"><IconBase name="map-pin" class="h-3.5 w-3.5" /> {{ selectedEventData.venue }}</span>
								</div>
							</div>
							<span class="shrink-0 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">{{ selectedEventData.status }}</span>
						</div>

						<div class="mb-5 flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
							<IconBase name="clipboard-list" class="h-4 w-4 shrink-0 text-gray-400" />
							{{ summaryMessage }}
						</div>

						<div class="space-y-3">
							<div v-for="activity in filteredActivities" :key="activity.title"
								class="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4">
								<IconBase v-if="activity.status === 'Done'" name="check-circle" class="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
								<IconBase v-else-if="activity.status === 'In Progress'" name="clock" class="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
								<span v-else class="mt-1 h-4 w-4 shrink-0 rounded-full border-2 border-gray-300" />

								<div class="min-w-0 flex-1">
									<div class="flex items-center gap-2 text-xs">
										<span class="font-semibold text-primary-700">{{ activity.event }}</span>
										<span class="text-gray-400">{{ activity.category }}</span>
									</div>
									<div class="mt-0.5 text-sm font-bold text-gray-900">{{ activity.title }}</div>
									<p class="mt-0.5 text-sm text-gray-500">{{ activity.desc }}</p>
									<div class="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-gray-400">
										<span class="flex items-center gap-1"><IconBase name="calendar" class="h-3.5 w-3.5" /> {{ activity.date }}</span>
										<span v-if="activity.person" class="flex items-center gap-1"><IconBase name="user" class="h-3.5 w-3.5" /> {{ activity.person }}</span>
										<span class="flex items-center gap-1"><IconBase name="tag" class="h-3.5 w-3.5" /> {{ activity.tag }}</span>
									</div>
								</div>

								<span class="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold"
									:class="activity.status === 'Done' ? 'bg-green-50 text-green-700' : 'text-gray-400'">
									{{ activity.status }}
								</span>
							</div>

							<div v-if="filteredActivities.length === 0" class="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
								No activities match your filters.
							</div>
						</div>
					</div>
				</Transition>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const events = [
	{ name: 'Tech Conference 2026', status: 'Active', date: 'June 15, 2026', venue: 'Manila Convention Center' },
	{ name: 'Santos-Reyes Wedding', status: 'Upcoming', date: 'July 26, 2026', venue: 'Grand Ballroom, Makati' },
	{ name: 'ABC Corp Annual Gala', status: 'Bidding', date: 'Aug 20, 2026', venue: 'Shangri-La BGC' },
	{ name: 'Rodriguez 50th Birthday', status: 'Completed', date: 'Apr 12, 2026', venue: 'The Picasso Boutique, BGC' },
	{ name: 'Habitat PH Fundraiser', status: 'Upcoming', date: 'Sep 5, 2026', venue: 'Fairmont Hotel, Makati' }
]

function eventBadgeClass(status) {
	if (status === 'Upcoming') return 'bg-orange-50 text-orange-600'
	if (status === 'Bidding') return 'bg-violet-50 text-violet-600'
	if (status === 'Completed') return 'bg-green-50 text-green-700'
	return 'bg-gray-100 text-gray-600'
}

const activities = [
	{ event: 'Santos-Reyes Wedding', category: 'Wedding', title: 'Wedding Day', desc: 'Ceremony at 4:00 PM · Reception doors open 6:00 PM', date: 'Jul 26, 2026 · 4:00 PM', tag: 'Milestone', status: 'Pending' },
	{ event: 'Santos-Reyes Wedding', category: 'Wedding', title: 'Ceremony Rehearsal', desc: 'Venue walkthrough with couple and bridal party', date: 'Jul 25, 2026 · 4:00 PM', tag: 'Milestone', status: 'Pending' },
	{ event: 'Santos-Reyes Wedding', category: 'Wedding', title: 'Décor Delivery', desc: 'Floral arrangements and furniture delivery to venue', date: 'Jul 24, 2026 · 8:00 AM', tag: 'Milestone', status: 'Pending' },
	{ event: 'Santos-Reyes Wedding', category: 'Wedding', title: 'Guest RSVP Collection', desc: 'RSVP portal live — 182 of 250 responses received', date: 'Jun 25, 2026 · 9:00 AM', person: 'Maria Santos', tag: 'Action', status: 'In Progress' },
	{ event: 'Santos-Reyes Wedding', category: 'Wedding', title: 'Catering Menu Finalized', desc: '4-course menu approved; dietary options noted for 12 guests', date: 'Jun 20, 2026 · 1:30 PM', person: 'Chef Marco', tag: 'Update', status: 'In Progress' },
	{ event: 'ABC Corp Annual Gala', category: 'Corporate', title: 'Award Decision', desc: 'Client to announce winning organizer after pitch presentations', date: 'Jun 20, 2026 · 5:00 PM', tag: 'Milestone', status: 'Pending' },
	{ event: 'Santos-Reyes Wedding', category: 'Wedding', title: 'Photographer Briefed', desc: 'Shot list submitted; golden-hour portraits scheduled at 5:30 PM', date: 'Jun 18, 2026 · 10:00 AM', person: 'Lens & Love PH', tag: 'Action', status: 'Done' },
	{ event: 'Tech Conference 2026', category: 'Conference', title: 'Event Day Setup', desc: 'Final preparations, guest check-in and badge distribution begins', date: 'Jun 15, 2026 · 6:00 AM', tag: 'Milestone', status: 'Pending' },
	{ event: 'Tech Conference 2026', category: 'Conference', title: 'Event Completion', desc: 'Event concludes — post-event report and client feedback collection', date: 'Jun 15, 2026 · 10:00 PM', tag: 'Milestone', status: 'Pending' },
	{ event: 'ABC Corp Annual Gala', category: 'Corporate', title: 'Venue Scouting', desc: 'Visiting Shangri-La BGC and Marriott to compare options', date: 'Jun 12, 2026 · 10:00 AM', person: 'Venue Team', tag: 'Update', status: 'In Progress' },
	{ event: 'Habitat PH Fundraiser', category: 'Charity', title: 'Contract Pending', desc: 'Awaiting countersignature from Habitat PH board of trustees', date: 'Jun 12, 2026 · 9:00 AM', tag: 'Update', status: 'In Progress' },
	{ event: 'Tech Conference 2026', category: 'Conference', title: 'Final Walkthrough', desc: 'Pre-event venue inspection and full setup verification', date: 'Jun 10, 2026 · 2:00 PM', tag: 'Milestone', status: 'Pending' },
	{ event: 'Santos-Reyes Wedding', category: 'Wedding', title: 'Floral Theme Approved', desc: 'Garden-romantic concept with white peonies and eucalyptus', date: 'Jun 10, 2026 · 2:00 PM', person: 'Bloom Studio', tag: 'Update', status: 'Done' },
	{ event: 'ABC Corp Annual Gala', category: 'Corporate', title: 'Presentation Scheduled', desc: 'Invited for live pitch to ABC Corp exec team on June 15', date: 'Jun 8, 2026 · 11:00 AM', tag: 'Update', status: 'In Progress' }
]

const selectedEvent = ref(null)
const selectedStatus = ref('All')
const searchQuery = ref('')

const statusFilters = ['All', 'Completed', 'In Progress', 'Pending']
const statusMap = { Completed: 'Done', 'In Progress': 'In Progress', Pending: 'Pending' }

const totalActivities = computed(() => activities.length)
const doneCount = computed(() => activities.filter((a) => a.status === 'Done').length)
const inProgressCount = computed(() => activities.filter((a) => a.status === 'In Progress').length)
const pendingCount = computed(() => activities.filter((a) => a.status === 'Pending').length)

const filteredActivities = computed(() => {
	return activities.filter((a) => {
		if (selectedEvent.value && a.event !== selectedEvent.value) return false
		if (selectedStatus.value !== 'All' && a.status !== statusMap[selectedStatus.value]) return false
		if (searchQuery.value && !`${a.title} ${a.desc}`.toLowerCase().includes(searchQuery.value.toLowerCase())) return false
		return true
	})
})

const summaryMessage = computed(() => {
	const scope = selectedEvent.value ? `activity for ${selectedEvent.value}` : `all activity across ${events.length} events`
	return `Showing ${scope} — newest first`
})

const selectedEventData = computed(() => events.find((ev) => ev.name === selectedEvent.value) ?? null)
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
	transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-slide-enter-from {
	opacity: 0;
	transform: translateY(6px);
}

.fade-slide-leave-to {
	opacity: 0;
	transform: translateY(-6px);
}
</style>
