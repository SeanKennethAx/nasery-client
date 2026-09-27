<template>
	<div
		class="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
		:style="glowStyle">
		<div class="absolute inset-x-0 top-0 h-[3px]" :class="tone.bar" />

		<div class="relative flex items-start justify-between">
			<div class="flex h-11 w-11 items-center justify-center rounded-xl" :class="tone.bg">
				<IconBase :name="icon" class="h-5 w-5" :class="tone.text" />
			</div>

			<span v-if="trend" class="flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold"
				:class="[tone.bg, tone.text]">
				<IconBase name="trending-up" class="h-3 w-3" />
				{{ trend }}
			</span>
		</div>

		<div class="relative mt-4 text-sm font-medium text-gray-500">{{ label }}</div>
		<div class="relative mt-1 text-3xl font-extrabold tracking-tight" :class="valueClass ?? 'text-gray-950'">
			{{ value }}
		</div>

		<div v-if="hint" class="relative mt-1.5 text-xs text-gray-400">{{ hint }}</div>
	</div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
	label: string
	value: string | number
	icon: string
	tone?: 'gray' | 'amber' | 'green' | 'blue' | 'primary' | 'violet'
	valueClass?: string
	hint?: string
	trend?: string
}>(), {
	tone: 'gray',
	valueClass: undefined,
	hint: undefined,
	trend: undefined,
})

const toneMap = {
	gray: { bg: 'bg-gray-100', text: 'text-gray-600', bar: 'bg-gray-300', rgb: '148, 163, 184' },
	amber: { bg: 'bg-amber-50', text: 'text-amber-600', bar: 'bg-amber-400', rgb: '245, 158, 11' },
	green: { bg: 'bg-green-50', text: 'text-green-600', bar: 'bg-green-400', rgb: '34, 197, 94' },
	blue: { bg: 'bg-blue-50', text: 'text-blue-600', bar: 'bg-blue-400', rgb: '59, 130, 246' },
	primary: { bg: 'bg-primary-50', text: 'text-primary-700', bar: 'bg-primary-600', rgb: '40, 95, 107' },
	violet: { bg: 'bg-violet-50', text: 'text-violet-600', bar: 'bg-violet-400', rgb: '139, 92, 246' },
}

const tone = computed(() => toneMap[props.tone])

/*
 * A background-painted radial glow instead of a separate blurred
 * element: it is clipped by the card's own border-radius/overflow
 * by construction, so it can never visually leak past the card
 * edge the way an absolutely-positioned filter:blur() layer can in
 * some rendering environments.
 */
const glowStyle = computed(() => ({
	backgroundImage: `radial-gradient(120px circle at 100% 0%, rgba(${tone.value.rgb}, 0.10), transparent 70%)`,
}))
</script>
