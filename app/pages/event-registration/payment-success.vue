<template>
    <main class="relative min-h-screen overflow-hidden bg-slate-50 px-4 py-12 sm:px-6">
        <div class="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary-100/50 blur-3xl" />

        <div class="relative mx-auto max-w-2xl">
            <div class="mb-8 flex items-center gap-3">
                <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-[#285F6b] font-bold text-white shadow-lg shadow-primary-900/20 ring-1 ring-black/5">N</div>
                <div><p class="font-bold text-slate-900">NaSeRy</p><p class="text-xs text-slate-500">Secure event payment</p></div>
            </div>

            <section class="overflow-hidden rounded-[28px] border border-slate-200/70 bg-white shadow-2xl shadow-slate-900/10">
                <div class="h-1.5 bg-[#285F6b]" />

                <div class="p-6 sm:p-9">
                    <div v-if="loading" class="py-10 text-center">
                        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-50">
                            <IconBase name="refresh-cw" class="h-5 w-5 animate-spin text-primary-700" />
                        </div>
                        <p class="mt-4 font-bold text-slate-900">Confirming your payment…</p>
                        <p class="mt-1 text-sm text-slate-500">Please keep this page open.</p>
                    </div>
                    <div v-else-if="errorMessage" class="rounded-2xl border border-red-100 bg-red-50 p-5 text-red-700">
                        <p class="font-bold">We could not confirm the payment</p>
                        <p class="mt-1 text-sm">{{ errorMessage }}</p>
                        <button class="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold shadow-sm ring-1 ring-red-200 transition hover:bg-red-50/50" @click="loadPayment">
                            <IconBase name="refresh-cw" class="h-4 w-4" />
                            Try again
                        </button>
                    </div>
                    <template v-else>
                        <div class="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/60">
                            <IconBase name="check-circle" class="h-8 w-8 text-emerald-600" />
                        </div>
                        <h1 class="mt-5 text-center text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Payment confirmed</h1>
                        <p class="mx-auto mt-2 max-w-sm text-center text-sm leading-6 text-slate-500">Your registration is complete. Download your ticket or send another copy to your verified email.</p>

                        <div class="mt-8 space-y-3">
                            <div v-for="ticket in tickets" :key="ticket.id"
                                class="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-5 transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
                                <div class="flex items-center gap-3.5">
                                    <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                                        <IconBase name="ticket" class="h-5 w-5 text-primary-700" />
                                    </div>
                                    <div class="min-w-0">
                                        <p class="truncate font-bold text-slate-900">{{ ticket.name }}</p>
                                        <p class="mt-0.5 text-sm text-slate-500">{{ ticket.ticket_type?.name }} · <span class="font-mono">{{ ticket.ticket_id }}</span></p>
                                    </div>
                                </div>
                                <button
                                    class="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#285F6b] px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-primary-900/20 transition hover:-translate-y-0.5 hover:bg-[#1f4a54] hover:shadow-md"
                                    @click="openDeliveryModal(ticket)">
                                    <IconBase name="ticket" class="h-4 w-4" />
                                    Get My Ticket
                                </button>
                            </div>
                        </div>

                        <div v-if="!tickets.length" class="mt-8 flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-5">
                            <IconBase name="clock" class="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                            <p class="text-sm leading-6 text-amber-800">Payment is complete. This event requires organizer approval, so your ticket will be emailed after approval.</p>
                        </div>

                        <div v-if="registrationToken" class="mt-8 border-t border-dashed border-slate-200 pt-6 text-center">
                            <NuxtLink :to="`/event-registration/${registrationToken}`"
                                class="inline-flex items-center gap-1.5 rounded-full border border-primary-100 bg-primary-50/60 px-4 py-2 text-sm font-bold text-primary-700 transition hover:bg-primary-100">
                                <IconBase name="arrow-left" class="h-3.5 w-3.5" />
                                Return to Event Registration
                            </NuxtLink>
                        </div>
                    </template>
                </div>
            </section>
        </div>

        <RegistrationTicketDeliveryModal :open="activeTicket !== null" :ticket-name="activeTicket?.name ?? ''"
            :ticket-label="activeTicket ? `${activeTicket.ticket_type?.name ?? ''} · ${activeTicket.ticket_id}` : ''"
            :emailing="activeTicket !== null && emailingId === activeTicket.id"
            :email-sent="activeTicket !== null && emailedIds.has(activeTicket.id)" :email-error="emailError"
            @close="closeDeliveryModal" @download="downloadTicket(activeTicket!)" @email="emailTicket(activeTicket!)"
            @print="printTicket(activeTicket!)" />
    </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { RegisteredTicket } from '~/types/public-registration'

definePageMeta({ layout: false })
const route = useRoute()
const config = useRuntimeConfig()
const apiBaseURL = (config.public.apiBaseURL as string | undefined) ?? 'http://127.0.0.1:8000/api'
const loading = ref(true)
const errorMessage = ref('')
const tickets = ref<RegisteredTicket[]>([])
const registrationToken = ref('')
const emailingId = ref<number | null>(null)
const emailedIds = ref<Set<number>>(new Set())
const emailError = ref('')
const activeTicket = ref<RegisteredTicket | null>(null)

const openDeliveryModal = (ticket: RegisteredTicket) => {
    emailError.value = ''
    activeTicket.value = ticket
}
const closeDeliveryModal = () => { activeTicket.value = null }

const loadPayment = async () => {
    loading.value = true
    errorMessage.value = ''
    const reference = typeof route.query.payment_reference === 'string' ? route.query.payment_reference : ''
    if (!reference) { errorMessage.value = 'The payment reference is missing.'; loading.value = false; return }
    try {
        const response = await $fetch<{ data: { status: string; tickets: RegisteredTicket[]; registration_token: string | null } }>(`${apiBaseURL}/event-payments/${encodeURIComponent(reference)}`)
        if (response.data.status !== 'paid') throw new Error('Payment is still processing. Please try again in a moment.')
        tickets.value = response.data.tickets
        registrationToken.value = response.data.registration_token ?? ''
    } catch (error: unknown) {
        errorMessage.value = getApiErrorMessage(error, 'Unable to verify this payment.')
    } finally { loading.value = false }
}

const emailTicket = async (ticket: RegisteredTicket) => {
    emailError.value = ''
    emailingId.value = ticket.id
    try {
        await $fetch(`${apiBaseURL}/tickets/${encodeURIComponent(ticket.qr_token)}/email`, { method: 'POST' })
        emailedIds.value.add(ticket.id)
    } catch (error: unknown) {
        emailError.value = getApiErrorMessage(error, 'Unable to email this ticket. Please try again.')
    } finally { emailingId.value = null }
}

function getApiErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof Error && !('data' in error)) return error.message
    const apiError = error as { data?: { message?: string } }
    return apiError?.data?.message || fallback
}

const downloadTicket = (ticket: RegisteredTicket) => window.location.assign(`${apiBaseURL}/tickets/${encodeURIComponent(ticket.qr_token)}/download`)
const printTicket = (ticket: RegisteredTicket) => {
    const popup = window.open(`${apiBaseURL}/tickets/${encodeURIComponent(ticket.qr_token)}/download`, '_blank')
    popup?.focus()
}

onMounted(loadPayment)
</script>
