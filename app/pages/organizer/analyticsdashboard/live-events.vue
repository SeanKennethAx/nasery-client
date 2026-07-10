<template>
	<div>
		<div class="mb-5 rounded-2xl border border-gray-200 bg-white p-6">
			<h2 class="text-base font-bold text-gray-900">{{ event.name }}</h2>
			<p class="mb-6 text-sm text-gray-500">{{ event.subtitle }}</p>

			<div class="mb-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
				<div>
					<span class="text-sm text-gray-500">Checked In</span>
					<div class="mt-1 text-3xl font-extrabold text-gray-900">
						{{ checkedIn }}
					</div>
				</div>
				<div>
					<span class="text-sm text-gray-500">Registered</span>
					<div class="mt-1 text-3xl font-extrabold text-gray-900">
						{{ registered }}</div>
				</div>
				<div>
					<span class="text-sm text-gray-500">Walk-ins</span>
					<div class="mt-1 text-3xl font-extrabold text-gray-900">
						{{ walkIns }}
					</div>
				</div>
				<div>
					<span class="text-sm text-gray-500">Capacity Fill</span>
					<div class="mt-1 text-3xl font-extrabold text-gray-900">
						{{ capacityFill }}%
					</div>
				</div>
			</div>

			<div class="mb-1 flex items-center justify-between text-sm">
				<span class="font-semibold text-gray-900">Check-in Progress</span>
				<span class="text-gray-500">
					{{ checkedIn }} / {{ registered }}</span>
			</div>
			<div class="mb-6 h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
				<div class="h-full rounded-full bg-[#0ca30c]" :style="{ width: checkinProgress + '%' }" />
			</div>

			<div class="mb-1 flex items-center justify-between text-sm">
				<span class="font-semibold text-gray-900">
					Overall Capacity
				</span>
				<span class="text-gray-500">
					{{ overallUsed }} / {{ venueCapacity }}
				</span>
			</div>
			<div class="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
				<div class="h-full rounded-full bg-[#2a78d6]" :style="{ width: overallCapacityProgress + '%' }" />
			</div>
		</div>

		<div class="rounded-2xl border border-gray-200 bg-white p-6">
			<h2 class="text-base font-bold text-gray-900">
				Live Check-in Activity
			</h2>
			<p class="mb-5 text-sm text-gray-500">
				Recent attendee check-ins
			</p>
			<div class="divide-y divide-gray-100">
				<div v-for="person in checkinActivity" :key="person.name"
					class="flex items-center gap-3 py-4 first:pt-0 last:pb-0">
					<IconBase name="user" class="h-5 w-5 shrink-0 text-gray-400" />
					<div class="min-w-0 flex-1">
						<div class="text-sm font-semibold text-gray-900">
							{{ person.name }}
						</div>
						<div class="text-xs text-gray-400">
							{{ person.time }}</div>
					</div>
					<span class="shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
						:class="person.badge === 'VIP' ? 'bg-gray-900 text-white' : 'border border-gray-200 text-gray-700'">
						{{ person.badge }}
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const event = { name: 'Tech Conference 2026', subtitle: 'Real-time event analytics' }

const checkedIn = 387
const registered = 450
const walkIns = 23
const venueCapacity = 500
const overallUsed = 410

const capacityFill = Math.round((checkedIn / venueCapacity) * 1000) / 10
const checkinProgress = Math.round((checkedIn / registered) * 1000) / 10
const overallCapacityProgress = Math.round((overallUsed / venueCapacity) * 1000) / 10

const checkinActivity = [
	{ name: 'Sean Kenneth H. Axalan', time: 'Just now', badge: 'VIP' },
	{ name: 'Rylle S. Manco', time: '1 min ago', badge: 'General' },
	{ name: 'Nathan Sevilla', time: '2 mins ago', badge: 'VIP' },
	{ name: 'Marlo P. Deang', time: '3 mins ago', badge: 'General' },
	{ name: 'Anthony R. Baron', time: '5 mins ago', badge: 'Walk-in' }
]
</script>
