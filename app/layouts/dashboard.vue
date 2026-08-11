<template>
	<div class="flex h-screen overflow-hidden bg-gray-50">
		<div class="fixed inset-x-0 top-0 z-50 h-1 bg-gray-900" />

		<aside class="shrink-0 overflow-hidden border-r border-gray-200 bg-white transition-all duration-200" :class="sidebarOpen
			? 'w-64'
			: 'w-0 border-r-0'
			">
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
					<NuxtLink v-for="item in navItems" :key="item.label" :to="item.to"
						class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold" :class="activeItem.label === item.label
							? 'bg-primary-700 text-white'
							: 'text-gray-600 hover:bg-gray-100'
							">
						<IconBase :name="item.icon" class="h-[18px] w-[18px] shrink-0" />

						{{ item.label }}
					</NuxtLink>
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
							<div class="truncate text-sm font-semibold text-gray-900">
								{{ sidebarName }}
							</div>

							<div class="text-xs text-gray-400">
								{{ sidebarRole }}
							</div>
						</div>
					</button>

					<p class="mb-3 px-1.5 text-[11px] text-gray-400">
						Click profile to customize
					</p>

					<button type="button"
						class="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700"
						@click="handleLogout">
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
						<IconBase :name="sidebarOpen
							? 'x'
							: 'menu'
							" class="h-5 w-5" />
					</button>

					<div>
						<div class="text-xs text-gray-400">
							Organizer Portal
						</div>

						<div class="text-sm font-bold text-gray-900">
							{{ activeItem.label }}
						</div>
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
</template>

<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'

const route = useRoute()

const {
	user,
	firstName,
	fullName,
	initials,
	roleLabel,
	logout,
} = useAuth()

const sidebarOpen = ref(true)

const sidebarName = computed(() => {
	return firstName.value || 'Organizer'
})

const sidebarInitials = computed(() => {
	return initials.value || 'O'
})

const sidebarRole = computed(() => {
	return roleLabel.value || 'Organizer'
})

const navItems = [
	{
		label: 'Home',
		to: '/organizer/home',
		icon: 'home',
	},
	{
		label: 'Analytics Dashboard',
		to: '/organizer/analyticsdashboard/overview',
		icon: 'chart-bar',
	},
	{
		label: 'Inquiry & Bidding',
		to: '/organizer/inquiries/match-inquiries',
		icon: 'file-text',
	},
	{
		label: 'Event Management',
		to: '/organizer/eventmanagement/all-events',
		icon: 'calendar',
	},
	{
		label: 'Activity Timeline',
		to: '/organizer/activity-timeline',
		icon: 'clipboard-list',
	},
	{
		label: 'Ticketing & Attendance',
		to: '/organizer/ticketattendance/attendees',
		icon: 'users',
	},
]

const analyticsRoutes = [
	'/organizer/analyticsdashboard/overview',
	'/organizer/analyticsdashboard/bid-performance',
	'/organizer/analyticsdashboard/event-performance',
	'/organizer/analyticsdashboard/live-events',
]

const inquiryRoutes = [
	'/organizer/inquiries/match-inquiries',
	'/organizer/inquiries/offers',
]

const eventManagementRoutes = [
	'/organizer/eventmanagement/all-events',
	'/organizer/eventmanagement/event-details',
	'/organizer/eventmanagement/ticket-tiers',
	'/organizer/eventmanagement/preparation-tracking',
]

const ticketAttendanceRoutes = [
	'/organizer/ticketattendance/attendees',
	'/organizer/ticketattendance/qr-checkin',
	'/organizer/ticketattendance/walkin-counter',
	'/organizer/ticketattendance/attendance-report',
]

const isAnalyticsRoute = computed(() => {
	return analyticsRoutes.includes(route.path)
})

const isInquiryRoute = computed(() => {
	return inquiryRoutes.includes(route.path)
})

const isEventManagementRoute = computed(() => {
	return eventManagementRoutes.includes(
		route.path
	)
})

const isTicketAttendanceRoute = computed(() => {
	return ticketAttendanceRoutes.includes(
		route.path
	)
})

const activeItem = computed(() => {
	if (isAnalyticsRoute.value) {
		return (
			navItems.find(
				(item) =>
					item.label ===
					'Analytics Dashboard'
			) ?? navItems[0]
		)
	}

	if (isInquiryRoute.value) {
		return (
			navItems.find(
				(item) =>
					item.label ===
					'Inquiry & Bidding'
			) ?? navItems[0]
		)
	}

	if (isEventManagementRoute.value) {
		return (
			navItems.find(
				(item) =>
					item.label ===
					'Event Management'
			) ?? navItems[0]
		)
	}

	if (isTicketAttendanceRoute.value) {
		return (
			navItems.find(
				(item) =>
					item.label ===
					'Ticketing & Attendance'
			) ?? navItems[0]
		)
	}

	return (
		navItems.find(
			(item) => item.to === route.path
		) ?? navItems[0]
	)
})

const profileTabs = [
	{
		label: 'Identity',
		icon: 'user',
	},
	{
		label: 'About',
		icon: 'file-text',
	},
	{
		label: 'Tags',
		icon: 'tag',
	},
	{
		label: 'Specialties',
		icon: 'award',
	},
	{
		label: 'Contact',
		icon: 'phone',
	},
	{
		label: 'Appearance',
		icon: 'settings',
	},
]

const experienceRanges = [
	'Under 1 year',
	'1–3 years',
	'3–5 years',
	'5–10 years',
	'10+ years',
]

const eventTypeOptions = [
	'Wedding',
	'Corporate Event',
	'Birthday Party',
	'Concert',
	'Conference',
	'Social Event',
	'Product Launch',
]

const specialtyOptions = [
	'Full Event Coordination',
	'Catering Services',
	'Audio-Visual & Lighting',
	'Photography & Videography',
	'Venue Sourcing',
	'Decor & Styling',
	'Entertainment Booking',
]

const bannerColors = [
	'#285F6b',
	'#7c3aed',
	'#be123c',
	'#b45309',
	'#15803d',
	'#1d4ed8',
]

function defaultProfile() {
	return {
		fullName: '',
		company: '',
		yearsExperience: '',
		location: '',
		bio: '',
		tags: [] as string[],
		specialties: [] as string[],
		email: '',
		phone: '',
		website: '',
		facebook: '',
		instagram: '',
		bannerColor: '#285F6b',
	}
}

const profile = reactive(
	defaultProfile()
)

const draftProfile = reactive(
	defaultProfile()
)

const showProfilePanel = ref(false)

const activeProfileTab = ref('Identity')

function syncProfileFromUser() {
	if (!user.value) {
		return
	}

	profile.fullName = fullName.value

	profile.email =
		user.value.email ?? ''

	profile.phone =
		user.value.phone ?? ''

	syncDraftProfile()
}


function syncDraftProfile() {
	Object.assign(
		draftProfile,
		profile
	)

	draftProfile.tags = [
		...profile.tags,
	]

	draftProfile.specialties = [
		...profile.specialties,
	]
}

watch(
	() => [
		user.value?.id,
		user.value?.firstname,
		user.value?.middlename,
		user.value?.lastname,
		user.value?.email,
		user.value?.phone,
	],
	() => {
		syncProfileFromUser()
	},
	{
		immediate: true,
	}
)

const profileTabButtonRefs:
	Record<string, HTMLElement | null> = {}

function setProfileTabRef(
	label: string,
	element:
		| Element
		| ComponentPublicInstance
		| null
) {
	if (!element) {
		profileTabButtonRefs[label] = null
		return
	}

	if (element instanceof HTMLElement) {
		profileTabButtonRefs[label] =
			element

		return
	}

	const rootElement = element.$el

	profileTabButtonRefs[label] =
		rootElement instanceof HTMLElement
			? rootElement
			: null
}

watch(
	activeProfileTab,
	async (label) => {
		await nextTick()

		profileTabButtonRefs[label]
			?.scrollIntoView({
				behavior: 'smooth',
				inline: 'nearest',
				block: 'nearest',
			})
	}
)

function initialsOf(
	name: string
): string {
	const words = name
		.trim()
		.split(/\s+/)
		.filter(Boolean)

	if (!words.length) {
		return ''
	}

	const first =
		words[0]?.charAt(0) ?? ''

	const last =
		words.length > 1
			? words[
				words.length - 1
			]?.charAt(0) ?? ''
			: ''

	return `${first}${last}`
		.toUpperCase()
}

const panelInitials = computed(() => {
	return initialsOf(
		draftProfile.company ||
		draftProfile.fullName
	)
})

function openProfilePanel() {
	syncDraftProfile()

	activeProfileTab.value =
		'Identity'

	showProfilePanel.value = true
}

function closeProfilePanel() {
	showProfilePanel.value = false
}

function saveProfile() {
	Object.assign(
		profile,
		draftProfile
	)

	profile.tags = [
		...draftProfile.tags,
	]

	profile.specialties = [
		...draftProfile.specialties,
	]

	closeProfilePanel()
}

function toggleTag(
	tag: string
) {
	const index =
		draftProfile.tags.indexOf(tag)

	if (index === -1) {
		draftProfile.tags.push(tag)
		return
	}

	draftProfile.tags.splice(
		index,
		1
	)
}

function toggleSpecialty(
	specialty: string
) {
	const index =
		draftProfile.specialties
			.indexOf(specialty)

	if (index === -1) {
		draftProfile.specialties.push(
			specialty
		)

		return
	}

	draftProfile.specialties.splice(
		index,
		1
	)
}

async function handleLogout() {
	logout()

	await navigateTo('/login')
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
