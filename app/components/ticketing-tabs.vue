<template>
	<div>
		<div class="mb-6">
			<h1 class="text-2xl font-extrabold text-gray-900">Registration, Ticketing &amp; Attendance</h1>
			<p class="mt-1 text-gray-500">Manage tickets, payments, and attendee check-in</p>
		</div>

		<div class="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
			<div v-for="stat in stats" :key="stat.label" class="rounded-2xl border border-gray-200 bg-white p-5">
				<span class="text-sm text-gray-500">{{ stat.label }}</span>
				<div class="mt-2 text-3xl font-extrabold text-gray-900">{{ stat.value }}</div>
				<div class="mt-2 text-sm text-gray-500">{{ stat.description }}</div>
			</div>
		</div>

		<div class="mb-6 inline-flex flex-wrap gap-1 rounded-xl bg-gray-100 p-1">
			<NuxtLink v-for="tab in tabs" :key="tab.label" :to="tab.to"
				class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold"
				:class="route.path === tab.to ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'">
				<IconBase :name="tab.icon" class="h-4 w-4" />
				{{ tab.label }}
			</NuxtLink>
		</div>
	</div>
</template>

<script setup lang="ts">
const route = useRoute()

const stats = [
	{ label: 'Total Registered', value: 5, description: 'Online ticket purchases' },
	{ label: 'Checked In', value: 3, description: 'QR scans completed' },
	{ label: 'Walk-ins', value: 3, description: 'On-site registrations' },
	{ label: 'Capacity Status', value: '1%', description: '6/1000' }
]

const tabs = [
	{ label: 'Attendees', to: '/organizer/ticketattendance/attendees', icon: 'users' },
	{ label: 'QR Check-in', to: '/organizer/ticketattendance/qr-checkin', icon: 'qr-code' },
	{ label: 'Walk-in Counter', to: '/organizer/ticketattendance/walkin-counter', icon: 'user' },
	{ label: 'Attendance Report', to: '/organizer/ticketattendance/attendance-report', icon: 'clipboard-list' }
]
</script>
