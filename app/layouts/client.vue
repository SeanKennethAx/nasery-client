<template>
	<div class="flex h-screen overflow-hidden bg-gray-50">
		<!-- <div class="fixed inset-x-0 top-0 z-50 h-1 bg-gray-900" /> -->

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
						Client Portal
					</span>
				</div>

				<nav class="flex-1 space-y-1 px-3">
					<NuxtLink v-for="item in navItems" :key="item.label" :to="item.to"
						class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold"
						:class="activeItem.label === item.label ? 'bg-primary-700 text-white' : 'text-gray-600 hover:bg-gray-100'">
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
						<IconBase :name="sidebarOpen ? 'x' : 'menu'" class="h-5 w-5" />
					</button>
					<div>
						<div class="text-xs text-gray-400">Client Portal</div>
						<div class="text-sm font-bold text-gray-900">{{ activeItem.label }}</div>
					</div>
				</div>
				<div class="flex items-center gap-2">
					<NotificationsDropdown portal="client" />
					<button type="button" class="flex max-w-52 items-center gap-2 rounded-xl border border-gray-200 bg-white p-1.5 pr-3 text-left transition hover:border-primary-200 hover:bg-primary-50" @click="openProfilePanel">
						<span class="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary-700 text-xs font-bold text-white">
							<img v-if="user?.avatar_url" :src="user.avatar_url" alt="" class="h-full w-full object-cover" /><span v-else>{{ sidebarInitials }}</span>
						</span>
						<span class="hidden min-w-0 sm:block"><span class="block truncate text-xs font-bold text-gray-900">{{ sidebarName }}</span><span class="block text-[10px] text-gray-400">Edit profile</span></span>
					</button>
				</div>
			</header>

			<main class="flex-1 overflow-y-auto p-6">
				<slot />
			</main>
		</div>

		<Transition name="fade">
			<div v-if="showProfilePanel" class="fixed inset-0 z-40 bg-gray-900/40" @click="closeProfilePanel" />
		</Transition>

		<Transition name="slide">
			<div v-if="showProfilePanel"
				class="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col overflow-hidden bg-white shadow-2xl"
				role="dialog" aria-modal="true" aria-labelledby="client-profile-title">
				<div class="relative shrink-0 pb-11">
					<div class="h-28 bg-gradient-to-br from-primary-700 to-primary-900" :style="{ backgroundColor: draftProfile.bannerColor }"><img v-if="user?.cover_url" :src="user.cover_url" alt="" class="h-full w-full object-cover" /></div>
					<div aria-hidden="true" class="absolute right-20 top-5 h-20 w-20 rounded-full border border-white/10" />
					<button type="button" aria-label="Close profile" class="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-gray-900/20 text-white backdrop-blur-sm transition hover:bg-gray-900/35"
						@click="closeProfilePanel">
						<IconBase name="x" class="h-5 w-5" />
					</button>
					<div class="absolute -bottom-1 left-6 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-primary-50 text-xl font-extrabold text-primary-700 shadow-md">
						<img v-if="user?.avatar_url" :src="user.avatar_url" alt="" class="h-full w-full object-cover" />
						<span v-else>{{ panelInitials }}</span>
					</div>
				</div>

				<div class="shrink-0 px-6 pb-5">
					<p class="mb-1 text-[10px] font-extrabold uppercase tracking-[.18em] text-primary-700">Client profile</p>
					<h2 id="client-profile-title" class="truncate text-xl font-extrabold text-gray-900">{{ draftProfile.fullName }}</h2>
					<p class="mt-0.5 text-sm text-gray-500">Manage what organizers see about you.</p>
				</div>

				<div class="flex shrink-0 scroll-px-6 scroll-smooth gap-2 overflow-x-auto overscroll-x-contain border-y border-gray-100 bg-gray-50/80 px-6 py-3">
					<button v-for="tab in profileTabs" :key="tab.label"
						type="button" class="flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold transition"
						:class="activeProfileTab === tab.label ? 'border-primary-200 bg-white text-primary-700 shadow-sm' : 'border-transparent text-gray-400 hover:bg-white hover:text-gray-600'"
						@click="activeProfileTab = tab.label">
						<IconBase :name="tab.icon" class="h-4 w-4" />
						{{ tab.label }}
					</button>
				</div>

				<div class="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white px-6 py-6">
					<div v-if="activeProfileTab === 'Identity'">
						<div class="mb-5 flex items-center gap-3">
							<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
								<IconBase name="user" class="h-4 w-4" />
							</div>
							<div>
								<div class="text-sm font-bold text-gray-900">Identity</div>
								<div class="text-xs text-gray-500">Your name and how organizers should address you</div>
							</div>
						</div>

						<FormsLabel text="Full Name" />
						<FormsTextField v-model="draftProfile.fullName" />

						<label class="mb-1.5 mt-4 block text-sm font-semibold text-gray-700">Client Type</label>
						<FormsSelect v-model="draftProfile.clientType" :options="clientTypes" :can-clear="false" />

						<div class="mt-4">
							<FormsLabel text="Location / City" />
							<FormsTextField v-model="draftProfile.location" icon="map-pin"
								placeholder="e.g. Quezon City" />
						</div>
					</div>

					<div v-else-if="activeProfileTab === 'About'">
						<div class="mb-5 flex items-center gap-3">
							<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
								<IconBase name="file-text" class="h-4 w-4" />
							</div>
							<div>
								<div class="text-sm font-bold text-gray-900">About</div>
								<div class="text-xs text-gray-500">Share a bit about your event vision</div>
							</div>
						</div>
						<label class="mb-1.5 block text-sm font-semibold text-gray-700">Bio / Description</label>
						<textarea v-model="draftProfile.bio" rows="7"
							placeholder="Tell organizers about your event vision, priorities, and what matters most to you..."
							class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15" />
					</div>

					<div v-else-if="activeProfileTab === 'Event Preferences'">
						<div class="mb-5 flex items-center gap-3">
							<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
								<IconBase name="tag" class="h-4 w-4" />
							</div>
							<div>
								<div class="text-sm font-bold text-gray-900">Event Preferences</div>
								<div class="text-xs text-gray-500">Types of events you usually need help with</div>
							</div>
						</div>
						<div class="flex flex-wrap gap-2">
							<button v-for="type in eventPreferenceOptions" :key="type" type="button"
								class="rounded-full px-3.5 py-1.5 text-sm font-semibold"
								:class="draftProfile.eventPreferences.includes(type) ? 'bg-primary-700 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'"
								@click="toggleEventPreference(type)">
								{{ type }}
							</button>
						</div>
					</div>

					<div v-else-if="activeProfileTab === 'Planning Style'">
						<div class="mb-5 flex items-center gap-3">
							<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
								<IconBase name="sparkles" class="h-4 w-4" />
							</div>
							<div>
								<div class="text-sm font-bold text-gray-900">Planning Style</div>
								<div class="text-xs text-gray-500">How involved you'd like organizers to be</div>
							</div>
						</div>
						<div class="flex flex-wrap gap-2">
							<button v-for="style in planningStyleOptions" :key="style" type="button"
								class="rounded-full px-3.5 py-1.5 text-sm font-semibold"
								:class="draftProfile.planningStyle.includes(style) ? 'bg-primary-700 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'"
								@click="togglePlanningStyle(style)">
								{{ style }}
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
								<div class="text-xs text-gray-500">How organizers can reach you</div>
							</div>
						</div>

						<FormsLabel text="Email Address" />
						<FormsTextField v-model="draftProfile.email" type="email" />

						<div class="mt-4">
							<FormsLabel text="Phone Number" />
							<FormsTextField v-model="draftProfile.phone" />
						</div>

						<div
							class="mb-2 mt-6 flex items-center gap-2 text-xs font-semibold tracking-wide text-gray-400">
							<IconBase name="user" class="h-3.5 w-3.5" /> ALTERNATE CONTACT
						</div>
						<p class="mb-3 text-xs text-gray-400">Optional — for day-of coordination if you're unreachable
						</p>

						<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
							<div>
								<FormsLabel text="Name" />
								<FormsTextField v-model="draftProfile.altContactName" placeholder="e.g. Maria Santos" />
							</div>
							<div>
								<FormsLabel text="Phone" />
								<FormsTextField v-model="draftProfile.altContactPhone"
									placeholder="e.g. 0917 123 4567" />
							</div>
						</div>
					</div>

					<div v-else-if="activeProfileTab === 'Appearance'">
						<ProfileMediaEditor class="mb-6" />
						<div class="mb-5 flex items-center gap-3">
							<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
								<IconBase name="settings" class="h-4 w-4" />
							</div>
							<div>
								<div class="text-sm font-bold text-gray-900">Appearance</div>
								<div class="text-xs text-gray-500">Customize your profile banner color</div>
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

				<div class="flex shrink-0 gap-3 border-t border-gray-200 bg-white px-6 py-4 shadow-[0_-8px_24px_rgba(15,23,42,0.04)]">
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
	logout,
} = useAuth()

const sidebarOpen = ref(true)

const navItems = [
	{
		label: 'My Events',
		to: '/client/my-events',
		icon: 'home',
	},
	{
		label: 'Post Event Inquiry',
		to: '/client/post-event',
		icon: 'send',
	},
	{
		label: 'Event Details',
		to: '/client/event-details',
		icon: 'calendar',
	},
	{
		label: 'Preparation Tracking',
		to: '/client/preparation-tracking',
		icon: 'clipboard-list',
	},
	{
		label: 'Activity Timeline',
		to: '/client/activity-timeline',
		icon: 'activity',
	},
	{
		label: 'Event Marketplace',
		to: '/marketplace',
		icon: 'calendar',
	},
	{
		label: 'Browse Organizers',
		to: '/organizers',
		icon: 'users',
	},
]

const activeItem = computed(() => {
	return (
		navItems.find(
			(item) => item.to === route.path
		) ?? navItems[0]
	)
})

/**
 * Sidebar name.
 *
 * Example:
 * firstname = "Nina"
 *
 * Sidebar:
 * Nina
 */
const sidebarName = computed(() => {
	return (
		firstName.value ||
		profile.fullName ||
		'User'
	)
})

const sidebarInitials = computed(() => {
	return (
		initials.value ||
		initialsOf(profile.fullName) ||
		'U'
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
		label: 'Event Preferences',
		icon: 'tag',
	},
	{
		label: 'Planning Style',
		icon: 'sparkles',
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

const clientTypes = [
	'Individual',
	'Couple',
	'Family',
	'Corporate',
]

const eventPreferenceOptions = [
	'Wedding',
	'Corporate',
	'Birthday',
	'Debut',
	'Concert',
	'Conference',
	'Reunion',
	'Seminar',
]

const planningStyleOptions = [
	'Full Coordination',
	'Partial Planning',
	'Day-of Coordination',
	'Vendor Referrals Only',
	'Budget-Conscious',
	'Premium / Luxury',
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
		clientType: clientTypes[0],
		location: '',
		bio: '',
		eventPreferences: ['Wedding'],
		planningStyle: [
			'Full Coordination',
		],
		email: '',
		phone: '',
		altContactName: '',
		altContactPhone: '',
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

/**
 * Populate profile information from
 * the actual authenticated user.
 */
function syncProfileFromUser() {
	if (!user.value) {
		return
	}

	profile.fullName =
		fullName.value

	profile.email =
		user.value.email ?? ''

	profile.phone =
		user.value.phone ?? ''

	Object.assign(
		draftProfile,
		profile
	)

	draftProfile.eventPreferences = [
		...profile.eventPreferences,
	]

	draftProfile.planningStyle = [
		...profile.planningStyle,
	]
}

/**
 * Run when the authenticated
 * user becomes available.
 */
watch(
	() => user.value?.id,
	() => {
		syncProfileFromUser()
	},
	{
		immediate: true,
	}
)

function initialsOf(
	name: string
): string {
	return (name || '')
		.trim()
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((word) => word[0])
		.join('')
		.toUpperCase()
}

/**
 * Profile-panel initials.
 *
 * These can change when the user edits
 * their profile name.
 */
const panelInitials = computed(() => {
	return initialsOf(
		draftProfile.fullName
	)
})

function openProfilePanel() {
	Object.assign(
		draftProfile,
		profile
	)

	draftProfile.eventPreferences = [
		...profile.eventPreferences,
	]

	draftProfile.planningStyle = [
		...profile.planningStyle,
	]

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

	profile.eventPreferences = [
		...draftProfile.eventPreferences,
	]

	profile.planningStyle = [
		...draftProfile.planningStyle,
	]

	closeProfilePanel()
}

function toggleEventPreference(
	type: string
) {
	const index =
		draftProfile.eventPreferences
			.indexOf(type)

	if (index === -1) {
		draftProfile.eventPreferences
			.push(type)

		return
	}

	draftProfile.eventPreferences
		.splice(index, 1)
}

function togglePlanningStyle(
	style: string
) {
	const index =
		draftProfile.planningStyle
			.indexOf(style)

	if (index === -1) {
		draftProfile.planningStyle
			.push(style)

		return
	}

	draftProfile.planningStyle
		.splice(index, 1)
}

async function handleLogout() {
	logout()

	await navigateTo('/login')
}
</script>
