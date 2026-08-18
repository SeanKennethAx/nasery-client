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
								{{ roleLabel }}
							</div>
						</div>
					</button>

					<p class="mb-3 px-1.5 text-[11px] text-gray-400">
						Click profile to customise
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
						<IconBase :name="sidebarOpen ? 'x' : 'menu'" class="h-5 w-5" />
					</button>
					<div>
						<div class="text-xs text-gray-400">Client Portal</div>
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
				<slot />
			</main>
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
					<p class="text-sm text-gray-500">{{ draftProfile.clientType }} Client</p>
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
								<div class="text-xs text-gray-500">Your name and how organizers should address you</div>
							</div>
						</div>

						<FormsLabel text="Full Name" />
						<FormsTextField v-model="draftProfile.fullName" />

						<label class="mb-1.5 mt-4 block text-sm font-semibold text-gray-700">Client Type</label>
						<select v-model="draftProfile.clientType"
							class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15">
							<option v-for="type in clientTypes" :key="type" :value="type">{{ type }}</option>
						</select>

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

const navItems = [
	{
		label: 'My Events',
		to: '/client/my-events',
		icon: 'home',
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

const profileTabButtonRefs: Record<
	string,
	HTMLElement
> = {}

function setProfileTabRef(
	label: string,
	el: any
) {
	if (!el) {
		return
	}

	profileTabButtonRefs[label] =
		el instanceof HTMLElement
			? el
			: el.$el
}

watch(
	activeProfileTab,
	(label) => {
		nextTick(() => {
			profileTabButtonRefs[label]
				?.scrollIntoView({
					behavior: 'smooth',
					inline: 'nearest',
					block: 'nearest',
				})
		})
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