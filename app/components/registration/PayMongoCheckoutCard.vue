<template>
    <section class="overflow-hidden rounded-3xl border border-[#285F6b]/15 bg-white shadow-xl shadow-slate-900/5">
        <div class="bg-gradient-to-br from-[#173f48] to-[#285F6b] p-6 text-white sm:p-7">
            <div class="flex items-start justify-between gap-4">
                <div>
                    <p class="text-xs font-bold uppercase tracking-[0.18em] text-white/60">Secure payment</p>
                    <h2 class="mt-2 text-2xl font-extrabold">Complete your registration</h2>
                    <p class="mt-2 max-w-lg text-sm leading-6 text-white/75">Pay safely through PayMongo. Your ticket becomes available only after payment is confirmed.</p>
                </div>
                <span class="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold">PayMongo</span>
            </div>
        </div>

        <div class="p-6 sm:p-7">
            <div class="flex items-center justify-between rounded-2xl bg-slate-50 px-5 py-4">
                <div><p class="text-xs font-semibold text-slate-500">Amount due</p><p class="mt-1 text-xs text-slate-400">Cards and supported e-wallets</p></div>
                <p class="text-2xl font-extrabold text-[#285F6b]">{{ formattedAmount }}</p>
            </div>

            <button type="button" class="mt-5 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#285F6b] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#285F6b]/20 transition hover:-translate-y-0.5 hover:bg-[#1f4a54]" @click="$emit('checkout')">
                Continue to secure payment
                <span aria-hidden="true">→</span>
            </button>
            <p class="mt-3 text-center text-xs leading-5 text-slate-400">You will be redirected to PayMongo to finish payment.</p>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ amount: number | string; currency?: string }>()
defineEmits<{ checkout: [] }>()

const formattedAmount = computed(() => new Intl.NumberFormat('en-PH', {
    style: 'currency', currency: props.currency || 'PHP', minimumFractionDigits: 2,
}).format(Number(props.amount)))
</script>
