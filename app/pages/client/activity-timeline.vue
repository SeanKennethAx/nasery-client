<template>
	<div
		class="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-24 text-center">
		<div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
			<IconBase name="activity" class="h-7 w-7" />
		</div>
		<h2 class="mt-4 text-lg font-bold text-gray-900">Activity Timeline</h2>
		<p class="mt-1 max-w-sm text-sm text-gray-500">Follow every update on your event inquiries and bids as they
			happen. This feature is coming soon.</p>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'client' })
</script>
