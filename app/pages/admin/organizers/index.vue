<template>
	<div>
		<div class="mb-6 flex flex-wrap items-start justify-between gap-3">
			<div>
				<h1 class="text-2xl font-extrabold text-gray-900">All Organizers</h1>
				<p class="mt-1 text-gray-500">Monitor every organizer registered on the platform.</p>
			</div>
		</div>

		<div v-if="pendingOrganizers.length" class="mb-6 rounded-2xl border border-amber-200 bg-amber-50/60 p-6">
			<div class="mb-4 flex items-center gap-2">
				<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
					<IconBase name="clock" class="h-4 w-4" />
				</div>
				<div>
					<h2 class="text-base font-bold text-gray-900">Pending Approvals</h2>
					<p class="text-sm text-gray-500">New organizer registrations awaiting review</p>
				</div>
			</div>
			<div class="space-y-3">
				<div v-for="org in pendingOrganizers" :key="org.id"
					class="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-amber-100 bg-white p-4">
					<div class="flex items-center gap-3">
						<div
							class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
							{{ initialsOf(org.name) }}
						</div>
						<div>
							<div class="text-sm font-semibold text-gray-900">{{ org.name }}</div>
							<div class="text-xs text-gray-500">{{ org.email }} &middot; Applied {{ org.joined }}</div>
						</div>
					</div>
					<div class="flex items-center gap-2">
						<button type="button"
							class="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700"
							@click="approve(org.id)">
							<IconBase name="check-circle" class="h-4 w-4" />
							Accept
						</button>
						<button type="button"
							class="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
							@click="decline(org.id)">
							<IconBase name="x-circle" class="h-4 w-4" />
							Decline
						</button>
					</div>
				</div>
			</div>
		</div>

		<div class="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
			<div class="rounded-2xl border border-gray-200 bg-white p-5">
				<span class="text-sm text-gray-500">Total Organizers</span>
				<div class="mt-2 text-3xl font-extrabold text-gray-900">{{ approvedOrganizers.length }}</div>
			</div>
			<div class="rounded-2xl border border-gray-200 bg-white p-5">
				<span class="text-sm text-gray-500">Active Organizers</span>
				<div class="mt-2 text-3xl font-extrabold text-gray-900">{{ activeCount }}</div>
			</div>
			<div class="rounded-2xl border border-gray-200 bg-white p-5">
				<span class="text-sm text-gray-500">Events Managed</span>
				<div class="mt-2 text-3xl font-extrabold text-gray-900">{{ totalEvents }}</div>
			</div>
			<div class="rounded-2xl border border-gray-200 bg-white p-5">
				<span class="text-sm text-gray-500">Platform Revenue</span>
				<div class="mt-2 text-3xl font-extrabold text-gray-900">{{ totalRevenueFormatted }}</div>
			</div>
		</div>

		<div class="rounded-2xl border border-gray-200 bg-white p-6">
			<div class="mb-5 flex flex-wrap items-center justify-between gap-3">
				<div>
					<h2 class="text-lg font-bold text-gray-900">Organizer Directory</h2>
					<p class="mt-1 text-sm text-gray-500">All organizers and their platform activity. Click a row for full
						details.</p>
				</div>
			</div>

			<div class="mb-5">
				<FormsTextField v-model="search" icon="search" placeholder="Search organizers..." />
			</div>

			<div class="overflow-x-auto">
				<table class="w-full text-left text-sm">
					<thead>
						<tr class="border-b border-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-400">
							<th class="pb-3 pr-4">Organizer</th>
							<th class="pb-3 pr-4">Email</th>
							<th class="pb-3 pr-4">Events</th>
							<th class="pb-3 pr-4">Revenue</th>
							<th class="pb-3 pr-4">Rating</th>
							<th class="pb-3 pr-4">Joined</th>
							<th class="pb-3">Status</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-100">
						<tr v-for="org in filteredOrganizers" :key="org.id" class="cursor-pointer hover:bg-gray-50"
							@click="navigateTo(`/admin/organizers/${org.id}`)">
							<td class="py-3.5 pr-4 font-semibold text-gray-900">{{ org.name }}</td>
							<td class="py-3.5 pr-4 text-gray-500">{{ org.email }}</td>
							<td class="py-3.5 pr-4 text-gray-700">{{ org.events.length }}</td>
							<td class="py-3.5 pr-4 text-gray-700">{{ formatCurrency(organizerRevenue(org)) }}</td>
							<td class="py-3.5 pr-4">
								<span class="inline-flex items-center gap-1 text-gray-700">
									<IconBase name="star" class="h-3.5 w-3.5 text-amber-500" />
									{{ org.rating.toFixed(1) }}
								</span>
							</td>
							<td class="py-3.5 pr-4 text-gray-500">{{ org.joined }}</td>
							<td class="py-3.5">
								<span class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
									:class="org.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-rose-50 text-rose-700'">
									{{ org.status }}
								</span>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const organizers = useOrganizers()
const search = ref('')

const pendingOrganizers = computed(() => organizers.value.filter((o) => o.status === 'Pending'))
const approvedOrganizers = computed(() => organizers.value.filter((o) => o.status !== 'Pending'))

const activeCount = computed(() => approvedOrganizers.value.filter((o) => o.status === 'Active').length)
const totalEvents = computed(() => approvedOrganizers.value.reduce((sum, o) => sum + o.events.length, 0))
const totalRevenue = computed(() => approvedOrganizers.value.reduce((sum, o) => sum + organizerRevenue(o), 0))
const totalRevenueFormatted = computed(() => formatCurrency(totalRevenue.value))

const filteredOrganizers = computed(() => {
	const q = search.value.trim().toLowerCase()
	const list = approvedOrganizers.value
	if (!q) return list
	return list.filter((o) => o.name.toLowerCase().includes(q) || o.email.toLowerCase().includes(q))
})

function initialsOf(name) {
	return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

function approve(id) {
	const org = organizers.value.find((o) => o.id === id)
	if (org) org.status = 'Active'
}

function decline(id) {
	organizers.value = organizers.value.filter((o) => o.id !== id)
}
</script>
