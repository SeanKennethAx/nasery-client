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

				<div class="flex items-center gap-2">
					<NotificationsDropdown />
					<button type="button" class="flex max-w-52 items-center gap-2 rounded-xl border border-gray-200 bg-white p-1.5 pr-3 text-left transition hover:border-primary-200 hover:bg-primary-50" @click="openProfilePanel">
						<span class="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary-700 text-xs font-bold text-white">
							<img v-if="user?.avatar_url" :src="user.avatar_url" alt="" class="h-full w-full object-cover" /><span v-else>{{ sidebarInitials }}</span>
						</span>
						<span class="hidden min-w-0 sm:block"><span class="block truncate text-xs font-bold text-gray-900">{{ sidebarName }}</span><span class="block text-[10px] text-gray-400">Edit profile</span></span>
					</button>
				</div>
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
			<div v-if="showProfilePanel" class="fixed inset-0 z-[90] bg-gray-900/40" @click="closeProfilePanel" />
		</Transition>

		<!-- Organizer profile customization panel -->
		<Transition name="slide">
			<div v-if="showProfilePanel"
				class="fixed inset-y-0 right-0 z-[100] flex w-full max-w-xl flex-col overflow-hidden bg-white shadow-2xl">
				<div class="flex min-h-0 flex-1 flex-col overflow-hidden">
					<!-- Banner -->
					<div class="relative shrink-0 pb-10">
						<div class="h-24" :style="{ backgroundColor: draftProfile.bannerColor }"><img v-if="user?.cover_url" :src="user.cover_url" alt="" class="h-full w-full object-cover" /></div>

						<button type="button"
							class="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-white transition hover:bg-black/30"
							@click="closeProfilePanel">
							<IconBase name="x" class="h-5 w-5" />
						</button>

						<div class="absolute -bottom-1 left-6 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-primary-700 text-lg font-bold text-white shadow-md">
							<img v-if="user?.avatar_url" :src="user.avatar_url" alt="" class="h-full w-full object-cover" />
							<span v-else>{{ panelInitials || 'O' }}</span>
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

					<!-- Loading state while fetching profile -->
					<div v-if="isProfileLoading" class="px-6 pb-4">
						<p class="text-sm text-gray-400">Loading profile...</p>
					</div>

					<!-- Save error -->
					<div v-if="profileSaveError"
						class="mx-6 mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
						{{ profileSaveError }}
					</div>

					<!-- Tabs -->
					<div class="grid shrink-0 grid-cols-3 gap-1 border-y border-gray-200 bg-gray-50/70 px-4 py-2">
						<button v-for="tab in profileTabs" :key="tab.label"
							:ref="(el) => setProfileTabRef(tab.label, el as Element | null)" type="button"
							class="flex min-w-0 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold transition sm:text-sm"
							:class="activeProfileTab === tab.label
								? 'bg-white text-primary-700 shadow-sm ring-1 ring-gray-200'
								: 'text-gray-400 hover:bg-white/70 hover:text-gray-600'
								" @click="activeProfileTab = tab.label">
							<IconBase :name="tab.icon" class="h-4 w-4 shrink-0" />

							<span class="truncate">{{ tab.label }}</span>
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
								<FormsSelect v-model="draftProfile.yearsExperience" :options="experienceRanges" placeholder="Select range" :can-clear="false" />
							</div>

							<div>
								<FormsLabel text="Location / Service Area" />

								<div class="relative">
									<FormsTextField v-model="draftProfile.location"
										placeholder="Search your service location" size="lg" autocomplete="off">
										<template #icon>
											<IconBase name="map-pin"
												class="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-primary-600" />
										</template>
									</FormsTextField>

									<div v-if="isSearchingLocation"
										class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
										Searching...
									</div>

									<div v-if="showLocationSuggestions"
										class="absolute z-[70] mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white py-1 shadow-xl">
										<button v-for="place in locationSuggestions" :key="String(place.place_id)"
											type="button"
											class="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-gray-50"
											@click="selectProfileLocation(place)">
											<IconBase name="map-pin" class="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />

											<span class="min-w-0">
												<span class="block text-sm font-semibold text-gray-800">
													{{ place.display_place || place.display_name }}
												</span>
												<span class="mt-0.5 block text-xs leading-relaxed text-gray-500">
													{{ place.display_name }}
												</span>
											</span>
										</button>
									</div>
								</div>

								<p v-if="locationSearchError" class="mt-2 text-xs text-red-600">
									{{ locationSearchError }}
								</p>

								<p v-else-if="draftProfile.latitude !== null && draftProfile.longitude !== null"
									class="mt-2 text-xs font-medium text-green-600">
									Location selected and coordinates are ready to save.
								</p>
							</div>

							<div class="mt-5">
								<FormsLabel text="Service Radius" />

								<div class="relative">
									<input v-model.number="draftProfile.serviceRadiusKm" type="number" min="1" max="200"
										class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 pr-14 text-sm text-gray-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15" />

									<span
										class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
										km
									</span>
								</div>

								<p class="mt-2 text-xs text-gray-400">
									Clients within this distance from your selected location can find you.
								</p>
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
							<ProfileMediaEditor class="mb-6" />
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
					<FormsButton variant="secondary" class="flex-1" :disabled="isSavingProfile"
						@click="closeProfilePanel">
						Cancel
					</FormsButton>

					<FormsButton class="flex-1" :disabled="isSavingProfile" @click="saveProfile">
						{{ isSavingProfile ? 'Saving...' : 'Save Profile' }}
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
	logout,
	token,
} = useAuth()

const config = useRuntimeConfig()

const locationIqApiKey = computed(() =>
	String(config.public.locationIqApiKey || '')
)

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
	'Corporate',
	'Birthday',
	'Debut',
	'Concert',
	'Conference',
	'Reunion',
	'Seminar',
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
		locationIqPlaceId: '',
		latitude: null as number | null,
		longitude: null as number | null,
		serviceRadiusKm: 25,
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

const isProfileLoading = ref(false)
const isSavingProfile = ref(false)
const profileSaveError = ref('')

interface LocationIqPlace {
	place_id: string | number
	display_name: string
	display_place?: string
	lat: string
	lon: string
}

const locationSuggestions = ref<LocationIqPlace[]>([])
const isSearchingLocation = ref(false)
const locationSearchError = ref('')
const selectedProfileLocation = ref('')
let locationSearchTimer: ReturnType<typeof setTimeout> | null = null
let locationSearchRequestId = 0

const showLocationSuggestions = computed(() =>
	locationSuggestions.value.length > 0 &&
	draftProfile.location.trim() !== selectedProfileLocation.value
)

interface OrganizerProfileData {
	id: number
	user_id: number
	company_name: string | null
	years_experience: string | null
	location: string | null
	google_place_id: string | null
	latitude: number | string | null
	longitude: number | string | null
	service_radius_km: number | string | null
	bio: string | null
	tags: string[] | null
	specialties: string[] | null
	website: string | null
	facebook: string | null
	instagram: string | null
	banner_color: string | null
}

interface OrganizerProfileResponse {
	data: OrganizerProfileData
}

function syncProfileFromUser() {
	if (!user.value) {
		return
	}

	profile.fullName = fullName.value

	profile.email =
		user.value.email ?? ''

	profile.phone =
		user.value.phone ?? ''

	if (!profile.location) {
		profile.location =
			user.value.address ?? ''
	}

	syncDraftProfile()
}

async function loadOrganizerProfile() {
	if (!token.value) {
		return
	}

	isProfileLoading.value = true

	try {
		const response =
			await $fetch<OrganizerProfileResponse>(
				`${config.public.apiBaseURL}/organizer/profile`,
				{
					method: 'GET',
					headers: {
						Accept: 'application/json',
						Authorization: `Bearer ${token.value}`,
					},
				},
			)

		const data = response.data

		profile.company =
			data.company_name ?? ''

		profile.yearsExperience =
			data.years_experience ?? ''

		if (data.location) {
			profile.location = data.location
		}

		profile.locationIqPlaceId =
			data.google_place_id ?? ''

		profile.latitude =
			data.latitude !== null
				? Number(data.latitude)
				: null

		profile.longitude =
			data.longitude !== null
				? Number(data.longitude)
				: null

		profile.serviceRadiusKm =
			data.service_radius_km !== null
				? Number(data.service_radius_km)
				: 25

		selectedProfileLocation.value =
			profile.location

		profile.bio = data.bio ?? ''

		profile.tags = Array.isArray(data.tags)
			? [...data.tags]
			: []

		profile.specialties = Array.isArray(
			data.specialties,
		)
			? [...data.specialties]
			: []

		profile.website = data.website ?? ''
		profile.facebook = data.facebook ?? ''
		profile.instagram =
			data.instagram ?? ''

		profile.bannerColor =
			data.banner_color ||
			profile.bannerColor

		syncDraftProfile()
	} catch (error) {
		console.error(
			'Failed to load organizer profile:',
			error,
		)
	} finally {
		isProfileLoading.value = false
	}
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
	() => draftProfile.location,
	(value) => {
		if (value === selectedProfileLocation.value) {
			return
		}

		draftProfile.locationIqPlaceId = ''
		draftProfile.latitude = null
		draftProfile.longitude = null
		locationSearchError.value = ''

		if (locationSearchTimer) {
			clearTimeout(locationSearchTimer)
		}

		const query = value.trim()

		if (query.length < 3) {
			locationSuggestions.value = []
			return
		}

		locationSearchTimer = setTimeout(() => {
			searchProfileLocation(query)
		}, 400)
	}
)

async function searchProfileLocation(query: string) {
	if (!locationIqApiKey.value) {
		locationSearchError.value =
			'LocationIQ API key is not configured.'
		return
	}

	const requestId = ++locationSearchRequestId
	isSearchingLocation.value = true
	locationSearchError.value = ''

	try {
		const results = await $fetch<LocationIqPlace[]>(
			'https://api.locationiq.com/v1/autocomplete',
			{
				query: {
					key: locationIqApiKey.value,
					q: query,
					limit: 6,
					countrycodes: 'ph',
					normalizecity: 1,
				},
			}
		)

		if (requestId !== locationSearchRequestId) {
			return
		}

		locationSuggestions.value = Array.isArray(results)
			? results
			: []
	} catch (error) {
		console.error('LocationIQ profile search failed:', error)

		if (requestId === locationSearchRequestId) {
			locationSuggestions.value = []
			locationSearchError.value =
				'Unable to search locations. Please try again.'
		}
	} finally {
		if (requestId === locationSearchRequestId) {
			isSearchingLocation.value = false
		}
	}
}

function selectProfileLocation(place: LocationIqPlace) {
	const latitude = Number(place.lat)
	const longitude = Number(place.lon)

	if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
		locationSearchError.value =
			'The selected location does not contain valid coordinates.'
		return
	}

	selectedProfileLocation.value = place.display_name
	draftProfile.location = place.display_name
	draftProfile.locationIqPlaceId = String(place.place_id || '')
	draftProfile.latitude = latitude
	draftProfile.longitude = longitude
	locationSuggestions.value = []
	locationSearchError.value = ''
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

onMounted(() => {
	loadOrganizerProfile()
})

onBeforeUnmount(() => {
	if (locationSearchTimer) {
		clearTimeout(locationSearchTimer)
	}
})

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

async function openProfilePanel() {
	window.dispatchEvent(new CustomEvent('dashboard:close-notifications'))

	profileSaveError.value = ''

	syncDraftProfile()
	selectedProfileLocation.value =
		draftProfile.location
	locationSuggestions.value = []
	locationSearchError.value = ''

	activeProfileTab.value =
		'Identity'

	showProfilePanel.value = true

	await loadOrganizerProfile()
}

function closeProfilePanel() {
	if (isSavingProfile.value) {
		return
	}

	showProfilePanel.value = false
	profileSaveError.value = ''
}

async function saveProfile() {
	if (!token.value) {
		profileSaveError.value =
			'Your session has expired. Please log in again.'

		return
	}

	profileSaveError.value = ''

	if (draftProfile.location.trim()) {
		if (
			draftProfile.latitude === null ||
			draftProfile.longitude === null
		) {
			profileSaveError.value =
				'Please select your location from the LocationIQ suggestions.'
			activeProfileTab.value = 'Identity'
			return
		}
	}

	if (
		!Number.isFinite(Number(draftProfile.serviceRadiusKm)) ||
		Number(draftProfile.serviceRadiusKm) < 1 ||
		Number(draftProfile.serviceRadiusKm) > 200
	) {
		profileSaveError.value =
			'Service radius must be between 1 and 200 km.'
		activeProfileTab.value = 'Identity'
		return
	}

	isSavingProfile.value = true

	try {
		await $fetch<OrganizerProfileResponse>(
			`${config.public.apiBaseURL}/organizer/profile`,
			{
				method: 'PUT',
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${token.value}`,
				},
				body: {
					company_name:
						draftProfile.company || null,

					years_experience:
						draftProfile.yearsExperience ||
						null,

					location:
						draftProfile.location || null,

					google_place_id:
						draftProfile.locationIqPlaceId || null,

					latitude:
						draftProfile.latitude,

					longitude:
						draftProfile.longitude,

					service_radius_km:
						Number(draftProfile.serviceRadiusKm),

					bio: draftProfile.bio || null,

					tags: draftProfile.tags,

					specialties:
						draftProfile.specialties,

					website:
						draftProfile.website || null,

					facebook:
						draftProfile.facebook || null,

					instagram:
						draftProfile.instagram || null,

					banner_color:
						draftProfile.bannerColor ||
						null,
				},
			},
		)

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

		selectedProfileLocation.value =
			draftProfile.location

		showProfilePanel.value = false
	} catch (error: unknown) {
		console.error(
			'Failed to save organizer profile:',
			error,
		)

		if (
			typeof error === 'object' &&
			error !== null
		) {
			const apiError =
				error as {
					data?: {
						message?: string
						errors?: Record<string, string[]>
					}
				}

			const validationErrors =
				apiError.data?.errors

			if (validationErrors) {
				const firstError =
					Object.values(
						validationErrors,
					)[0]?.[0]

				if (firstError) {
					profileSaveError.value =
						firstError

					return
				}
			}

			if (apiError.data?.message) {
				profileSaveError.value =
					apiError.data.message

				return
			}
		}

		profileSaveError.value =
			'Unable to save your profile. Please try again.'
	} finally {
		isSavingProfile.value = false
	}
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
