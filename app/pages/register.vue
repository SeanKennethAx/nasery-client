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
				class="flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold" :class="role === 'organizer'
					? 'border-primary-600 bg-primary-50 text-primary-700'
					: 'border-gray-200 text-gray-500'
					" @click="role = 'organizer'">
				Organizer
			</button>

			<button type="button"
				class="flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold" :class="role === 'client'
					? 'border-primary-600 bg-primary-50 text-primary-700'
					: 'border-gray-200 text-gray-500'
					" @click="role = 'client'">
				Client
			</button>
		</div>

		<AuthSocialButtons mode="register" @continue="handleSocialContinue" />

		<AuthContactMethodToggle v-model="registerMethod" />

		<form @submit.prevent="handleSubmit">

			<div class="mb-5">
				<FormsLabel text="Full Name" required />

				<FormsTextField v-model="form.fullName" type="text" placeholder="Sean Kenneth H. Axalan" size="lg"
					required>
					<template #icon>
						<svg viewBox="0 0 20 20"
							class="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400">
							<path fill="currentColor"
								d="M10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.3 0-8 1.7-8 5v1h16v-1c0-3.3-4.7-5-8-5Z" />
						</svg>
					</template>
				</FormsTextField>
			</div>

			<template v-if="registerMethod === 'email'">
				<div class="mb-5">
					<FormsLabel text="Email Address" required />

					<FormsTextField v-model="form.email" type="email" placeholder="you@example.com" size="lg" required>
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

					<FormsTextField v-model="form.phone" type="tel" placeholder="+63 912 345 6789" size="lg" required>
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

			<div class="mb-6">
				<FormsLabel text="Password" required />

				<FormsPasswordField v-model="form.password" placeholder="Create a strong password" size="lg" required>
					<template #icon>
						<svg viewBox="0 0 20 20"
							class="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400">
							<path fill="currentColor"
								d="M5 8.5V6.8a5 5 0 0 1 10 0v1.7a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Zm1.8 0h6.4V6.8a3.2 3.2 0 0 0-6.4 0v1.7Z" />
						</svg>
					</template>
				</FormsPasswordField>
			</div>

			<p class="mb-5 text-[13px] leading-relaxed text-gray-500">
				By creating an account, you agree to our

				<span class="cursor-pointer font-semibold text-primary-600">
					Terms of Service
				</span>

				and

				<span class="cursor-pointer font-semibold text-primary-600">
					Privacy Policy
				</span>.
			</p>

			<div v-if="errorMessage"
				class="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
				{{ errorMessage }}
			</div>

			<button type="submit" :disabled="isLoading"
				class="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-700 py-4 text-[15px] font-bold text-white transition hover:bg-primary-900 disabled:cursor-not-allowed disabled:opacity-60">
				<template v-if="isLoading">
					Creating Account...
				</template>

				<template v-else>
					Create My Account

					<svg viewBox="0 0 20 20" class="h-4 w-4">
						<path fill="currentColor"
							d="M11.3 4.3a1 1 0 0 1 1.4 0l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 1 1-1.4-1.4L14.6 11H3a1 1 0 1 1 0-2h11.6l-3.3-3.3a1 1 0 0 1 0-1.4Z" />
					</svg>
				</template>
			</button>
		</form>

		<p class="mt-5 text-center text-sm text-gray-500">
			Already have an account?

			<NuxtLink to="/login" class="font-bold text-primary-600">
				Sign in
			</NuxtLink>
		</p>

		<Teleport to="body">
			<div v-if="showSuccessModal"
				class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
				<div role="dialog" aria-modal="true" aria-labelledby="registration-success-title"
					class="w-full max-w-sm rounded-2xl bg-white p-7 text-center shadow-2xl">
					<div class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
						<svg viewBox="0 0 24 24" class="h-8 w-8 text-green-600">
							<path fill="currentColor"
								d="M9.55 18.2 3.85 12.5l1.4-1.4 4.3 4.3 9.2-9.2 1.4 1.4-10.6 10.6Z" />
						</svg>
					</div>

					<h3 id="registration-success-title" class="mb-2 text-xl font-bold text-gray-900">
						Account Created Successfully
					</h3>

					<p class="mb-2 text-sm leading-relaxed text-gray-500">
						Your account has been registered successfully.
					</p>

					<p class="mb-6 text-sm leading-relaxed text-gray-500">
						{{ successLoginMessage }}
					</p>

					<div class="mb-5 rounded-xl bg-gray-50 px-4 py-3">
						<p class="text-xs text-gray-400">
							{{ successContactLabel }}
						</p>

						<p class="mt-1 break-all text-sm font-semibold text-gray-700">
							{{ registeredContact }}
						</p>
					</div>

					<button type="button"
						class="w-full rounded-xl bg-primary-700 py-3.5 text-sm font-bold text-white transition hover:bg-primary-900"
						@click="goToLogin">
						Continue to Sign In
					</button>
				</div>
			</div>
		</Teleport>
	</div>
</template>

<script setup lang="ts">
import type { UserRole } from '~/types/auth'

definePageMeta({
	layout: 'auth',
})

const role = ref<UserRole>('organizer')

const registerMethod =
	ref<'email' | 'phone'>('email')

const showSuccessModal = ref(false)

const registeredMethod =
	ref<'email' | 'phone'>('email')

const registeredContact = ref('')

const form = reactive({
	fullName: '',
	email: '',
	phone: '',
	password: '',
})

const {
	register,
	isLoading,
	errorMessage,
} = useAuth()

const successContactLabel = computed(() => {
	return registeredMethod.value === 'phone'
		? 'Registered phone number'
		: 'Registered email'
})

const successLoginMessage = computed(() => {
	return registeredMethod.value === 'phone'
		? 'Please sign in using your phone number and password to access your new account.'
		: 'Please sign in using your email and password to access your new account.'
})

function parseFullName(fullName: string) {
	const parts = fullName
		.trim()
		.split(/\s+/)
		.filter(Boolean)

	if (parts.length === 0) {
		return {
			firstname: '',
			middlename: '',
			lastname: '',
		}
	}

	if (parts.length === 1) {
		return {
			firstname: parts[0] ?? '',
			middlename: '',
			lastname: '',
		}
	}

	if (parts.length === 2) {
		return {
			firstname: parts[0] ?? '',
			middlename: '',
			lastname: parts[1] ?? '',
		}
	}

	return {
		firstname: parts[0] ?? '',

		middlename: parts
			.slice(1, -1)
			.join(' '),

		lastname:
			parts[parts.length - 1] ?? '',
	}
}

function normalizePhone(phone: string): string {
	const normalized = phone
		.trim()
		.replace(/[\s\-()]+/g, '')

	// +639123456789
	if (/^\+639\d{9}$/.test(normalized)) {
		return normalized
	}

	// 639123456789
	if (/^639\d{9}$/.test(normalized)) {
		return `+${normalized}`
	}

	// 09123456789
	if (/^09\d{9}$/.test(normalized)) {
		return `+63${normalized.slice(1)}`
	}

	// 9123456789
	if (/^9\d{9}$/.test(normalized)) {
		return `+63${normalized}`
	}

	return normalized
}

async function handleSubmit() {
	errorMessage.value = ''

	try {
		const {
			firstname,
			middlename,
			lastname,
		} = parseFullName(form.fullName)

		if (!firstname || !lastname) {
			errorMessage.value =
				'Please enter your first name and last name.'

			return
		}
		if (!form.password) {
			errorMessage.value =
				'Password is required.'

			return
		}

		if (form.password.length < 8) {
			errorMessage.value =
				'Password must be at least 8 characters.'

			return
		}
		if (registerMethod.value === 'email') {
			const email = form.email
				.trim()
				.toLowerCase()

			if (!email) {
				errorMessage.value =
					'Email address is required.'

				return
			}
			const emailPattern =
				/^[^\s@]+@[^\s@]+\.[^\s@]+$/

			if (!emailPattern.test(email)) {
				errorMessage.value =
					'Please enter a valid email address.'

				return
			}

			await register({
				firstname,
				...(middlename
					? { middlename }
					: {}),

				lastname,
				email,
				password: form.password,
				role: role.value,
				register_method: 'email',
			})

			registeredMethod.value = 'email'
			registeredContact.value = email
		}
		else {
			const phone = normalizePhone(
				form.phone
			)

			if (!phone) {
				errorMessage.value =
					'Phone number is required.'

				return
			}

			if (!/^\+639\d{9}$/.test(phone)) {
				errorMessage.value =
					'Please enter a valid Philippine mobile number.'

				return
			}

			await register({
				firstname,
				...(middlename
					? { middlename }
					: {}),

				lastname,
				phone,
				password: form.password,
				role: role.value,
				register_method: 'phone',
			})

			registeredMethod.value = 'phone'
			registeredContact.value = phone
		}
		showSuccessModal.value = true

	} catch (error: any) {
		console.error(
			'Registration failed:',
			error
		)
		if (error?.data?.errors) {
			const errors = error.data.errors

			const firstError = Object
				.values(errors)
				.flat()[0]

			errorMessage.value =
				String(firstError)

			return
		}
		if (error?.data?.message) {
			errorMessage.value =
				error.data.message

			return
		}
		if (error instanceof Error) {
			errorMessage.value =
				error.message

			return
		}

		errorMessage.value =
			'Registration failed. Please try again.'
	}
}

async function goToLogin() {
	showSuccessModal.value = false

	await navigateTo({
		path: '/login',
		query: {
			method: registeredMethod.value,
		},
	})
}

function handleSocialContinue() {
	errorMessage.value =
		'Social registration is not available yet.'
}


watch(registerMethod, (method) => {
	errorMessage.value = ''

	if (method === 'email') {
		form.phone = ''
	} else {
		form.email = ''
	}
})
</script>