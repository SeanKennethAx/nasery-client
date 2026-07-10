<template>
	<div>
		<h1 class="text-2xl font-extrabold text-gray-900">Organizer Analytics Dashboard</h1>
		<p class="mt-1 text-gray-500">Track your performance, bids, and event metrics</p>

		<div class="mt-6 mb-6 inline-flex rounded-xl bg-gray-100 p-1">
			<NuxtLink v-for="tab in tabs" :key="tab.label" :to="tab.to"
				class="rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-200"
				:class="route.path === tab.to ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'">
				{{ tab.label }}
			</NuxtLink>
		</div>
	</div>
</template>

<script setup lang="ts">
const route = useRoute()

const tabs = [
	{ label: 'Overview', to: '/organizer/analyticsdashboard/overview' },
	{ label: 'Bid Performance', to: '/organizer/analyticsdashboard/bid-performance' },
	{ label: 'Event Performance', to: '/organizer/analyticsdashboard/event-performance' },
	{ label: 'Live Events', to: '/organizer/analyticsdashboard/live-events' }
]
</script>