<template>
	<div>
		<div class="mb-5 grid grid-cols-3 gap-2 sm:gap-2.5">
			<button v-for="provider in providers" :key="provider.id" type="button"
				:disabled="loading === provider.id"
				class="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-1 py-2.5 text-[13px] font-semibold text-gray-700 transition hover:-translate-y-px hover:border-primary-200 hover:bg-primary-50/40 disabled:cursor-wait disabled:opacity-60"
				@click="continueWith(provider.id)">
				<svg v-if="provider.id === 'facebook'" aria-hidden="true" viewBox="0 0 24 24"
					class="h-5 w-5 shrink-0">
					<circle cx="12" cy="12" r="11" fill="#1877F2" />
					<path fill="#fff"
						d="M13.7 20v-7h2.35l.35-2.73h-2.7V8.53c0-.79.22-1.33 1.36-1.33h1.45V4.77a19.5 19.5 0 0 0-2.11-.11c-2.09 0-3.52 1.27-3.52 3.62v1.99H8.52V13h2.36v7h2.82Z" />
				</svg>
				<svg v-else-if="provider.id === 'apple'" aria-hidden="true" viewBox="0 0 24 24"
					class="h-5 w-5 shrink-0 fill-current text-black">
					<path
						d="M17.05 12.54c-.03-2.96 2.42-4.4 2.53-4.47a5.43 5.43 0 0 0-4.28-2.32c-1.8-.19-3.55 1.08-4.47 1.08-.94 0-2.36-1.06-3.89-1.03a5.66 5.66 0 0 0-4.76 2.9c-2.07 3.58-.53 8.85 1.46 11.75.99 1.42 2.14 3 3.67 2.94 1.5-.06 2.06-.94 3.87-.94 1.79 0 2.32.94 3.88.9 1.61-.02 2.63-1.42 3.58-2.85a11.75 11.75 0 0 0 1.64-3.34 5.13 5.13 0 0 1-3.23-4.62ZM14.12 3.84A5.18 5.18 0 0 0 15.3.12a5.27 5.27 0 0 0-3.4 1.77 4.93 4.93 0 0 0-1.21 3.58 4.35 4.35 0 0 0 3.43-1.63Z" />
				</svg>
				<img v-else :src="provider.icon" alt="" class="h-5 w-5 shrink-0" />
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
	{ id: 'facebook' as const, label: 'Facebook', icon: '' },
	{ id: 'apple' as const, label: 'Apple', icon: '' },
]

function continueWith(provider: SocialProvider) {
	error.value = ''
	loading.value = provider
	const base = String(config.public.apiBaseURL || '').replace(/\/$/, '')
	window.location.assign(`${base}/auth/social/${provider}/redirect?role=${props.role}&mode=${props.mode}`)
}
</script>
