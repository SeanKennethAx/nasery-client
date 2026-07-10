<template>
	<div>
		<div class="rounded-2xl border border-gray-200 bg-white p-6">
			<h2 class="text-base font-bold text-gray-900">
				Bid Performance Trends
			</h2>
			<p class="mb-8 text-sm text-gray-500">
				Monthly bid submission and win/loss rates
			</p>

			<div class="flex">
				<div class="mr-3 flex flex-col justify-between text-xs text-gray-400"
					:style="{ height: chartHeight + 'px' }">
					<span v-for="tick in yTicks" :key="tick">{{ tick }}</span>
				</div>

				<div class="relative flex-1">
					<div class="absolute inset-0 flex flex-col justify-between">
						<div v-for="tick in yTicks" :key="tick" class="border-t border-dashed border-gray-200" />
					</div>

					<div class="relative flex items-end justify-between px-2" :style="{ height: chartHeight + 'px' }">
						<div v-for="(month, i) in months" :key="month"
							class="flex flex-1 items-end justify-center gap-1.5">
							<div class="w-6 rounded-t bg-[#0ca30c]" :style="{ height: barHeight(won[i]) + 'px' }" />
							<div class="w-6 rounded-t bg-[#d03b3b]" :style="{ height: barHeight(lost[i]) + 'px' }" />
						</div>
					</div>
				</div>
			</div>

			<div class="mt-2 flex pl-8">
				<div v-for="month in months" :key="month" class="flex-1 text-center text-sm text-gray-600">{{ month }}
				</div>
			</div>

			<div class="mt-4 flex items-center justify-center gap-6 text-sm text-gray-700">
				<span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-sm bg-[#0ca30c]" /> Won
					Bids
				</span>
				<span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-sm bg-[#d03b3b]" /> Lost
					Bids
				</span>
			</div>
		</div>

		<div class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
			<div class="rounded-2xl border border-gray-200 bg-white p-5">
				<div class="text-sm font-semibold text-gray-900">
					Total Bids
				</div>
				<div class="text-sm text-gray-400">
					All time
				</div>
				<div class="mt-3 text-3xl font-extrabold text-gray-900">
					{{ totalBids }}</div>
			</div>
			<div class="rounded-2xl border border-gray-200 bg-white p-5">
				<div class="text-sm font-semibold text-gray-900">
					Bids Won
				</div>
				<div class="text-sm text-gray-400">All time</div>
				<div class="mt-3 text-3xl font-extrabold text-green-600">
					{{ bidsWon }}
				</div>
			</div>
			<div class="rounded-2xl border border-gray-200 bg-white p-5">
				<div class="text-sm font-semibold text-gray-900">
					Bids Lost
				</div>
				<div class="text-sm text-gray-400">All time</div>
				<div class="mt-3 text-3xl font-extrabold text-red-600">
					{{ bidsLost }}
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May']
const won = [8, 10, 12, 15, 16]
const lost = [2, 3, 5, 7, 9]

const maxValue = 16
const chartHeight = 256
const yTicks = [16, 12, 8, 4, 0]

function barHeight(value: number) {
	return Math.round((value / maxValue) * chartHeight)
}

const totalBids = won.reduce((a, b) => a + b, 0) + lost.reduce((a, b) => a + b, 0)
const bidsWon = won.reduce((a, b) => a + b, 0)
const bidsLost = lost.reduce((a, b) => a + b, 0)
</script>
