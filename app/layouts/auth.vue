<script setup lang="ts">
const route = useRoute()
const activeTab = computed(() => (route.path === '/register' ? 'register' : 'signin'))
</script>

<template>
	<div class="relative flex min-h-screen flex-col bg-gray-50 lg:flex-row">
		<!-- <div class="fixed inset-x-0 top-0 z-50 h-1 bg-gray-900" /> -->

		<div
			class="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-primary-600 to-primary-900 px-10 py-12 text-white lg:flex lg:w-1/2 lg:px-16 lg:py-14">
			<div class="pointer-events-none absolute inset-0"
				style="background-image: radial-gradient(rgba(255,255,255,0.12) 1.5px, transparent 1.5px); background-size: 22px 22px;" />

			<div class="relative z-10 flex items-center gap-3.5">
				<div class="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-xl font-bold">N</div>
				<div>
					<div class="text-xl font-bold leading-tight xl:text-2xl">NaSeRy</div>
					<div class="text-[11px] tracking-[0.12em] text-white/60">EVENT MANAGEMENT</div>
				</div>
			</div>

			<div class="relative z-10 max-w-md">
				<h1 class="mb-6 text-4xl font-extrabold leading-tight xl:text-5xl">
					Events that<br />
					<span class="text-white/55">win bids<span class="text-white">.</span></span>
				</h1>
				<p class="text-base leading-relaxed text-white/75 xl:text-lg">
					Connect clients with qualified organizers through a competitive
					bidding system built for results.
				</p>
			</div>

			<div class="relative z-10 flex flex-wrap gap-8 xl:gap-12">
				<div>
					<div class="text-2xl font-extrabold xl:text-[26px]">1,200+</div>
					<div class="mt-0.5 text-sm text-white/65">Events Hosted</div>
				</div>
				<div>
					<div class="text-2xl font-extrabold xl:text-[26px]">340+</div>
					<div class="mt-0.5 text-sm text-white/65">Organizers</div>
				</div>
				<div>
					<div class="text-2xl font-extrabold xl:text-[26px]">98%</div>
					<div class="mt-0.5 text-sm text-white/65">Satisfaction</div>
				</div>
			</div>
		</div>

		<div class="flex w-full flex-1 flex-col overflow-y-auto px-4 py-8 sm:px-8 sm:py-10 lg:w-1/2 lg:px-12 lg:py-14">
			<div class="mb-6 flex justify-center sm:mb-8 lg:justify-end">
				<div class="inline-flex rounded-full border border-gray-200 bg-white p-1">
					<NuxtLink to="/login"
						class="whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold sm:px-6"
						:class="activeTab === 'signin' ? 'bg-primary-700 text-white' : 'text-gray-700'">
						Sign In
					</NuxtLink>
					<NuxtLink to="/register"
						class="whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold sm:px-6"
						:class="activeTab === 'register' ? 'bg-primary-700 text-white' : 'text-gray-700'">
						Register
					</NuxtLink>
				</div>
			</div>

			<div class="flex flex-1 items-center justify-center">
				<div class="w-full max-w-[460px] rounded-2xl bg-white p-6 shadow-xl shadow-gray-900/10 sm:p-8 lg:p-10">
					<slot />
				</div>
			</div>
		</div>

		<button type="button"
			class="fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg">
			<svg viewBox="0 0 20 20" class="h-4 w-4">
				<path fill="currentColor"
					d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm-1-5h2v2H9v-2Zm2-1.6V12H9v-.6c0-1.4 1.3-1.7 2-2.3.6-.5 1-.9 1-1.6 0-.9-.8-1.5-2-1.5-1 0-1.7.4-2.3 1.2L6.3 6C7.1 4.8 8.4 4 10 4c2.2 0 4 1.4 4 3.5 0 1.4-.8 2.1-1.6 2.7-.6.5-1.2.8-1.4 1.2Z" />
			</svg>
		</button>
	</div>
</template>
