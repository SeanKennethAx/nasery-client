<template>
	<div>
		<SuperadminPageHeader />

		<div v-if="errorMessage" class="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
			{{ errorMessage }}
		</div>

		<div class="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
			<SuperadminStatCard label="Total Organizers" :value="organizers.length" icon="briefcase" tone="primary"
				:hint="`${organizersWithEvents} with at least one event`" />
			<SuperadminStatCard label="Events Managed" :value="totalEvents" icon="calendar" tone="blue"
				hint="Across every organizer" />
			<SuperadminStatCard label="Platform Revenue" :value="formatCurrency(totalRevenue)" icon="cash" tone="green"
				value-class="text-green-600" hint="From accepted quotations" />
			<SuperadminStatCard label="Avg. Rating" :value="avgRating || '—'" icon="star" tone="amber"
				:hint="ratedOrganizersCount ? `From ${ratedOrganizersCount} rated organizer${ratedOrganizersCount === 1 ? '' : 's'}` : 'No reviews yet'" />
		</div>

		<div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
			<div class="mb-5 flex flex-wrap items-center justify-between gap-3">
				<div>
					<h2 class="text-lg font-bold text-gray-900">Organizer Directory</h2>
					<p class="mt-1 text-sm text-gray-500">
						All organizers and their platform activity. Click a row for full details.
					</p>
				</div>
			</div>

			<div class="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
				<div class="w-full lg:max-w-md">
					<FormsTextField v-model="search" icon="search" placeholder="Search organizers..." />
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
				Loading organizers...
			</div>

			<div v-else-if="!organizers.length" class="py-10 text-center text-sm text-gray-400">
				{{ search.trim() ? 'No organizers match your search.' : 'No organizers found.' }}
			</div>

			<div v-else class="overflow-x-auto">
				<table class="w-full text-left text-sm">
					<thead>
						<tr
							class="border-b border-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-400">
							<th class="pb-3 pr-4">Rank</th>
							<th class="pb-3 pr-4">Organizer</th>
							<th class="pb-3 pr-4">Email</th>
							<th class="pb-3 pr-4">Events</th>
							<th class="pb-3 pr-4">Revenue</th>
							<th class="pb-3 pr-4">Rating</th>
							<th class="pb-3">Joined</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-100">
						<tr v-for="(org, index) in sortedOrganizers" :key="org.id"
							class="group cursor-pointer transition hover:bg-gray-50"
							@click="navigateTo(`/superadmin/organizers/${org.id}`)">
							<td class="py-3.5 pr-4">
								<span class="flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold"
									:class="rankStyle(index)">
									{{ index + 1 }}
								</span>
							</td>
							<td class="py-3.5 pr-4">
								<div class="flex items-center gap-3">
									<SuperadminAvatar :name="org.name" size="sm" />
									<div class="min-w-0">
										<div class="font-semibold text-gray-900 transition group-hover:text-primary-700">{{ org.name }}</div>
										<div v-if="org.location" class="truncate text-xs text-gray-400">{{ org.location }}</div>
									</div>
								</div>
							</td>
							<td class="py-3.5 pr-4 text-gray-500">{{ org.email || '—' }}</td>
							<td class="py-3.5 pr-4 text-gray-700">{{ org.events_count }}</td>
							<td class="py-3.5 pr-4 font-semibold text-gray-900">{{ formatCurrency(org.revenue) }}</td>
							<td class="py-3.5 pr-4">
								<span v-if="org.reviews_count" class="inline-flex items-center gap-1 text-gray-700">
									<IconBase name="star" class="h-3.5 w-3.5 text-amber-500" />
									{{ org.rating.toFixed(1) }}
									<span class="text-xs text-gray-400">({{ org.reviews_count }})</span>
								</span>
								<span v-else class="text-xs text-gray-400">No reviews</span>
							</td>
							<td class="py-3.5 text-gray-500">{{ formatDate(org.joined) }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { superAdminService, type AdminOrganizerSummary } from '~/services/superAdminService'

definePageMeta({
	layout: 'superadmin',
	middleware: ['superadmin'],
})

const { token } = useAuth('superadmin')

const organizers = ref<AdminOrganizerSummary[]>([])
const isLoading = ref(false)
const errorMessage = ref('')
const search = ref('')

type SortField = 'revenue' | 'events' | 'rating' | 'joined'

const sortBy = ref<SortField>('revenue')
const sortOptions: Array<{ label: string, value: SortField }> = [
	{ label: 'Revenue', value: 'revenue' },
	{ label: 'Events', value: 'events' },
	{ label: 'Rating', value: 'rating' },
	{ label: 'Joined', value: 'joined' },
]

let searchTimeout: ReturnType<typeof setTimeout> | null = null

const totalEvents = computed(() => organizers.value.reduce((sum, o) => sum + o.events_count, 0))
const totalRevenue = computed(() => organizers.value.reduce((sum, o) => sum + o.revenue, 0))
const organizersWithEvents = computed(() => organizers.value.filter(o => o.events_count > 0).length)
const ratedOrganizersCount = computed(() => organizers.value.filter(o => o.reviews_count > 0).length)
const avgRating = computed(() => {
	const rated = organizers.value.filter(o => o.rating > 0)
	if (!rated.length) return 0
	return Number((rated.reduce((sum, o) => sum + o.rating, 0) / rated.length).toFixed(1))
})

const sortedOrganizers = computed(() => {
	const list = [...organizers.value]

	if (sortBy.value === 'events') {
		return list.sort((a, b) => b.events_count - a.events_count)
	}

	if (sortBy.value === 'rating') {
		return list.sort((a, b) => b.rating - a.rating)
	}

	if (sortBy.value === 'joined') {
		return list.sort((a, b) => new Date(b.joined).getTime() - new Date(a.joined).getTime())
	}

	return list.sort((a, b) => b.revenue - a.revenue)
})

function rankStyle(index: number) {
	if (index === 0) return 'bg-amber-100 text-amber-700'
	if (index === 1) return 'bg-gray-200 text-gray-600'
	if (index === 2) return 'bg-orange-100 text-orange-700'
	return 'bg-gray-100 text-gray-400'
}

async function loadOrganizers() {
	if (!token.value) {
		return
	}

	isLoading.value = true
	errorMessage.value = ''

	try {
		const response = await superAdminService.getOrganizers(token.value, search.value.trim())
		organizers.value = response.data
	} catch (error: unknown) {
		errorMessage.value = getApiErrorMessage(error, 'Unable to load organizers.')
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
	searchTimeout = setTimeout(loadOrganizers, 350)
})

onMounted(() => {
	loadOrganizers()
})
</script>
