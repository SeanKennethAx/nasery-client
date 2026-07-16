<template>
	<label :for="fieldFor" class="mb-1.5 block text-sm font-semibold text-gray-700">
		{{ text }}
		<span v-if="required" class="text-rose-500">*</span>
		<span v-if="hint" class="font-normal text-gray-400">{{ hint }}</span>
	</label>
</template>

<script setup lang="ts">
defineProps({
	text: { type: String, default: '' },
	fieldFor: { type: String, default: '' },
	required: { type: Boolean, default: false },
	hint: { type: String, default: '' }
})
</script>
