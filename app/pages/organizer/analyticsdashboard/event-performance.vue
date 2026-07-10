<template>
	<div>
		<div class="rounded-2xl border border-gray-200 bg-white p-6">
			<h2 class="text-base font-bold text-gray-900">
				Event Attendance Trends
			</h2>
			<p class="mb-8 text-sm text-gray-500">
				Monthly attendance vs no-show rates
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

					<svg class="relative block w-full" :style="{ height: chartHeight + 'px' }" viewBox="0 0 1000 300"
						preserveAspectRatio="none">
						<polyline :points="attendancePoints" fill="none" stroke="#0ca30c" stroke-width="2"
							vector-effect="non-scaling-stroke" />
						<polyline :points="noShowPoints" fill="none" stroke="#d03b3b" stroke-width="2"
							vector-effect="non-scaling-stroke" />
						<circle v-for="(v, i) in attendance" :key="'a' + i" :cx="xFor(i)" :cy="yFor(v)" r="5"
							fill="#0ca30c" />
						<circle v-for="(v, i) in noShow" :key="'n' + i" :cx="xFor(i)" :cy="yFor(v)" r="5"
							fill="#d03b3b" />
					</svg>
				</div>
			</div>

			<div class="mt-2 flex pl-8">
				<div v-for="month in months" :key="month" class="flex-1 text-center text-sm text-gray-600">{{ month }}
				</div>
			</div>

			<div class="mt-4 flex items-center justify-center gap-6 text-sm text-gray-700">
				<span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-full bg-[#0ca30c]" />
					Attendance %
				</span>
				<span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-full bg-[#d03b3b]" />
					No-Show %
				</span>
			</div>
		</div>

		<div class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
			<div class="rounded-2xl border border-gray-200 bg-white p-5">
				<div class="text-sm font-semibold text-gray-900">
					Avg Capacity Fill
				</div>
				<div class="text-sm text-gray-400">
					Per event
				</div>
				<div class="mt-3 text-3xl font-extrabold text-gray-900">
					{{ avgAttendance }}%
				</div>
			</div>
			<div class="rounded-2xl border border-gray-200 bg-white p-5">
				<div class="text-sm font-semibold text-gray-900">
					Avg No-Show Rate
				</div>
				<div class="text-sm text-gray-400">
					Per event
				</div>
				<div class="mt-3 text-3xl font-extrabold text-gray-900">
					{{ avgNoShow }}%
				</div>
			</div>
			<div class="rounded-2xl border border-gray-200 bg-white p-5">
				<div class="text-sm font-semibold text-gray-900">
					Total Events
				</div>
				<div class="text-sm text-gray-400">
					Organized
				</div>
				<div class="mt-3 text-3xl font-extrabold text-gray-900">
					{{ totalEvents }}
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May']
const attendance = [88, 90, 93, 90, 95]
const noShow = [12, 10, 8, 11, 10]
const totalEvents = 24

const chartHeight = 300
const yTicks = [100, 75, 50, 25, 0]

function xFor(i: number) {
	return (i / (months.length - 1)) * 1000
}

function yFor(value: number) {
	return 300 - (value / 100) * 300
}

function toPoints(values: number[]) {
	return values.map((v, i) => `${xFor(i)},${yFor(v)}`).join(' ')
}

const attendancePoints = toPoints(attendance)
const noShowPoints = toPoints(noShow)

function average(values: number[]) {
	return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10
}

const avgAttendance = average(attendance)
const avgNoShow = average(noShow)
</script>
