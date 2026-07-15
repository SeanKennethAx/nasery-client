<template>
	<div class="rounded-2xl border border-gray-200 bg-white p-6">
		<h2 class="text-lg font-bold text-gray-900">Dynamic Preparation Tracking</h2>
		<p class="mb-6 text-sm text-gray-500">Track event readiness with automated checklist</p>

		<div class="mb-1 flex items-center justify-between">
			<span class="text-base font-bold text-gray-900">Overall Event Readiness</span>
			<span class="text-2xl font-extrabold text-gray-900">{{ readinessPercent }}%</span>
		</div>
		<div class="relative mb-6 h-8 w-full overflow-hidden rounded-full bg-gray-100">
			<div class="h-full rounded-full bg-gray-900 transition-all duration-200" :style="{ width: readinessPercent + '%' }" />
			<span class="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white">
				{{ completedCount }}/{{ checklist.length }} completed
			</span>
		</div>

		<div class="space-y-3">
			<button v-for="item in checklist" :key="item.label" type="button"
				class="flex w-full items-center gap-3 rounded-xl border border-gray-200 px-4 py-3.5 text-left hover:bg-gray-50"
				@click="item.done = !item.done">
				<IconBase v-if="item.done" name="check-circle" class="h-5 w-5 shrink-0 text-green-600" />
				<span v-else class="h-5 w-5 shrink-0 rounded-full border-2 border-gray-300" />
				<span class="text-sm font-medium" :class="item.done ? 'text-gray-400 line-through' : 'text-gray-900'">
					{{ item.label }}
				</span>
			</button>
		</div>

		<button type="button"
			class="mt-5 flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800">
			<IconBase name="plus" class="h-4 w-4" /> Add Checklist Item
		</button>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const checklist = reactive([
	{ label: 'Event details configured', done: true },
	{ label: 'Ticket tiers defined', done: true },
	{ label: 'Venue confirmed', done: true },
	{ label: 'Catering arranged', done: true },
	{ label: 'AV equipment booked', done: false },
	{ label: 'Staff assignments', done: true },
	{ label: 'Marketing materials ready', done: false },
	{ label: 'Registration system tested', done: true },
	{ label: 'QR codes generated', done: false },
	{ label: 'Emergency protocols set', done: true }
])

const completedCount = computed(() => checklist.filter((item) => item.done).length)
const readinessPercent = computed(() => Math.round((completedCount.value / checklist.length) * 100))
</script>
