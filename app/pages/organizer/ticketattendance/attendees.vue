<template>
	<div class="rounded-2xl border border-gray-200 bg-white p-6">
		<div class="mb-5 flex flex-wrap items-start justify-between gap-3">
			<div>
				<h2 class="text-lg font-bold text-gray-900">Attendee Management</h2>
				<p class="mt-1 text-sm text-gray-500">View and manage registered attendees</p>
			</div>
			<div class="flex shrink-0 gap-3">
				<button type="button"
					class="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
					<IconBase name="upload" class="h-4 w-4" /> Bulk Import
				</button>
				<button type="button"
					class="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
					<IconBase name="download" class="h-4 w-4" /> Export List
				</button>
			</div>
		</div>

		<div class="relative mb-5">
			<IconBase name="search"
				class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
			<input v-model="search" type="text" placeholder="Search attendees..."
				class="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/15" />
		</div>

		<div class="overflow-x-auto">
			<table class="w-full text-left text-sm">
				<thead>
					<tr class="border-b border-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-400">
						<th class="pb-3 pr-4">Name</th>
						<th class="pb-3 pr-4">Email</th>
						<th class="pb-3 pr-4">Ticket Type</th>
						<th class="pb-3 pr-4">Ticket ID</th>
						<th class="pb-3 pr-4">Status</th>
						<th class="pb-3">Payment</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100">
					<tr v-for="a in filteredAttendees" :key="a.ticketId">
						<td class="py-3.5 pr-4 font-semibold text-gray-900">{{ a.name }}</td>
						<td class="py-3.5 pr-4 text-gray-500">{{ a.email }}</td>
						<td class="py-3.5 pr-4 text-gray-700">{{ a.ticketType }}</td>
						<td class="py-3.5 pr-4 text-gray-500">{{ a.ticketId }}</td>
						<td class="py-3.5 pr-4">
							<span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
								:class="a.status === 'checked-in' ? 'bg-gray-900 text-white' : 'border border-gray-200 text-gray-600'">
								<IconBase v-if="a.status === 'checked-in'" name="check-circle" class="h-3 w-3" />
								{{ a.status }}
							</span>
							<div v-if="a.checkedInAt" class="mt-1 text-xs text-gray-400">{{ a.checkedInAt }}</div>
						</td>
						<td class="py-3.5">
							<span class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
								:class="a.payment === 'paid' ? 'bg-gray-900 text-white' : 'border border-gray-200 text-gray-600'">
								{{ a.payment }}
							</span>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const search = ref('')

const attendees = [
	{ name: 'John Smith', email: 'john.smith@example.com', ticketType: 'VIP Front Row', ticketId: 'VIP-001-2026', status: 'checked-in', checkedInAt: '9:15 AM', payment: 'paid' },
	{ name: 'Sarah Johnson', email: 'sarah.j@example.com', ticketType: 'Main Floor', ticketId: 'MF-234-2026', status: 'checked-in', checkedInAt: '9:22 AM', payment: 'paid' },
	{ name: 'Mike Chen', email: 'mchen@example.com', ticketType: 'VIP Front Row', ticketId: 'VIP-002-2026', status: 'registered', checkedInAt: null, payment: 'paid' },
	{ name: 'Emma Wilson', email: 'emma.w@example.com', ticketType: 'Main Floor', ticketId: 'MF-235-2026', status: 'registered', checkedInAt: null, payment: 'pending' },
	{ name: 'David Lee', email: 'david.lee@example.com', ticketType: 'Balcony', ticketId: 'BAL-156-2026', status: 'checked-in', checkedInAt: '9:45 AM', payment: 'paid' }
]

const filteredAttendees = computed(() => {
	const q = search.value.trim().toLowerCase()
	if (!q) return attendees
	return attendees.filter((a) =>
		a.name.toLowerCase().includes(q) ||
		a.email.toLowerCase().includes(q) ||
		a.ticketId.toLowerCase().includes(q)
	)
})
</script>
