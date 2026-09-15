<template>
	<div>
		<FormsLabel text="Email Address" required />

		<div class="flex gap-2">
			<FormsTextField v-model="email" type="email" placeholder="you@example.com" size="lg" required
				:disabled="verified">
				<template #icon>
					<IconBase name="mail" class="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
				</template>
			</FormsTextField>
			<button v-if="!verified" type="button" :disabled="sending || resendSeconds > 0 || !validEmail"
				class="shrink-0 rounded-xl bg-primary-700 px-4 text-sm font-bold text-white transition hover:bg-primary-900 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
				@click="sendCode">
				{{ sending ? 'Sending…' : resendSeconds > 0 ? `${resendSeconds}s` : codeSent ? 'Resend' : 'Send code' }}
			</button>
			<button v-else type="button" class="shrink-0 rounded-xl border border-emerald-200 px-4 text-sm font-bold text-emerald-700 hover:bg-emerald-50" @click="changeEmail">
				Change
			</button>
		</div>

		<div v-if="codeSent && !verified" class="mt-3 rounded-xl border border-primary-100 bg-primary-50/50 p-3">
			<p class="text-xs font-semibold text-gray-700">Enter the 6-digit code sent to {{ normalizedEmail }}</p>
			<div class="mt-2 flex gap-2">
				<input v-model="code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" aria-label="Email verification code"
					class="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-center font-mono text-lg font-extrabold tracking-[0.35em] text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15"
					placeholder="000000" @input="sanitizeCode">
				<button type="button" :disabled="verifying || code.length !== 6"
					class="rounded-xl bg-primary-700 px-4 text-sm font-bold text-white hover:bg-primary-900 disabled:cursor-not-allowed disabled:opacity-50" @click="verifyCode">
					{{ verifying ? 'Checking…' : 'Verify' }}
				</button>
			</div>
			<p class="mt-2 text-xs text-gray-500">The code expires in 10 minutes. For your security, never share it.</p>
		</div>

		<div v-if="verified" class="mt-3 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-700">
			<IconBase name="check-circle" class="h-4 w-4" /> Email verified
		</div>
		<p v-if="message" class="mt-2 text-xs" :class="error ? 'text-red-600' : 'text-emerald-700'">{{ message }}</p>
	</div>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue: string; verificationToken: string }>()
const emit = defineEmits<{
	'update:modelValue': [value: string]
	'update:verificationToken': [value: string]
}>()

const config = useRuntimeConfig()
const code = ref('')
const codeSent = ref(false)
const sending = ref(false)
const verifying = ref(false)
const resendSeconds = ref(0)
const message = ref('')
const error = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

const email = computed({ get: () => props.modelValue, set: value => emit('update:modelValue', value) })
const normalizedEmail = computed(() => email.value.trim().toLowerCase())
const validEmail = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail.value))
const verified = computed(() => Boolean(props.verificationToken))

watch(normalizedEmail, () => {
	if (!verified.value) return
	changeEmail()
})

onBeforeUnmount(() => { if (timer) clearInterval(timer) })

function getMessage(value: unknown, fallback: string) {
	const candidate = value as { data?: { message?: string }; message?: string }
	return candidate?.data?.message || candidate?.message || fallback
}

function startTimer(seconds = 60) {
	resendSeconds.value = seconds
	if (timer) clearInterval(timer)
	timer = setInterval(() => {
		resendSeconds.value--
		if (resendSeconds.value <= 0 && timer) { clearInterval(timer); timer = null }
	}, 1000)
}

async function sendCode() {
	if (!validEmail.value) return
	sending.value = true
	message.value = ''
	error.value = false
	try {
		const response = await $fetch<{ message: string; data: { resend_in: number } }>(`${config.public.apiBaseURL}/auth/email-verification/send`, {
			method: 'POST', body: { email: normalizedEmail.value },
		})
		codeSent.value = true
		message.value = response.message
		startTimer(response.data.resend_in)
	} catch (value) {
		error.value = true
		message.value = getMessage(value, 'Unable to send the verification code.')
	} finally { sending.value = false }
}

function sanitizeCode() { code.value = code.value.replace(/\D/g, '').slice(0, 6) }

async function verifyCode() {
	verifying.value = true
	message.value = ''
	error.value = false
	try {
		const response = await $fetch<{ message: string; data: { verification_token: string } }>(`${config.public.apiBaseURL}/auth/email-verification/verify`, {
			method: 'POST', body: { email: normalizedEmail.value, code: code.value },
		})
		emit('update:verificationToken', response.data.verification_token)
		message.value = response.message
	} catch (value) {
		error.value = true
		message.value = getMessage(value, 'Unable to verify this code.')
	} finally { verifying.value = false }
}

function changeEmail() {
	emit('update:verificationToken', '')
	code.value = ''
	codeSent.value = false
	message.value = ''
	error.value = false
}
</script>
