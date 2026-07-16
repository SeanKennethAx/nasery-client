<template>
	<button :type="type" :disabled="disabled"
		class="flex items-center justify-center gap-2 rounded-xl text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
		:class="[variantClasses, sizeClasses]">
		<slot />
	</button>
</template>

<script setup lang="ts">
const props = defineProps({
	variant: { type: String, default: 'primary' },
	size: { type: String, default: 'md' },
	type: { type: String, default: 'button' },
	disabled: { type: Boolean, default: false }
})

const variantClasses = computed(() => {
	if (props.variant === 'secondary') return 'border border-gray-200 text-gray-700 hover:bg-gray-50'
	return 'bg-primary-700 text-white hover:bg-primary-900'
})

const sizeClasses = computed(() => (props.size === 'lg' ? 'px-4 py-3.5' : 'px-4 py-2.5'))
</script>
