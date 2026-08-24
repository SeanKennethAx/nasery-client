<template>
    <div class="rounded-2xl border border-gray-200 bg-white p-6">
        <div class="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
                <h2 class="text-lg font-bold text-gray-900">
                    Walk-in Registration Counter
                </h2>

                <p class="mt-1 text-sm text-gray-500">
                    <span v-if="selectedEvent">
                        Process on-site ticket purchases for
                        <span class="font-semibold text-gray-700">
                            {{ selectedEvent.name }}
                        </span>
                    </span>

                    <span v-else>
                        Process on-site ticket purchases
                    </span>
                </p>
            </div>

            <button type="button"
                class="flex shrink-0 items-center gap-2 rounded-xl bg-[#285F6b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1f4a54] disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="!selectedEventId" @click="openWalkInForm">
                <IconBase name="user-plus" class="h-4 w-4" />

                New Walk-in
            </button>
        </div>

        <div v-if="errorMessage" class="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {{ errorMessage }}
        </div>

        <div v-if="!selectedEventId" class="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div class="flex items-start gap-3">
                <IconBase name="calendar" class="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                <div>
                    <div class="text-sm font-bold text-gray-900">
                        Select an Event
                    </div>

                    <p class="mt-0.5 text-sm text-gray-600">
                        Choose an event from the event selector above before adding walk-in attendees.
                    </p>
                </div>
            </div>
        </div>

        <template v-else>
            <div class="mb-3 flex items-center justify-between">
                <div>
                    <h3 class="text-base font-bold text-gray-900">
                        Walk-in Queue
                    </h3>

                    <p class="mt-0.5 text-xs text-gray-500">
                        Pending walk-in registrations waiting for payment
                    </p>
                </div>

                <span class="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">
                    {{ pendingQueue.length }}
                    pending
                </span>
            </div>

            <div v-if="isLoadingWalkIns" class="py-8 text-center text-sm text-gray-500">
                <IconBase name="refresh-cw" class="mx-auto mb-2 h-5 w-5 animate-spin text-gray-400" />

                Loading walk-in queue...
            </div>

            <div v-else-if="pendingQueue.length" class="divide-y divide-gray-100">
                <div v-for="entry in pendingQueue" :key="entry.id"
                    class="flex flex-wrap items-center justify-between gap-4 py-3.5">
                    <div class="flex items-center gap-3">
                        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#285F6b]/10">
                            <IconBase name="user-plus" class="h-5 w-5 text-[#285F6b]" />
                        </div>

                        <div>
                            <div class="text-sm font-bold text-gray-900">
                                {{ entry.name }}
                            </div>

                            <div class="mt-0.5 text-sm text-gray-500">
                                {{
                                    entry.ticket_type
                                        ?.name ||
                                    'Ticket type'
                                }}

                                <span v-if="entry.amount">
                                    •
                                    {{
                                        formatCurrency(
                                            entry.amount,
                                        )
                                    }}
                                </span>
                            </div>

                            <div v-if="
                                entry.email ||
                                entry.phone
                            " class="mt-1 text-xs text-gray-400">
                                <span v-if="entry.email">
                                    {{ entry.email }}
                                </span>

                                <span v-if="
                                    entry.email &&
                                    entry.phone
                                ">
                                    •
                                </span>

                                <span v-if="entry.phone">
                                    {{ entry.phone }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-4">
                        <span class="text-sm text-gray-400">
                            {{
                                formatTime(
                                    entry.created_at,
                                )
                            }}
                        </span>

                        <button type="button"
                            class="flex items-center gap-2 rounded-lg bg-gray-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                            :disabled="processingPaymentId ===
                                entry.id
                                " @click="
                                    processPayment(
                                        entry,
                                    )
                                    ">
                            <IconBase v-if="
                                processingPaymentId ===
                                entry.id
                            " name="refresh-cw" class="h-3.5 w-3.5 animate-spin" />

                            <IconBase v-else name="credit-card" class="h-3.5 w-3.5" />

                            {{
                                processingPaymentId ===
                                    entry.id
                                    ? 'Processing...'
                                    : 'Process Payment'
                            }}
                        </button>
                    </div>
                </div>
            </div>

            <div v-else class="rounded-xl border border-dashed border-gray-300 px-5 py-10 text-center">
                <IconBase name="user-plus" class="mx-auto h-7 w-7 text-gray-400" />

                <p class="mt-2 text-sm font-semibold text-gray-700">
                    No walk-ins in queue
                </p>

                <p class="mt-1 text-xs text-gray-500">
                    New walk-in registrations for this event will appear here.
                </p>
            </div>
        </template>

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
                            <h2 class="text-base font-bold text-gray-900">
                                New Walk-in
                            </h2>

                            <p class="text-sm text-gray-500">
                                {{
                                    selectedEvent?.name ||
                                    'Register a walk-in attendee'
                                }}
                            </p>
                        </div>
                    </div>

                    <button type="button" class="text-gray-400 hover:text-gray-600" @click="closeWalkInForm">
                        <IconBase name="x" class="h-5 w-5" />
                    </button>
                </div>

                <div class="flex-1 overflow-y-auto px-6 py-5">
                    <div v-if="walkInFormError"
                        class="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {{ walkInFormError }}
                    </div>

                    <FormsLabel text="Full Name" required />

                    <FormsTextField v-model="walkInForm.name" icon="user" placeholder="e.g. Robert Brown" required />

                    <label class="mb-1.5 mt-4 block text-sm font-semibold text-gray-700">
                        Ticket Type *
                    </label>

                    <select v-model="walkInForm.ticketTypeId"
                        class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15">
                        <option :value="null" disabled>
                            Select ticket type
                        </option>

                        <option v-for="tier in ticketTiers" :key="tier.id" :value="tier.id">
                            {{ tier.name }}
                            —
                            {{
                                formatCurrency(
                                    tier.price,
                                )
                            }}
                        </option>
                    </select>

                    <div v-if="!ticketTiers.length"
                        class="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                        No ticket types are configured for this event.
                    </div>

                    <div v-if="selectedTicketType" class="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
                        <div class="flex items-center justify-between gap-3">
                            <span class="text-xs font-medium text-gray-500">
                                Ticket Price
                            </span>

                            <span class="text-sm font-bold text-gray-900">
                                {{
                                    formatCurrency(
                                        selectedTicketType.price,
                                    )
                                }}
                            </span>
                        </div>
                    </div>

                    <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                            <FormsLabel text="Email Address" />

                            <FormsTextField v-model="walkInForm.email" type="email"
                                placeholder="e.g. robert@example.com" />
                        </div>

                        <div>
                            <FormsLabel text="Phone Number" />

                            <FormsTextField v-model="walkInForm.phone" placeholder="e.g. 0917 123 4567" />
                        </div>
                    </div>
                </div>

                <div class="flex shrink-0 gap-3 border-t border-gray-200 px-6 py-4">
                    <FormsButton variant="secondary" class="flex-1" :disabled="isSubmittingWalkIn"
                        @click="closeWalkInForm">
                        Cancel
                    </FormsButton>

                    <FormsButton class="flex-1" :disabled="isSubmittingWalkIn ||
                        !walkInForm.name.trim() ||
                        !walkInForm.ticketTypeId
                        " @click="submitWalkIn">
                        <IconBase v-if="isSubmittingWalkIn" name="refresh-cw" class="h-4 w-4 animate-spin" />

                        <IconBase v-else name="user-plus" class="h-4 w-4" />

                        {{
                            isSubmittingWalkIn
                                ? 'Adding...'
                                : 'Add to Queue'
                        }}
                    </FormsButton>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
interface OrganizerEvent {
    id: number
    name: string
    event_type: string
    event_date: string | null
    location: string | null
    status: string
    ticket_types?: TicketType[]
}

interface TicketType {
    id: number
    name: string
    price: string | number
    capacity: number
}

interface WalkIn {
    id: number
    event_id: number
    event_ticket_type_id: number | null
    name: string
    email: string | null
    phone: string | null
    amount: string | number

    payment_status:
    | 'pending'
    | 'paid'
    | 'cancelled'

    paid_at: string | null
    created_at: string
    ticket_type?: TicketType | null
}

interface WalkInSummary {
    pending: number
    paid: number
    capacity: number
    registered: number
    remaining: number
}

type EventDetailResponse =
    | OrganizerEvent
    | {
        data: OrganizerEvent
    }

interface WalkInResponse {
    data: WalkIn[]
}

interface WalkInSummaryResponse {
    data: WalkInSummary
}

interface CreateWalkInResponse {
    message?: string
    data: WalkIn
}

interface PaymentResponse {
    message?: string

    data: {
        walk_in: WalkIn
        ticket: unknown
    }
}

interface AttendeeSummary {
    total_registered: number
    checked_in: number
    walk_ins: number
    capacity: number
    capacity_percent: number
}

interface AttendeeSummaryResponse {
    data: AttendeeSummary
}

interface ApiErrorResponse {
    data?: {
        message?: string
        errors?: Record<string, string[]>
    }
}

definePageMeta({
    layout: 'dashboard',
    middleware: ['organizer'],
})

const config =
    useRuntimeConfig()

const {
    token,
} = useAuth()

const organizerEvents =
    useState<OrganizerEvent[]>(
        'ticketingOrganizerEvents',
        () => [],
    )

const selectedEventId =
    useState<number | null>(
        'ticketingSelectedEventId',
        () => null,
    )

const ticketingSummary =
    useState<AttendeeSummary>(
        'ticketingAttendeeSummary',
        () => ({
            total_registered: 0,
            checked_in: 0,
            walk_ins: 0,
            capacity: 0,
            capacity_percent: 0,
        }),
    )

const selectedEvent =
    computed<OrganizerEvent | null>(
        () => {
            if (
                !selectedEventId.value
            ) {
                return null
            }

            return (
                organizerEvents.value.find(
                    event =>
                        event.id ===
                        selectedEventId.value,
                ) ?? null
            )
        },
    )

const ticketTiers =
    ref<TicketType[]>([])

const walkIns =
    ref<WalkIn[]>([])

const walkInSummary =
    ref<WalkInSummary>({
        pending: 0,
        paid: 0,
        capacity: 0,
        registered: 0,
        remaining: 0,
    })

const isLoadingWalkIns =
    ref(false)

const errorMessage =
    ref('')

const showWalkInForm =
    ref(false)

const walkInFormError =
    ref('')

const isSubmittingWalkIn =
    ref(false)

const processingPaymentId =
    ref<number | null>(
        null,
    )

const pendingQueue =
    computed(() =>
        walkIns.value.filter(
            entry =>
                entry.payment_status ===
                'pending',
        ),
    )

function emptyWalkInForm() {
    return {
        name: '',

        ticketTypeId:
            null as number | null,

        email: '',
        phone: '',
    }
}

const walkInForm =
    reactive(
        emptyWalkInForm(),
    )

const selectedTicketType =
    computed<TicketType | null>(
        () => {
            if (
                !walkInForm.ticketTypeId
            ) {
                return null
            }

            return (
                ticketTiers.value.find(
                    ticket =>
                        ticket.id ===
                        walkInForm.ticketTypeId,
                ) ?? null
            )
        },
    )

function getApiErrorMessage(
    error: unknown,
    fallback: string,
): string {
    const apiError =
        error as ApiErrorResponse

    const validationError =
        Object.values(
            apiError.data?.errors ?? {},
        )[0]?.[0]

    return (
        validationError ??
        apiError.data?.message ??
        fallback
    )
}

function extractEvent(
    response: EventDetailResponse,
): OrganizerEvent {
    if (
        typeof response === 'object' &&
        response !== null &&
        'data' in response
    ) {
        return response.data
    }

    return response as OrganizerEvent
}

async function loadSelectedEvent() {
    if (
        !token.value ||
        !selectedEventId.value
    ) {
        ticketTiers.value =
            []

        return
    }

    try {
        const response =
            await $fetch<EventDetailResponse>(
                `${config.public.apiBaseURL}/organizer/events/${selectedEventId.value}`,
                {
                    method: 'GET',

                    headers: {
                        Accept:
                            'application/json',

                        Authorization:
                            `Bearer ${token.value}`,
                    },
                },
            )

        const event =
            extractEvent(
                response,
            )

        ticketTiers.value =
            event.ticket_types ??
            []

    } catch (error: unknown) {
        console.error(
            'Failed to load selected event:',
            error,
        )

        errorMessage.value =
            getApiErrorMessage(
                error,
                'Unable to load event ticket types.',
            )
    }
}

async function loadWalkIns() {
    if (
        !token.value ||
        !selectedEventId.value
    ) {
        walkIns.value =
            []

        return
    }

    isLoadingWalkIns.value =
        true

    errorMessage.value =
        ''

    try {
        const [
            walkInResponse,
            summaryResponse,
        ] = await Promise.all([
            $fetch<WalkInResponse>(
                `${config.public.apiBaseURL}/organizer/events/${selectedEventId.value}/walk-ins`,
                {
                    method: 'GET',

                    headers: {
                        Accept:
                            'application/json',

                        Authorization:
                            `Bearer ${token.value}`,
                    },
                },
            ),

            $fetch<WalkInSummaryResponse>(
                `${config.public.apiBaseURL}/organizer/events/${selectedEventId.value}/walk-in-summary`,
                {
                    method: 'GET',

                    headers: {
                        Accept:
                            'application/json',

                        Authorization:
                            `Bearer ${token.value}`,
                    },
                },
            ),
        ])

        walkIns.value =
            walkInResponse.data ??
            []

        walkInSummary.value =
            summaryResponse.data

    } catch (error: unknown) {
        console.error(
            'Failed to load walk-ins:',
            error,
        )

        errorMessage.value =
            getApiErrorMessage(
                error,
                'Unable to load walk-ins.',
            )

    } finally {
        isLoadingWalkIns.value =
            false
    }
}

async function refreshTopSummary() {
    if (
        !token.value ||
        !selectedEventId.value
    ) {
        return
    }

    try {
        const response =
            await $fetch<AttendeeSummaryResponse>(
                `${config.public.apiBaseURL}/organizer/events/${selectedEventId.value}/attendee-summary`,
                {
                    method: 'GET',

                    headers: {
                        Accept:
                            'application/json',

                        Authorization:
                            `Bearer ${token.value}`,
                    },
                },
            )

        ticketingSummary.value =
            response.data

    } catch (error: unknown) {
        console.error(
            'Failed to refresh ticketing summary:',
            error,
        )
    }
}

function openWalkInForm() {
    if (
        !selectedEventId.value
    ) {
        return
    }

    Object.assign(
        walkInForm,
        emptyWalkInForm(),
    )

    if (
        ticketTiers.value.length ===
        1
    ) {
        walkInForm.ticketTypeId =
            ticketTiers.value[0]?.id ??
            null
    }

    walkInFormError.value =
        ''

    showWalkInForm.value =
        true
}

function closeWalkInForm() {
    if (
        isSubmittingWalkIn.value
    ) {
        return
    }

    showWalkInForm.value =
        false

    walkInFormError.value =
        ''
}

async function submitWalkIn() {
    if (
        !token.value ||
        !selectedEventId.value
    ) {
        return
    }

    if (
        !walkInForm.name.trim()
    ) {
        walkInFormError.value =
            'Full name is required.'

        return
    }

    if (
        !walkInForm.ticketTypeId
    ) {
        walkInFormError.value =
            'Please select a ticket type.'

        return
    }

    isSubmittingWalkIn.value =
        true

    walkInFormError.value =
        ''

    try {
        const response =
            await $fetch<CreateWalkInResponse>(
                `${config.public.apiBaseURL}/organizer/events/${selectedEventId.value}/walk-ins`,
                {
                    method: 'POST',

                    headers: {
                        Accept:
                            'application/json',

                        Authorization:
                            `Bearer ${token.value}`,
                    },

                    body: {
                        event_ticket_type_id:
                            walkInForm.ticketTypeId,

                        name:
                            walkInForm.name.trim(),

                        email:
                            walkInForm.email.trim() ||
                            null,

                        phone:
                            walkInForm.phone.trim() ||
                            null,
                    },
                },
            )

        walkIns.value.unshift(
            response.data,
        )

        showWalkInForm.value =
            false

        Object.assign(
            walkInForm,
            emptyWalkInForm(),
        )

        await loadWalkIns()

    } catch (error: unknown) {
        console.error(
            'Failed to add walk-in:',
            error,
        )

        walkInFormError.value =
            getApiErrorMessage(
                error,
                'Unable to add walk-in.',
            )

    } finally {
        isSubmittingWalkIn.value =
            false
    }
}

async function processPayment(
    entry: WalkIn,
) {
    if (
        !token.value ||
        !selectedEventId.value
    ) {
        return
    }

    processingPaymentId.value =
        entry.id

    errorMessage.value =
        ''

    try {
        await $fetch<PaymentResponse>(
            `${config.public.apiBaseURL}/organizer/events/${selectedEventId.value}/walk-ins/${entry.id}/process-payment`,
            {
                method: 'POST',

                headers: {
                    Accept:
                        'application/json',

                    Authorization:
                        `Bearer ${token.value}`,
                },
            },
        )

        await Promise.all([
            loadWalkIns(),
            refreshTopSummary(),
        ])

    } catch (error: unknown) {
        console.error(
            'Failed to process payment:',
            error,
        )

        errorMessage.value =
            getApiErrorMessage(
                error,
                'Unable to process payment.',
            )

    } finally {
        processingPaymentId.value =
            null
    }
}

function formatCurrency(
    value: string | number,
): string {
    const amount =
        Number(value)

    return new Intl.NumberFormat(
        'en-PH',
        {
            style: 'currency',
            currency: 'PHP',
            maximumFractionDigits: 0,
        },
    ).format(
        Number.isNaN(amount)
            ? 0
            : amount,
    )
}

function formatTime(
    value: string | null,
): string {
    if (!value) {
        return ''
    }

    return new Date(
        value,
    ).toLocaleTimeString(
        'en-US',
        {
            hour: 'numeric',
            minute: '2-digit',
        },
    )
}

watch(
    selectedEventId,
    async () => {
        showWalkInForm.value =
            false

        walkIns.value =
            []

        ticketTiers.value =
            []

        walkInSummary.value = {
            pending: 0,
            paid: 0,
            capacity: 0,
            registered: 0,
            remaining: 0,
        }

        if (
            !selectedEventId.value
        ) {
            return
        }

        await Promise.all([
            loadSelectedEvent(),
            loadWalkIns(),
        ])
    },
    {
        immediate: true,
    },
)
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