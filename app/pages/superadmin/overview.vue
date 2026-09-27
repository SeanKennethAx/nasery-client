<template>
	<div>
		<SuperadminPageHeader />

		<div v-if="isLoading"
			class="rounded-2xl border border-gray-100 bg-white p-10 text-center text-sm text-gray-500">
			Loading platform overview...
		</div>

		<div v-else-if="errorMessage" class="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
			{{ errorMessage }}
		</div>

		<template v-else-if="overview">
			<div class="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
				<SuperadminStatCard label="Total Organizers" :value="overview.organizer_count" icon="users" tone="gray"
					:hint="monthHint(overview.new_organizers_this_month, 'organizer')" />
				<SuperadminStatCard label="Total Clients" :value="overview.client_count" icon="user" tone="blue"
					:hint="monthHint(overview.new_clients_this_month, 'client')" />
				<SuperadminStatCard label="Active Events" :value="overview.active_event_count" icon="calendar"
					tone="primary"
					:hint="`${overview.event_count} total, ${overview.new_events_this_month} new this month`" />
				<SuperadminStatCard label="Pending Quotations" :value="overview.pending_quotations_count" icon="clock"
					tone="amber" value-class="text-amber-600" hint="Bids awaiting a client decision" />
				<SuperadminStatCard label="Total Revenue" :value="formatCurrency(overview.total_revenue)" icon="cash"
					tone="green" value-class="text-green-600" hint="From accepted quotations, all-time" />
				<SuperadminStatCard label="Bids This Month" :value="overview.bids_this_month" icon="file-text"
					tone="violet" :hint="`${overview.avg_organizer_rating || '—'} avg. organizer rating`" />
			</div>

			<div class="grid grid-cols-1 gap-5 xl:grid-cols-3">
				<div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm xl:col-span-2">
					<h2 class="text-base font-bold text-gray-900">Recent Activity</h2>
					<p class="mt-1 text-sm text-gray-500">Latest actions across all organizers and clients</p>

					<div v-if="overview.recent_activity.length" class="mt-5 space-y-1">
						<div v-for="(item, index) in overview.recent_activity" :key="index"
							class="flex items-start gap-3 rounded-xl px-1 py-2.5 transition hover:bg-gray-50">
							<span class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
								:class="activityStyle(item.type).bg">
								<IconBase :name="activityStyle(item.type).icon" class="h-3.5 w-3.5"
									:class="activityStyle(item.type).text" />
							</span>
							<div class="min-w-0 flex-1">
								<div class="flex items-start justify-between gap-3">
									<span class="text-sm text-gray-900">{{ item.label }}</span>
									<span class="shrink-0 text-xs text-gray-400">{{ formatRelativeTime(item.at)
										}}</span>
								</div>
								<span
									class="mt-0.5 inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
									:class="[activityStyle(item.type).bg, activityStyle(item.type).text]">
									{{ activityStyle(item.type).label }}
								</span>
							</div>
						</div>
					</div>
					<p v-else class="mt-5 text-sm text-gray-400">No recent activity yet.</p>
				</div>

				<div class="space-y-5">
					<div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
						<h2 class="text-base font-bold text-gray-900">Top Organizers</h2>
						<p class="mt-1 text-sm text-gray-500">Ranked by revenue generated</p>

						<div v-if="overview.top_organizers.length" class="mt-4 divide-y divide-gray-100">
							<button v-for="org in overview.top_organizers" :key="org.id" type="button"
								class="flex w-full items-center justify-between gap-3 py-3 text-left transition hover:bg-gray-50"
								@click="navigateTo(`/superadmin/organizers/${org.id}`)">
								<div class="flex min-w-0 items-center gap-3">
									<SuperadminAvatar :name="org.name" size="sm" />
									<div class="min-w-0">
										<div class="truncate text-sm font-semibold text-gray-900">{{ org.name }}</div>
										<div class="text-xs text-gray-500">{{ org.events_count }} events</div>
									</div>
								</div>
								<span class="shrink-0 text-sm font-bold text-gray-900">{{ formatCurrency(org.revenue)
									}}</span>
							</button>
						</div>
						<p v-else class="mt-4 text-sm text-gray-400">No organizer revenue yet.</p>
					</div>

					<div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
						<h2 class="text-base font-bold text-gray-900">Pending Quotations</h2>
						<p class="mt-1 text-sm text-gray-500">Bids awaiting a client decision, oldest first</p>

						<div v-if="overview.pending_quotations.length" class="mt-4 space-y-2.5">
							<div v-for="quotation in overview.pending_quotations" :key="quotation.id"
								class="flex items-center justify-between gap-3 rounded-xl border border-gray-100 p-3 transition hover:border-amber-200 hover:bg-amber-50/30">
								<div class="flex min-w-0 items-center gap-3">
									<SuperadminAvatar :name="quotation.organizer" tone="amber" size="sm" />
									<div class="min-w-0">
										<div class="truncate text-sm font-semibold text-gray-900">{{ quotation.organizer
											}}</div>
										<div class="truncate text-xs text-gray-500">{{ quotation.event }} · {{
											formatCurrency(quotation.amount) }}</div>
									</div>
								</div>
								<span class="shrink-0 text-xs text-gray-400">{{
									formatRelativeTime(quotation.submitted_at) }}</span>
							</div>
						</div>
						<p v-else class="mt-4 text-sm text-gray-400">No quotations are waiting on a decision.</p>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import { superAdminService, type AdminOverview } from '~/services/superAdminService'

definePageMeta({
	layout: 'superadmin',
	middleware: ['superadmin'],
})

const { token } = useAuth('superadmin')

const overview = ref<AdminOverview | null>(null)
const isLoading = ref(false)
const errorMessage = ref('')

async function loadOverview() {
	if (!token.value) {
		return
	}

	isLoading.value = true
	errorMessage.value = ''

	try {
		const response = await superAdminService.getOverview(token.value)
		overview.value = response.data
	} catch (error: unknown) {
		errorMessage.value = getApiErrorMessage(error, 'Unable to load the platform overview.')
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

function monthHint(count: number, noun: string) {
	if (count <= 0) return `No new ${noun}s this month`
	return `+${count} new ${noun}${count === 1 ? '' : 's'} this month`
}

function formatRelativeTime(dateString: string) {
	const diffMs = Date.now() - new Date(dateString).getTime()
	const minutes = Math.floor(diffMs / 60000)
	if (minutes < 1) return 'Just now'
	if (minutes < 60) return `${minutes}m ago`
	const hours = Math.floor(minutes / 60)
	if (hours < 24) return `${hours}h ago`
	const days = Math.floor(hours / 24)
	return `${days}d ago`
}

const activityStyles: Record<string, { icon: string, bg: string, text: string, label: string }> = {
	organizer_joined: { icon: 'briefcase', bg: 'bg-primary-50', text: 'text-primary-700', label: 'Organizer' },
	client_joined: { icon: 'user', bg: 'bg-blue-50', text: 'text-blue-600', label: 'Client' },
	quotation_accepted: { icon: 'award', bg: 'bg-green-50', text: 'text-green-600', label: 'Bid won' },
	event_created: { icon: 'calendar', bg: 'bg-gray-100', text: 'text-gray-500', label: 'Event' },
	review_received: { icon: 'star', bg: 'bg-amber-50', text: 'text-amber-600', label: 'Review' },
}

function activityStyle(type: string) {
	return activityStyles[type] ?? { icon: 'activity', bg: 'bg-gray-100', text: 'text-gray-500', label: 'Activity' }
}

onMounted(() => {
	loadOverview()
})
</script>
