<template>
	<div>
		<div class="mb-5 flex items-start justify-between">
			<p class="text-sm text-gray-500">Manage zone-based ticket tiers for {{ eventName }}</p>
			<button type="button"
				class="flex shrink-0 items-center gap-2 rounded-xl bg-[#285F6b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1f4a54]">
				<IconBase name="plus" class="h-4 w-4" /> Add Tier
			</button>
		</div>

		<div class="space-y-5">
			<div v-for="tier in tiers" :key="tier.name" class="rounded-2xl border border-gray-200 bg-white p-6">
				<div class="flex items-start justify-between">
					<div>
						<h3 class="text-lg font-bold text-gray-900">{{ tier.name }}</h3>
						<p class="mt-1 text-sm text-gray-500">{{ tier.sold }} / {{ tier.capacity }} sold</p>
					</div>
					<div class="flex shrink-0 gap-2">
						<button type="button" class="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50">
							<IconBase name="edit" class="h-4 w-4" />
						</button>
						<button type="button" class="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50">
							<IconBase name="trash" class="h-4 w-4" />
						</button>
					</div>
				</div>

				<div class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
					<div>
						<div class="text-sm text-gray-500">Price</div>
						<div class="mt-1 text-lg font-bold text-gray-900">{{ tier.price }}</div>
					</div>
					<div>
						<div class="text-sm text-gray-500">Capacity</div>
						<div class="mt-1 text-lg font-bold text-gray-900">{{ tier.capacity }}</div>
					</div>
					<div>
						<div class="text-sm text-gray-500">Availability</div>
						<div class="mt-1 text-lg font-bold text-gray-900">{{ tier.capacity - tier.sold }}</div>
					</div>
				</div>

				<div class="mt-5">
					<div class="mb-2 text-sm text-gray-500">Benefits</div>
					<div class="flex flex-wrap gap-2">
						<span v-for="benefit in tier.benefits" :key="benefit"
							class="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-700">
							{{ benefit }}
						</span>
					</div>
				</div>

				<div class="mt-5 mb-1 flex items-center justify-between text-sm">
					<span class="font-semibold text-gray-900">Tickets Sold</span>
					<span class="text-gray-500">{{ tier.sold }} / {{ tier.capacity }}</span>
				</div>
				<div class="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
					<div class="h-full rounded-full bg-[#0ca30c]" :style="{ width: (tier.sold / tier.capacity) * 100 + '%' }" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const eventName = 'Tech Conference 2026'

const tiers = [
	{
		name: 'VIP Front Row',
		sold: 87,
		capacity: 100,
		price: '₱5,000',
		benefits: ['Priority seating', 'VIP lounge access', 'Free lunch', 'Networking session']
	},
	{
		name: 'Main Floor',
		sold: 512,
		capacity: 600,
		price: '₱2,500',
		benefits: ['Standard seating', 'Conference materials', 'Coffee breaks']
	},
	{
		name: 'Balcony',
		sold: 157,
		capacity: 300,
		price: '₱1,500',
		benefits: ['Upper level seating', 'Conference materials']
	}
]
</script>
