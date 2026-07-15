<template>
	<div class="rounded-2xl border border-gray-200 bg-white p-6">
		<h2 class="text-lg font-bold text-gray-900">{{ event.name }}</h2>
		<p class="mb-6 text-sm text-gray-500">Event configuration and details</p>

		<div class="grid grid-cols-1 gap-x-12 gap-y-6 sm:grid-cols-2">
			<div>
				<div class="text-sm text-gray-500">Event Name</div>
				<div class="mt-1 text-base font-bold text-gray-900">{{ event.name }}</div>
			</div>
			<div>
				<div class="text-sm text-gray-500">Status</div>
				<span class="mt-1 inline-block rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">{{ event.status }}</span>
			</div>
			<div>
				<div class="text-sm text-gray-500">Event Date</div>
				<div class="mt-1 flex items-center gap-1.5 text-base font-bold text-gray-900">
					<IconBase name="calendar" class="h-4 w-4 text-gray-400" /> {{ event.eventDate }}
				</div>
			</div>
			<div>
				<div class="text-sm text-gray-500">Location</div>
				<div class="mt-1 flex items-center gap-1.5 text-base font-bold text-gray-900">
					<IconBase name="map-pin" class="h-4 w-4 text-gray-400" /> {{ event.location }}
				</div>
			</div>
			<div>
				<div class="text-sm text-gray-500">Total Capacity</div>
				<div class="mt-1 flex items-center gap-1.5 text-base font-bold text-gray-900">
					<IconBase name="users" class="h-4 w-4 text-gray-400" /> {{ event.totalCapacity }}
				</div>
			</div>
			<div>
				<div class="text-sm text-gray-500">Tickets Sold</div>
				<div class="mt-1 text-base font-bold text-gray-900">{{ event.ticketsSold }}</div>
			</div>
		</div>

		<div class="mt-6 flex gap-3">
			<button type="button"
				class="flex items-center gap-2 rounded-xl bg-[#285F6b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1f4a54]">
				<IconBase name="edit" class="h-4 w-4" /> Edit Details
			</button>
			<button type="button"
				class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
				Publish Event
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const event = {
	name: 'Tech Conference 2026',
	status: 'published',
	eventDate: 'June 15, 2026',
	location: 'Manila Convention Center',
	totalCapacity: 1000,
	ticketsSold: 756
}
</script>
