<template>
	<div />
</template>

<script setup lang="ts">
definePageMeta({
	layout: false,
})

await navigateTo('/superadmin/overview', { replace: true })
</script>
