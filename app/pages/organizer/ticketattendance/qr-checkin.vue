<template>
    <div class="rounded-2xl border border-gray-200 bg-white p-6">
        <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
                <h2 class="text-lg font-bold text-gray-900">
                    QR Code Check-in Scanner
                </h2>

                <p class="mt-1 text-sm text-gray-500">
                    <span v-if="selectedEvent">
                        Scan attendee QR tickets for
                        <span class="font-semibold text-gray-700">
                            {{ selectedEvent.name }}
                        </span>
                    </span>

                    <span v-else>
                        Scan attendee QR tickets for entry
                    </span>
                </p>
            </div>

            <span v-if="selectedEvent"
                class="rounded-full bg-[#285F6b]/10 px-3 py-1 text-xs font-semibold text-[#285F6b]">
                {{ selectedEvent.name }}
            </span>
        </div>

        <div v-if="!eventId"
            class="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Select an event from the event selector above before starting QR check-in.
        </div>

        <div v-if="scannerMessage" class="mt-5 rounded-xl border px-4 py-3" :class="scannerMessageClass">
            <div class="flex items-start gap-3">
                <IconBase :name="scannerResultType === 'success'
                    ? 'check-circle'
                    : scannerResultType === 'warning'
                        ? 'alert-circle'
                        : 'x-circle'
                    " class="mt-0.5 h-5 w-5 shrink-0" />

                <div>
                    <p class="text-sm font-semibold">
                        {{ scannerMessage }}
                    </p>

                    <p v-if="lastScannedTicket" class="mt-1 text-xs opacity-80">
                        {{
                            lastScannedTicket.ticket_type?.name ||
                            'General Admission'
                        }}
                    </p>
                </div>
            </div>
        </div>

        <div class="my-8 flex flex-col items-center">
            <div
                class="relative h-64 w-64 overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-gray-950">
                <video id="qr-scanner-video" class="h-full w-full object-cover" muted playsinline />

                <div v-if="!isScanning"
                    class="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
                    <IconBase name="qr-code" class="h-14 w-14 text-gray-400" />

                    <div class="mt-4 text-base font-bold text-gray-900">
                        QR Scanner Ready
                    </div>

                    <p class="mt-1 text-sm text-gray-500">
                        Start the camera and position the
                        attendee QR code within the frame.
                    </p>
                </div>

                <div v-if="isScanning" class="pointer-events-none absolute inset-7">
                    <div class="absolute left-0 top-0 h-8 w-8 border-l-4 border-t-4 border-white" />

                    <div class="absolute right-0 top-0 h-8 w-8 border-r-4 border-t-4 border-white" />

                    <div class="absolute bottom-0 left-0 h-8 w-8 border-b-4 border-l-4 border-white" />

                    <div class="absolute bottom-0 right-0 h-8 w-8 border-b-4 border-r-4 border-white" />

                    <div class="absolute left-2 right-2 top-1/2 h-0.5 bg-green-400 shadow-lg" />
                </div>

                <div v-if="isProcessingScan" class="absolute inset-0 flex items-center justify-center bg-gray-950/50">
                    <div class="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-lg">
                        <div class="flex items-center gap-2">
                            <IconBase name="refresh-cw" class="h-4 w-4 animate-spin" />

                            Checking ticket...
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-6 flex gap-3">
                <button type="button"
                    class="flex items-center gap-2 rounded-xl bg-[#285F6b] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1f4a54] disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="!eventId ||
                        isProcessingScan
                        " @click="
                            isScanning
                                ? stopScanner()
                                : startScanner()
                            ">
                    <IconBase :name="isScanning
                        ? 'x'
                        : 'qr-code'
                        " class="h-4 w-4" />

                    {{
                        isScanning
                            ? 'Stop Scanning'
                            : 'Start Scanning'
                    }}
                </button>

                <button type="button"
                    class="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="!eventId" @click="openManualEntry">
                    Manual Entry
                </button>
            </div>
        </div>

        <div class="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div class="rounded-xl bg-gray-50 p-4">
                <p class="text-xs text-gray-500">
                    Registered Tickets
                </p>

                <p class="mt-1 text-2xl font-extrabold text-gray-900">
                    {{ checkInSummary.registered }}
                </p>
            </div>

            <div class="rounded-xl bg-gray-50 p-4">
                <p class="text-xs text-gray-500">
                    QR Checked In
                </p>

                <p class="mt-1 text-2xl font-extrabold text-gray-900">
                    {{ checkInSummary.checked_in }}
                </p>
            </div>
        </div>

        <div class="border-t border-gray-100 pt-6">
            <div class="mb-4 flex items-center justify-between">
                <div>
                    <h3 class="text-base font-bold text-gray-900">
                        Recent QR Check-ins
                    </h3>

                    <p class="mt-0.5 text-xs text-gray-500">
                        Attendees checked in using the QR scanner
                    </p>
                </div>

                <button v-if="eventId" type="button" class="text-xs font-semibold text-primary-700 hover:underline"
                    @click="loadCheckInSummary">
                    Refresh
                </button>
            </div>

            <div v-if="isLoadingSummary" class="py-6 text-center text-sm text-gray-500">
                Loading QR check-ins...
            </div>

            <div v-else-if="
                checkInSummary.recent_check_ins.length
            " class="divide-y divide-gray-100">
                <div v-for="entry in checkInSummary.recent_check_ins" :key="entry.id"
                    class="flex flex-wrap items-center justify-between gap-3 py-3.5">
                    <div class="flex min-w-0 items-center gap-3">
                        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50">
                            <IconBase name="check-circle" class="h-5 w-5 text-green-600" />
                        </div>

                        <div class="min-w-0">
                            <div class="truncate text-sm font-bold text-gray-900">
                                {{
                                    entry.ticket.attendee_name
                                }}
                            </div>

                            <div class="mt-0.5 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                                <span>
                                    {{
                                        entry.ticket.ticket_type
                                            ?.name ||
                                        'General Admission'
                                    }}
                                </span>

                                <span v-if="entry.ticket.source"
                                    class="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
                                    {{
                                        formatTicketSource(
                                            entry.ticket.source,
                                        )
                                    }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="flex shrink-0 flex-col items-end">
                        <span class="text-sm text-gray-400">
                            {{
                                formatCheckInTime(
                                    entry.checked_in_at,
                                )
                            }}
                        </span>

                        <span class="mt-1 text-[10px] font-semibold uppercase tracking-wide text-green-600">
                            QR Scan
                        </span>
                    </div>
                </div>
            </div>

            <div v-else class="rounded-xl border border-dashed border-gray-300 px-5 py-8 text-center">
                <IconBase name="qr-code" class="mx-auto h-7 w-7 text-gray-400" />

                <p class="mt-2 text-sm font-semibold text-gray-700">
                    No QR check-ins yet
                </p>

                <p class="mt-1 text-xs text-gray-500">
                    Successful QR scans for this event will appear here.
                </p>
            </div>
        </div>

        <Transition name="fade">
            <div v-if="showManualEntry" class="fixed inset-0 z-40 bg-gray-900/40" @click="closeManualEntry" />
        </Transition>

        <Transition name="slide">
            <div v-if="showManualEntry"
                class="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl">
                <div class="flex items-start justify-between border-b border-gray-200 px-6 py-5">
                    <div>
                        <h2 class="text-lg font-bold text-gray-900">
                            Manual Check-in
                        </h2>

                        <p class="mt-1 text-sm text-gray-500">
                            <span v-if="selectedEvent">
                                Check in an attendee for
                                {{ selectedEvent.name }} manually.
                            </span>

                            <span v-else>
                                Enter the attendee ticket ID manually.
                            </span>
                        </p>
                    </div>

                    <button type="button" class="text-gray-400 hover:text-gray-600" @click="closeManualEntry">
                        <IconBase name="x" class="h-5 w-5" />
                    </button>
                </div>

                <div class="flex-1 overflow-y-auto px-6 py-5">
                    <div v-if="manualEntryError"
                        class="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {{ manualEntryError }}
                    </div>

                    <FormsLabel text="Ticket ID" required />

                    <FormsTextField v-model="manualTicketId" type="number" placeholder="Enter ticket ID" />
                </div>

                <div class="border-t border-gray-200 px-6 py-4">
                    <div class="flex justify-end gap-3">
                        <button type="button"
                            class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                            :disabled="isManualCheckingIn" @click="closeManualEntry">
                            Cancel
                        </button>

                        <button type="button"
                            class="flex items-center gap-2 rounded-xl bg-[#285F6b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1f4a54] disabled:opacity-50"
                            :disabled="isManualCheckingIn ||
                                !manualTicketId
                                " @click="submitManualCheckIn">
                            <IconBase v-if="isManualCheckingIn" name="refresh-cw" class="h-4 w-4 animate-spin" />

                            {{
                                isManualCheckingIn
                                    ? 'Checking In...'
                                    : 'Check In'
                            }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import {
    BrowserQRCodeReader,
    type IScannerControls,
} from '@zxing/browser'

interface OrganizerEvent {
    id: number
    name: string
    event_type: string
    event_date: string | null
    location: string | null
    status: string
}

interface TicketType {
    id: number
    name: string
}

interface ScannedTicket {
    id: number
    event_id?: number
    attendee_name: string
    attendee_email: string | null
    status?: string
    source?: 'online' | 'walk_in' | string
    payment_status?: 'pending' | 'paid' | 'refunded' | string
    checked_in_at: string | null
    ticket_type?: TicketType | null
}

interface QRCheckInEntry {
    id: number
    checked_in_at: string
    ticket: ScannedTicket
}

interface ScanResponse {
    message: string
    code?: string
    data: ScannedTicket
}

interface CheckInSummary {
    registered: number
    checked_in: number
    recent_check_ins: QRCheckInEntry[]
}

interface CheckInSummaryResponse {
    data: CheckInSummary
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
    status?: number

    data?: {
        message?: string
        code?: string
        data?: ScannedTicket
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
            if (!selectedEventId.value) {
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

const eventId =
    computed<number | null>(
        () =>
            selectedEventId.value,
    )

const scannerControls =
    shallowRef<IScannerControls | null>(
        null,
    )

const isScanning =
    ref(false)

const isProcessingScan =
    ref(false)

const scannerMessage =
    ref('')

const scannerResultType =
    ref<
        | 'success'
        | 'warning'
        | 'error'
        | null
    >(null)

const lastScannedTicket =
    ref<ScannedTicket | null>(
        null,
    )

const lastScannedValue =
    ref('')

const lastScannedAt =
    ref(0)

const isLoadingSummary =
    ref(false)

const checkInSummary =
    ref<CheckInSummary>({
        registered: 0,
        checked_in: 0,
        recent_check_ins: [],
    })

const showManualEntry =
    ref(false)

const manualTicketId =
    ref('')

const manualEntryError =
    ref('')

const isManualCheckingIn =
    ref(false)

const scannerMessageClass =
    computed(() => {
        if (
            scannerResultType.value ===
            'success'
        ) {
            return 'border-green-200 bg-green-50 text-green-700'
        }

        if (
            scannerResultType.value ===
            'warning'
        ) {
            return 'border-amber-200 bg-amber-50 text-amber-700'
        }

        return 'border-red-200 bg-red-50 text-red-700'
    })

function formatTicketSource(
    source?: string,
): string {
    if (source === 'walk_in') {
        return 'Walk-in'
    }

    if (source === 'online') {
        return 'Online'
    }

    return 'Ticket'
}

function getApiErrorMessage(
    error: unknown,
    fallback: string,
): string {
    const apiError =
        error as ApiErrorResponse

    const validationMessage =
        Object.values(
            apiError.data?.errors ?? {},
        )[0]?.[0]

    return (
        validationMessage ??
        apiError.data?.message ??
        fallback
    )
}

async function refreshTopSummary() {
    if (
        !token.value ||
        !eventId.value
    ) {
        return
    }

    try {
        const response =
            await $fetch<AttendeeSummaryResponse>(
                `${config.public.apiBaseURL}/organizer/events/${eventId.value}/attendee-summary`,
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

async function startScanner() {
    if (!eventId.value) {
        scannerResultType.value =
            'error'

        scannerMessage.value =
            'Please select an event before scanning.'

        return
    }

    scannerMessage.value =
        ''

    lastScannedTicket.value =
        null

    try {
        stopScanner()

        const codeReader =
            new BrowserQRCodeReader()

        isScanning.value =
            true

        scannerControls.value =
            await codeReader.decodeFromConstraints(
                {
                    video: {
                        facingMode: {
                            ideal:
                                'environment',
                        },
                    },
                },
                'qr-scanner-video',
                async result => {
                    if (
                        !result ||
                        isProcessingScan.value
                    ) {
                        return
                    }

                    const text =
                        result.getText()

                    const now =
                        Date.now()

                    if (
                        text ===
                        lastScannedValue.value &&
                        now -
                        lastScannedAt.value <
                        2000
                    ) {
                        return
                    }

                    lastScannedValue.value =
                        text

                    lastScannedAt.value =
                        now

                    await handleScannedCode(
                        text,
                    )
                },
            )

    } catch (error: unknown) {
        console.error(
            'Unable to start QR scanner:',
            error,
        )

        scannerControls.value =
            null

        isScanning.value =
            false

        scannerResultType.value =
            'error'

        scannerMessage.value =
            'Unable to access the camera. Please allow camera permission and try again.'
    }
}

function stopScanner() {
    scannerControls.value
        ?.stop()

    scannerControls.value =
        null

    isScanning.value =
        false
}

async function handleScannedCode(
    qrValue: string,
) {
    if (
        !token.value ||
        !eventId.value
    ) {
        return
    }

    isProcessingScan.value =
        true

    scannerMessage.value =
        ''

    lastScannedTicket.value =
        null

    try {
        const response =
            await $fetch<ScanResponse>(
                `${config.public.apiBaseURL}/organizer/events/${eventId.value}/check-in`,
                {
                    method: 'POST',

                    headers: {
                        Accept:
                            'application/json',

                        Authorization:
                            `Bearer ${token.value}`,
                    },

                    body: {
                        qr_token:
                            qrValue,
                    },
                },
            )

        lastScannedTicket.value =
            response.data

        scannerResultType.value =
            'success'

        scannerMessage.value =
            `${response.data.attendee_name} checked in successfully.`

        await Promise.all([
            loadCheckInSummary(),
            refreshTopSummary(),
        ])

    } catch (error: unknown) {
        console.error(
            'QR check-in failed:',
            error,
        )

        const apiError =
            error as ApiErrorResponse

        if (
            apiError.data?.code ===
            'ALREADY_CHECKED_IN'
        ) {
            scannerResultType.value =
                'warning'

            lastScannedTicket.value =
                apiError.data.data ??
                null

        } else {
            scannerResultType.value =
                'error'
        }

        scannerMessage.value =
            getApiErrorMessage(
                error,
                'Unable to check in this ticket.',
            )

    } finally {
        await new Promise<void>(
            resolve => {
                setTimeout(
                    resolve,
                    1200,
                )
            },
        )

        isProcessingScan.value =
            false
    }
}

async function loadCheckInSummary() {
    if (
        !token.value ||
        !eventId.value
    ) {
        checkInSummary.value = {
            registered: 0,
            checked_in: 0,
            recent_check_ins: [],
        }

        return
    }

    isLoadingSummary.value =
        true

    try {
        const response =
            await $fetch<CheckInSummaryResponse>(
                `${config.public.apiBaseURL}/organizer/events/${eventId.value}/check-in-summary`,
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

        checkInSummary.value =
            response.data

    } catch (error: unknown) {
        console.error(
            'Failed to load check-in summary:',
            error,
        )

        checkInSummary.value = {
            registered: 0,
            checked_in: 0,
            recent_check_ins: [],
        }

    } finally {
        isLoadingSummary.value =
            false
    }
}

function openManualEntry() {
    if (!eventId.value) {
        return
    }

    manualTicketId.value =
        ''

    manualEntryError.value =
        ''

    showManualEntry.value =
        true
}

function closeManualEntry() {
    if (
        isManualCheckingIn.value
    ) {
        return
    }

    showManualEntry.value =
        false

    manualTicketId.value =
        ''

    manualEntryError.value =
        ''
}

async function submitManualCheckIn() {
    if (
        !token.value ||
        !eventId.value
    ) {
        return
    }

    const ticketId =
        Number(
            manualTicketId.value,
        )

    if (
        !Number.isFinite(ticketId) ||
        ticketId <= 0
    ) {
        manualEntryError.value =
            'Enter a valid ticket ID.'

        return
    }

    isManualCheckingIn.value =
        true

    manualEntryError.value =
        ''

    try {
        const response =
            await $fetch<ScanResponse>(
                `${config.public.apiBaseURL}/organizer/events/${eventId.value}/manual-check-in`,
                {
                    method: 'POST',

                    headers: {
                        Accept:
                            'application/json',

                        Authorization:
                            `Bearer ${token.value}`,
                    },

                    body: {
                        ticket_id:
                            ticketId,
                    },
                },
            )

        lastScannedTicket.value =
            response.data

        scannerResultType.value =
            'success'

        scannerMessage.value =
            `${response.data.attendee_name} checked in manually.`

        showManualEntry.value =
            false

        manualTicketId.value =
            ''

        await Promise.all([
            loadCheckInSummary(),
            refreshTopSummary(),
        ])

    } catch (error: unknown) {
        console.error(
            'Manual check-in failed:',
            error,
        )

        const apiError =
            error as ApiErrorResponse

        if (
            apiError.data?.code ===
            'ALREADY_CHECKED_IN'
        ) {
            scannerResultType.value =
                'warning'

            lastScannedTicket.value =
                apiError.data.data ??
                null
        }

        manualEntryError.value =
            getApiErrorMessage(
                error,
                'Unable to check in this ticket.',
            )

    } finally {
        isManualCheckingIn.value =
            false
    }
}

function formatCheckInTime(
    value: string | null,
): string {
    if (!value) {
        return ''
    }

    const date =
        new Date(value)

    return date.toLocaleTimeString(
        'en-US',
        {
            hour:
                'numeric',

            minute:
                '2-digit',
        },
    )
}

watch(
    eventId,
    async () => {
        stopScanner()

        scannerMessage.value =
            ''

        scannerResultType.value =
            null

        lastScannedTicket.value =
            null

        lastScannedValue.value =
            ''

        lastScannedAt.value =
            0

        showManualEntry.value =
            false

        await loadCheckInSummary()
    },
    {
        immediate: true,
    },
)

onBeforeUnmount(() => {
    stopScanner()
})
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