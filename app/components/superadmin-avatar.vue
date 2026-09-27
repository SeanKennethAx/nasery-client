<template>
	<div class="flex shrink-0 items-center justify-center rounded-full font-bold" :class="[sizeClass, tone.bg, tone.text]">
		{{ initials }}
	</div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
	name: string
	size?: 'sm' | 'md' | 'lg'
	tone?: 'primary' | 'amber' | 'violet' | 'blue' | 'gray'
}>(), {
	size: 'md',
	tone: 'primary',
})

const sizeMap = {
	sm: 'h-8 w-8 text-xs',
	md: 'h-9 w-9 text-xs',
	lg: 'h-12 w-12 text-base',
}

const toneMap = {
	primary: { bg: 'bg-primary-700', text: 'text-white' },
	amber: { bg: 'bg-amber-50', text: 'text-amber-700' },
	violet: { bg: 'bg-violet-50', text: 'text-violet-700' },
	blue: { bg: 'bg-blue-50', text: 'text-blue-700' },
	gray: { bg: 'bg-gray-100', text: 'text-gray-600' },
}

const sizeClass = computed(() => sizeMap[props.size])
const tone = computed(() => toneMap[props.tone])

const initials = computed(() =>
	props.name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?',
)
</script>
