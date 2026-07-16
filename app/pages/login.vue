<template>
	<div>

		<Alert type="danger" :text="state?.error?.message"
			v-if="state.error?.message && state.error.message.length > 0" />

		<h2 class="mb-1.5 text-2xl font-extrabold text-gray-900 sm:text-[28px]">
			Welcome back
		</h2>
		<p class="mb-6 text-sm text-gray-500">
			Sign in to manage your events and bids
		</p>

		<AuthSocialButtons mode="login" @continue="handleSocialContinue" />
		<AuthContactMethodToggle v-model="loginMethod" />

		<form @submit.prevent="handleSubmit">
			<template v-if="loginMethod === 'email'">
				<div class="mb-5">
					<FormsLabel text="Email Address" required />
					<FormsTextField v-model="state.email" type="email" placeholder="you@example.com" size="lg" required>
						<template #icon>
							<svg viewBox="0 0 20 20"
								class="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400">
								<path fill="currentColor"
									d="M2.5 4.5A1.5 1.5 0 0 1 4 3h12a1.5 1.5 0 0 1 1.5 1.5v11A1.5 1.5 0 0 1 16 17H4a1.5 1.5 0 0 1-1.5-1.5v-11Zm1.7.3 5.34 4.27a.9.9 0 0 0 1.12 0L16 4.8a.3.3 0 0 0-.19-.3H4.19a.3.3 0 0 0-.19.3Z" />
							</svg>
						</template>
					</FormsTextField>
				</div>
			</template>
			<template v-else>
				<div class="mb-5">
					<FormsLabel text="Phone Number" required />
					<FormsTextField v-model="state.phone" type="tel" placeholder="+1 (555) 000-0000" size="lg" required>
						<template #icon>
							<svg viewBox="0 0 20 20"
								class="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400">
								<path fill="currentColor"
									d="M4.4 2.6h2.9c.5 0 1 .3 1.1.8l.9 3a1.2 1.2 0 0 1-.3 1.2l-1.5 1.5a11.3 11.3 0 0 0 4.4 4.4l1.5-1.5a1.2 1.2 0 0 1 1.2-.3l3 .9c.5.1.8.6.8 1.1v2.9c0 .7-.6 1.3-1.3 1.2C9.9 17 3 10.1 2.6 2.7c0-.7.6-1.3 1.3-1.3Z" />
							</svg>
						</template>
					</FormsTextField>
				</div>
			</template>

			<div class="mb-2 flex items-center justify-between">
				<label class="text-sm font-semibold text-gray-700">
					Password
				</label>
				<span class="cursor-pointer text-[13px] font-semibold text-primary-600">
					Forgot password?
				</span>
			</div>
			<div class="mb-6">
				<FormsPasswordField v-model="state.password" placeholder="Enter password" size="lg" required>
					<template #icon>
						<svg viewBox="0 0 20 20"
							class="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400">
							<path fill="currentColor"
								d="M5 8.5V6.8a5 5 0 0 1 10 0v1.7a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Zm1.8 0h6.4V6.8a3.2 3.2 0 0 0-6.4 0v1.7Z" />
						</svg>
					</template>
				</FormsPasswordField>
			</div>

			<button type="submit"
				class="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-700 py-4 text-[15px] font-bold text-white hover:bg-primary-900">
				Sign In to NaSeRy
				<svg viewBox="0 0 20 20" class="h-4 w-4">
					<path fill="currentColor"
						d="M11.3 4.3a1 1 0 0 1 1.4 0l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 1 1-1.4-1.4L14.6 11H3a1 1 0 1 1 0-2h11.6l-3.3-3.3a1 1 0 0 1 0-1.4Z" />
				</svg>
			</button>
		</form>

		<p class="mt-5 text-center text-sm text-gray-500">
			New to NaSeRy? <NuxtLink to="/register" class="font-bold text-primary-600">Create account</NuxtLink>
		</p>
	</div>
</template>

<script setup lang="ts">
import { authService } from '@/components/api/user/AuthService'
definePageMeta({ layout: 'auth' })

const loginMethod = ref<'email' | 'phone'>('email')

const state = reactive({
	email: '',
	error: null as any,
	phone: '',
	password: ''
})

async function handleSubmit() {
	try {
		const params = {
			email: state.email,
			password: state.password,
		}
		const response = await authService.login(params)
		if (response) {
			localStorage.setItem("_token", response)
			navigateTo('/organizer/home')

		}
	}
	catch (error: any) {
		state.error = error
	}
}

function handleSocialContinue() {
	navigateTo('/organizer/home')
}
</script>
