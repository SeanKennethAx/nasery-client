<template>
	<div class="space-y-5">
		<div v-for="event in events" :key="event.name" class="rounded-2xl border border-gray-200 bg-white p-6">
			<div class="flex items-start justify-between">
				<div>
					<h3 class="text-lg font-bold text-gray-900">{{ event.name }}</h3>
					<p class="mt-1 text-sm text-gray-500">{{ event.date }} &bull; {{ event.venue }}</p>
				</div>
				<span class="shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
					:class="event.status === 'published' ? 'bg-gray-900 text-white' : 'border border-gray-200 text-gray-600'">
					{{ event.status }}
				</span>
			</div>

			<div class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
				<div>
					<div class="text-sm text-gray-500">Total Capacity</div>
					<div class="mt-1 text-2xl font-extrabold text-gray-900">{{ event.totalCapacity }}</div>
				</div>
				<div>
					<div class="text-sm text-gray-500">Tickets Sold</div>
					<div class="mt-1 text-2xl font-extrabold text-gray-900">{{ event.ticketsSold }}</div>
				</div>
				<div>
					<div class="text-sm text-gray-500">Fill Rate</div>
					<div class="mt-1 text-2xl font-extrabold text-gray-900">{{ event.fillRate }}%</div>
				</div>
			</div>

			<div class="mt-5 mb-1 flex items-center justify-between text-sm">
				<span class="font-semibold text-gray-900">Event Readiness</span>
				<span class="text-gray-500">{{ event.readiness }}%</span>
			</div>
			<div class="mb-5 h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
				<div class="h-full rounded-full bg-[#285F6b]" :style="{ width: event.readiness + '%' }" />
			</div>

			<div class="flex gap-3">
				<button type="button"
					class="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
					<IconBase name="edit" class="h-4 w-4" /> Edit
				</button>
				<button type="button"
					class="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
					View Details
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const events = [
	{
		name: 'Tech Conference 2026',
		date: 'June 15, 2026',
		venue: 'SMX Convention Center',
		status: 'published',
		totalCapacity: 1000,
		ticketsSold: 756,
		fillRate: 76,
		readiness: 85
	},
	{
		name: 'Corporate Gala Night',
		date: 'July 20, 2026',
		venue: 'Grand Ballroom Hotel',
		status: 'draft',
		totalCapacity: 500,
		ticketsSold: 0,
		fillRate: 0,
		readiness: 45
	}
]
</script>
