<template>
    <main class="min-h-screen bg-slate-50 px-4 py-12 sm:px-6">
        <div class="mx-auto max-w-2xl">
            <div class="mb-8 flex items-center gap-3">
                <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-[#285F6b] font-bold text-white">N</div>
                <div><p class="font-bold text-slate-900">NaSeRy</p><p class="text-xs text-slate-500">Secure event payment</p></div>
            </div>

            <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8">
                <div v-if="loading" class="py-10 text-center"><p class="font-bold text-slate-900">Confirming your payment…</p><p class="mt-2 text-sm text-slate-500">Please keep this page open.</p></div>
                <div v-else-if="errorMessage" class="rounded-2xl border border-red-100 bg-red-50 p-5 text-red-700"><p class="font-bold">We could not confirm the payment</p><p class="mt-1 text-sm">{{ errorMessage }}</p><button class="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-bold shadow-sm" @click="loadPayment">Try again</button></div>
                <template v-else>
                    <div class="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-600">✓</div>
                    <h1 class="mt-5 text-2xl font-extrabold text-slate-900">Payment confirmed</h1>
                    <p class="mt-2 text-sm leading-6 text-slate-500">Your registration is complete. Download your ticket or send another copy to your verified email.</p>

                    <div class="mt-6 space-y-3">
                        <div v-for="ticket in tickets" :key="ticket.id" class="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:flex sm:items-center sm:justify-between">
                            <div><p class="font-bold text-slate-900">{{ ticket.name }}</p><p class="mt-1 text-sm text-slate-500">{{ ticket.ticket_type?.name }} · {{ ticket.ticket_id }}</p></div>
                            <div class="mt-4 flex gap-2 sm:mt-0"><button class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700" @click="printTicket(ticket)">Print</button><button class="rounded-xl bg-[#285F6b] px-4 py-2 text-sm font-bold text-white" @click="downloadTicket(ticket)">Download PDF</button></div>
                        </div>
                    </div>

                    <p v-if="!tickets.length" class="mt-6 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">Payment is complete. This event requires organizer approval, so your ticket will be emailed after approval.</p>
                </template>
            </section>
        </div>
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

const loadPayment = async () => {
    loading.value = true
    errorMessage.value = ''
    const reference = typeof route.query.payment_reference === 'string' ? route.query.payment_reference : ''
    if (!reference) { errorMessage.value = 'The payment reference is missing.'; loading.value = false; return }
    try {
        const response = await $fetch<{ data: { status: string; tickets: RegisteredTicket[] } }>(`${apiBaseURL}/event-payments/${encodeURIComponent(reference)}`)
        if (response.data.status !== 'paid') throw new Error('Payment is still processing. Please try again in a moment.')
        tickets.value = response.data.tickets
    } catch (error: unknown) {
        errorMessage.value = error instanceof Error ? error.message : 'Unable to verify this payment.'
    } finally { loading.value = false }
}

const downloadTicket = (ticket: RegisteredTicket) => window.location.assign(`${apiBaseURL}/tickets/${encodeURIComponent(ticket.qr_token)}/download`)
const printTicket = (ticket: RegisteredTicket) => {
    const popup = window.open(`${apiBaseURL}/tickets/${encodeURIComponent(ticket.qr_token)}/download`, '_blank')
    popup?.focus()
}

onMounted(loadPayment)
</script>
