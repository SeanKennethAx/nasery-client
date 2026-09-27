<template>
	<div>
		<button type="button"
			class="mb-4 flex items-center gap-1.5 text-sm font-semibold text-gray-500 transition hover:text-gray-700"
			@click="navigateTo('/superadmin/clients')">
			<IconBase name="arrow-left" class="h-4 w-4" />
			Back to Clients
		</button>

		<div v-if="isLoading" class="rounded-2xl border border-gray-100 bg-white p-10 text-center text-sm text-gray-500">
			Loading client...
		</div>

		<div v-else-if="errorMessage" class="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
			{{ errorMessage }}
		</div>

		<template v-else-if="client">
			<div class="mb-6 flex flex-wrap items-start justify-between gap-4">
				<div class="flex items-center gap-4">
					<SuperadminAvatar :name="client.name" tone="blue" size="lg" />
					<div>
						<h1 class="text-2xl font-extrabold tracking-tight text-gray-950">{{ client.name }}</h1>
						<p class="mt-1 text-gray-500">Client since {{ formatDate(client.joined) }}</p>
					</div>
				</div>
			</div>

			<div class="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
				<SuperadminStatCard label="Inquiries Posted" :value="client.inquiries_count" icon="file-text" tone="violet" />
				<SuperadminStatCard label="Confirmed Events" :value="client.events_count" icon="calendar" tone="primary" />
				<SuperadminStatCard label="Total Spend" :value="formatCurrency(client.total_spend)" icon="cash" tone="green"
					value-class="text-green-600" />
				<SuperadminStatCard label="Reviews Left" :value="client.reviews.length" icon="star" tone="amber" />
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
							<div class="truncate text-sm font-semibold text-gray-900">{{ client.email || 'Not provided' }}</div>
						</div>
					</div>
					<div class="flex items-center gap-3">
						<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
							<IconBase name="phone" class="h-4 w-4" />
						</div>
						<div class="min-w-0">
							<div class="text-xs text-gray-400">Phone</div>
							<div class="truncate text-sm font-semibold text-gray-900">{{ client.phone || 'Not provided' }}</div>
						</div>
					</div>
					<div class="flex items-center gap-3">
						<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
							<IconBase name="map-pin" class="h-4 w-4" />
						</div>
						<div class="min-w-0">
							<div class="text-xs text-gray-400">Address</div>
							<div class="truncate text-sm font-semibold text-gray-900">{{ client.address || 'Not provided' }}</div>
						</div>
					</div>
				</div>
			</div>

			<div class="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
				<h2 class="mb-1 text-base font-bold text-gray-900">Inquiries</h2>
				<p class="mb-4 text-sm text-gray-500">Every event inquiry this client has posted</p>
				<div v-if="client.inquiries.length" class="overflow-x-auto">
					<table class="w-full text-left text-sm">
						<thead>
							<tr
								class="border-b border-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-400">
								<th class="pb-3 pr-4">Event</th>
								<th class="pb-3 pr-4">Type</th>
								<th class="pb-3 pr-4">Date</th>
								<th class="pb-3 pr-4">Budget</th>
								<th class="pb-3 pr-4">Offers</th>
								<th class="pb-3">Status</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-100">
							<tr v-for="inquiry in client.inquiries" :key="inquiry.id">
								<td class="py-3.5 pr-4 font-semibold text-gray-900">{{ inquiry.event_title || `${inquiry.event_type} Inquiry` }}</td>
								<td class="py-3.5 pr-4 text-gray-500">{{ inquiry.event_type }}</td>
								<td class="py-3.5 pr-4 text-gray-500">{{ formatDate(inquiry.event_date) }}</td>
								<td class="py-3.5 pr-4 text-gray-500">{{ inquiry.budget_range || '—' }}</td>
								<td class="py-3.5 pr-4 text-gray-700">{{ inquiry.quotations_count }}</td>
								<td class="py-3.5">
									<span class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
										:class="inquiryStatusClass(inquiry.status)">
										{{ formatStatus(inquiry.status) }}
									</span>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p v-else class="text-sm text-gray-400">No inquiries yet.</p>
			</div>

			<div class="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
				<h2 class="mb-1 text-base font-bold text-gray-900">Events</h2>
				<p class="mb-4 text-sm text-gray-500">Confirmed events this client has booked</p>
				<div v-if="client.events.length" class="overflow-x-auto">
					<table class="w-full text-left text-sm">
						<thead>
							<tr
								class="border-b border-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-400">
								<th class="pb-3 pr-4">Event</th>
								<th class="pb-3 pr-4">Organizer</th>
								<th class="pb-3 pr-4">Date</th>
								<th class="pb-3 pr-4">Amount</th>
								<th class="pb-3">Status</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-100">
							<tr v-for="event in client.events" :key="event.id">
								<td class="py-3.5 pr-4 font-semibold text-gray-900">{{ event.name }}</td>
								<td class="py-3.5 pr-4 text-gray-500">{{ event.organizer }}</td>
								<td class="py-3.5 pr-4 text-gray-500">{{ formatDate(event.event_date) }}</td>
								<td class="py-3.5 pr-4 text-gray-700">{{ formatCurrency(event.amount) }}</td>
								<td class="py-3.5">
									<span class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
										:class="eventStatusClass(event.status)">
										{{ formatStatus(event.status) }}
									</span>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p v-else class="text-sm text-gray-400">No confirmed events yet.</p>
			</div>

			<div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
				<h2 class="mb-1 text-base font-bold text-gray-900">Reviews Left</h2>
				<p class="mb-4 text-sm text-gray-500">Feedback this client has given organizers</p>
				<div v-if="client.reviews.length" class="space-y-3">
					<div v-for="review in client.reviews" :key="review.id" class="rounded-xl border border-gray-100 p-4">
						<div class="flex items-center justify-between gap-3">
							<span class="text-sm font-semibold text-gray-900">{{ review.organizer }}</span>
							<span class="inline-flex items-center gap-1 text-sm font-semibold text-amber-600">
								<IconBase name="star" class="h-3.5 w-3.5" />
								{{ review.rating }}
							</span>
						</div>
						<p v-if="review.review" class="mt-2 text-sm text-gray-600">{{ review.review }}</p>
					</div>
				</div>
				<p v-else class="text-sm text-gray-400">No reviews left yet.</p>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import { superAdminService, type AdminClientDetail } from '~/services/superAdminService'

definePageMeta({
	layout: 'superadmin',
	middleware: ['superadmin'],
})

const route = useRoute()
const { token } = useAuth('superadmin')

const client = ref<AdminClientDetail | null>(null)
const isLoading = ref(false)
const errorMessage = ref('')

async function loadClient() {
	if (!token.value) {
		return
	}

	isLoading.value = true
	errorMessage.value = ''

	try {
		const response = await superAdminService.getClient(token.value, route.params.id as string)
		client.value = response.data
	} catch (error: unknown) {
		errorMessage.value = getApiErrorMessage(error, 'Client not found.')
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
	return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function inquiryStatusClass(status: string) {
	switch (status) {
		case 'awarded':
			return 'bg-green-50 text-green-700'
		case 'cancelled':
			return 'bg-red-50 text-red-600'
		case 'receiving_quotations':
			return 'bg-blue-50 text-blue-700'
		default:
			return 'bg-amber-50 text-amber-700'
	}
}

function eventStatusClass(status: string) {
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

onMounted(() => {
	loadClient()
})
</script>
