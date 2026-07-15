<template>
    <div class="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 class="text-lg font-bold text-gray-900">Post-Event Attendance Report</h2>
        <p class="mt-1 text-sm text-gray-500">Comprehensive event attendance analytics</p>

        <div class="mb-6 mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div class="rounded-xl border border-gray-200 p-5">
                <span class="text-sm text-gray-500">Total Registered</span>
                <div class="mt-2 text-3xl font-extrabold text-gray-900">{{ totalRegistered }}</div>
                <div class="mt-2 text-sm text-gray-500">Online tickets sold</div>
            </div>
            <div class="rounded-xl border border-gray-200 p-5">
                <span class="text-sm text-gray-500">Total Attended</span>
                <div class="mt-2 text-3xl font-extrabold text-gray-900">{{ totalAttended }}</div>
                <div class="mt-2 text-sm text-gray-500">Check-in completed</div>
            </div>
            <div class="rounded-xl border border-gray-200 p-5">
                <span class="text-sm text-gray-500">Attendance Rate</span>
                <div class="mt-2 text-3xl font-extrabold text-gray-900">{{ attendanceRate }}%</div>
                <div class="mt-2 text-sm text-gray-500">Registered vs attended</div>
            </div>
        </div>

        <h3 class="mb-4 text-base font-bold text-gray-900">Attendance by Ticket Type</h3>
        <div class="space-y-5">
            <div v-for="row in byTicketType" :key="row.type">
                <div class="mb-1.5 flex items-center justify-between text-sm">
                    <span class="font-medium text-gray-700">{{ row.type }}</span>
                    <span class="text-gray-500">{{ row.attended }} / {{ row.total }} ({{ row.percent }}%)</span>
                </div>
                <div class="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                    <div class="h-full rounded-full bg-[#285F6b]" :style="{ width: row.percent + '%' }" />
                </div>
            </div>
        </div>

        <div class="mt-6 flex gap-3">
            <button type="button"
                class="flex items-center gap-2 rounded-xl bg-[#285F6b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800">
                <IconBase name="download" class="h-4 w-4" /> Download PDF Report
            </button>
            <button type="button"
                class="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                <IconBase name="download" class="h-4 w-4" /> Export CSV
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const attendees = [
    { ticketType: 'VIP Front Row', status: 'checked-in' },
    { ticketType: 'Main Floor', status: 'checked-in' },
    { ticketType: 'VIP Front Row', status: 'registered' },
    { ticketType: 'Main Floor', status: 'registered' },
    { ticketType: 'Balcony', status: 'checked-in' }
]

const totalRegistered = attendees.length
const totalAttended = attendees.filter((a) => a.status === 'checked-in').length
const attendanceRate = Math.round((totalAttended / totalRegistered) * 100)

const ticketTypeOrder = ['VIP Front Row', 'Main Floor', 'Balcony']

const byTicketType = ticketTypeOrder.map((type) => {
    const rows = attendees.filter((a) => a.ticketType === type)
    const attended = rows.filter((a) => a.status === 'checked-in').length
    return { type, attended, total: rows.length, percent: Math.round((attended / rows.length) * 100) }
})
</script>
