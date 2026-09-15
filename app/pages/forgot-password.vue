<template>
	<div>
		<NuxtLink to="/login" class="mb-5 inline-flex text-sm font-semibold text-primary-700">← Back to sign in</NuxtLink>
		<h2 class="text-2xl font-extrabold text-gray-900">Reset your password</h2>
		<p class="mb-6 mt-2 text-sm leading-relaxed text-gray-500">Confirm the email and phone number registered to your account. We’ll send a secure code to your email.</p>

		<div v-if="message" class="mb-4 rounded-xl border px-4 py-3 text-sm" :class="error ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'">{{ message }}</div>

		<form v-if="step === 'identity'" class="space-y-5" @submit.prevent="sendCode">
			<div><FormsLabel text="Registered Email" required /><FormsTextField v-model="form.email" type="email" placeholder="you@example.com" size="lg" required /></div>
			<div><FormsLabel text="Registered Phone Number" required /><FormsTextField v-model="form.phone" type="tel" placeholder="+63 912 345 6789" size="lg" required /></div>
			<button :disabled="loading" class="w-full rounded-xl bg-primary-700 py-4 text-sm font-bold text-white disabled:opacity-60">{{ loading ? 'Sending code…' : 'Send reset code' }}</button>
		</form>

		<form v-else class="space-y-5" @submit.prevent="resetPassword">
			<div><FormsLabel text="6-digit verification code" required /><FormsTextField v-model="form.code" inputmode="numeric" maxlength="6" placeholder="000000" size="lg" required /></div>
			<div><FormsLabel text="New Password" required /><FormsPasswordField v-model="form.password" placeholder="At least 8 characters" size="lg" required /></div>
			<div><FormsLabel text="Confirm New Password" required /><FormsPasswordField v-model="form.passwordConfirmation" placeholder="Enter it again" size="lg" required /></div>
			<button :disabled="loading" class="w-full rounded-xl bg-primary-700 py-4 text-sm font-bold text-white disabled:opacity-60">{{ loading ? 'Resetting…' : 'Reset password' }}</button>
			<button type="button" class="w-full text-sm font-semibold text-primary-700" @click="step = 'identity'">Use different account details</button>
		</form>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })
useSeoMeta({ title: 'Reset password | NaSeRy' })
const config = useRuntimeConfig()
const step = ref<'identity' | 'reset'>('identity')
const loading = ref(false)
const message = ref('')
const error = ref(false)
const form = reactive({ email: '', phone: '', code: '', password: '', passwordConfirmation: '' })
const normalizePhone = (value: string) => {
	const phone = value.trim().replace(/[\s\-()]+/g, '')
	if (/^09\d{9}$/.test(phone)) return `+63${phone.slice(1)}`
	if (/^639\d{9}$/.test(phone)) return `+${phone}`
	return phone
}
const getMessage = (value: unknown, fallback: string) => (value as { data?: { message?: string } })?.data?.message || fallback

async function sendCode() {
	loading.value = true; message.value = ''; error.value = false
	try {
		const response = await $fetch<{ message: string }>(`${config.public.apiBaseURL}/auth/forgot-password/send`, { method: 'POST', body: { email: form.email.trim().toLowerCase(), phone: normalizePhone(form.phone) } })
		message.value = response.message; step.value = 'reset'
	} catch (value) { error.value = true; message.value = getMessage(value, 'Unable to send the reset code.') }
	finally { loading.value = false }
}

async function resetPassword() {
	if (form.password !== form.passwordConfirmation) { error.value = true; message.value = 'The password confirmation does not match.'; return }
	loading.value = true; message.value = ''; error.value = false
	try {
		const response = await $fetch<{ message: string }>(`${config.public.apiBaseURL}/auth/forgot-password/reset`, { method: 'POST', body: { email: form.email.trim().toLowerCase(), phone: normalizePhone(form.phone), code: form.code, password: form.password, password_confirmation: form.passwordConfirmation } })
		message.value = response.message
		setTimeout(() => navigateTo('/login'), 1200)
	} catch (value) { error.value = true; message.value = getMessage(value, 'Unable to reset your password.') }
	finally { loading.value = false }
}
</script>
