<template>
    <div class="min-h-screen bg-[#f6f8f8]">
        <header class="border-b border-gray-200 bg-white">
            <div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
                <div class="flex items-center gap-3">
                    <div
                        class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#285F6b] text-sm font-bold text-white">
                        N
                    </div>

                    <div>
                        <p class="font-bold text-gray-900">
                            NaSeRy
                        </p>

                        <p class="text-xs text-gray-500">
                            Event Registration
                        </p>
                    </div>
                </div>

                <span v-if="eventData?.public_registration"
                    class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Registration Open
                </span>
            </div>
        </header>

        <main class="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
            <div v-if="loading" class="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
                <svg class="mx-auto h-6 w-6 animate-spin text-[#285F6b]" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z" />
                </svg>

                <p class="mt-3 text-sm font-medium text-gray-600">
                    Loading registration form...
                </p>
            </div>

            <div v-else-if="errorMessage && !eventData"
                class="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
                <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2" class="h-5 w-5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" x2="12" y1="8" y2="12" />
                        <line x1="12" x2="12.01" y1="16" y2="16" />
                    </svg>
                </div>

                <h1 class="mt-4 text-xl font-bold text-gray-900">
                    Registration unavailable
                </h1>

                <p class="mt-2 text-sm text-red-600">
                    {{ errorMessage }}
                </p>
            </div>

            <div v-else-if="eventData" class="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
                <section class="space-y-5">
                    <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                        <div class="h-2 bg-[#285F6b]" />

                        <div class="p-6 sm:p-7">
                            <p class="text-xs font-bold uppercase tracking-[0.18em] text-[#285F6b]">
                                Attendee Registration
                            </p>

                            <h1 class="mt-3 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                                {{ eventData.name }}
                            </h1>

                            <p v-if="eventData.description" class="mt-3 text-sm leading-6 text-gray-600">
                                {{ eventData.description }}
                            </p>

                            <div class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div class="rounded-xl bg-gray-50 p-4">
                                    <p class="text-xs font-medium text-gray-500">
                                        Date & Time
                                    </p>

                                    <p class="mt-1 text-sm font-semibold text-gray-900">
                                        {{ eventSchedule }}
                                    </p>
                                </div>

                                <div class="rounded-xl bg-gray-50 p-4">
                                    <p class="text-xs font-medium text-gray-500">
                                        Location
                                    </p>

                                    <p class="mt-1 text-sm font-semibold text-gray-900">
                                        {{ eventData.location || 'Location not specified' }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="registeredTickets.length"
                        class="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm sm:p-7">
                        <div class="flex items-start gap-3">
                            <div
                                class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2" class="h-5 w-5">
                                    <path d="M20 6 9 17l-5-5" />
                                </svg>
                            </div>

                            <div>
                                <h2 class="text-xl font-bold text-gray-900">
                                    Registration successful
                                </h2>

                                <p class="mt-1 text-sm text-gray-500">
                                    {{ successMessage }}
                                </p>
                            </div>
                        </div>

                        <div class="mt-6 space-y-4">
                            <div v-for="ticket in registeredTickets" :key="ticket.id"
                                class="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                                <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p class="text-xs font-medium uppercase tracking-wide text-gray-400">
                                            Attendee
                                        </p>

                                        <p class="mt-1 text-lg font-bold text-gray-900">
                                            {{ ticket.name }}
                                        </p>

                                        <p class="mt-1 text-sm text-gray-500">
                                            {{ ticket.ticket_type?.name || 'General Admission' }}
                                        </p>

                                        <p class="mt-2 font-mono text-xs font-semibold text-[#285F6b]">
                                            {{ ticket.ticket_id }}
                                        </p>
                                    </div>

                                    <div class="grid grid-cols-1 gap-2 sm:min-w-[210px]">
                                        <button type="button"
                                            class="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                                            @click="downloadTicket(ticket)">
                                            Download PDF Ticket
                                        </button>

                                        <button type="button"
                                            class="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#285F6b] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f4a54] disabled:cursor-not-allowed disabled:opacity-50"
                                            :disabled="!ticket.email ||
                                                emailSendingTicketId === ticket.id
                                                " @click="sendTicketEmail(ticket)">
                                            {{
                                                emailSendingTicketId === ticket.id
                                                    ? 'Sending Ticket...'
                                                    : 'Send PDF to Email'
                                            }}
                                        </button>
                                    </div>
                                </div>

                                <p v-if="emailSuccessTicketId === ticket.id"
                                    class="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                                    QR ticket was successfully sent to {{ ticket.email }}.
                                </p>

                                <div v-if="emailErrorTicketId === ticket.id"
                                    class="mt-3 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-xs font-semibold text-red-700">
                                    <p>
                                        {{ emailErrorMessages[ticket.id] || 'Unable to send this ticket.' }}
                                    </p>

                                    <p class="mt-1 font-normal text-red-600">
                                        Recipient: {{ ticket.email || 'No attendee email available' }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button type="button"
                            class="mt-6 inline-flex h-11 items-center justify-center rounded-xl border border-[#285F6b]/25 bg-white px-5 text-sm font-semibold text-[#285F6b] transition hover:bg-[#285F6b]/5"
                            @click="registerMore">
                            Register another attendee
                        </button>
                    </div>

                    <form v-else class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7"
                        @submit.prevent="submitRegistration">
                        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <h2 class="text-xl font-bold text-gray-900">
                                    Attendee Information
                                </h2>

                                <p class="mt-1 text-sm text-gray-500">
                                    Fill in the attendee details below. Each attendee must verify their email with a
                                    6-digit code.
                                </p>
                            </div>

                            <button v-if="availableTicketTypes.length" type="button"
                                class="inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                                @click="addAttendee">
                                + Add Attendee
                            </button>
                        </div>

                        <div v-if="errorMessage"
                            class="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {{ errorMessage }}
                        </div>

                        <div class="mt-6 space-y-5">
                            <div v-for="(attendee, index) in form.attendees" :key="index"
                                class="rounded-2xl border border-gray-200 bg-gray-50/60 p-5">
                                <div class="flex items-center justify-between gap-3">
                                    <div>
                                        <p class="text-sm font-bold text-gray-900">
                                            Attendee {{ index + 1 }}
                                        </p>

                                        <p class="mt-0.5 text-xs text-gray-500">
                                            Fields marked with * are required.
                                        </p>
                                    </div>

                                    <button v-if="form.attendees.length > 1" type="button"
                                        class="text-xs font-semibold text-red-600 hover:text-red-700"
                                        @click="removeAttendee(index)">
                                        Remove
                                    </button>
                                </div>

                                <div class="mt-5">
                                    <label class="mb-1.5 block text-sm font-semibold text-gray-700">
                                        Full Name
                                        <span class="text-red-500">*</span>
                                    </label>

                                    <input v-model="attendee.name" type="text" required autocomplete="name"
                                        placeholder="Enter attendee full name"
                                        class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#285F6b] focus:ring-2 focus:ring-[#285F6b]/10">
                                </div>

                                <div class="mt-4">
                                    <div class="mb-2 flex items-center justify-between gap-3">
                                        <label class="block text-sm font-semibold text-gray-700">
                                            Email Address
                                            <span class="text-red-500">*</span>
                                        </label>

                                        <span v-if="verificationState(index).verified"
                                            class="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" stroke-width="2" class="h-3.5 w-3.5">
                                                <path d="M20 6 9 17l-5-5" />
                                            </svg>
                                            VERIFIED
                                        </span>

                                        <span v-else-if="verificationState(index).sent"
                                            class="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                                            <span class="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                            CODE SENT
                                        </span>

                                        <span v-else
                                            class="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-bold text-gray-500">
                                            NOT VERIFIED
                                        </span>
                                    </div>

                                    <div class="overflow-hidden rounded-2xl border bg-white transition" :class="verificationState(index).verified
                                        ? 'border-emerald-200 ring-2 ring-emerald-500/5'
                                        : verificationState(index).sent
                                            ? 'border-[#285F6b]/25 ring-2 ring-[#285F6b]/5'
                                            : 'border-gray-200'
                                        ">
                                        <div class="flex flex-col gap-2 p-3 sm:flex-row">
                                            <div class="relative flex-1">
                                                <div
                                                    class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                        fill="none" stroke="currentColor" stroke-width="2"
                                                        class="h-4 w-4">
                                                        <rect width="20" height="16" x="2" y="4" rx="2" />
                                                        <path d="m22 7-10 6L2 7" />
                                                    </svg>
                                                </div>

                                                <input v-model="attendee.email" type="email" required
                                                    autocomplete="email" placeholder="attendee@example.com"
                                                    :disabled="verificationState(index).verified"
                                                    class="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-10 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#285F6b] focus:ring-2 focus:ring-[#285F6b]/10 disabled:border-emerald-100 disabled:bg-emerald-50/60"
                                                    @input="handleEmailChanged(index)">

                                                <span v-if="verificationState(index).verified"
                                                    class="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"
                                                    title="Verified email">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                        fill="none" stroke="currentColor" stroke-width="2.5"
                                                        class="h-3.5 w-3.5">
                                                        <path d="M20 6 9 17l-5-5" />
                                                    </svg>
                                                </span>
                                            </div>

                                            <button type="button"
                                                class="inline-flex h-[46px] shrink-0 items-center justify-center gap-2 rounded-xl bg-[#285F6b] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#1f4a54] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                                                :disabled="verificationState(index).sending ||
                                                    verificationState(index).verified ||
                                                    !attendee.email.trim()
                                                    " @click="sendVerificationCode(index)">
                                                <svg v-if="!verificationState(index).sending"
                                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" stroke-width="2" class="h-4 w-4">
                                                    <path d="m22 2-7 20-4-9-9-4Z" />
                                                    <path d="M22 2 11 13" />
                                                </svg>

                                                <svg v-else class="h-4 w-4 animate-spin"
                                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle class="opacity-25" cx="12" cy="12" r="10"
                                                        stroke="currentColor" stroke-width="4" />
                                                    <path class="opacity-75" fill="currentColor"
                                                        d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z" />
                                                </svg>

                                                {{
                                                    verificationState(index).sending
                                                        ? 'Sending...'
                                                        : verificationState(index).sent
                                                            ? 'Resend Code'
                                                            : 'Send Code'
                                                }}
                                            </button>
                                        </div>

                                        <div v-if="!verificationState(index).sent && !verificationState(index).verified"
                                            class="border-t border-gray-100 bg-gray-50/80 px-4 py-3">
                                            <div class="flex items-start gap-2.5">
                                                <div
                                                    class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#285F6b]/10 text-[#285F6b]">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                        fill="none" stroke="currentColor" stroke-width="2"
                                                        class="h-3.5 w-3.5">
                                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                                                        <path d="m9 12 2 2 4-4" />
                                                    </svg>
                                                </div>

                                                <div>
                                                    <p class="text-xs font-semibold text-gray-700">
                                                        Secure email verification
                                                    </p>
                                                    <p class="mt-0.5 text-xs leading-5 text-gray-500">
                                                        We will send a one-time 6-digit PIN. Registration stays locked
                                                        until the email is verified.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div v-if="verificationState(index).verified"
                                        class="mt-3 overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white">
                                        <div class="flex items-center justify-between gap-3 p-4">
                                            <div class="flex items-center gap-3">
                                                <div
                                                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                        fill="none" stroke="currentColor" stroke-width="2"
                                                        class="h-5 w-5">
                                                        <path d="M20 6 9 17l-5-5" />
                                                    </svg>
                                                </div>

                                                <div>
                                                    <p class="text-sm font-bold text-emerald-800">
                                                        Email verified successfully
                                                    </p>
                                                    <p class="mt-0.5 break-all text-xs text-emerald-700">
                                                        {{ verificationState(index).verifiedEmail }}
                                                    </p>
                                                </div>
                                            </div>

                                            <button type="button"
                                                class="shrink-0 rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-50"
                                                @click="changeVerifiedEmail(index)">
                                                Change
                                            </button>
                                        </div>
                                    </div>

                                    <div v-else-if="verificationState(index).sent"
                                        class="mt-3 overflow-hidden rounded-2xl border border-[#285F6b]/20 bg-white shadow-sm">
                                        <div class="bg-gradient-to-r from-[#285F6b] to-[#347887] px-4 py-3 text-white">
                                            <div class="flex items-center justify-between gap-3">
                                                <div class="flex items-center gap-2.5">
                                                    <div
                                                        class="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                            fill="none" stroke="currentColor" stroke-width="2"
                                                            class="h-4 w-4">
                                                            <rect width="20" height="16" x="2" y="4" rx="2" />
                                                            <path d="m22 7-10 6L2 7" />
                                                        </svg>
                                                    </div>

                                                    <div>
                                                        <p class="text-sm font-bold">
                                                            Check your inbox
                                                        </p>
                                                        <p class="mt-0.5 max-w-[260px] truncate text-xs text-white/75">
                                                            Code sent to {{ attendee.email }}
                                                        </p>
                                                    </div>
                                                </div>

                                                <span v-if="verificationState(index).expiresIn > 0"
                                                    class="rounded-lg bg-white/15 px-2.5 py-1 font-mono text-xs font-bold">
                                                    {{ formatCountdown(verificationState(index).expiresIn) }}
                                                </span>
                                            </div>
                                        </div>

                                        <div class="p-4">
                                            <label
                                                class="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
                                                6-Digit Verification PIN
                                            </label>

                                            <div class="flex flex-col gap-2 sm:flex-row">
                                                <input v-model="verificationState(index).code" type="text"
                                                    inputmode="numeric" autocomplete="one-time-code" maxlength="6"
                                                    placeholder="000000"
                                                    class="h-[52px] w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-center font-mono text-xl font-extrabold tracking-[0.45em] text-gray-900 outline-none transition placeholder:tracking-[0.45em] placeholder:text-gray-300 focus:border-[#285F6b] focus:bg-white focus:ring-2 focus:ring-[#285F6b]/10"
                                                    @input="sanitizeVerificationCode(index)"
                                                    @keyup.enter="verifyEmailCode(index)">

                                                <button type="button"
                                                    class="inline-flex h-[52px] shrink-0 items-center justify-center gap-2 rounded-xl bg-[#285F6b] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#1f4a54] disabled:cursor-not-allowed disabled:opacity-50"
                                                    :disabled="verificationState(index).verifying ||
                                                        verificationState(index).code.length !== 6 ||
                                                        verificationState(index).expiresIn <= 0
                                                        " @click="verifyEmailCode(index)">
                                                    <svg v-if="verificationState(index).verifying"
                                                        class="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg"
                                                        fill="none" viewBox="0 0 24 24">
                                                        <circle class="opacity-25" cx="12" cy="12" r="10"
                                                            stroke="currentColor" stroke-width="4" />
                                                        <path class="opacity-75" fill="currentColor"
                                                            d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z" />
                                                    </svg>

                                                    {{
                                                        verificationState(index).verifying
                                                            ? 'Verifying...'
                                                            : 'Verify Email'
                                                    }}
                                                </button>
                                            </div>

                                            <div class="mt-3 flex flex-wrap items-center justify-between gap-2">
                                                <p v-if="verificationState(index).expiresIn > 0"
                                                    class="text-xs text-gray-500">
                                                    The PIN expires after 10 minutes.
                                                </p>

                                                <p v-else class="text-xs font-semibold text-amber-700">
                                                    This PIN expired. Request a new code.
                                                </p>

                                                <button type="button"
                                                    class="text-xs font-bold text-[#285F6b] transition hover:text-[#1f4a54] disabled:cursor-not-allowed disabled:text-gray-400"
                                                    :disabled="verificationState(index).sending ||
                                                        verificationState(index).resendIn > 0
                                                        " @click="sendVerificationCode(index)">
                                                    {{
                                                        verificationState(index).resendIn > 0
                                                            ? `Resend available in ${verificationState(index).resendIn}s`
                                                            : 'Resend verification code'
                                                    }}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div v-if="verificationState(index).error"
                                        class="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-xs font-semibold text-red-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2" class="mt-0.5 h-4 w-4 shrink-0">
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="M12 8v4" />
                                            <path d="M12 16h.01" />
                                        </svg>

                                        {{ verificationState(index).error }}
                                    </div>

                                    <div v-if="
                                        verificationState(index).success &&
                                        !verificationState(index).verified
                                    "
                                        class="mt-3 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-xs font-semibold text-emerald-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2" class="mt-0.5 h-4 w-4 shrink-0">
                                            <path d="M20 6 9 17l-5-5" />
                                        </svg>

                                        {{ verificationState(index).success }}
                                    </div>
                                </div>

                                <div class="mt-4">
                                    <label class="mb-1.5 block text-sm font-semibold text-gray-700">
                                        Contact Number
                                        <span class="text-xs font-normal text-gray-400">(optional)</span>
                                    </label>

                                    <input v-model="attendee.contact_no" type="tel" autocomplete="tel"
                                        placeholder="e.g. 09171234567"
                                        class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#285F6b] focus:ring-2 focus:ring-[#285F6b]/10">
                                </div>

                                <div class="mt-4">
                                    <label class="mb-1.5 block text-sm font-semibold text-gray-700">
                                        Ticket Type
                                        <span class="text-red-500">*</span>
                                    </label>

                                    <FormsSelect v-model="attendee.event_ticket_type_id" :options="availableTicketTypes.map(ticketType => ({ value: ticketType.id, label: `${ticketType.name} — ${formatCurrency(ticketType.price)}` }))" placeholder="Select ticket type" :can-clear="false" />
                                </div>
                            </div>
                        </div>

                        <div class="mt-6 rounded-2xl bg-[#285F6b]/5 p-4">
                            <div class="flex items-center justify-between gap-4">
                                <div>
                                    <p class="text-xs font-medium text-gray-500">
                                        Registration total
                                    </p>

                                    <p class="mt-1 text-sm font-semibold text-gray-900">
                                        {{ totalAttendees }}
                                        {{ totalAttendees === 1 ? 'attendee' : 'attendees' }}
                                    </p>

                                    <p class="mt-1 text-xs text-gray-500">
                                        {{ verifiedAttendeeCount }} of {{ totalAttendees }} email(s) verified
                                    </p>
                                </div>

                                <p class="text-xl font-extrabold text-[#285F6b]">
                                    {{ formatCurrency(totalAmount) }}
                                </p>
                            </div>
                        </div>

                        <button type="submit"
                            class="mt-5 inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#285F6b] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#1f4a54] disabled:cursor-not-allowed disabled:opacity-50"
                            :disabled="submitting ||
                                !registrationAvailable ||
                                !allEmailsVerified
                                ">
                            {{
                                submitting
                                    ? 'Generating QR Ticket...'
                                    : !allEmailsVerified
                                        ? 'Verify All Emails to Continue'
                                        : 'Submit Registration'
                            }}
                        </button>

                        <p class="mt-3 text-center text-xs leading-5 text-gray-400">
                            Your information will only be used for this event registration.
                        </p>
                    </form>
                </section>

                <aside class="space-y-4 lg:sticky lg:top-6 lg:self-start">
                    <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <h3 class="text-sm font-bold text-gray-900">
                            Available Tickets
                        </h3>

                        <div v-if="availableTicketTypes.length" class="mt-4 space-y-3">
                            <div v-for="ticketType in availableTicketTypes" :key="ticketType.id"
                                class="rounded-xl border border-gray-100 bg-gray-50 p-4">
                                <div class="flex items-start justify-between gap-3">
                                    <div>
                                        <p class="font-semibold text-gray-900">
                                            {{ ticketType.name }}
                                        </p>

                                        <p class="mt-1 text-sm font-bold text-[#285F6b]">
                                            {{ formatCurrency(ticketType.price) }}
                                        </p>
                                    </div>

                                    <span v-if="
                                        ticketType.remaining !== null &&
                                        ticketType.remaining !== undefined
                                    "
                                        class="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-600">
                                        {{ ticketType.remaining }} left
                                    </span>
                                </div>
                            </div>
                        </div>

                        <p v-else class="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
                            No ticket types are currently available.
                        </p>
                    </div>

                    <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <h3 class="text-sm font-bold text-gray-900">
                            What happens next?
                        </h3>

                        <ol class="mt-4 space-y-3 text-sm text-gray-600">
                            <li class="flex gap-3">
                                <span
                                    class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#285F6b]/10 text-xs font-bold text-[#285F6b]">
                                    1
                                </span>
                                Enter your attendee details and email.
                            </li>

                            <li class="flex gap-3">
                                <span
                                    class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#285F6b]/10 text-xs font-bold text-[#285F6b]">
                                    2
                                </span>
                                Verify the email using the 6-digit code.
                            </li>

                            <li class="flex gap-3">
                                <span
                                    class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#285F6b]/10 text-xs font-bold text-[#285F6b]">
                                    3
                                </span>
                                Submit registration and generate the QR ticket.
                            </li>

                            <li class="flex gap-3">
                                <span
                                    class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#285F6b]/10 text-xs font-bold text-[#285F6b]">
                                    4
                                </span>
                                Download the PDF ticket or send it to the verified email.
                            </li>
                        </ol>
                    </div>
                </aside>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'

import type {
    AttendeeForm,
    PublicEvent,
    PublicRegistrationResponse,
    PublicRegistrationSubmitResponse,
    RegisteredTicket,
} from '~/types/public-registration'

definePageMeta({
    layout: false,
})

type VerificationState = {
    sending: boolean
    verifying: boolean
    sent: boolean
    verified: boolean
    code: string
    error: string
    success: string
    verificationToken: string | null
    verifiedEmail: string
    expiresIn: number
    resendIn: number
}

type VerificationSendResponse = {
    message: string
    data?: {
        expires_in?: number
        resend_in?: number
    }
}

type VerificationVerifyResponse = {
    message: string
    data?: {
        verified?: boolean
        email?: string
        verification_token?: string
    }
}

type AttendeeFormWithContact = AttendeeForm & {
    contact_no?: string
}

const route = useRoute()
const config = useRuntimeConfig()

const apiBaseURL =
    (config.public.apiBaseURL as string | undefined) ??
    'http://127.0.0.1:8000/api'

const token = computed<string>(() => {
    const routeToken = route.params.token

    if (Array.isArray(routeToken)) {
        return routeToken[0] ?? ''
    }

    return typeof routeToken === 'string'
        ? routeToken
        : ''
})

const loading = ref(true)
const submitting = ref(false)

const errorMessage = ref('')
const successMessage = ref('')

const eventData =
    ref<PublicEvent | null>(null)

const registeredTickets =
    ref<RegisteredTicket[]>([])

const emailSendingTicketId =
    ref<number | null>(null)

const emailSuccessTicketId =
    ref<number | null>(null)

const emailErrorTicketId =
    ref<number | null>(null)

const emailErrorMessages =
    reactive<Record<number, string>>({})

const createVerificationState =
    (): VerificationState => ({
        sending: false,
        verifying: false,
        sent: false,
        verified: false,
        code: '',
        error: '',
        success: '',
        verificationToken: null,
        verifiedEmail: '',
        expiresIn: 0,
        resendIn: 0,
    })

const form = reactive({
    attendees: [
        {
            name: '',
            email: '',
            contact_no: '',
            event_ticket_type_id: null,
        },
    ] as AttendeeFormWithContact[],
})

const emailVerificationStates =
    reactive<VerificationState[]>([
        createVerificationState(),
    ])

let countdownTimer:
    ReturnType<typeof setInterval> |
    null = null

const verificationState = (
    index: number
): VerificationState => {
    if (!emailVerificationStates[index]) {
        emailVerificationStates[index] =
            createVerificationState()
    }

    return emailVerificationStates[index]
}

const ticketTypes = computed(() =>
    eventData.value?.ticket_types ?? []
)

const availableTicketTypes = computed(() =>
    ticketTypes.value.filter(
        ticketType =>
            !ticketType.sold_out
    )
)

const registrationAvailable = computed(() =>
    Boolean(
        eventData.value?.public_registration &&
        availableTicketTypes.value.length
    )
)

const totalAttendees = computed(
    () => form.attendees.length
)

const verifiedAttendeeCount = computed(
    () =>
        emailVerificationStates.filter(
            state => state.verified
        ).length
)

const allEmailsVerified = computed(
    () =>
        form.attendees.length > 0 &&
        form.attendees.every(
            (attendee, index) => {
                const state =
                    verificationState(index)

                return (
                    state.verified &&
                    state.verificationToken &&
                    state.verifiedEmail
                        .toLowerCase() ===
                    attendee.email
                        .trim()
                        .toLowerCase()
                )
            }
        )
)

const totalAmount = computed(() =>
    form.attendees.reduce(
        (total, attendee) => {
            const ticketType =
                availableTicketTypes.value.find(
                    item =>
                        item.id ===
                        attendee.event_ticket_type_id
                )

            return (
                total +
                Number(ticketType?.price ?? 0)
            )
        },
        0
    )
)

const formatCurrency = (
    amount: string | number
) =>
    new Intl.NumberFormat(
        'en-PH',
        {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2,
        }
    ).format(
        Number(amount || 0)
    )

const formatDate = (
    value: string | null
) => {
    if (!value) {
        return 'Date not specified'
    }

    const date =
        new Date(
            value.includes('T')
                ? value
                : `${value}T00:00:00`
        )

    return new Intl.DateTimeFormat(
        'en-PH',
        {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        }
    ).format(date)
}

const formatTime = (
    value: string | null
) => {
    if (!value) {
        return null
    }

    const parts = value.split(':')

    if (parts.length < 2) {
        return value
    }

    const hours =
        Number(parts[0])

    const minutes =
        Number(parts[1])

    if (
        Number.isNaN(hours) ||
        Number.isNaN(minutes)
    ) {
        return value
    }

    const date =
        new Date()

    date.setHours(
        hours,
        minutes,
        0,
        0
    )

    return new Intl.DateTimeFormat(
        'en-PH',
        {
            hour: 'numeric',
            minute: '2-digit',
        }
    ).format(date)
}

const formatCountdown = (
    seconds: number
): string => {
    const safeSeconds =
        Math.max(0, seconds)

    const minutes =
        Math.floor(
            safeSeconds / 60
        )

    const remainingSeconds =
        safeSeconds % 60

    return `${minutes}:${String(
        remainingSeconds
    ).padStart(2, '0')}`
}

const eventSchedule = computed(() => {
    if (!eventData.value) {
        return ''
    }

    const date =
        formatDate(
            eventData.value.event_date
        )

    const start =
        formatTime(
            eventData.value.start_time
        )

    const end =
        formatTime(
            eventData.value.end_time
        )

    if (start && end) {
        return `${date} • ${start} - ${end}`
    }

    return start
        ? `${date} • ${start}`
        : date
})

const getDefaultTicketTypeId =
    (): number | null =>
        availableTicketTypes.value[0]?.id ??
        null

const resetVerificationState = (
    index: number
) => {
    emailVerificationStates[index] =
        createVerificationState()
}

const handleEmailChanged = (
    index: number
) => {
    const state =
        verificationState(index)

    const currentEmail =
        form.attendees[index]
            ?.email
            ?.trim()
            .toLowerCase() ?? ''

    if (
        state.verifiedEmail &&
        currentEmail !==
        state.verifiedEmail
            .trim()
            .toLowerCase()
    ) {
        resetVerificationState(index)
        return
    }

    if (state.sent && !state.verified) {
        state.code = ''
        state.sent = false
        state.success = ''
        state.error = ''
        state.verificationToken = null
        state.expiresIn = 0
        state.resendIn = 0
    }
}

const changeVerifiedEmail = (
    index: number
) => {
    resetVerificationState(index)
}

const sanitizeVerificationCode = (
    index: number
) => {
    const state =
        verificationState(index)

    state.code =
        state.code
            .replace(/\D/g, '')
            .slice(0, 6)
}

const startCountdownTimer = () => {
    if (countdownTimer) {
        return
    }

    countdownTimer =
        setInterval(
            () => {
                emailVerificationStates.forEach(
                    state => {
                        if (state.expiresIn > 0) {
                            state.expiresIn -= 1
                        }

                        if (state.resendIn > 0) {
                            state.resendIn -= 1
                        }
                    }
                )
            },
            1000
        )
}

const addAttendee = () => {
    errorMessage.value = ''

    const defaultTicketTypeId =
        getDefaultTicketTypeId()

    if (!defaultTicketTypeId) {
        errorMessage.value =
            'There are no available ticket types for this event.'

        return
    }

    form.attendees.push({
        name: '',
        email: '',
        contact_no: '',
        event_ticket_type_id:
            defaultTicketTypeId,
    })

    emailVerificationStates.push(
        createVerificationState()
    )
}

const removeAttendee = (
    index: number
) => {
    if (
        form.attendees.length === 1
    ) {
        return
    }

    form.attendees.splice(
        index,
        1
    )

    emailVerificationStates.splice(
        index,
        1
    )
}

const getApiErrorMessage = (
    error: unknown,
    fallback: string
): string => {
    const apiError =
        error as {
            data?: {
                message?: string
                errors?: Record<
                    string,
                    string[]
                >
            }
            message?: string
        }

    const validationMessage =
        Object.values(
            apiError.data?.errors ??
            {}
        )[0]?.[0]

    const message = (
        validationMessage ??
        apiError.data?.message ??
        apiError.message ??
        fallback
    )

    return message.includes('SQLSTATE')
        ? fallback
        : message
}

const sendVerificationCode =
    async (
        index: number
    ) => {
        errorMessage.value = ''

        const attendee =
            form.attendees[index]

        if (!attendee) {
            return
        }

        const email =
            attendee.email.trim()

        const state =
            verificationState(index)

        state.error = ''
        state.success = ''

        if (!email) {
            state.error =
                'Please enter an email address first.'

            return
        }

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!emailPattern.test(email)) {
            state.error =
                'Please enter a valid email address.'

            return
        }

        if (state.resendIn > 0) {
            state.error =
                `Please wait ${state.resendIn} seconds before requesting another code.`

            return
        }

        state.sending = true

        try {
            const response =
                await $fetch<VerificationSendResponse>(
                    `${apiBaseURL}/events/register/${encodeURIComponent(
                        token.value
                    )}/email-verification/send`,
                    {
                        method: 'POST',

                        headers: {
                            Accept:
                                'application/json',
                        },

                        body: {
                            email,
                        },
                    }
                )

            state.sent = true
            state.verified = false
            state.code = ''
            state.verificationToken = null
            state.verifiedEmail = ''
            state.expiresIn =
                Number(
                    response.data?.expires_in ??
                    600
                )
            state.resendIn =
                Number(
                    response.data?.resend_in ??
                    60
                )
            state.success =
                response.message ||
                'A 6-digit verification code was sent to your email.'
        } catch (error: unknown) {
            state.error =
                getApiErrorMessage(
                    error,
                    'Unable to send the verification code.'
                )
        } finally {
            state.sending = false
        }
    }

const verifyEmailCode =
    async (
        index: number
    ) => {
        errorMessage.value = ''

        const attendee =
            form.attendees[index]

        if (!attendee) {
            return
        }

        const state =
            verificationState(index)

        state.error = ''
        state.success = ''

        const email =
            attendee.email.trim()

        const code =
            state.code.trim()

        if (!email) {
            state.error =
                'Please enter an email address.'

            return
        }

        if (!/^\d{6}$/.test(code)) {
            state.error =
                'Please enter the complete 6-digit verification code.'

            return
        }

        if (state.expiresIn <= 0) {
            state.error =
                'This verification code has expired. Please request a new code.'

            return
        }

        state.verifying = true

        try {
            const response =
                await $fetch<VerificationVerifyResponse>(
                    `${apiBaseURL}/events/register/${encodeURIComponent(
                        token.value
                    )}/email-verification/verify`,
                    {
                        method: 'POST',

                        headers: {
                            Accept:
                                'application/json',
                        },

                        body: {
                            email,
                            code,
                        },
                    }
                )

            if (
                !response.data?.verified ||
                !response.data
                    ?.verification_token
            ) {
                state.error =
                    'The email could not be verified.'

                return
            }

            state.verified = true
            state.sent = true
            state.verifiedEmail =
                response.data.email ??
                email
            state.verificationToken =
                response.data
                    .verification_token
            state.success =
                response.message ||
                'Email verified successfully.'
            state.code = ''
        } catch (error: unknown) {
            state.error =
                getApiErrorMessage(
                    error,
                    'The verification code is invalid or expired.'
                )
        } finally {
            state.verifying = false
        }
    }

const loadEvent = async () => {
    loading.value = true
    errorMessage.value = ''

    if (!token.value) {
        errorMessage.value =
            'The registration link is invalid or incomplete.'

        loading.value = false

        return
    }

    try {
        const response =
            await $fetch<PublicRegistrationResponse>(
                `${apiBaseURL}/events/register/${encodeURIComponent(
                    token.value
                )}`,
                {
                    method: 'GET',

                    headers: {
                        Accept:
                            'application/json',
                    },
                }
            )

        eventData.value =
            response.data.event

        const defaultTicketTypeId =
            getDefaultTicketTypeId()

        form.attendees.forEach(
            attendee => {
                const selectedTicketStillAvailable =
                    availableTicketTypes.value.some(
                        ticketType =>
                            ticketType.id ===
                            attendee.event_ticket_type_id
                    )

                if (
                    !selectedTicketStillAvailable
                ) {
                    attendee.event_ticket_type_id =
                        defaultTicketTypeId
                }
            }
        )
    } catch (error: unknown) {
        eventData.value = null

        errorMessage.value =
            getApiErrorMessage(
                error,
                'Unable to load this registration page.'
            )
    } finally {
        loading.value = false
    }
}

const submitRegistration =
    async () => {
        errorMessage.value = ''
        successMessage.value = ''

        emailSuccessTicketId.value = null
        emailErrorTicketId.value = null

        if (!token.value) {
            errorMessage.value =
                'The registration link is invalid.'

            return
        }

        if (
            !eventData.value?.public_registration
        ) {
            errorMessage.value =
                'Registration is currently closed for this event.'

            return
        }

        if (
            !availableTicketTypes.value.length
        ) {
            errorMessage.value =
                'There are no available ticket types remaining for this event.'

            return
        }

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        const invalidAttendeeIndex =
            form.attendees.findIndex(
                attendee =>
                    !attendee.name.trim() ||
                    !attendee.email.trim() ||
                    !emailPattern.test(
                        attendee.email.trim()
                    ) ||
                    !attendee.event_ticket_type_id
            )

        if (
            invalidAttendeeIndex !== -1
        ) {
            errorMessage.value =
                `Please complete the full name, valid email address, and ticket type for attendee ${invalidAttendeeIndex + 1}.`

            return
        }

        const unverifiedAttendeeIndex =
            form.attendees.findIndex(
                (attendee, index) => {
                    const state =
                        verificationState(index)

                    return !(
                        state.verified &&
                        state.verificationToken &&
                        state.verifiedEmail
                            .toLowerCase() ===
                        attendee.email
                            .trim()
                            .toLowerCase()
                    )
                }
            )

        if (
            unverifiedAttendeeIndex !== -1
        ) {
            errorMessage.value =
                `Please verify the email address for attendee ${unverifiedAttendeeIndex + 1} before submitting.`

            return
        }

        const unavailableTicket =
            form.attendees.find(
                attendee =>
                    !availableTicketTypes.value.some(
                        ticketType =>
                            ticketType.id ===
                            attendee.event_ticket_type_id
                    )
            )

        if (unavailableTicket) {
            errorMessage.value =
                'One of the selected ticket types is no longer available. Please select another ticket type.'

            return
        }

        submitting.value = true

        try {
            const response =
                await $fetch<PublicRegistrationSubmitResponse>(
                    `${apiBaseURL}/events/register/${encodeURIComponent(
                        token.value
                    )}`,
                    {
                        method: 'POST',

                        headers: {
                            Accept:
                                'application/json',
                        },

                        body: {
                            attendees:
                                form.attendees.map(
                                    (
                                        attendee,
                                        index
                                    ) => ({
                                        name:
                                            attendee.name.trim(),

                                        email:
                                            attendee.email.trim(),

                                        contact_no:
                                            attendee.contact_no
                                                ?.trim() ||
                                            null,

                                        event_ticket_type_id:
                                            attendee.event_ticket_type_id,

                                        email_verification_token:
                                            verificationState(
                                                index
                                            )
                                                .verificationToken,
                                    })
                                ),
                        },
                    }
                )

            registeredTickets.value =
                response.data.tickets ??
                []

            successMessage.value =
                response.message ??
                (
                    registeredTickets.value.length > 1
                        ? 'Registration successful. Your QR tickets are ready.'
                        : 'Registration successful. Your QR ticket is ready.'
                )

            await loadEvent()

            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            })
        } catch (error: unknown) {
            errorMessage.value =
                getApiErrorMessage(
                    error,
                    'Registration failed. Please try again.'
                )
        } finally {
            submitting.value =
                false
        }
    }

const downloadTicket = (
    ticket: RegisteredTicket
) => {
    if (!ticket.qr_token) {
        errorMessage.value =
            'This ticket does not have a valid QR token.'

        return
    }

    window.open(
        `${apiBaseURL}/tickets/${encodeURIComponent(
            ticket.qr_token
        )}/download`,
        '_blank',
        'noopener,noreferrer'
    )
}

const sendTicketEmail =
    async (
        ticket: RegisteredTicket
    ) => {
        emailSuccessTicketId.value = null
        emailErrorTicketId.value = null
        delete emailErrorMessages[ticket.id]

        if (!ticket.email) {
            emailErrorTicketId.value =
                ticket.id

            const message =
                'This ticket does not have an attendee email address.'

            emailErrorMessages[ticket.id] =
                message

            errorMessage.value =
                message

            return
        }

        if (!ticket.qr_token) {
            emailErrorTicketId.value =
                ticket.id

            const message =
                'This ticket does not have a valid QR token.'

            emailErrorMessages[ticket.id] =
                message

            errorMessage.value =
                message

            return
        }

        emailSendingTicketId.value =
            ticket.id

        try {
            const response =
                await $fetch<{
                    message: string
                    data?: {
                        email?: string
                        ticket_id?: string
                    }
                }>(
                    `${apiBaseURL}/tickets/${encodeURIComponent(
                        ticket.qr_token
                    )}/email`,
                    {
                        method: 'POST',

                        headers: {
                            Accept:
                                'application/json',
                        },

                        body: {
                            email:
                                ticket.email,
                        },
                    }
                )

            emailSuccessTicketId.value =
                ticket.id

            delete emailErrorMessages[ticket.id]
            errorMessage.value = ''

            console.log(
                response.message
            )
        } catch (error: unknown) {
            console.error(
                'Unable to send ticket email:',
                error
            )

            emailErrorTicketId.value =
                ticket.id

            const message =
                getApiErrorMessage(
                    error,
                    'Unable to send the QR ticket by email.'
                )

            emailErrorMessages[ticket.id] =
                message

            errorMessage.value =
                message
        } finally {
            emailSendingTicketId.value =
                null
        }
    }

const registerMore = () => {
    registeredTickets.value = []

    successMessage.value = ''
    errorMessage.value = ''

    emailSendingTicketId.value = null
    emailSuccessTicketId.value = null
    emailErrorTicketId.value = null

    Object.keys(
        emailErrorMessages
    ).forEach(
        key => {
            delete emailErrorMessages[
                Number(key)
            ]
        }
    )

    form.attendees.splice(
        0,
        form.attendees.length,
        {
            name: '',
            email: '',
            contact_no: '',
            event_ticket_type_id:
                getDefaultTicketTypeId(),
        }
    )

    emailVerificationStates.splice(
        0,
        emailVerificationStates.length,
        createVerificationState()
    )

    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    })
}

onMounted(() => {
    startCountdownTimer()
    loadEvent()
})

onBeforeUnmount(() => {
    if (countdownTimer) {
        clearInterval(
            countdownTimer
        )

        countdownTimer = null
    }
})
</script>
