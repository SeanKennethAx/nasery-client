<template>
	<div>
		<SuperadminPageHeader />

		<div v-if="errorMessage" class="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
			{{ errorMessage }}
		</div>

		<div class="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
			<SuperadminStatCard label="Total Clients" :value="clients.length" icon="user" tone="blue"
				:hint="`${clientsWithEvents} with a confirmed event`" />
			<SuperadminStatCard label="Total Inquiries" :value="totalInquiries" icon="file-text" tone="violet"
				hint="Posted across all clients" />
			<SuperadminStatCard label="Confirmed Events" :value="totalEvents" icon="calendar" tone="primary"
				:hint="`${conversionRate}% of inquiries converted`" />
			<SuperadminStatCard label="Total Spend" :value="formatCurrency(totalSpend)" icon="cash" tone="green"
				value-class="text-green-600" hint="From accepted quotations" />
		</div>

		<div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
			<div class="mb-5 flex flex-wrap items-center justify-between gap-3">
				<div>
					<h2 class="text-lg font-bold text-gray-900">Client Directory</h2>
					<p class="mt-1 text-sm text-gray-500">
						All clients and their booking activity. Click a row for full details.
					</p>
				</div>
			</div>

			<div class="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
				<div class="w-full lg:max-w-md">
					<FormsTextField v-model="search" icon="search" placeholder="Search clients..." />
				</div>

				<div class="flex flex-wrap items-center gap-2">
					<span class="text-xs font-semibold uppercase tracking-wide text-gray-400">Sort by</span>
					<button v-for="option in sortOptions" :key="option.value" type="button"
						class="rounded-full px-3 py-1.5 text-xs font-semibold transition" :class="sortBy === option.value
							? 'bg-primary-700 text-white'
							: 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
							" @click="sortBy = option.value">
						{{ option.label }}
					</button>
				</div>
			</div>

			<div v-if="isLoading" class="py-10 text-center text-sm text-gray-500">
				Loading clients...
			</div>

			<div v-else-if="!clients.length" class="py-10 text-center text-sm text-gray-400">
				{{ search.trim() ? 'No clients match your search.' : 'No clients found.' }}
			</div>

			<div v-else class="overflow-x-auto">
				<table class="w-full text-left text-sm">
					<thead>
						<tr
							class="border-b border-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-400">
							<th class="pb-3 pr-4">Rank</th>
							<th class="pb-3 pr-4">Client</th>
							<th class="pb-3 pr-4">Email</th>
							<th class="pb-3 pr-4">Inquiries</th>
							<th class="pb-3 pr-4">Converted</th>
							<th class="pb-3 pr-4">Total Spend</th>
							<th class="pb-3">Joined</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-100">
						<tr v-for="(client, index) in sortedClients" :key="client.id"
							class="group cursor-pointer transition hover:bg-gray-50"
							@click="navigateTo(`/superadmin/clients/${client.id}`)">
							<td class="py-3.5 pr-4">
								<span class="flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold"
									:class="rankStyle(index)">
									{{ index + 1 }}
								</span>
							</td>
							<td class="py-3.5 pr-4">
								<div class="flex items-center gap-3">
									<SuperadminAvatar :name="client.name" tone="blue" size="sm" />
									<div class="min-w-0">
										<div class="font-semibold text-gray-900 transition group-hover:text-primary-700">{{ client.name }}</div>
										<div v-if="client.phone" class="truncate text-xs text-gray-400">{{ client.phone }}</div>
									</div>
								</div>
							</td>
							<td class="py-3.5 pr-4 text-gray-500">{{ client.email || '—' }}</td>
							<td class="py-3.5 pr-4 text-gray-700">{{ client.inquiries_count }}</td>
							<td class="py-3.5 pr-4">
								<span v-if="client.inquiries_count" class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
									:class="conversionClass(client)">
									{{ client.events_count }}/{{ client.inquiries_count }}
								</span>
								<span v-else class="text-xs text-gray-400">No inquiries</span>
							</td>
							<td class="py-3.5 pr-4 font-semibold text-gray-900">{{ formatCurrency(client.total_spend) }}</td>
							<td class="py-3.5 text-gray-500">{{ formatDate(client.joined) }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { superAdminService, type AdminClientSummary } from '~/services/superAdminService'

definePageMeta({
	layout: 'superadmin',
	middleware: ['superadmin'],
})

const { token } = useAuth('superadmin')

const clients = ref<AdminClientSummary[]>([])
const isLoading = ref(false)
const errorMessage = ref('')
const search = ref('')

type SortField = 'spend' | 'inquiries' | 'events' | 'joined'

const sortBy = ref<SortField>('spend')
const sortOptions: Array<{ label: string, value: SortField }> = [
	{ label: 'Total Spend', value: 'spend' },
	{ label: 'Inquiries', value: 'inquiries' },
	{ label: 'Events', value: 'events' },
	{ label: 'Joined', value: 'joined' },
]

let searchTimeout: ReturnType<typeof setTimeout> | null = null

const totalInquiries = computed(() => clients.value.reduce((sum, c) => sum + c.inquiries_count, 0))
const totalEvents = computed(() => clients.value.reduce((sum, c) => sum + c.events_count, 0))
const totalSpend = computed(() => clients.value.reduce((sum, c) => sum + c.total_spend, 0))
const clientsWithEvents = computed(() => clients.value.filter(c => c.events_count > 0).length)
const conversionRate = computed(() => {
	if (!totalInquiries.value) return 0
	return Math.round((totalEvents.value / totalInquiries.value) * 100)
})

const sortedClients = computed(() => {
	const list = [...clients.value]

	if (sortBy.value === 'inquiries') {
		return list.sort((a, b) => b.inquiries_count - a.inquiries_count)
	}

	if (sortBy.value === 'events') {
		return list.sort((a, b) => b.events_count - a.events_count)
	}

	if (sortBy.value === 'joined') {
		return list.sort((a, b) => new Date(b.joined).getTime() - new Date(a.joined).getTime())
	}

	return list.sort((a, b) => b.total_spend - a.total_spend)
})

function rankStyle(index: number) {
	if (index === 0) return 'bg-amber-100 text-amber-700'
	if (index === 1) return 'bg-gray-200 text-gray-600'
	if (index === 2) return 'bg-orange-100 text-orange-700'
	return 'bg-gray-100 text-gray-400'
}

function conversionClass(client: AdminClientSummary) {
	const rate = client.events_count / client.inquiries_count
	if (rate >= 1) return 'bg-green-50 text-green-700'
	if (rate > 0) return 'bg-amber-50 text-amber-700'
	return 'bg-gray-100 text-gray-500'
}

async function loadClients() {
	if (!token.value) {
		return
	}

	isLoading.value = true
	errorMessage.value = ''

	try {
		const response = await superAdminService.getClients(token.value, search.value.trim())
		clients.value = response.data
	} catch (error: unknown) {
		errorMessage.value = getApiErrorMessage(error, 'Unable to load clients.')
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

function formatDate(value: string) {
	return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

watch(search, () => {
	if (searchTimeout) clearTimeout(searchTimeout)
	searchTimeout = setTimeout(loadClients, 350)
})

onMounted(() => {
	loadClients()
})
</script>
