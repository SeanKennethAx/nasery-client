<template>
	<div class="flex h-screen overflow-hidden bg-gray-50">
		<div class="fixed inset-x-0 top-0 z-50 h-1 bg-gray-900" />

		<aside class="shrink-0 overflow-hidden border-r border-gray-200 bg-white transition-all duration-200"
			:class="sidebarOpen ? 'w-64' : 'w-0 border-r-0'">
			<div class="flex h-full w-64 flex-col overflow-y-auto">
				<div class="flex items-center gap-2.5 px-5 py-5">
					<div
						class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-700 text-sm font-bold text-white">
						N
					</div>
					<div>
						<div class="text-base font-bold leading-tight text-gray-900">
							NaSeRy
						</div>
						<div class="text-[11px] text-gray-400">
							Event Management System
						</div>
					</div>
				</div>

				<div class="px-5 pb-3">
					<span
						class="inline-flex items-center gap-1.5 rounded-md bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700">
						<span class="h-1.5 w-1.5 rounded-full bg-primary-600" />
						Organizer Portal
					</span>
				</div>

				<nav class="flex-1 space-y-1 px-3">
					<template v-for="item in navItems" :key="item.label">
						<NuxtLink v-if="item.to" :to="item.to"
							class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold"
							:class="activeItem.label === item.label ? 'bg-primary-700 text-white' : 'text-gray-600 hover:bg-gray-100'">
							<IconBase :name="item.icon" class="h-[18px] w-[18px] shrink-0" />
							{{ item.label }}
						</NuxtLink>
						<button v-else type="button"
							class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-gray-600 hover:bg-gray-100">
							<IconBase :name="item.icon" class="h-[18px] w-[18px] shrink-0" />
							{{ item.label }}
						</button>
					</template>
				</nav>

				<div class="border-t border-gray-100 px-4 py-4">
					<button type="button"
						class="mb-1 flex w-full items-center gap-3 rounded-lg p-1.5 text-left hover:bg-gray-50"
						@click="openProfilePanel">
						<div
							class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-700 text-sm font-bold text-white">
							{{ sidebarInitials }}
						</div>
						<div class="min-w-0">
							<div class="truncate text-sm font-semibold text-gray-900">{{ profile.company }}</div>
							<div class="text-xs text-gray-400">
								Organizer
							</div>
						</div>
					</button>
					<p class="mb-3 px-1.5 text-[11px] text-gray-400">Click profile to customize</p>
					<button type="button"
						class="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700"
						@click="navigateTo('/login')">
						<IconBase name="log-out" class="h-4 w-4" />
						Sign out
					</button>
				</div>
			</div>
		</aside>

		<div class="flex min-w-0 flex-1 flex-col">
			<header class="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 py-3.5">
				<div class="flex items-center gap-4">
					<button type="button" class="text-gray-400 hover:text-gray-600" @click="sidebarOpen = !sidebarOpen">
						<IconBase :name="sidebarOpen ? 'x' : 'menu'" class="h-5 w-5" />
					</button>
					<div>
						<div class="text-xs text-gray-400">Organizer Portal</div>
						<div class="text-sm font-bold text-gray-900">{{ activeItem.label }}</div>
					</div>
				</div>
				<span
					class="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
					<span class="h-1.5 w-1.5 rounded-full bg-green-500" />
					System Online
				</span>
			</header>

			<main class="flex-1 overflow-y-auto p-6">
				<AnalyticsTabs v-if="isAnalyticsRoute" />
				<InquiryTabs v-else-if="isInquiryRoute" />
				<EventManagementTabs v-else-if="isEventManagementRoute" />
				<TicketingTabs v-else-if="isTicketAttendanceRoute" />
				<slot />
			</main>
		</div>
	</div>

	<Transition name="fade">
		<div v-if="showProfilePanel" class="fixed inset-0 z-40 bg-gray-900/40" @click="closeProfilePanel" />
	</Transition>

	<Transition name="slide">
		<div v-if="showProfilePanel"
			class="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col overflow-y-auto bg-white shadow-2xl">
			<div class="relative shrink-0 pb-9">
				<div class="h-16" :style="{ backgroundColor: draftProfile.bannerColor }" />
				<button type="button" class="absolute right-4 top-4 text-white/80 hover:text-white"
					@click="closeProfilePanel">
					<IconBase name="x" class="h-5 w-5" />
				</button>
				<div
					class="absolute -bottom-1 left-6 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white bg-white text-lg font-bold text-primary-700 shadow-sm">
					{{ panelInitials }}
				</div>
			</div>

			<div class="px-6 pb-4">
				<h2 class="text-lg font-bold text-gray-900">{{ draftProfile.fullName }}</h2>
				<p class="text-sm text-gray-500">{{ draftProfile.company }} &middot;
					Organizer
				</p>
			</div>

			<div class="flex scroll-px-6 scroll-smooth gap-5 overflow-x-auto border-b border-gray-200 px-6">
				<button v-for="tab in profileTabs" :key="tab.label" :ref="(el) => setProfileTabRef(tab.label, el)"
					type="button" class="flex shrink-0 items-center gap-1.5 border-b-2 pb-3 text-sm font-semibold"
					:class="activeProfileTab === tab.label ? 'border-primary-700 text-primary-700' : 'border-transparent text-gray-400 hover:text-gray-600'"
					@click="activeProfileTab = tab.label">
					<IconBase :name="tab.icon" class="h-4 w-4" />
					{{ tab.label }}
				</button>
			</div>

			<div class="flex-1 px-6 py-5">
				<div v-if="activeProfileTab === 'Identity'">
					<div class="mb-5 flex items-center gap-3">
						<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
							<IconBase name="user" class="h-4 w-4" />
						</div>
						<div>
							<div class="text-sm font-bold text-gray-900">Identity</div>
							<div class="text-xs text-gray-500">Your public-facing name and company</div>
						</div>
					</div>

					<FormsLabel text="Full Name" />
					<FormsTextField v-model="draftProfile.fullName" />

					<div class="mt-4">
						<FormsLabel text="Company / Brand Name" />
						<FormsTextField v-model="draftProfile.company" />
					</div>

					<label class="mb-1.5 mt-4 block text-sm font-semibold text-gray-700">Years of Experience</label>
					<select v-model="draftProfile.yearsExperience"
						class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15">
						<option value="" disabled>Select range</option>
						<option v-for="range in experienceRanges" :key="range" :value="range">{{ range }}</option>
					</select>

					<div class="mt-4">
						<FormsLabel text="Location / Service Area" />
						<FormsTextField v-model="draftProfile.location" icon="map-pin" placeholder="e.g. Metro Manila" />
					</div>
				</div>

				<div v-else-if="activeProfileTab === 'About'">
					<div class="mb-5 flex items-center gap-3">
						<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
							<IconBase name="file-text" class="h-4 w-4" />
						</div>
						<div>
							<div class="text-sm font-bold text-gray-900">About</div>
							<div class="text-xs text-gray-500">Share your story with clients</div>
						</div>
					</div>
					<label class="mb-1.5 block text-sm font-semibold text-gray-700">Bio / Description</label>
					<textarea v-model="draftProfile.bio" rows="7"
						placeholder="Tell clients about your event planning experience and style..."
						class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15" />
				</div>

				<div v-else-if="activeProfileTab === 'Tags'">
					<div class="mb-5 flex items-center gap-3">
						<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
							<IconBase name="tag" class="h-4 w-4" />
						</div>
						<div>
							<div class="text-sm font-bold text-gray-900">Tags</div>
							<div class="text-xs text-gray-500">Event types you organize</div>
						</div>
					</div>
					<div class="flex flex-wrap gap-2">
						<button v-for="tag in eventTypeOptions" :key="tag" type="button"
							class="rounded-full px-3.5 py-1.5 text-sm font-semibold"
							:class="draftProfile.tags.includes(tag) ? 'bg-primary-700 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'"
							@click="toggleTag(tag)">
							{{ tag }}
						</button>
					</div>
				</div>

				<div v-else-if="activeProfileTab === 'Specialties'">
					<div class="mb-5 flex items-center gap-3">
						<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
							<IconBase name="award" class="h-4 w-4" />
						</div>
						<div>
							<div class="text-sm font-bold text-gray-900">Specialties</div>
							<div class="text-xs text-gray-500">Services you offer</div>
						</div>
					</div>
					<div class="flex flex-wrap gap-2">
						<button v-for="item in specialtyOptions" :key="item" type="button"
							class="rounded-full px-3.5 py-1.5 text-sm font-semibold"
							:class="draftProfile.specialties.includes(item) ? 'bg-primary-700 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'"
							@click="toggleSpecialty(item)">
							{{ item }}
						</button>
					</div>
				</div>

				<div v-else-if="activeProfileTab === 'Contact'">
					<div class="mb-5 flex items-center gap-3">
						<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
							<IconBase name="phone" class="h-4 w-4" />
						</div>
						<div>
							<div class="text-sm font-bold text-gray-900">Contact</div>
							<div class="text-xs text-gray-500">How clients can reach you</div>
						</div>
					</div>

					<FormsLabel text="Email Address" />
					<FormsTextField v-model="draftProfile.email" type="email" />

					<div class="mt-4">
						<FormsLabel text="Phone Number" />
						<FormsTextField v-model="draftProfile.phone" />
					</div>

					<div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
						<div>
							<FormsLabel text="Website" />
							<FormsTextField v-model="draftProfile.website" placeholder="e.g. www.yoursite.ph" />
						</div>
						<div>
							<FormsLabel text="Facebook Page" />
							<FormsTextField v-model="draftProfile.facebook" placeholder="e.g. facebook.com/yourpage" />
						</div>
					</div>

					<div class="mt-4">
						<FormsLabel text="Instagram Handle" />
						<FormsTextField v-model="draftProfile.instagram" placeholder="e.g. @yourhandle" />
					</div>
				</div>

				<div v-else-if="activeProfileTab === 'Appearance'">
					<div class="mb-5 flex items-center gap-3">
						<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
							<IconBase name="settings" class="h-4 w-4" />
						</div>
						<div>
							<div class="text-sm font-bold text-gray-900">
								Appearance
							</div>
							<div class="text-xs text-gray-500">
								Customize your profile banner color
							</div>
						</div>
					</div>
					<div class="flex flex-wrap gap-3">
						<button v-for="color in bannerColors" :key="color" type="button"
							class="h-10 w-10 rounded-full border-2"
							:class="draftProfile.bannerColor === color ? 'border-gray-900' : 'border-transparent'"
							:style="{ backgroundColor: color }" @click="draftProfile.bannerColor = color" />
					</div>
				</div>
			</div>

			<div class="flex shrink-0 gap-3 border-t border-gray-200 px-6 py-4">
				<FormsButton variant="secondary" class="flex-1" @click="closeProfilePanel">
					Cancel
				</FormsButton>
				<FormsButton class="flex-1" @click="saveProfile">
					Save Profile
				</FormsButton>
			</div>
		</div>
	</Transition>
</template>

<script setup lang="ts">
const route = useRoute()

const sidebarOpen = ref(true)

const navItems = [
	{ label: 'Home', to: '/organizer/home', icon: 'home' },
	{ label: 'Analytics Dashboard', to: '/organizer/analyticsdashboard/overview', icon: 'chart-bar' },
	{ label: 'Inquiry & Bidding', to: '/organizer/inquiries/match-inquiries', icon: 'file-text' },
	{ label: 'Event Management', to: '/organizer/eventmanagement/all-events', icon: 'calendar' },
	{ label: 'Activity Timeline', to: '/organizer/activity-timeline', icon: 'clipboard-list' },
	{ label: 'Ticketing & Attendance', to: '/organizer/ticketattendance/attendees', icon: 'users' }
]

const analyticsRoutes = [
	'/organizer/analyticsdashboard/overview',
	'/organizer/analyticsdashboard/bid-performance',
	'/organizer/analyticsdashboard/event-performance',
	'/organizer/analyticsdashboard/live-events'
]

const inquiryRoutes = ['/organizer/inquiries/match-inquiries', '/organizer/inquiries/offers']

const eventManagementRoutes = [
	'/organizer/eventmanagement/all-events',
	'/organizer/eventmanagement/event-details',
	'/organizer/eventmanagement/ticket-tiers',
	'/organizer/eventmanagement/preparation-tracking'
]

const ticketAttendanceRoutes = [
	'/organizer/ticketattendance/attendees',
	'/organizer/ticketattendance/qr-checkin',
	'/organizer/ticketattendance/walkin-counter',
	'/organizer/ticketattendance/attendance-report'
]

const isAnalyticsRoute = computed(() => analyticsRoutes.includes(route.path))
const isInquiryRoute = computed(() => inquiryRoutes.includes(route.path))
const isEventManagementRoute = computed(() => eventManagementRoutes.includes(route.path))
const isTicketAttendanceRoute = computed(() => ticketAttendanceRoutes.includes(route.path))

const activeItem = computed(() => {
	if (isAnalyticsRoute.value) {
		return navItems.find((item) => item.label === 'Analytics Dashboard') ?? navItems[0]
	}
	if (isInquiryRoute.value) {
		return navItems.find((item) => item.label === 'Inquiry & Bidding') ?? navItems[0]
	}
	if (isEventManagementRoute.value) {
		return navItems.find((item) => item.label === 'Event Management') ?? navItems[0]
	}
	if (isTicketAttendanceRoute.value) {
		return navItems.find((item) => item.label === 'Ticketing & Attendance') ?? navItems[0]
	}
	return navItems.find((item) => item.to === route.path) ?? navItems[0]
})

const profileTabs = [
	{ label: 'Identity', icon: 'user' },
	{ label: 'About', icon: 'file-text' },
	{ label: 'Tags', icon: 'tag' },
	{ label: 'Specialties', icon: 'award' },
	{ label: 'Contact', icon: 'phone' },
	{ label: 'Appearance', icon: 'settings' }
]

const experienceRanges = ['Under 1 year', '1–3 years', '3–5 years', '5–10 years', '10+ years']
const eventTypeOptions = ['Wedding', 'Corporate Event', 'Birthday Party', 'Concert', 'Conference', 'Social Event', 'Product Launch']
const specialtyOptions = ['Full Event Coordination', 'Catering Services', 'Audio-Visual & Lighting', 'Photography & Videography', 'Venue Sourcing', 'Decor & Styling', 'Entertainment Booking']
const bannerColors = ['#285F6b', '#7c3aed', '#be123c', '#b45309', '#15803d', '#1d4ed8']

function defaultProfile() {
	return {
		fullName: 'EventPro Solutions',
		company: 'EventPro Solutions',
		yearsExperience: '',
		location: 'Metro Manila',
		bio: '',
		tags: ['Corporate Event', 'Wedding'],
		specialties: ['Full Event Coordination'],
		email: 'contact@eventprosolutions.ph',
		phone: '0917 123 4567',
		website: '',
		facebook: '',
		instagram: '',
		bannerColor: '#285F6b'
	}
}

const profile = reactive(defaultProfile())
const draftProfile = reactive(defaultProfile())
const showProfilePanel = ref(false)
const activeProfileTab = ref('Identity')

const profileTabButtonRefs = {}
function setProfileTabRef(label, el) {
	if (el) profileTabButtonRefs[label] = el
}

watch(activeProfileTab, (label) => {
	nextTick(() => {
		profileTabButtonRefs[label]?.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' })
	})
})

function initialsOf(name) {
	return (name || '').trim().split(/\s+/).slice(0, 2).map((word) => word[0]).join('').toUpperCase()
}

const sidebarInitials = computed(() => initialsOf(profile.company || profile.fullName))
const panelInitials = computed(() => initialsOf(draftProfile.company || draftProfile.fullName))

function openProfilePanel() {
	Object.assign(draftProfile, profile)
	draftProfile.tags = [...profile.tags]
	draftProfile.specialties = [...profile.specialties]
	activeProfileTab.value = 'Identity'
	showProfilePanel.value = true
}

function closeProfilePanel() {
	showProfilePanel.value = false
}

function saveProfile() {
	Object.assign(profile, draftProfile)
	profile.tags = [...draftProfile.tags]
	profile.specialties = [...draftProfile.specialties]
	closeProfilePanel()
}

function toggleTag(tag) {
	const index = draftProfile.tags.indexOf(tag)
	if (index === -1) draftProfile.tags.push(tag)
	else draftProfile.tags.splice(index, 1)
}

function toggleSpecialty(item) {
	const index = draftProfile.specialties.indexOf(item)
	if (index === -1) draftProfile.specialties.push(item)
	else draftProfile.specialties.splice(index, 1)
}
</script>

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
