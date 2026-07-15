<template>
	<div>
		<div class="mb-6 flex items-start justify-between">
			<div>
				<h1 class="text-2xl font-extrabold text-gray-900">Event Creation &amp; Management</h1>
				<p class="mt-1 text-gray-500">Configure events and manage ticket tiers</p>
			</div>
			<button type="button"
				class="flex shrink-0 items-center gap-2 rounded-xl bg-[#285F6b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1f4a54]"
				@click="openCreateEvent">
				<IconBase name="plus" class="h-4 w-4" /> Create New Event
			</button>
		</div>

		<div class="mb-6 inline-flex rounded-xl bg-gray-100 p-1">
			<NuxtLink v-for="tab in tabs" :key="tab.label" :to="tab.to"
				class="rounded-lg px-4 py-2 text-sm font-semibold"
				:class="route.path === tab.to ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'">
				{{ tab.label }}
			</NuxtLink>
		</div>

		<Transition name="fade">
			<div v-if="showCreateEvent" class="fixed inset-0 z-40 bg-gray-900/40" @click="closeCreateEvent" />
		</Transition>

		<Transition name="slide">
			<div v-if="showCreateEvent"
				class="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-white shadow-2xl">
				<div class="flex shrink-0 items-start justify-between border-b border-gray-200 px-6 py-5">
					<div class="flex items-start gap-3">
						<div
							class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#285F6b] text-white">
							<IconBase name="calendar" class="h-5 w-5" />
						</div>
						<div>
							<h2 class="text-base font-bold text-gray-900">Create New Event</h2>
							<p class="text-sm text-gray-500">Fill in your event details below</p>
						</div>
					</div>
					<button type="button" class="text-gray-400 hover:text-gray-600" @click="closeCreateEvent">
						<IconBase name="x" class="h-5 w-5" />
					</button>
				</div>

				<div class="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-gray-200 px-6 scroll-smooth">
					<button v-for="tab in createTabs" :key="tab.label" :ref="(el) => setTabRef(tab.label, el)" type="button"
						class="flex shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-3 text-sm font-semibold"
						:class="activeCreateTab === tab.label ? 'border-primary-700 text-primary-700' : 'border-transparent text-gray-400 hover:text-gray-600'"
						@click="activeCreateTab = tab.label">
						<IconBase :name="tab.icon" class="h-4 w-4" /> {{ tab.label }}
					</button>
				</div>

				<div class="flex-1 overflow-y-auto px-6 py-5">
					<template v-if="activeCreateTab === 'Basic Info'">
						<label class="mb-1.5 block text-sm font-semibold text-gray-700">Event Name <span
								class="text-red-500">*</span></label>
						<input v-model="eventForm.name" type="text" placeholder="e.g. Santos-Reyes Wedding Reception"
							class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15" />

						<label class="mb-1.5 mt-4 block text-sm font-semibold text-gray-700">Event Type <span
								class="text-red-500">*</span></label>
						<select v-model="eventForm.eventType"
							class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15">
							<option value="" disabled>Select event type</option>
							<option v-for="type in eventTypes" :key="type" :value="type">{{ type }}</option>
						</select>

						<label class="mb-1.5 mt-4 block text-sm font-semibold text-gray-700">Description</label>
						<textarea v-model="eventForm.description" rows="4"
							placeholder="Describe the event — theme, programme, highlights, and any special notes..."
							class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15" />

						<div class="mt-4 grid grid-cols-2 gap-3">
							<div>
								<label class="mb-1.5 block text-sm font-semibold text-gray-700">Event Date <span
										class="text-red-500">*</span></label>
								<input v-model="eventForm.eventDate" type="date"
									class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15" />
							</div>
							<div>
								<label class="mb-1.5 block text-sm font-semibold text-gray-700">Status</label>
								<select v-model="eventForm.status"
									class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15">
									<option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
								</select>
							</div>
						</div>

						<div class="mt-4 grid grid-cols-2 gap-3">
							<div>
								<label class="mb-1.5 block text-sm font-semibold text-gray-700">Start Time</label>
								<input v-model="eventForm.startTime" type="time"
									class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15" />
							</div>
							<div>
								<label class="mb-1.5 block text-sm font-semibold text-gray-700">End Time</label>
								<input v-model="eventForm.endTime" type="time"
									class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15" />
							</div>
						</div>

						<label class="mb-1.5 mt-4 block text-sm font-semibold text-gray-700">Tags <span
								class="text-gray-400">(comma-separated)</span></label>
						<div class="relative">
							<IconBase name="tag"
								class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
							<input v-model="eventForm.tags" type="text" placeholder="e.g. Wedding, Garden, Outdoor"
								class="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15" />
						</div>
					</template>

					<template v-else-if="activeCreateTab === 'Venue'">
						<label class="mb-1.5 block text-sm font-semibold text-gray-700">Venue Name</label>
						<input v-model="eventForm.venueName" type="text" placeholder="e.g. Manila Convention Center"
							class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15" />

						<label class="mb-1.5 mt-4 block text-sm font-semibold text-gray-700">Address</label>
						<input v-model="eventForm.address" type="text" placeholder="Street address"
							class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15" />

						<div class="mt-4 grid grid-cols-2 gap-3">
							<div>
								<label class="mb-1.5 block text-sm font-semibold text-gray-700">City / Area</label>
								<input v-model="eventForm.city" type="text" placeholder="e.g. Makati"
									class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15" />
							</div>
							<div>
								<label class="mb-1.5 block text-sm font-semibold text-gray-700">Capacity</label>
								<input v-model="eventForm.capacity" type="number" placeholder="e.g. 500"
									class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15" />
							</div>
						</div>
					</template>

					<template v-else-if="activeCreateTab === 'Ticket Zones'">
						<div class="space-y-3">
							<div v-for="(zone, i) in eventForm.zones" :key="i"
								class="rounded-xl border border-gray-200 p-3">
								<div class="mb-2 flex items-center justify-between">
									<span class="text-xs font-semibold text-gray-400">Zone {{ i + 1 }}</span>
									<button v-if="eventForm.zones.length > 1" type="button"
										class="text-gray-400 hover:text-red-500" @click="removeZone(i)">
										<IconBase name="trash" class="h-4 w-4" />
									</button>
								</div>
								<input v-model="zone.name" type="text" placeholder="Zone name (e.g. VIP Front Row)"
									class="mb-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15" />
								<div class="grid grid-cols-2 gap-2">
									<input v-model="zone.price" type="text" placeholder="Price (₱)"
										class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15" />
									<input v-model="zone.capacity" type="number" placeholder="Capacity"
										class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15" />
								</div>
							</div>
						</div>
						<button type="button" class="mt-3 flex items-center gap-1 text-sm font-semibold text-primary-700"
							@click="addZone">
							<IconBase name="plus" class="h-3.5 w-3.5" /> Add Zone
						</button>
					</template>

					<template v-else-if="activeCreateTab === 'Settings'">
						<label class="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3.5">
							<span class="text-sm font-medium text-gray-700">Allow public registration</span>
							<input v-model="eventForm.publicRegistration" type="checkbox"
								class="h-4 w-4 accent-primary-700" />
						</label>
						<label
							class="mt-3 flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3.5">
							<span class="text-sm font-medium text-gray-700">Require approval before confirming</span>
							<input v-model="eventForm.requireApproval" type="checkbox"
								class="h-4 w-4 accent-primary-700" />
						</label>
						<label
							class="mt-3 flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3.5">
							<span class="text-sm font-medium text-gray-700">Enable waitlist when sold out</span>
							<input v-model="eventForm.waitlistEnabled" type="checkbox"
								class="h-4 w-4 accent-primary-700" />
						</label>
					</template>

					<template v-else-if="activeCreateTab === 'Contact'">
						<label class="mb-1.5 block text-sm font-semibold text-gray-700">Contact Person</label>
						<input v-model="eventForm.contactName" type="text" placeholder="e.g. Maria Santos"
							class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15" />

						<label class="mb-1.5 mt-4 block text-sm font-semibold text-gray-700">Email</label>
						<input v-model="eventForm.contactEmail" type="email" placeholder="you@example.com"
							class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15" />

						<label class="mb-1.5 mt-4 block text-sm font-semibold text-gray-700">Phone</label>
						<input v-model="eventForm.contactPhone" type="tel" placeholder="+63 9XX XXX XXXX"
							class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15" />
					</template>
				</div>

				<div class="shrink-0 border-t border-gray-200 px-6 py-4">
					<button type="button"
						class="flex w-full items-center justify-center gap-2 rounded-xl bg-[#285F6b] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1f4a54]"
						@click="goNext">
						{{ isLastTab ? 'Create Event' : 'Next' }}
						<IconBase name="arrow-right" class="h-4 w-4" />
					</button>
				</div>
			</div>
		</Transition>
	</div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
	transition: transform 0.25s ease;
}

.slide-enter-from,
.slide-leave-to {
	transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>

<script setup lang="ts">
const route = useRoute()

const tabs = [
	{ label: 'All Events', to: '/organizer/eventmanagement/all-events' },
	{ label: 'Event Details', to: '/organizer/eventmanagement/event-details' },
	{ label: 'Ticket Tiers', to: '/organizer/eventmanagement/ticket-tiers' },
	{ label: 'Preparation Tracking', to: '/organizer/eventmanagement/preparation-tracking' }
]

const createTabs = [
	{ label: 'Basic Info', icon: 'file-text' },
	{ label: 'Venue', icon: 'map-pin' },
	{ label: 'Ticket Zones', icon: 'tag' },
	{ label: 'Settings', icon: 'settings' },
	{ label: 'Contact', icon: 'phone' }
]

const eventTypes = ['Wedding', 'Corporate', 'Conference', 'Birthday', 'Social', 'Charity', 'Other']
const statusOptions = ['Draft', 'Published']

const showCreateEvent = ref(false)
const activeCreateTab = ref(createTabs[0].label)

const tabButtonRefs = {}
function setTabRef(label, el) {
	if (el) tabButtonRefs[label] = el
}

watch(activeCreateTab, (label) => {
	nextTick(() => {
		tabButtonRefs[label]?.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' })
	})
})

function emptyEventForm() {
	return {
		name: '',
		eventType: '',
		description: '',
		eventDate: '',
		status: 'Draft',
		startTime: '',
		endTime: '',
		tags: '',
		venueName: '',
		address: '',
		city: '',
		capacity: '',
		zones: [{ name: '', price: '', capacity: '' }],
		publicRegistration: true,
		requireApproval: false,
		waitlistEnabled: false,
		contactName: '',
		contactEmail: '',
		contactPhone: ''
	}
}

const eventForm = reactive(emptyEventForm())

function openCreateEvent() {
	Object.assign(eventForm, emptyEventForm())
	activeCreateTab.value = createTabs[0].label
	showCreateEvent.value = true
}

function closeCreateEvent() {
	showCreateEvent.value = false
}

function addZone() {
	eventForm.zones.push({ name: '', price: '', capacity: '' })
}

function removeZone(index: number) {
	eventForm.zones.splice(index, 1)
}

const currentTabIndex = computed(() => createTabs.findIndex((t) => t.label === activeCreateTab.value))
const isLastTab = computed(() => currentTabIndex.value === createTabs.length - 1)

function goNext() {
	if (isLastTab.value) {
		closeCreateEvent()
	} else {
		activeCreateTab.value = createTabs[currentTabIndex.value + 1].label
	}
}
</script>