<template>
	<div class="space-y-5">
		<div v-for="offer in offers" :key="offer.title" class="rounded-2xl border border-gray-200 bg-white p-6">
			<div class="flex items-start justify-between">
				<div>
					<h3 class="text-lg font-bold text-gray-900">
						{{ offer.title }}</h3>
					<p class="mt-1 text-sm text-gray-500">
						{{ offer.description }}</p>
				</div>
				<span class="shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
					:class="statusBadgeClass(offer.status)">
					{{ offer.status }}
				</span>
			</div>

			<div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
				<div class="rounded-lg bg-gray-50 p-3">
					<div class="text-xs text-gray-500">
						Offer Amount
					</div>
					<div class="mt-1 text-lg font-bold text-brand-700">
						{{ offer.amount }}
					</div>
				</div>
				<div class="rounded-lg bg-gray-50 p-3">
					<div class="text-xs text-gray-500">
						Submitted
					</div>
					<div class="mt-1 text-sm font-bold text-gray-900">
						{{ offer.submitted }}
					</div>
				</div>
				<div class="rounded-lg bg-gray-50 p-3">
					<div class="text-xs text-gray-500">Status</div>
					<div class="mt-1 text-sm font-bold" :class="statusTextClass(offer.status)">
						{{ offer.status }}
					</div>
				</div>
			</div>

			<div class="mt-4">
				<div class="mb-2 text-xs font-semibold tracking-wide text-gray-400">
					COST BREAKDOWN
				</div>
				<div class="divide-y divide-gray-100">
					<div v-for="line in offer.breakdown" :key="line.label"
						class="flex items-center justify-between py-2 text-sm">
						<span class="text-gray-600">
							{{ line.label }}
						</span>
						<span class="font-semibold text-gray-900">
							{{ line.amount }}
						</span>
					</div>
				</div>
				<div
					class="mt-1 flex items-center justify-between border-t border-gray-200 pt-2 text-sm font-bold text-gray-900">
					<span>Total</span>
					<span>{{ offer.total }}</span>
				</div>
			</div>

			<div class="mt-5 flex gap-3">
				<button v-if="offer.status === 'Won'" type="button"
					class="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
					<IconBase name="arrow-right" class="h-4 w-4" />
					Start Event Planning
				</button>
				<button v-else-if="offer.status === 'Under Review'" type="button"
					class="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
					<IconBase name="message" class="h-4 w-4" />
					Message Client
				</button>
				<button v-else-if="offer.status === 'Pending'" type="button"
					class="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
					Edit Offer
				</button>
				<button type="button"
					class="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
					View Full Proposal
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

function statusBadgeClass(status: string) {
	if (status === 'Won') return 'bg-green-50 text-green-700'
	if (status === 'Lost') return 'bg-red-50 text-red-600'
	if (status === 'Under Review') return 'bg-orange-50 text-orange-600'
	return 'bg-gray-100 text-gray-600'
}

function statusTextClass(status: string) {
	if (status === 'Won') return 'text-green-600'
	if (status === 'Lost') return 'text-red-600'
	if (status === 'Under Review') return 'text-orange-600'
	return 'text-gray-700'
}

const offers = [
	{
		title: 'Corporate Annual Gala',
		description: 'Complete event management with premium catering and AV setup',
		amount: '₱650,000',
		submitted: 'May 20, 2026',
		status: 'Pending',
		breakdown: [
			{ label: 'Venue booking & setup', amount: '₱150,000' },
			{ label: 'Catering (500 pax)', amount: '₱250,000' },
			{ label: 'AV equipment & technician', amount: '₱100,000' },
			{ label: 'Stage & lighting design', amount: '₱80,000' },
			{ label: 'Event coordination team', amount: '₱70,000' }
		],
		total: '₱650,000'
	},
	{
		title: 'Product Launch Event',
		description: 'Modern venue setup with product display and premium catering',
		amount: '₱420,000',
		submitted: 'May 18, 2026',
		status: 'Under Review',
		breakdown: [
			{ label: 'Venue & modern setup', amount: '₱120,000' },
			{ label: 'Product display booths', amount: '₱80,000' },
			{ label: 'Catering (300 pax)', amount: '₱150,000' },
			{ label: 'Technical support', amount: '₱70,000' }
		],
		total: '₱420,000'
	},
	{
		title: 'Tech Conference 2026',
		description: '3-day technology conference with multiple tracks and networking',
		amount: '₱1,750,000',
		submitted: 'May 15, 2026',
		status: 'Won',
		breakdown: [
			{ label: 'Convention center booking', amount: '₱400,000' },
			{ label: 'Catering (3 days, 1000 pax)', amount: '₱600,000' },
			{ label: 'AV & tech equipment', amount: '₱350,000' },
			{ label: 'Staff & coordination', amount: '₱250,000' },
			{ label: 'Materials & signage', amount: '₱150,000' }
		],
		total: '₱1,750,000'
	},
	{
		title: 'Charity Fundraiser',
		description: 'Elegant ballroom setup with auction area',
		amount: '₱280,000',
		submitted: 'May 10, 2026',
		status: 'Lost',
		breakdown: [
			{ label: 'Ballroom rental', amount: '₱120,000' },
			{ label: 'Catering (200 pax)', amount: '₱90,000' },
			{ label: 'Auction setup & staging', amount: '₱70,000' }
		],
		total: '₱280,000'
	}
]
</script>
