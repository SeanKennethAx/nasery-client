<template>
	<div>
		<div class="mb-5 grid grid-cols-3 gap-2 sm:gap-2.5">
			<button v-for="provider in providers" :key="provider.id" type="button"
				:disabled="loading === provider.id"
				class="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-1 py-2.5 text-[13px] font-semibold text-gray-700 transition hover:-translate-y-px hover:border-primary-200 hover:bg-primary-50/40 disabled:cursor-wait disabled:opacity-60"
				@click="continueWith(provider.id)">
				<img :src="provider.icon" alt="" class="h-5 w-5 shrink-0" />
				<span class="hidden sm:inline">{{ loading === provider.id ? 'Opening…' : provider.label }}</span>
			</button>
		</div>

		<p v-if="error" class="-mt-2 mb-4 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
			{{ error }}
		</p>

		<div class="relative my-5 text-center text-[13px] text-gray-400">
			<div class="absolute inset-x-0 top-1/2 h-px bg-gray-200" />
			<span class="relative bg-white px-3">or continue with</span>
		</div>
	</div>
</template>

<script setup lang="ts">
type SocialProvider = 'google' | 'facebook' | 'apple'

const props = withDefaults(defineProps<{
	mode?: 'login' | 'register'
	role?: 'client' | 'organizer'
}>(), { mode: 'login', role: 'client' })

const config = useRuntimeConfig()
const loading = ref<SocialProvider | null>(null)
const error = ref('')
const providers = [
	{ id: 'google' as const, label: 'Google', icon: 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg' },
	{ id: 'facebook' as const, label: 'Facebook', icon: 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/facebook.svg' },
	{ id: 'apple' as const, label: 'Apple', icon: 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/apple.svg' },
]

function continueWith(provider: SocialProvider) {
	error.value = ''
	loading.value = provider
	const base = String(config.public.apiBaseURL || '').replace(/\/$/, '')
	window.location.assign(`${base}/auth/social/${provider}/redirect?role=${props.role}&mode=${props.mode}`)
}
</script>
