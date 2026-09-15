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
			<div class="mb-5">
				<FormsEmailVerificationField v-model="form.email" v-model:verification-token="emailVerificationToken" />
			</div>
			<div class="mb-5">
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
			<div class="mb-5">
				<FormsLabel text="Phone No" required />

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


			<div class="mb-5">
				<FormsAddressSearchField v-model="form.clientAddress" v-model:selected="selectedClientLocation"
					label="Address" placeholder="Search your home or business address" required
					hint="This address is used for your account details." />
			</div>

			<div v-if="role === 'organizer'" class="mb-6 rounded-2xl border border-primary-100 bg-primary-50/40 p-4 sm:p-5">
				<div class="mb-4">
					<p class="text-sm font-bold text-gray-800">
						Organizer Service Details
					</p>

					<p class="mt-1 text-xs leading-relaxed text-gray-500">
						Add a service area if you want nearby clients to discover you automatically.
					</p>
				</div>

				<div class="mb-4">
						<FormsAddressSearchField v-model="form.organizerLocation" v-model:selected="selectedOrganizerLocation"
							label="Service Address" placeholder="Search your service address (optional)"
							hint="Optional — you can add or change this later in your profile." />
				</div>

				<div v-if="selectedOrganizerLocation">
					<FormsLabel text="Service Radius" />

					<FormsSelect v-model="form.serviceRadiusKm" :options="serviceRadiusSelectOptions" :can-clear="false"
						:searchable="false" />

					<p class="mt-1.5 text-xs text-gray-400">
						Clients whose event is inside this distance can discover you as a nearby organizer.
					</p>
				</div>
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

			<NuxtLink :to="loginLocation" class="font-bold text-primary-600">
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
const authRoute = useRoute()
useSeoMeta({ title: 'Create an account | NaSeRy' })
const loginLocation = computed(() => {
	const redirect = inquiryRedirect(authRoute.query.redirect)
	return { path: '/login', query: redirect ? { redirect } : {} }
})
import type {
	RegisterPayload,
	UserRole,
} from '~/types/auth'

definePageMeta({
	layout: 'auth',
})

interface SelectedLocation {
	address: string
	providerId: string
	latitude: number
	longitude: number
}

const role = ref<UserRole>(inquiryRedirect(authRoute.query.redirect) ? 'client' : 'organizer')
const showSuccessModal = ref(false)
const registeredContact = ref('')
const emailVerificationToken = ref('')

const { register, isLoading, errorMessage } = useAuth()

const form = reactive({
	fullName: '',
	email: '',
	password: '',
	phone: '',
	clientAddress: '',
	organizerLocation: '',
	serviceRadiusKm: 25,
})

const serviceRadiusOptions = [5, 10, 15, 25, 50, 75, 100, 150, 200]
const serviceRadiusSelectOptions = serviceRadiusOptions.map(radius => ({
	value: radius,
	label: `${radius} km`,
}))

const selectedOrganizerLocation = ref<SelectedLocation | null>(null)
const selectedClientLocation = ref<SelectedLocation | null>(null)

const hasSelectedClientLocation = computed(() => {
	const selected = selectedClientLocation.value
	return Boolean(selected?.address && selected.providerId && Number.isFinite(selected.latitude) && Number.isFinite(selected.longitude))
})

watch(role, () => {
	errorMessage.value = ''
})

const successContactLabel = computed(() =>
	'Registered email'
)

const successLoginMessage = computed(() =>
	role.value === 'organizer'
		? 'Please sign in to complete your organizer profile and start receiving nearby event inquiries.'
		: 'Please sign in using your email and password to access your new account.'
)

function parseFullName(
	fullName: string
) {
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
			firstname:
				parts[0] ?? '',

			middlename:
				'',

			lastname:
				'',
		}
	}

	if (parts.length === 2) {
		return {
			firstname:
				parts[0] ?? '',

			middlename:
				'',

			lastname:
				parts[1] ?? '',
		}
	}

	return {
		firstname:
			parts[0] ?? '',

		middlename:
			parts
				.slice(1, -1)
				.join(' '),

		lastname:
			parts[
			parts.length - 1
			] ?? '',
	}
}

function normalizePhone(
	phone: string
): string {
	const normalized = phone
		.trim()
		.replace(/[\s\-()]+/g, '')

	if (
		/^\+639\d{9}$/
			.test(normalized)
	) {
		return normalized
	}

	if (
		/^639\d{9}$/
			.test(normalized)
	) {
		return `+${normalized}`
	}

	if (
		/^09\d{9}$/
			.test(normalized)
	) {
		return `+63${normalized.slice(1)}`
	}

	if (
		/^9\d{9}$/
			.test(normalized)
	) {
		return `+63${normalized}`
	}

	return normalized
}

async function handleSubmit() {
	errorMessage.value = ''

	const {
		firstname,
		middlename,
		lastname,
	} = parseFullName(
		form.fullName
	)

	if (
		!firstname ||
		!lastname
	) {
		errorMessage.value =
			'Please enter your first name and last name.'

		return
	}

	const email =
		form.email
			.trim()
			.toLowerCase()

	if (!email) {
		errorMessage.value =
			'Email address is required.'

		return
	}

	if (!emailVerificationToken.value) {
		errorMessage.value = 'Verify your email address before creating your account.'
		return
	}

	const emailPattern =
		/^[^\s@]+@[^\s@]+\.[^\s@]+$/

	if (
		!emailPattern.test(email)
	) {
		errorMessage.value =
			'Please enter a valid email address.'

		return
	}

	if (!form.password) {
		errorMessage.value =
			'Password is required.'

		return
	}

	if (
		form.password.length < 8
	) {
		errorMessage.value =
			'Password must be at least 8 characters.'

		return
	}

	const phone =
		normalizePhone(
			form.phone
		)

	if (!phone) {
		errorMessage.value =
			'Phone number is required.'

		return
	}

	if (
		!/^\+639\d{9}$/
			.test(phone)
	) {
		errorMessage.value =
			'Please enter a valid Philippine mobile number.'

		return
	}

	const accountLocation = selectedClientLocation.value

	if (!accountLocation || !hasSelectedClientLocation.value) {
		errorMessage.value = 'Please select your address from the location suggestions.'
		return
	}

	const address = accountLocation.address
	let organizerFields:
		Partial<RegisterPayload> = {}

	if (role.value === 'organizer' && form.organizerLocation.trim() && !selectedOrganizerLocation.value) {
		errorMessage.value = 'Choose a service address from the suggestions, or leave it blank.'
		return
	}

	if (role.value === 'organizer' && selectedOrganizerLocation.value) {
		const selected = selectedOrganizerLocation.value
		organizerFields = {
			location:
				selected.address,

			google_place_id:
				selected.providerId,

			latitude:
				selected.latitude,

			longitude:
				selected.longitude,

			service_radius_km:
				Number(
					form.serviceRadiusKm
				),
		}
	}

	const registrationPayload:
		RegisterPayload = {
		firstname,

		...(middlename
			? { middlename }
			: {}),

		lastname,

		email,
		email_verification_token: emailVerificationToken.value,

		password:
			form.password,

		phone,

		address,

		role:
			role.value,

		...organizerFields,
	}

	try {
		await register(
			registrationPayload
		)

		registeredContact.value =
			email

		showSuccessModal.value =
			true
	} catch (error: unknown) {
		console.error(
			'Registration failed:',
			error
		)
	}
}

async function goToLogin() {
	showSuccessModal.value = false
	await navigateTo(loginLocation.value)
}

function handleSocialContinue() {
	errorMessage.value =
		'Social registration is not available yet.'
}
</script>
