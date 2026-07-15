<template>
	<div class="mb-5 grid grid-cols-3 gap-2 sm:gap-2.5">
		<button type="button"
			class="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white py-2.5 px-1 text-[13px] font-medium text-gray-700 hover:bg-gray-50"
			@click="openGoogle">
			<svg viewBox="0 0 48 48" class="h-5 w-5 shrink-0">
				<path fill="#FFC107"
					d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
				<path fill="#FF3D00"
					d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
				<path fill="#4CAF50"
					d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.6C29.6 34.9 26.9 36 24 36c-5.3 0-9.6-3.1-11.3-7.6l-6.6 5.1C9.6 39.6 16.2 44 24 44z" />
				<path fill="#1976D2"
					d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.6 5.6C40.9 36.7 44 31 44 24c0-1.3-.1-2.7-.4-3.5z" />
			</svg>
			<span class="hidden sm:inline">Google</span>
		</button>
		<button type="button"
			class="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white py-2.5 px-1 text-[13px] font-medium text-gray-700 hover:bg-gray-50"
			@click="openProvider('Facebook')">
			<svg viewBox="0 0 24 24" class="h-5 w-5 shrink-0">
				<path fill="#1877F2"
					d="M24 12.1c0-6.6-5.4-12-12-12S0 5.5 0 12.1c0 6 4.4 10.9 10.1 11.9v-8.4H7.1v-3.5h3v-2.6c0-3 1.8-4.6 4.5-4.6 1.3 0 2.4.1 2.7.1v3.1h-1.9c-1.5 0-1.8.7-1.8 1.7v2.3h3.6l-.5 3.5h-3.1V24C19.6 23 24 18.1 24 12.1z" />
			</svg>
			<span class="hidden sm:inline">Facebook</span>
		</button>
		<button type="button"
			class="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white py-2.5 px-1 text-[13px] font-medium text-gray-700 hover:bg-gray-50"
			@click="openProvider('Apple')">
			<svg viewBox="0 0 24 24" class="h-5 w-5 shrink-0">
				<path fill="#111"
					d="M16.5 1c.1 1.2-.4 2.4-1.1 3.3-.8.9-2 1.6-3.2 1.5-.1-1.2.4-2.5 1.1-3.3.8-.9 2.1-1.6 3.2-1.5zM20.7 17.2c-.5 1.2-.8 1.7-1.5 2.7-1 1.5-2.4 3.3-4.1 3.3-1.5 0-1.9-1-4-1-2 0-2.5 1-4 1-1.7 0-3-1.7-4-3.1C1 17.2.1 13 1.4 9.9c.9-2.1 2.5-3.4 4.2-3.4 1.6 0 2.6 1 4 1 1.3 0 2.1-1 4-1 1.5 0 3.1.8 4.1 2.2-3.6 2-3 6.9.9 8.5z" />
			</svg>
			<span class="hidden sm:inline">Apple</span>
		</button>
	</div>

	<div class="relative my-5 text-center text-[13px] text-gray-400">
		<div class="absolute inset-x-0 top-1/2 h-px bg-gray-200" />
		<span class="relative bg-white px-3">or continue with</span>
	</div>

	<Transition name="fade">
		<div v-if="activeProvider" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4"
			@click.self="close">
			<div class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
				<div class="mb-5 flex items-center justify-between">
					<div class="flex items-center gap-2.5">
						<svg v-if="activeProvider === 'Facebook'" viewBox="0 0 24 24" class="h-6 w-6 shrink-0">
							<path fill="#1877F2"
								d="M24 12.1c0-6.6-5.4-12-12-12S0 5.5 0 12.1c0 6 4.4 10.9 10.1 11.9v-8.4H7.1v-3.5h3v-2.6c0-3 1.8-4.6 4.5-4.6 1.3 0 2.4.1 2.7.1v3.1h-1.9c-1.5 0-1.8.7-1.8 1.7v2.3h3.6l-.5 3.5h-3.1V24C19.6 23 24 18.1 24 12.1z" />
						</svg>
						<svg v-else viewBox="0 0 24 24" class="h-6 w-6 shrink-0">
							<path fill="#111"
								d="M16.5 1c.1 1.2-.4 2.4-1.1 3.3-.8.9-2 1.6-3.2 1.5-.1-1.2.4-2.5 1.1-3.3.8-.9 2.1-1.6 3.2-1.5zM20.7 17.2c-.5 1.2-.8 1.7-1.5 2.7-1 1.5-2.4 3.3-4.1 3.3-1.5 0-1.9-1-4-1-2 0-2.5 1-4 1-1.7 0-3-1.7-4-3.1C1 17.2.1 13 1.4 9.9c.9-2.1 2.5-3.4 4.2-3.4 1.6 0 2.6 1 4 1 1.3 0 2.1-1 4-1 1.5 0 3.1.8 4.1 2.2-3.6 2-3 6.9.9 8.5z" />
						</svg>
						<h3 class="text-base font-bold text-gray-900">Continue with {{ activeProvider }}</h3>
					</div>
					<button type="button" class="text-gray-400 hover:text-gray-600" @click="close">
						<svg viewBox="0 0 20 20" class="h-5 w-5">
							<path fill="currentColor"
								d="M10 8.6 14.1 4.5l1.4 1.4L11.4 10l4.1 4.1-1.4 1.4L10 11.4l-4.1 4.1-1.4-1.4L8.6 10 4.5 5.9l1.4-1.4L10 8.6Z" />
						</svg>
					</button>
				</div>

				<div class="mb-6 flex items-center gap-3 rounded-xl border border-gray-200 p-3.5">
					<div
						class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-700 text-sm font-bold text-white">
						JD
					</div>
					<div class="min-w-0">
						<div class="truncate text-sm font-bold text-gray-900">{{ mockAccount.name }}</div>
						<div class="truncate text-xs text-gray-500">{{ mockAccount.identifier }}</div>
					</div>
				</div>

				<button type="button"
					class="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-700 py-3 text-sm font-bold text-white hover:bg-primary-900"
					@click="confirm">
					Continue as {{ mockAccount.name }}
				</button>
				<button type="button"
					class="w-full rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
					@click="close">
					Cancel
				</button>

				<p class="mt-4 text-center text-[11px] leading-relaxed text-gray-400">
					By continuing you agree to NaSeRy's
					<span class="cursor-pointer font-semibold text-primary-600">Terms of Service</span> and
					<span class="cursor-pointer font-semibold text-primary-600">Privacy Policy</span>.
				</p>
			</div>
		</div>
	</Transition>

	<Transition name="fade">
		<div v-if="googleStep" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4"
			@click.self="closeGoogle">
			<div class="w-full max-w-[420px] rounded-lg border border-gray-200 bg-white p-10 shadow-2xl">
				<button type="button" class="mb-2 -ml-1 -mt-4 block text-gray-400 hover:text-gray-600"
					@click="closeGoogle">
					<svg viewBox="0 0 20 20" class="h-5 w-5">
						<path fill="currentColor"
							d="M10 8.6 14.1 4.5l1.4 1.4L11.4 10l4.1 4.1-1.4 1.4L10 11.4l-4.1 4.1-1.4-1.4L8.6 10 4.5 5.9l1.4-1.4L10 8.6Z" />
					</svg>
				</button>

				<svg viewBox="0 0 48 48" class="mx-auto h-9 w-9 shrink-0">
					<path fill="#FFC107"
						d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
					<path fill="#FF3D00"
						d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
					<path fill="#4CAF50"
						d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.6C29.6 34.9 26.9 36 24 36c-5.3 0-9.6-3.1-11.3-7.6l-6.6 5.1C9.6 39.6 16.2 44 24 44z" />
					<path fill="#1976D2"
						d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.6 5.6C40.9 36.7 44 31 44 24c0-1.3-.1-2.7-.4-3.5z" />
				</svg>

				<template v-if="googleStep === 'email'">
					<h3 class="mt-4 text-center text-xl font-normal text-[#202124]">Sign in</h3>
					<p class="mt-1 text-center text-sm text-[#202124]">Use your Google Account</p>

					<label class="mb-1.5 mt-7 block text-xs font-medium text-[#5f6368]">Email or phone</label>
					<input v-model="googleEmail" type="text"
						class="w-full rounded border border-[#dadce0] px-3.5 py-3 text-sm text-[#202124] focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]" />
					<button type="button" class="mt-3 text-sm font-medium text-[#1a73e8] hover:underline">
						Forgot email?
					</button>

					<p class="mt-6 text-xs leading-relaxed text-[#5f6368]">
						Not your computer? Use Guest mode to sign in privately.
					</p>

					<div class="mt-8 flex items-center justify-between">
						<button type="button" class="text-sm font-medium text-[#1a73e8] hover:underline">
							Create account
						</button>
						<button type="button"
							class="rounded-md bg-[#1a73e8] px-6 py-2 text-sm font-medium text-white hover:bg-[#1765cc]"
							:disabled="!googleEmail" @click="submitEmail">
							Next
						</button>
					</div>
				</template>

				<template v-else-if="googleStep === 'password'">
					<h3 class="mt-4 text-center text-xl font-normal text-[#202124]">Welcome</h3>
					<button type="button"
						class="mx-auto mt-4 flex items-center gap-2 rounded-full border border-[#dadce0] py-1.5 pl-1.5 pr-3 text-sm text-[#202124] hover:bg-gray-50"
						@click="backToEmail">
						<span
							class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-700 text-[11px] font-bold text-white">JD</span>
						<span class="max-w-[220px] truncate">{{ googleEmail }}</span>
						<svg viewBox="0 0 20 20" class="h-4 w-4 text-[#5f6368]">
							<path fill="currentColor" d="M5.8 7.5 10 11.7l4.2-4.2 1.3 1.3-5.5 5.5-5.5-5.5Z" />
						</svg>
					</button>

					<label class="mb-1.5 mt-7 block text-xs font-medium text-[#5f6368]">Enter your password</label>
					<div class="relative">
						<input v-model="googlePassword" :type="showGooglePassword ? 'text' : 'password'"
							class="w-full rounded border border-[#dadce0] px-3.5 py-3 pr-11 text-sm text-[#202124] focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]" />
						<button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-[#5f6368]"
							@click="showGooglePassword = !showGooglePassword">
							<svg v-if="showGooglePassword" viewBox="0 0 20 20" class="h-[18px] w-[18px]">
								<path fill="currentColor"
									d="M10 4C5.5 4 1.7 6.9.5 10c1.2 3.1 5 6 9.5 6s8.3-2.9 9.5-6c-1.2-3.1-5-6-9.5-6Zm0 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-1.6a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z" />
							</svg>
							<svg v-else viewBox="0 0 20 20" class="h-[18px] w-[18px]">
								<path fill="currentColor"
									d="M2.7 1.6 1.6 2.7l2.3 2.3C2.3 6.1 1 7.9.5 10c1.2 3.1 5 6 9.5 6a10.4 10.4 0 0 0 4.3-.9l2.5 2.5 1.1-1.1L2.7 1.6ZM10 14a4 4 0 0 1-3.6-5.7l1.3 1.3a2.4 2.4 0 0 0 3 3l1.3 1.3A4 4 0 0 1 10 14Zm.4-8-1.6-1.6c.4-.1.8-.1 1.2-.1 4.5 0 8.3 2.9 9.5 6-.5 1.2-1.3 2.4-2.4 3.3l-1.4-1.4A6.4 6.4 0 0 0 17.8 10a8.6 8.6 0 0 0-7.4-4Z" />
							</svg>
						</button>
					</div>
					<button type="button" class="mt-3 text-sm font-medium text-[#1a73e8] hover:underline">
						Forgot password?
					</button>

					<div class="mt-8 flex items-center justify-between">
						<button type="button" class="text-sm font-medium text-[#1a73e8] hover:underline"
							@click="backToEmail">
							Back
						</button>
						<button type="button"
							class="rounded-md bg-[#1a73e8] px-6 py-2 text-sm font-medium text-white hover:bg-[#1765cc]"
							:disabled="!googlePassword" @click="submitPassword">
							Next
						</button>
					</div>
				</template>

				<template v-else-if="googleStep === 'verifying'">
					<div class="flex flex-col items-center py-8">
						<svg viewBox="0 0 24 24" class="h-8 w-8 animate-spin text-[#1a73e8]">
							<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" fill="none"
								stroke-linecap="round" stroke-dasharray="40 100" />
						</svg>
						<p class="mt-4 text-sm text-[#5f6368]">Verifying your account...</p>
					</div>
				</template>
			</div>
		</div>
	</Transition>

	<Transition name="toast">
		<div v-if="showSuccessToast"
			class="fixed left-1/2 top-6 z-[60] flex -translate-x-1/2 items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-5 py-3.5 shadow-2xl">
			<IconBase name="check-circle" class="h-5 w-5 shrink-0 text-green-600" />
			<span class="text-sm font-semibold text-gray-900">{{ successMessage }}</span>
		</div>
	</Transition>
</template>

<script setup lang="ts">
const props = defineProps({
	mode: { type: String, default: 'login' }
})

const emit = defineEmits(['continue'])

const activeProvider = ref(null)

const mockAccounts = {
	Google: { name: 'Sean Kenneth H. Axalan', identifier: 'seankennethaxalan@gmail.com' },
	Facebook: { name: 'Sean Kenneth h. Axalan', identifier: 'facebook.com/seankennethaxalan' },
	Apple: { name: 'Sean Kenneth H. Axalan', identifier: 'Hide My Email · s••••@privaterelay.appleid.com' }
}

const mockAccount = computed(() => mockAccounts[activeProvider.value] ?? mockAccounts.Google)

function openProvider(provider) {
	activeProvider.value = provider
}

function close() {
	activeProvider.value = null
}

function confirm() {
	const provider = activeProvider.value
	const account = mockAccounts[provider]
	close()
	emit('continue', { provider, ...account })
}

const googleStep = ref(null)
const googleEmail = ref('seankennethaxalan@gmail.com')
const googlePassword = ref('')
const showGooglePassword = ref(false)
const showSuccessToast = ref(false)

const successMessage = computed(() => props.mode === 'register' ? 'Registered Successfully!' : 'Login Successful!')

function openGoogle() {
	googleEmail.value = 'seankennethaxalan@gmail.com'
	googlePassword.value = ''
	googleStep.value = 'email'
}

function closeGoogle() {
	googleStep.value = null
}

function submitEmail() {
	if (!googleEmail.value) return
	googleStep.value = 'password'
}

function backToEmail() {
	googleStep.value = 'email'
}

function submitPassword() {
	if (!googlePassword.value) return
	googleStep.value = 'verifying'
	setTimeout(() => {
		googleStep.value = null
		showSuccessToast.value = true
		setTimeout(() => {
			showSuccessToast.value = false
			emit('continue', { provider: 'Google', ...mockAccounts.Google })
		}, 1400)
	}, 900)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.toast-enter-active,
.toast-leave-active {
	transition: opacity 0.25s ease, transform 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
	opacity: 0;
	transform: translate(-50%, -12px);
}
</style>
