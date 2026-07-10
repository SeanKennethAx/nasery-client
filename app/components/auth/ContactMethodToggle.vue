<script setup lang="ts">
const method = defineModel<'email' | 'phone'>({ required: true })
</script>

<template>
	<div class="mb-6 flex rounded-xl bg-gray-100 p-1">
		<button
			type="button"
			class="flex flex-1 items-center justify-center gap-1.5 rounded-[9px] py-2.5 text-sm font-medium transition-colors duration-300"
			:class="method === 'email' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'"
			@click="method = 'email'"
		>
			<svg viewBox="0 0 20 20" class="h-4 w-4"><path fill="currentColor" d="M2.5 4.5A1.5 1.5 0 0 1 4 3h12a1.5 1.5 0 0 1 1.5 1.5v11A1.5 1.5 0 0 1 16 17H4a1.5 1.5 0 0 1-1.5-1.5v-11Zm1.7.3 5.34 4.27a.9.9 0 0 0 1.12 0L16 4.8a.3.3 0 0 0-.19-.3H4.19a.3.3 0 0 0-.19.3Z"/></svg>
			Email
		</button>
		<button
			type="button"
			class="flex flex-1 items-center justify-center gap-1.5 rounded-[9px] py-2.5 text-sm font-medium transition-colors duration-300"
			:class="method === 'phone' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'"
			@click="method = 'phone'"
		>
			<svg viewBox="0 0 20 20" class="h-4 w-4"><path fill="currentColor" d="M4.4 2.6h2.9c.5 0 1 .3 1.1.8l.9 3a1.2 1.2 0 0 1-.3 1.2l-1.5 1.5a11.3 11.3 0 0 0 4.4 4.4l1.5-1.5a1.2 1.2 0 0 1 1.2-.3l3 .9c.5.1.8.6.8 1.1v2.9c0 .7-.6 1.3-1.3 1.2C9.9 17 3 10.1 2.6 2.7c0-.7.6-1.3 1.3-1.3Z"/></svg>
			Phone
		</button>
	</div>
</template>
