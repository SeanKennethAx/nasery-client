<template>
	<div v-if="organizer">
		<button type="button" class="mb-4 flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-700"
			@click="navigateTo('/admin/organizers')">
			<IconBase name="arrow-left" class="h-4 w-4" />
			Back to Organizers
		</button>

		<div class="mb-6 flex flex-wrap items-start justify-between gap-4">
			<div class="flex items-center gap-4">
				<div
					class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-700 text-lg font-bold text-white">
					{{ initialsOf(organizer.name) }}
				</div>
				<div>
					<div class="flex items-center gap-2.5">
						<h1 class="text-2xl font-extrabold text-gray-900">{{ organizer.name }}</h1>
						<span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
							:class="organizer.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-rose-50 text-rose-700'">
							{{ organizer.status }}
						</span>
					</div>
					<p class="mt-1 text-gray-500">Organizer since {{ organizer.joined }}</p>
				</div>
			</div>
		</div>

		<div class="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
			<div class="rounded-2xl border border-gray-200 bg-white p-5">
				<span class="text-sm text-gray-500">Total Events</span>
				<div class="mt-2 text-3xl font-extrabold text-gray-900">{{ organizer.events.length }}</div>
			</div>
			<div class="rounded-2xl border border-gray-200 bg-white p-5">
				<span class="text-sm text-gray-500">Total Revenue</span>
				<div class="mt-2 text-3xl font-extrabold text-gray-900">{{ formatCurrency(revenue) }}</div>
			</div>
			<div class="rounded-2xl border border-gray-200 bg-white p-5">
				<span class="text-sm text-gray-500">Clients Served</span>
				<div class="mt-2 text-3xl font-extrabold text-gray-900">{{ clients.length }}</div>
			</div>
			<div class="rounded-2xl border border-gray-200 bg-white p-5">
				<span class="text-sm text-gray-500">Rating</span>
				<div class="mt-2 flex items-center gap-1.5 text-3xl font-extrabold text-gray-900">
					{{ organizer.rating.toFixed(1) }}
					<IconBase name="star" class="h-5 w-5 text-amber-500" />
				</div>
			</div>
		</div>

		<div class="mb-6 rounded-2xl border border-gray-200 bg-white p-6">
			<h2 class="mb-4 text-base font-bold text-gray-900">Contact Information</h2>
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<div class="flex items-center gap-3">
					<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
						<IconBase name="message" class="h-4 w-4" />
					</div>
					<div class="min-w-0">
						<div class="text-xs text-gray-400">Email</div>
						<div class="truncate text-sm font-semibold text-gray-900">{{ organizer.email }}</div>
					</div>
				</div>
				<div class="flex items-center gap-3">
					<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
						<IconBase name="phone" class="h-4 w-4" />
					</div>
					<div class="min-w-0">
						<div class="text-xs text-gray-400">Phone</div>
						<div class="truncate text-sm font-semibold text-gray-900">{{ organizer.phone }}</div>
					</div>
				</div>
				<div class="flex items-center gap-3">
					<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
						<IconBase name="map-pin" class="h-4 w-4" />
					</div>
					<div class="min-w-0">
						<div class="text-xs text-gray-400">Location</div>
						<div class="truncate text-sm font-semibold text-gray-900">{{ organizer.location }}</div>
					</div>
				</div>
			</div>
		</div>

		<div class="mb-6 rounded-2xl border border-gray-200 bg-white p-6">
			<h2 class="mb-1 text-base font-bold text-gray-900">Clients</h2>
			<p class="mb-4 text-sm text-gray-500">Organizations this organizer has worked with</p>
			<div v-if="clients.length" class="flex flex-wrap gap-2">
				<span v-for="clientName in clients" :key="clientName"
					class="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700">
					{{ clientName }}
				</span>
			</div>
			<p v-else class="text-sm text-gray-400">No clients yet.</p>
		</div>

		<div class="rounded-2xl border border-gray-200 bg-white p-6">
			<h2 class="mb-1 text-base font-bold text-gray-900">Events</h2>
			<p class="mb-4 text-sm text-gray-500">Every event this organizer has managed</p>
			<div v-if="organizer.events.length" class="overflow-x-auto">
				<table class="w-full text-left text-sm">
					<thead>
						<tr class="border-b border-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-400">
							<th class="pb-3 pr-4">Event</th>
							<th class="pb-3 pr-4">Client</th>
							<th class="pb-3 pr-4">Date</th>
							<th class="pb-3 pr-4">Venue</th>
							<th class="pb-3 pr-4">Tickets</th>
							<th class="pb-3 pr-4">Revenue</th>
							<th class="pb-3">Status</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-100">
						<tr v-for="event in organizer.events" :key="event.title">
							<td class="py-3.5 pr-4 font-semibold text-gray-900">{{ event.title }}</td>
							<td class="py-3.5 pr-4 text-gray-500">{{ event.client }}</td>
							<td class="py-3.5 pr-4 text-gray-500">{{ event.date }}</td>
							<td class="py-3.5 pr-4 text-gray-500">{{ event.venue }}</td>
							<td class="py-3.5 pr-4 text-gray-700">{{ event.ticketsSold }}/{{ event.capacity }}</td>
							<td class="py-3.5 pr-4 text-gray-700">{{ formatCurrency(event.revenue) }}</td>
							<td class="py-3.5">
								<span class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
									:class="event.status === 'Completed' ? 'bg-gray-100 text-gray-600' : 'bg-primary-50 text-primary-700'">
									{{ event.status }}
								</span>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<p v-else class="text-sm text-gray-400">No events yet.</p>
		</div>
	</div>
	<div v-else class="rounded-2xl border border-gray-200 bg-white px-6 py-24 text-center">
		<p class="text-sm text-gray-500">Organizer not found.</p>
		<button type="button" class="mt-3 text-sm font-semibold text-primary-600" @click="navigateTo('/admin/organizers')">
			Back to Organizers
		</button>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const route = useRoute()
const organizers = useOrganizers()

const organizer = computed(() => organizers.value.find((o) => o.id === route.params.id))
const revenue = computed(() => (organizer.value ? organizerRevenue(organizer.value) : 0))
const clients = computed(() => (organizer.value ? organizerClients(organizer.value) : []))

function initialsOf(name) {
	return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}
</script>
