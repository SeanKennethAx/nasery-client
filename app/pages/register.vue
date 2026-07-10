<template>
	<div>
		<h2 class="mb-1.5 text-2xl font-extrabold text-gray-900 sm:text-[28px]">
			Create account
		</h2>
		<p class="mb-6 text-sm text-gray-500">
			Join NaSeRy to start posting or winning events
		</p>

		<span class="mb-2 block text-[11px] font-semibold tracking-[0.08em] text-gray-400">
			I AM JOINING AS
		</span>
		<div class="mb-5 grid grid-cols-2 gap-3">
			<button type="button"
				class="flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold"
				:class="role === 'organizer' ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-500'"
				@click="role = 'organizer'">
				Organizer
			</button>
			<button type="button"
				class="flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold"
				:class="role === 'client' ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-500'"
				@click="role = 'client'">
				Client
			</button>
		</div>

		<AuthSocialButtons />
		<AuthContactMethodToggle v-model="registerMethod" />

		<form @submit.prevent="handleSubmit">
			<label class="mb-2 block text-sm font-semibold text-gray-700">
				Full Name</label>
			<div class="relative mb-5">
				<svg viewBox="0 0 20 20"
					class="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400">
					<path fill="currentColor"
						d="M10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.3 0-8 1.7-8 5v1h16v-1c0-3.3-4.7-5-8-5Z" />
				</svg>
				<input v-model="form.fullName" type="text" placeholder="Juan dela Cruz" required
					class="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/15" />
			</div>

			<template v-if="registerMethod === 'email'">
				<label class="mb-2 block text-sm font-semibold text-gray-700">
					Email Address
				</label>
				<div class="relative mb-5">
					<svg viewBox="0 0 20 20"
						class="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400">
						<path fill="currentColor"
							d="M2.5 4.5A1.5 1.5 0 0 1 4 3h12a1.5 1.5 0 0 1 1.5 1.5v11A1.5 1.5 0 0 1 16 17H4a1.5 1.5 0 0 1-1.5-1.5v-11Zm1.7.3 5.34 4.27a.9.9 0 0 0 1.12 0L16 4.8a.3.3 0 0 0-.19-.3H4.19a.3.3 0 0 0-.19.3Z" />
					</svg>
					<input v-model="form.email" type="email" placeholder="you@example.com" required
						class="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/15" />
				</div>
			</template>
			<template v-else>
				<label class="mb-2 block text-sm font-semibold text-gray-700">
					Phone Number</label>
				<div class="relative mb-5">
					<svg viewBox="0 0 20 20"
						class="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400">
						<path fill="currentColor"
							d="M4.4 2.6h2.9c.5 0 1 .3 1.1.8l.9 3a1.2 1.2 0 0 1-.3 1.2l-1.5 1.5a11.3 11.3 0 0 0 4.4 4.4l1.5-1.5a1.2 1.2 0 0 1 1.2-.3l3 .9c.5.1.8.6.8 1.1v2.9c0 .7-.6 1.3-1.3 1.2C9.9 17 3 10.1 2.6 2.7c0-.7.6-1.3 1.3-1.3Z" />
					</svg>
					<input v-model="form.phone" type="tel" placeholder="+1 (555) 000-0000" required
						class="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/15" />
				</div>
			</template>

			<label class="mb-2 block text-sm font-semibold text-gray-700">
				Password
			</label>
			<div class="relative mb-6">
				<svg viewBox="0 0 20 20"
					class="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400">
					<path fill="currentColor"
						d="M5 8.5V6.8a5 5 0 0 1 10 0v1.7a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Zm1.8 0h6.4V6.8a3.2 3.2 0 0 0-6.4 0v1.7Z" />
				</svg>
				<input v-model="form.password" :type="showPassword ? 'text' : 'password'"
					placeholder="Create a strong password" required
					class="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-11 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/15" />
				<button type="button" class="absolute right-3 top-1/2 flex -translate-y-1/2 text-gray-400"
					@click="showPassword = !showPassword">
					<svg v-if="showPassword" viewBox="0 0 20 20" class="h-[18px] w-[18px]">
						<path fill="currentColor"
							d="M10 4C5.5 4 1.7 6.9.5 10c1.2 3.1 5 6 9.5 6s8.3-2.9 9.5-6c-1.2-3.1-5-6-9.5-6Zm0 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-1.6a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z" />
					</svg>
					<svg v-else viewBox="0 0 20 20" class="h-[18px] w-[18px]">
						<path fill="currentColor"
							d="M2.7 1.6 1.6 2.7l2.3 2.3C2.3 6.1 1 7.9.5 10c1.2 3.1 5 6 9.5 6a10.4 10.4 0 0 0 4.3-.9l2.5 2.5 1.1-1.1L2.7 1.6ZM10 14a4 4 0 0 1-3.6-5.7l1.3 1.3a2.4 2.4 0 0 0 3 3l1.3 1.3A4 4 0 0 1 10 14Zm.4-8-1.6-1.6c.4-.1.8-.1 1.2-.1 4.5 0 8.3 2.9 9.5 6-.5 1.2-1.3 2.4-2.4 3.3l-1.4-1.4A6.4 6.4 0 0 0 17.8 10a8.6 8.6 0 0 0-7.4-4Z" />
					</svg>
				</button>
			</div>

			<p class="mb-5 text-[13px] leading-relaxed text-gray-500">
				By creating an account, you agree to our
				<span class="cursor-pointer font-semibold text-brand-600">Terms of Service</span> and
				<span class="cursor-pointer font-semibold text-brand-600">Privacy Policy</span>.
			</p>

			<button type="submit"
				class="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-700 py-4 text-[15px] font-bold text-white hover:bg-brand-900">
				Create My Account
				<svg viewBox="0 0 20 20" class="h-4 w-4">
					<path fill="currentColor"
						d="M11.3 4.3a1 1 0 0 1 1.4 0l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 1 1-1.4-1.4L14.6 11H3a1 1 0 1 1 0-2h11.6l-3.3-3.3a1 1 0 0 1 0-1.4Z" />
				</svg>
			</button>
		</form>

		<p class="mt-5 text-center text-sm text-gray-500">
			Already have an account? <NuxtLink to="/login" class="font-bold text-brand-600">Sign in</NuxtLink>
		</p>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const role = ref<'organizer' | 'client'>('organizer')
const registerMethod = ref<'email' | 'phone'>('email')
const showPassword = ref(false)

const form = reactive({
	fullName: '',
	email: '',
	phone: '',
	password: ''
})

function handleSubmit() {
	navigateTo('/organizer/home')
}
</script>
