<template>
	<div class="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#03141a] px-4 py-10">
		<!-- Ambient glow layers -->
		<div class="pointer-events-none absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-primary-500/20 blur-[120px]" />
		<div class="pointer-events-none absolute -bottom-48 -right-32 h-[36rem] w-[36rem] rounded-full bg-emerald-500/10 blur-[140px]" />
		<div class="pointer-events-none absolute right-1/4 top-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-[100px]" />

		<div class="pointer-events-none absolute inset-0 opacity-40"
			style="background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px); background-size: 26px 26px;" />

		<div class="relative w-full max-w-4xl overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] shadow-[0_30px_90px_-25px_rgba(0,0,0,0.7)] backdrop-blur-sm lg:grid lg:grid-cols-2">
			<!-- Branding / identity panel -->
			<div class="relative flex flex-col justify-between overflow-hidden px-8 py-10 sm:px-10 lg:py-12">
				<div class="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full border border-white/10" />
				<div class="pointer-events-none absolute -left-16 -top-16 h-56 w-56 scale-75 rounded-full border border-white/10" />

				<div class="relative">
					<div class="flex items-center gap-3">
						<div class="relative flex h-12 w-12 shrink-0 items-center justify-center">
							<span class="absolute inset-0 animate-ping rounded-2xl bg-primary-500/30" style="animation-duration: 2.4s;" />
							<span class="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-800 text-lg font-black text-white shadow-lg shadow-primary-900/40">
								N
							</span>
						</div>
						<div>
							<div class="text-lg font-bold leading-tight text-white">NaSeRy</div>
							<div class="text-xs text-white/40">Event Management System</div>
						</div>
					</div>

					<span
						class="mt-6 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-300">
						<span class="relative flex h-1.5 w-1.5">
							<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
							<span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
						</span>
						Super Admin Portal
					</span>

					<h1 class="mt-6 max-w-sm text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-[34px]">
						Command every
						<span class="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">organizer, client,</span>
						and event.
					</h1>

					<p class="mt-4 max-w-sm text-sm leading-relaxed text-white/50">
						One console for platform-wide oversight — revenue, bids, and activity across NaSeRy, in real time.
					</p>
				</div>

				<div class="relative mt-10 space-y-3.5 lg:mt-0">
					<div v-for="point in highlights" :key="point" class="flex items-center gap-2.5 text-sm text-white/70">
						<span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10">
							<IconBase name="check-circle" class="h-3 w-3 text-emerald-300" />
						</span>
						{{ point }}
					</div>
				</div>
			</div>

			<!-- Sign-in card -->
			<div class="relative overflow-hidden bg-white/[0.97] px-6 py-10 sm:px-10 lg:rounded-l-[28px] lg:py-12">
				<div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-500 via-emerald-400 to-cyan-400" />

				<Alert v-if="errorMessage" type="danger" :text="errorMessage" />

				<h2 class="mb-1.5 text-2xl font-extrabold tracking-tight text-gray-950">
					Super Admin sign in
				</h2>

				<p class="mb-7 text-sm text-gray-500">
					Restricted access. Sign in with your NaSeRy super admin account.
				</p>

				<form @submit.prevent="handleSubmit">
					<div class="mb-5">
						<FormsLabel text="Email Address" field-for="admin-login-email" required />

						<FormsTextField id="admin-login-email" v-model="state.email" type="email" autocomplete="email"
							placeholder="admin@nasery.local" size="lg" required>
							<template #icon>
								<svg viewBox="0 0 20 20"
									class="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400">
									<path fill="currentColor"
										d="M2.5 4.5A1.5 1.5 0 0 1 4 3h12a1.5 1.5 0 0 1 1.5 1.5v11A1.5 1.5 0 0 1 16 17H4a1.5 1.5 0 0 1-1.5-1.5v-11Zm1.7.3 5.34 4.27a.9.9 0 0 0 1.12 0L16 4.8a.3.3 0 0 0-.19-.3H4.19a.3.3 0 0 0-.19.3Z" />
								</svg>
							</template>
						</FormsTextField>
					</div>

					<div class="mb-7">
						<FormsLabel text="Password" field-for="admin-login-password" required />

						<FormsPasswordField id="admin-login-password" v-model="state.password"
							autocomplete="current-password" placeholder="Enter password" size="lg" required>
							<template #icon>
								<svg viewBox="0 0 20 20"
									class="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400">
									<path fill="currentColor"
										d="M5 8.5V6.8a5 5 0 0 1 10 0v1.7a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Zm1.8 0h6.4V6.8a3.2 3.2 0 0 0-6.4 0v1.7Z" />
								</svg>
							</template>
						</FormsPasswordField>
					</div>

					<button type="submit" :disabled="isLoading"
						class="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-700 to-primary-800 py-4 text-[15px] font-bold text-white shadow-lg shadow-primary-900/20 transition hover:from-primary-800 hover:to-primary-900 disabled:cursor-not-allowed disabled:opacity-60">
						<IconBase v-if="isLoading" name="refresh-cw" class="h-4 w-4 animate-spin" />

						<template v-if="isLoading">
							Signing In...
						</template>

						<template v-else>
							Sign In to Super Admin Portal

							<svg viewBox="0 0 20 20" class="h-4 w-4 transition-transform group-hover:translate-x-0.5">
								<path fill="currentColor"
									d="M11.3 4.3a1 1 0 0 1 1.4 0l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 1 1-1.4-1.4L14.6 11H3a1 1 0 1 1 0-2h11.6l-3.3-3.3a1 1 0 0 1 0-1.4Z" />
							</svg>
						</template>
					</button>
				</form>

				<p class="mt-6 text-center text-xs text-gray-400">
					This portal is for authorized NaSeRy staff only.
				</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
definePageMeta({
	layout: false,
})

useSeoMeta({ title: 'Super Admin Sign In | NaSeRy' })

const highlights = [
	'Real-time platform oversight',
	'Organizer & client visibility',
	'Unified control center',
]

const {
	login,
	logout,
	isLoading,
	errorMessage,
} = useAuth()

const state = reactive({
	email: '',
	password: '',
})

async function handleSubmit() {
	errorMessage.value = ''

	try {
		const user = await login({
			email: state.email.trim(),
			password: state.password,
		})

		if (user.role !== 'superadmin') {
			logout()
			errorMessage.value = 'This account is not a super admin account.'
			return
		}

		await navigateTo('/superadmin/overview')
	} catch (error) {
		console.error('Super admin login failed:', error)
	}
}
</script>
