<template>
	<div :class="attrs.class">
		<div class="relative">
			<slot name="icon">
				<IconBase v-if="icon" :name="icon"
					class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
					:class="size === 'lg' ? 'left-3.5 h-[18px] w-[18px]' : ''" />
			</slot>
			<input :id="fieldId" v-bind="inputAttrs" :value="modelValue" :type="inputType" :placeholder="placeholder"
				:required="required" :class="inputClasses" @input="$emit('update:modelValue', $event.target.value)" />
			<button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
				:class="size === 'lg' ? 'right-3.5' : ''" @click="showPassword = !showPassword">
				<svg v-if="showPassword" viewBox="0 0 20 20" :class="size === 'lg' ? 'h-[18px] w-[18px]' : 'h-4 w-4'">
					<path fill="currentColor"
						d="M10 4C5.5 4 1.7 6.9.5 10c1.2 3.1 5 6 9.5 6s8.3-2.9 9.5-6c-1.2-3.1-5-6-9.5-6Zm0 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-1.6a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z" />
				</svg>
				<svg v-else viewBox="0 0 20 20" :class="size === 'lg' ? 'h-[18px] w-[18px]' : 'h-4 w-4'">
					<path fill="currentColor"
						d="M2.7 1.6 1.6 2.7l2.3 2.3C2.3 6.1 1 7.9.5 10c1.2 3.1 5 6 9.5 6a10.4 10.4 0 0 0 4.3-.9l2.5 2.5 1.1-1.1L2.7 1.6ZM10 14a4 4 0 0 1-3.6-5.7l1.3 1.3a2.4 2.4 0 0 0 3 3l1.3 1.3A4 4 0 0 1 10 14Zm.4-8-1.6-1.6c.4-.1.8-.1 1.2-.1 4.5 0 8.3 2.9 9.5 6-.5 1.2-1.3 2.4-2.4 3.3l-1.4-1.4A6.4 6.4 0 0 0 17.8 10a8.6 8.6 0 0 0-7.4-4Z" />
				</svg>
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = defineProps({
	modelValue: { type: [String, Number], default: '' },
	required: { type: Boolean, default: false },
	placeholder: { type: String, default: '' },
	icon: { type: String, default: '' },
	size: { type: String, default: 'md' }
})

defineEmits(['update:modelValue'])

const slots = useSlots()
const attrs = useAttrs()
const fieldId = useId()

defineExpose({ fieldId })

const inputAttrs = computed(() => {
	const { class: _omit, ...rest } = attrs
	return rest
})

const showPassword = ref(false)
const hasLeftIcon = computed(() => Boolean(props.icon) || Boolean(slots.icon))

const inputType = computed(() => (showPassword.value ? 'text' : 'password'))

const inputClasses = computed(() => {
	const base = 'w-full rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15'

	if (props.size === 'lg') {
		const left = hasLeftIcon.value ? 'pl-11' : 'pl-4'
		return `${base} py-3.5 ${left} pr-11`
	}

	const left = hasLeftIcon.value ? 'pl-9' : 'pl-3.5'
	return `${base} py-2.5 ${left} pr-11`
})
</script>
