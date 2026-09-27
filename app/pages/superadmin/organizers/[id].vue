<template>
	<div>
		<button type="button"
			class="mb-4 flex items-center gap-1.5 text-sm font-semibold text-gray-500 transition hover:text-gray-700"
			@click="navigateTo('/superadmin/organizers')">
			<IconBase name="arrow-left" class="h-4 w-4" />
			Back to Organizers
		</button>

		<div v-if="isLoading" class="rounded-2xl border border-gray-100 bg-white p-10 text-center text-sm text-gray-500">
			Loading organizer...
		</div>

		<div v-else-if="errorMessage" class="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
			{{ errorMessage }}
		</div>

		<template v-else-if="organizer">
			<div class="mb-6 flex flex-wrap items-start justify-between gap-4">
				<div class="flex items-center gap-4">
					<SuperadminAvatar :name="organizer.name" size="lg" />
					<div>
						<h1 class="text-2xl font-extrabold tracking-tight text-gray-950">{{ organizer.name }}</h1>
						<p class="mt-1 text-gray-500">Organizer since {{ formatDate(organizer.joined) }}</p>
					</div>
				</div>
			</div>

			<div class="mb-6 grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-5">
				<SuperadminStatCard label="Total Events" :value="organizer.events_count" icon="calendar" tone="primary" />
				<SuperadminStatCard label="Total Revenue" :value="formatCurrency(organizer.revenue)" icon="cash" tone="green"
					value-class="text-green-600" />
				<SuperadminStatCard label="Clients Served" :value="organizer.clients.length" icon="users" tone="blue" />
				<SuperadminStatCard label="Win Rate" :value="`${organizer.win_rate}%`" icon="award" tone="violet"
					:hint="`${organizer.won_bids_count}/${organizer.bids_count} bids won`" />
				<SuperadminStatCard :label="`Rating (${organizer.reviews_count})`"
					:value="organizer.rating ? organizer.rating.toFixed(1) : '—'" icon="star" tone="amber" />
			</div>

			<div class="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
				<h2 class="mb-4 text-base font-bold text-gray-900">Contact Information</h2>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
					<div class="flex items-center gap-3">
						<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
							<IconBase name="message" class="h-4 w-4" />
						</div>
						<div class="min-w-0">
							<div class="text-xs text-gray-400">Email</div>
							<div class="truncate text-sm font-semibold text-gray-900">{{ organizer.email || 'Not provided' }}</div>
						</div>
					</div>
					<div class="flex items-center gap-3">
						<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
							<IconBase name="phone" class="h-4 w-4" />
						</div>
						<div class="min-w-0">
							<div class="text-xs text-gray-400">Phone</div>
							<div class="truncate text-sm font-semibold text-gray-900">{{ organizer.phone || 'Not provided' }}</div>
						</div>
					</div>
					<div class="flex items-center gap-3">
						<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
							<IconBase name="map-pin" class="h-4 w-4" />
						</div>
						<div class="min-w-0">
							<div class="text-xs text-gray-400">Location</div>
							<div class="truncate text-sm font-semibold text-gray-900">{{ organizer.location || 'Not provided' }}</div>
						</div>
					</div>
				</div>
			</div>

			<div class="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
				<h2 class="mb-1 text-base font-bold text-gray-900">Clients</h2>
				<p class="mb-4 text-sm text-gray-500">Organizations this organizer has worked with</p>
				<div v-if="organizer.clients.length" class="flex flex-wrap gap-2">
					<span v-for="clientName in organizer.clients" :key="clientName"
						class="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700">
						{{ clientName }}
					</span>
				</div>
				<p v-else class="text-sm text-gray-400">No clients yet.</p>
			</div>

			<div class="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
				<h2 class="mb-1 text-base font-bold text-gray-900">Events</h2>
				<p class="mb-4 text-sm text-gray-500">Every event this organizer has managed</p>
				<div v-if="organizer.events.length" class="overflow-x-auto">
					<table class="w-full text-left text-sm">
						<thead>
							<tr
								class="border-b border-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-400">
								<th class="pb-3 pr-4">Event</th>
								<th class="pb-3 pr-4">Client</th>
								<th class="pb-3 pr-4">Date</th>
								<th class="pb-3 pr-4">Location</th>
								<th class="pb-3 pr-4">Tickets</th>
								<th class="pb-3 pr-4">Revenue</th>
								<th class="pb-3">Status</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-100">
							<tr v-for="event in organizer.events" :key="event.id" class="transition hover:bg-gray-50">
								<td class="py-3.5 pr-4 font-semibold text-gray-900">{{ event.name }}</td>
								<td class="py-3.5 pr-4 text-gray-500">{{ event.client }}</td>
								<td class="py-3.5 pr-4 text-gray-500">{{ formatDate(event.event_date) }}</td>
								<td class="max-w-[220px] truncate py-3.5 pr-4 text-gray-500">{{ event.location || '—' }}</td>
								<td class="py-3.5 pr-4 text-gray-700">{{ event.tickets_sold }}/{{ event.capacity || '—' }}</td>
								<td class="py-3.5 pr-4 font-semibold text-gray-900">{{ formatCurrency(event.revenue) }}</td>
								<td class="py-3.5">
									<span class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
										:class="statusClass(event.status)">
										{{ formatStatus(event.status) }}
									</span>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p v-else class="text-sm text-gray-400">No events yet.</p>
			</div>

			<div class="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
				<h2 class="mb-1 text-base font-bold text-gray-900">Quotations &amp; Bids</h2>
				<p class="mb-4 text-sm text-gray-500">Every bid this organizer has submitted, most recent first</p>
				<div v-if="organizer.quotations.length" class="overflow-x-auto">
					<table class="w-full text-left text-sm">
						<thead>
							<tr
								class="border-b border-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-400">
								<th class="pb-3 pr-4">Client</th>
								<th class="pb-3 pr-4">Event</th>
								<th class="pb-3 pr-4">Amount</th>
								<th class="pb-3 pr-4">Submitted</th>
								<th class="pb-3">Status</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-100">
							<tr v-for="quotation in organizer.quotations" :key="quotation.id" class="transition hover:bg-gray-50">
								<td class="py-3.5 pr-4 font-semibold text-gray-900">{{ quotation.client }}</td>
								<td class="py-3.5 pr-4 text-gray-500">{{ quotation.event }}</td>
								<td class="py-3.5 pr-4 font-semibold text-gray-900">{{ formatCurrency(quotation.amount) }}</td>
								<td class="py-3.5 pr-4 text-gray-500">{{ formatDate(quotation.submitted_at) }}</td>
								<td class="py-3.5">
									<span class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
										:class="quotationStatusClass(quotation.status)">
										{{ formatStatus(quotation.status) }}
									</span>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p v-else class="text-sm text-gray-400">No bids submitted yet.</p>
			</div>

			<div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
				<h2 class="mb-1 text-base font-bold text-gray-900">Reviews</h2>
				<p class="mb-4 text-sm text-gray-500">Feedback left by clients</p>
				<div v-if="organizer.reviews.length" class="space-y-3">
					<div v-for="review in organizer.reviews" :key="review.id" class="rounded-xl border border-gray-100 p-4">
						<div class="flex items-center justify-between gap-3">
							<span class="text-sm font-semibold text-gray-900">{{ review.client }}</span>
							<span class="inline-flex items-center gap-1 text-sm font-semibold text-amber-600">
								<IconBase name="star" class="h-3.5 w-3.5" />
								{{ review.rating }}
							</span>
						</div>
						<p v-if="review.review" class="mt-2 text-sm text-gray-600">{{ review.review }}</p>
					</div>
				</div>
				<p v-else class="text-sm text-gray-400">No reviews yet.</p>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import { superAdminService, type AdminOrganizerDetail } from '~/services/superAdminService'

definePageMeta({
	layout: 'superadmin',
	middleware: ['superadmin'],
})

const route = useRoute()
const { token } = useAuth('superadmin')

const organizer = ref<AdminOrganizerDetail | null>(null)
const isLoading = ref(false)
const errorMessage = ref('')

async function loadOrganizer() {
	if (!token.value) {
		return
	}

	isLoading.value = true
	errorMessage.value = ''

	try {
		const response = await superAdminService.getOrganizer(token.value, route.params.id as string)
		organizer.value = response.data
	} catch (error: unknown) {
		errorMessage.value = getApiErrorMessage(error, 'Organizer not found.')
	} finally {
		isLoading.value = false
	}
}

function getApiErrorMessage(error: unknown, fallback: string): string {
	const apiError = error as { data?: { message?: string } }
	return apiError?.data?.message || fallback
}

function formatCurrency(amount: number) {
	if (amount >= 1000000) return `₱${(amount / 1000000).toFixed(1)}M`
	if (amount >= 1000) return `₱${(amount / 1000).toFixed(0)}K`
	return `₱${amount}`
}

function formatDate(value: string | null) {
	if (!value) return 'Not scheduled'
	return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatStatus(status: string) {
	return status.charAt(0).toUpperCase() + status.slice(1)
}

function statusClass(status: string) {
	switch (status) {
		case 'completed':
			return 'bg-gray-100 text-gray-600'
		case 'published':
		case 'ongoing':
			return 'bg-primary-50 text-primary-700'
		case 'cancelled':
			return 'bg-red-50 text-red-600'
		default:
			return 'bg-amber-50 text-amber-700'
	}
}

function quotationStatusClass(status: string) {
	switch (status) {
		case 'accepted':
			return 'bg-green-50 text-green-700'
		case 'rejected':
			return 'bg-red-50 text-red-600'
		case 'withdrawn':
			return 'bg-gray-100 text-gray-500'
		default:
			return 'bg-amber-50 text-amber-700'
	}
}

onMounted(() => {
	loadOrganizer()
})
</script>
