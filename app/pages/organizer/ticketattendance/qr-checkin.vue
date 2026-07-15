<template>
    <div class="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 class="text-lg font-bold text-gray-900">QR Code Check-in Scanner</h2>
        <p class="mt-1 text-sm text-gray-500">Scan attendee QR tickets for entry</p>

        <div class="my-8 flex flex-col items-center">
            <div
                class="flex h-56 w-56 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 text-center">
                <IconBase name="qr-code" class="h-14 w-14 text-gray-400" />
                <div class="mt-4 text-base font-bold text-gray-900">QR Scanner Active</div>
                <p class="mt-1 text-sm text-gray-500">Position QR code within frame to scan</p>
            </div>

            <div class="mt-6 flex gap-3">
                <button type="button"
                    class="flex items-center gap-2 rounded-xl bg-[#285F6b] px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800">
                    <IconBase name="qr-code" class="h-4 w-4" /> Start Scanning
                </button>
                <button type="button"
                    class="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                    Manual Entry
                </button>
            </div>
        </div>

        <div class="border-t border-gray-100 pt-6">
            <h3 class="mb-4 text-base font-bold text-gray-900">Recent Check-ins</h3>
            <div class="divide-y divide-gray-100">
                <div v-for="entry in recentCheckIns" :key="entry.name" class="flex items-center justify-between py-3.5">
                    <div class="flex items-center gap-3">
                        <IconBase name="check-circle" class="h-5 w-5 text-green-600" />
                        <div>
                            <div class="text-sm font-bold text-gray-900">{{ entry.name }}</div>
                            <div class="text-sm text-gray-500">{{ entry.ticketType }}</div>
                        </div>
                    </div>
                    <span class="text-sm text-gray-400">{{ entry.time }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const recentCheckIns = [
    { name: 'Sean Kenneth H. Axalan', ticketType: 'VIP Front Row', time: '9:15 AM' },
    { name: 'Nathan Sevilla', ticketType: 'Main Floor', time: '9:22 AM' },
    { name: 'Rylle Manco', ticketType: 'Balcony', time: '9:45 AM' }
]
</script>
