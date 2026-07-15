<template>
    <div class="rounded-2xl border border-gray-200 bg-white p-6">
        <div class="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
                <h2 class="text-lg font-bold text-gray-900">Walk-in Registration Counter</h2>
                <p class="mt-1 text-sm text-gray-500">Process on-site ticket purchases</p>
            </div>
            <button type="button"
                class="flex shrink-0 items-center gap-2 rounded-xl bg-[#285F6b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
                @click="openWalkInForm">
                <IconBase name="user-plus" class="h-4 w-4" /> New Walk-in
            </button>
        </div>

        <div class="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <IconBase name="users" class="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div>
                <div class="text-sm font-bold text-gray-900">Capacity Warning</div>
                <p class="mt-0.5 text-sm text-gray-600">Current capacity at {{ capacityPercent }}%. Remaining slots: {{
                    remainingSlots }}</p>
            </div>
        </div>

        <div class="mb-3 flex items-center justify-between">
            <h3 class="text-base font-bold text-gray-900">Walk-in Queue</h3>
            <span class="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">{{ queue.length }}
                pending</span>
        </div>

        <div v-if="queue.length" class="divide-y divide-gray-100">
            <div v-for="entry in queue" :key="entry.id" class="flex items-center justify-between py-3.5">
                <div class="flex items-center gap-3">
                    <IconBase name="user-plus" class="h-5 w-5 text-primary-700" />
                    <div>
                        <div class="text-sm font-bold text-gray-900">{{ entry.name }}</div>
                        <div class="text-sm text-gray-500">{{ entry.ticketType }}</div>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <span class="text-sm text-gray-400">{{ entry.time }}</span>
                    <button type="button"
                        class="flex items-center gap-2 rounded-lg bg-gray-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-gray-800"
                        @click="processPayment(entry.id)">
                        <IconBase name="credit-card" class="h-3.5 w-3.5" /> Process Payment
                    </button>
                </div>
            </div>
        </div>
        <p v-else class="py-6 text-center text-sm text-gray-400">No walk-ins in queue.</p>

        <Transition name="fade">
            <div v-if="showWalkInForm" class="fixed inset-0 z-40 bg-gray-900/40" @click="closeWalkInForm" />
        </Transition>

        <Transition name="slide">
            <div v-if="showWalkInForm"
                class="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl">
                <div class="flex shrink-0 items-start justify-between border-b border-gray-200 px-6 py-5">
                    <div class="flex items-start gap-3">
                        <div
                            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-white">
                            <IconBase name="user-plus" class="h-5 w-5" />
                        </div>
                        <div>
                            <h2 class="text-base font-bold text-gray-900">New Walk-in</h2>
                            <p class="text-sm text-gray-500">Register a walk-in attendee</p>
                        </div>
                    </div>
                    <button type="button" class="text-gray-400 hover:text-gray-600" @click="closeWalkInForm">
                        <IconBase name="x" class="h-5 w-5" />
                    </button>
                </div>

                <div class="flex-1 overflow-y-auto px-6 py-5">
                    <label class="mb-1.5 block text-sm font-semibold text-gray-700">Full Name *</label>
                    <div class="relative">
                        <IconBase name="user"
                            class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input v-model="walkInForm.name" type="text" placeholder="e.g. Robert Brown"
                            class="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15" />
                    </div>

                    <label class="mb-1.5 mt-4 block text-sm font-semibold text-gray-700">Ticket Type *</label>
                    <select v-model="walkInForm.ticketType"
                        class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15">
                        <option v-for="tier in ticketTiers" :key="tier.name" :value="tier.name">{{ tier.name }} — {{
                            tier.price }}</option>
                    </select>

                    <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                            <label class="mb-1.5 block text-sm font-semibold text-gray-700">Email Address</label>
                            <input v-model="walkInForm.email" type="email" placeholder="e.g. robert@example.com"
                                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15" />
                        </div>
                        <div>
                            <label class="mb-1.5 block text-sm font-semibold text-gray-700">Phone Number</label>
                            <input v-model="walkInForm.phone" type="text" placeholder="e.g. 0917 123 4567"
                                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15" />
                        </div>
                    </div>

                    <label class="mb-1.5 mt-4 block text-sm font-semibold text-gray-700">Payment Method</label>
                    <select v-model="walkInForm.paymentMethod"
                        class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15">
                        <option v-for="method in paymentMethods" :key="method" :value="method">{{ method }}</option>
                    </select>
                </div>

                <div class="flex shrink-0 gap-3 border-t border-gray-200 px-6 py-4">
                    <button type="button"
                        class="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        @click="closeWalkInForm">
                        Cancel
                    </button>
                    <button type="button"
                        class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
                        :disabled="!walkInForm.name" @click="submitWalkIn">
                        <IconBase name="user-plus" class="h-4 w-4" />
                        Add to Queue
                    </button>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const totalCapacity = 1000
const checkedIn = 6
const capacityPercent = Math.round((checkedIn / totalCapacity) * 100)
const remainingSlots = totalCapacity - checkedIn

const ticketTiers = [
    { name: 'VIP Front Row', price: '₱5,000' },
    { name: 'Main Floor', price: '₱2,500' },
    { name: 'Balcony', price: '₱1,500' }
]

const paymentMethods = ['Cash', 'Card', 'GCash']

const queue = reactive([
    { id: 1, name: 'Marlo Deang', ticketType: 'Main Floor', time: '10:05 AM' },
    { id: 2, name: 'John Romar Pardo', ticketType: 'Balcony', time: '10:12 AM' },
    { id: 3, name: 'Vince David Canale', ticketType: 'VIP Front Row', time: '10:18 AM' }
])

let nextId = 4

const showWalkInForm = ref(false)

function emptyWalkInForm() {
    return {
        name: '',
        ticketType: ticketTiers[0].name,
        email: '',
        phone: '',
        paymentMethod: paymentMethods[0]
    }
}

const walkInForm = reactive(emptyWalkInForm())

function openWalkInForm() {
    Object.assign(walkInForm, emptyWalkInForm())
    showWalkInForm.value = true
}

function closeWalkInForm() {
    showWalkInForm.value = false
}

function submitWalkIn() {
    if (!walkInForm.name) return
    queue.push({
        id: nextId++,
        name: walkInForm.name,
        ticketType: walkInForm.ticketType,
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    })
    closeWalkInForm()
}

function processPayment(id) {
    const index = queue.findIndex((entry) => entry.id === id)
    if (index !== -1) queue.splice(index, 1)
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.25s ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
