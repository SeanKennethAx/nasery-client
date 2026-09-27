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
						class="inline-flex items-center gap-1.5 rounded-md bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
						<span class="h-1.5 w-1.5 rounded-full bg-red-500" />
						Super Admin
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
						@click="signOut">
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
						<div class="text-xs text-gray-400">Super Admin Portal</div>
						<div class="text-sm font-bold text-gray-900">{{ activeItem.label }}</div>
					</div>
				</div>
				<div class="flex items-center gap-3">
					<NotificationsDropdown portal="superadmin" />

					<div ref="profileMenuRef" class="relative">
						<button type="button"
							class="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white py-1.5 pl-1.5 pr-3 transition hover:border-primary-200 hover:bg-primary-50"
							@click="toggleProfileMenu">
							<SuperadminAvatar :name="fullName || 'Super Admin'" size="sm" />
							<span class="text-sm font-semibold text-gray-700">Profile</span>
							<IconBase name="chevron-down" class="h-3.5 w-3.5 text-gray-400" />
						</button>

						<div v-if="profileMenuOpen"
							class="absolute right-0 top-12 z-[80] w-56 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
							<div class="border-b border-gray-100 px-4 py-3.5">
								<p class="truncate text-sm font-bold text-gray-900">{{ fullName || 'NaSeRy HQ' }}</p>
								<p class="text-xs text-gray-400">Super Admin</p>
							</div>
							<button type="button"
								class="flex w-full items-center gap-2.5 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
								@click="signOut">
								<IconBase name="log-out" class="h-4 w-4" />
								Sign out
							</button>
						</div>
					</div>
				</div>
			</header>

			<main class="flex-1 overflow-y-auto p-6">
				<slot />
			</main>
		</div>
	</div>
</template>

<script setup lang="ts">
const route = useRoute()

const sidebarOpen = ref(true)

const navItems = [
	{ label: 'Overview', to: '/superadmin/overview', icon: 'home', matches: ['/superadmin/overview'] },
	{ label: 'Organizers', to: '/superadmin/organizers', icon: 'briefcase', matches: ['/superadmin/organizers'] },
	{ label: 'Clients', to: '/superadmin/clients', icon: 'users', matches: ['/superadmin/clients'] },
	{ label: 'Events', to: '/superadmin/events', icon: 'calendar', matches: ['/superadmin/events'] },
	{ label: 'Analytics', to: '/superadmin/analytics', icon: 'chart-bar', matches: ['/superadmin/analytics'] },
	{ label: 'Event Tags', to: '/superadmin/event-tags', icon: 'tag', matches: ['/superadmin/event-tags'] },
	{ label: 'Activity Log', to: '/superadmin/activity-log', icon: 'clipboard-list', matches: ['/superadmin/activity-log'] },
]

const activeItem = computed(
	() => navItems.find((item) => item.matches.some((path) => route.path.startsWith(path))) ?? navItems[0]
)

const { fullName, logout } = useAuth('superadmin')

const profileMenuOpen = ref(false)
const profileMenuRef = ref<HTMLElement | null>(null)

function toggleProfileMenu() {
	profileMenuOpen.value = !profileMenuOpen.value
	if (profileMenuOpen.value) {
		window.dispatchEvent(new CustomEvent('dashboard:close-notifications'))
	}
}

function closeProfileMenuOnOutsideClick(event: MouseEvent) {
	if (profileMenuOpen.value && !profileMenuRef.value?.contains(event.target as Node)) {
		profileMenuOpen.value = false
	}
}

onMounted(() => {
	document.addEventListener('click', closeProfileMenuOnOutsideClick)
})

onBeforeUnmount(() => {
	document.removeEventListener('click', closeProfileMenuOnOutsideClick)
})

function signOut() {
	logout()
	navigateTo('/superadmin/login')
}
</script>
