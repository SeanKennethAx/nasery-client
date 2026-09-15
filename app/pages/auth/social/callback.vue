<template>
	<div class="py-10 text-center">
		<div v-if="!error" class="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary-700" />
		<h2 class="mt-5 text-xl font-extrabold text-gray-900">{{ error ? 'Unable to sign in' : 'Completing secure sign in…' }}</h2>
		<p class="mt-2 text-sm text-gray-500">{{ error || 'Please keep this window open.' }}</p>
		<NuxtLink v-if="error" to="/login" class="mt-6 inline-flex rounded-xl bg-primary-700 px-5 py-3 text-sm font-bold text-white">Back to sign in</NuxtLink>
	</div>
</template>

<script setup lang="ts">
import { authService } from '~/services/authService'

definePageMeta({ layout: 'auth' })
useSeoMeta({ title: 'Social sign in | NaSeRy' })

const route = useRoute()
const error = ref('')
const { setSession, redirectByRole } = useAuth()

onMounted(async () => {
	const code = typeof route.query.code === 'string' ? route.query.code : ''
	if (!code) { error.value = 'The social provider did not return a valid sign-in code.'; return }
	try {
		const response = await authService.exchangeSocialCode(code)
		const user = setSession(response)
		await redirectByRole(user)
	} catch (value) {
		const candidate = value as { data?: { message?: string } }
		error.value = candidate.data?.message || 'Social sign in could not be completed. Please try again.'
	}
})
</script>
