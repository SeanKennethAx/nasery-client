<template>
	<div class="flex h-screen overflow-hidden bg-gray-50">
		<!-- <div class="fixed inset-x-0 top-0 z-50 h-1 bg-gray-900" /> -->

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

		<!-- Organizer profile overlay -->
		<Transition name="fade">
			<div v-if="showProfilePanel" class="fixed inset-0 z-40 bg-gray-900/40" @click="closeProfilePanel" />
		</Transition>

		<!-- Organizer profile customization panel -->
		<Transition name="slide">
			<div v-if="showProfilePanel"
				class="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col bg-white shadow-2xl">
				<div class="flex min-h-0 flex-1 flex-col overflow-hidden">
					<!-- Banner -->
					<div class="relative shrink-0 pb-10">
						<div class="h-24" :style="{ backgroundColor: draftProfile.bannerColor }" />

						<button type="button"
							class="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-white transition hover:bg-black/30"
							@click="closeProfilePanel">
							<IconBase name="x" class="h-5 w-5" />
						</button>

						<div
							class="absolute -bottom-1 left-6 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white bg-primary-700 text-lg font-bold text-white shadow-md">
							{{ panelInitials || 'O' }}
						</div>
					</div>

					<!-- Header -->
					<div class="shrink-0 px-6 pb-4">
						<h2 class="text-xl font-bold text-gray-900">
							{{
								draftProfile.company ||
								draftProfile.fullName ||
								'Organizer Profile'
							}}
						</h2>

						<p class="mt-0.5 text-sm text-gray-400">
							{{
								draftProfile.company ||
								draftProfile.fullName ||
								'Organizer'
							}}
							· Organizer
						</p>
					</div>

					<!-- Tabs -->
					<div
						class="flex shrink-0 scroll-px-6 scroll-smooth gap-5 overflow-x-auto border-b border-gray-200 px-6">
						<button v-for="tab in profileTabs" :key="tab.label"
							:ref="(el) => setProfileTabRef(tab.label, el as Element | null)" type="button"
							class="flex shrink-0 items-center gap-1.5 border-b-2 pb-3 text-sm font-semibold transition"
							:class="activeProfileTab === tab.label
								? 'border-primary-700 text-primary-700'
								: 'border-transparent text-gray-400 hover:text-gray-600'
								" @click="activeProfileTab = tab.label">
							<IconBase :name="tab.icon" class="h-4 w-4" />

							{{ tab.label }}
						</button>
					</div>

					<!-- Content -->
					<div class="min-h-0 flex-1 overflow-y-auto px-6 py-6">
						<!-- Identity -->
						<div v-if="activeProfileTab === 'Identity'">
							<div class="mb-6 flex items-center gap-3 border-b border-gray-100 pb-5">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
									<IconBase name="user" class="h-5 w-5" />
								</div>
								<div>
									<div class="text-base font-bold text-gray-900">
										Identity
									</div>
									<div class="text-sm text-gray-400">
										Your public-facing name and company
									</div>
								</div>
							</div>

							<div class="mb-5">
								<FormsLabel text="Full Name" />
								<FormsTextField v-model="draftProfile.fullName" placeholder="Enter your full name"
									size="lg" />
							</div>

							<div class="mb-5">
								<FormsLabel text="Company / Brand Name" />
								<FormsTextField v-model="draftProfile.company" placeholder="Enter company or brand name"
									size="lg" />
							</div>

							<div class="mb-5">
								<FormsLabel text="Years of Experience" />
								<select v-model="draftProfile.yearsExperience"
									class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15">
									<option value="" disabled>
										Select range
									</option>
									<option v-for="range in experienceRanges" :key="range" :value="range">
										{{ range }}
									</option>
								</select>
							</div>

							<div>
								<FormsLabel text="Location / Service Area" />
								<FormsTextField v-model="draftProfile.location" placeholder="e.g. Metro Manila"
									size="lg">
									<template #icon>
										<IconBase name="map-pin"
											class="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-primary-600" />
									</template>
								</FormsTextField>
							</div>
						</div>

						<!-- About -->
						<div v-else-if="activeProfileTab === 'About'">
							<div class="mb-6 flex items-center gap-3 border-b border-gray-100 pb-5">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
									<IconBase name="file-text" class="h-5 w-5" />
								</div>
								<div>
									<div class="text-base font-bold text-gray-900">
										About
									</div>
									<div class="text-sm text-gray-400">
										Tell clients about your business
									</div>
								</div>
							</div>

							<label class="mb-2 block text-sm font-semibold text-gray-700">
								Business Description
							</label>

							<textarea v-model="draftProfile.bio" rows="8"
								placeholder="Tell clients about your experience, services, and approach to event planning..."
								class="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15" />
						</div>

						<!-- Tags -->
						<div v-else-if="activeProfileTab === 'Tags'">
							<div class="mb-6 flex items-center gap-3 border-b border-gray-100 pb-5">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
									<IconBase name="tag" class="h-5 w-5" />
								</div>
								<div>
									<div class="text-base font-bold text-gray-900">
										Event Tags
									</div>
									<div class="text-sm text-gray-400">
										Select the events you usually handle
									</div>
								</div>
							</div>

							<div class="flex flex-wrap gap-2.5">
								<button v-for="tag in eventTypeOptions" :key="tag" type="button"
									class="rounded-full px-4 py-2 text-sm font-semibold transition" :class="draftProfile.tags.includes(tag)
										? 'bg-primary-700 text-white'
										: 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'" @click="toggleTag(tag)">
									{{ tag }}
								</button>
							</div>
						</div>

						<!-- Specialties -->
						<div v-else-if="activeProfileTab === 'Specialties'">
							<div class="mb-6 flex items-center gap-3 border-b border-gray-100 pb-5">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
									<IconBase name="award" class="h-5 w-5" />
								</div>
								<div>
									<div class="text-base font-bold text-gray-900">
										Specialties
									</div>
									<div class="text-sm text-gray-400">
										Services and areas you specialize in
									</div>
								</div>
							</div>

							<div class="flex flex-wrap gap-2.5">
								<button v-for="specialty in specialtyOptions" :key="specialty" type="button"
									class="rounded-full px-4 py-2 text-sm font-semibold transition" :class="draftProfile.specialties.includes(specialty)
										? 'bg-primary-700 text-white'
										: 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'" @click="toggleSpecialty(specialty)">
									{{ specialty }}
								</button>
							</div>
						</div>

						<!-- Contact -->
						<div v-else-if="activeProfileTab === 'Contact'">
							<div class="mb-6 flex items-center gap-3 border-b border-gray-100 pb-5">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
									<IconBase name="phone" class="h-5 w-5" />
								</div>
								<div>
									<div class="text-base font-bold text-gray-900">
										Contact
									</div>
									<div class="text-sm text-gray-400">
										How clients can reach your business
									</div>
								</div>
							</div>

							<div class="mb-5">
								<FormsLabel text="Email Address" />
								<FormsTextField v-model="draftProfile.email" type="email" placeholder="you@example.com"
									size="lg" />
							</div>

							<div class="mb-5">
								<FormsLabel text="Phone Number" />
								<FormsTextField v-model="draftProfile.phone" type="tel" placeholder="+63 912 345 6789"
									size="lg" />
							</div>

							<div class="mb-5">
								<FormsLabel text="Website" />
								<FormsTextField v-model="draftProfile.website" placeholder="https://yourwebsite.com"
									size="lg" />
							</div>

							<div class="mb-5">
								<FormsLabel text="Facebook" />
								<FormsTextField v-model="draftProfile.facebook" placeholder="Facebook page URL"
									size="lg" />
							</div>

							<div>
								<FormsLabel text="Instagram" />
								<FormsTextField v-model="draftProfile.instagram" placeholder="@username" size="lg" />
							</div>
						</div>

						<!-- Appearance -->
						<div v-else-if="activeProfileTab === 'Appearance'">
							<div class="mb-6 flex items-center gap-3 border-b border-gray-100 pb-5">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
									<IconBase name="settings" class="h-5 w-5" />
								</div>
								<div>
									<div class="text-base font-bold text-gray-900">
										Appearance
									</div>
									<div class="text-sm text-gray-400">
										Customize your profile banner
									</div>
								</div>
							</div>

							<p class="mb-4 text-sm font-semibold text-gray-700">
								Banner Color
							</p>

							<div class="flex flex-wrap gap-3">
								<button v-for="color in bannerColors" :key="color" type="button"
									class="flex h-11 w-11 items-center justify-center rounded-full border-2 transition"
									:class="draftProfile.bannerColor === color
										? 'border-gray-900'
										: 'border-transparent'" :style="{ backgroundColor: color }" @click="draftProfile.bannerColor = color">
									<IconBase v-if="draftProfile.bannerColor === color" name="check"
										class="h-4 w-4 text-white" />
								</button>
							</div>
						</div>
					</div>
				</div>

				<!-- Footer -->
				<div class="flex shrink-0 gap-3 border-t border-gray-200 bg-white px-6 py-4">
					<FormsButton variant="secondary" class="flex-1" @click="closeProfilePanel">
						Cancel
					</FormsButton>

					<FormsButton class="flex-1" @click="saveProfile">
						Save Profile
					</FormsButton>
				</div>
			</div>
		</Transition>
	</div>
</template>

<script setup lang="ts">

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
	return (
		profile.company ||
		profile.fullName ||
		firstName.value ||
		'Organizer'
	)
})

const sidebarInitials = computed(() => {
	return (
		initialsOf(
			profile.company ||
			profile.fullName
		) ||
		initials.value ||
		'O'
	)
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

	profile.location =
		user.value.address ?? ''

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
		user.value?.address,
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
	element: Element | null
) {
	profileTabButtonRefs[label] =
		element instanceof HTMLElement
			? element
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
