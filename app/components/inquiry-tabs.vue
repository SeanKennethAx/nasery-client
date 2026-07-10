<script setup lang="ts">
const route = useRoute()

const tabs = [
	{ label: 'Matching Inquiries', to: '/organizer/inquiries/matchinquiries', icon: 'star', badge: '3' },
	{ label: 'My Offers', to: '/organizer/inquiries/offers', icon: 'file-text', badge: null }
]
</script>

<template>
	<div>
		<div class="mb-6 flex items-start justify-between">
			<div>
				<h1 class="text-2xl font-extrabold text-gray-900">Inquiry &amp; Bidding</h1>
				<p class="mt-1 text-gray-500">Browse matched client inquiries and submit your competitive offers.</p>
			</div>
			<span
				class="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700">
				<IconBase name="bell" class="h-4 w-4 text-gray-500" /> 3 New Matching
			</span>
		</div>

		<div class="mb-6 inline-flex rounded-xl bg-gray-100 p-1">
			<NuxtLink v-for="tab in tabs" :key="tab.label" :to="tab.to"
				class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold"
				:class="route.path === tab.to ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'">
				<IconBase :name="tab.icon" class="h-4 w-4" />
				{{ tab.label }}
				<span v-if="tab.badge" class="rounded-full bg-brand-700 px-2 py-0.5 text-xs font-semibold text-white">{{ tab.badge }}</span>
				<span v-else-if="tab.label === 'My Offers'">(4)</span>
			</NuxtLink>
		</div>
	</div>
</template>
