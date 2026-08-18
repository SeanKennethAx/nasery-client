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
						class="inline-flex items-center gap-1.5 rounded-md bg-gray-900 px-2.5 py-1 text-xs font-semibold text-white">
						<span class="h-1.5 w-1.5 rounded-full bg-white" />
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
					<div class="mb-3 flex items-center gap-3">
						<div
							class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
							SA
						</div>
						<div class="min-w-0">
							<div class="truncate text-sm font-semibold text-gray-900">NaSeRy HQ</div>
							<div class="text-xs text-gray-400">
								Super Admin
							</div>
						</div>
					</div>
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
						<div class="text-xs text-gray-400">Super Admin</div>
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
	</div>
</template>

<script setup lang="ts">
const route = useRoute()

const sidebarOpen = ref(true)

const navItems = [
	{ label: 'Overview', to: '/admin/overview', icon: 'home' },
	{ label: 'Organizers', to: '/admin/organizers', icon: 'users' },
	{ label: 'Events', to: '/admin/events', icon: 'calendar' },
	{ label: 'Analytics', to: '/admin/analytics', icon: 'chart-bar' },
	{ label: 'Activity Log', to: '/admin/activity-log', icon: 'clipboard-list' }
]

const activeItem = computed(
	() => [...navItems].reverse().find((item) => route.path.startsWith(item.to)) ?? navItems[0]
)
</script>
