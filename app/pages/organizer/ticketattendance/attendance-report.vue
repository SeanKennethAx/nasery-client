<template>
    <div class="rounded-2xl border border-gray-200 bg-white p-6">
        <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
                <h2 class="text-lg font-bold text-gray-900">
                    Attendance Report
                </h2>

                <p class="mt-1 text-sm text-gray-500">
                    <span v-if="selectedEvent">
                        Attendance analytics for
                        <span class="font-semibold text-gray-700">
                            {{ selectedEvent.name }}
                        </span>
                    </span>

                    <span v-else>
                        Comprehensive event attendance analytics
                    </span>
                </p>
            </div>

            <span v-if="selectedEvent"
                class="rounded-full bg-[#285F6b]/10 px-3 py-1 text-xs font-semibold text-[#285F6b]">
                {{ selectedEvent.name }}
            </span>
        </div>

        <div v-if="!selectedEventId" class="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <div class="flex items-start gap-3">
                <IconBase name="calendar" class="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                <div>
                    <p class="text-sm font-bold text-gray-900">
                        Select an Event
                    </p>

                    <p class="mt-0.5 text-sm text-gray-600">
                        Choose an event from the event selector above to view its attendance report.
                    </p>
                </div>
            </div>
        </div>

        <template v-else>
            <div v-if="errorMessage"
                class="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {{ errorMessage }}
            </div>

            <div v-if="isLoading" class="py-16 text-center">
                <IconBase name="refresh-cw" class="mx-auto h-6 w-6 animate-spin text-gray-400" />

                <p class="mt-3 text-sm text-gray-500">
                    Loading attendance report...
                </p>
            </div>

            <template v-else>
                <div class="mb-6 mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    <div class="rounded-xl border border-gray-200 p-5">
                        <div class="flex items-start justify-between gap-3">
                            <div>
                                <span class="text-sm text-gray-500">
                                    Total Registered
                                </span>

                                <div class="mt-2 text-3xl font-extrabold text-gray-900">
                                    {{ totalRegistered }}
                                </div>

                                <div class="mt-2 text-sm text-gray-500">
                                    Issued attendee tickets
                                </div>
                            </div>

                            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <IconBase name="users" class="h-5 w-5" />
                            </div>
                        </div>
                    </div>

                    <div class="rounded-xl border border-gray-200 p-5">
                        <div class="flex items-start justify-between gap-3">
                            <div>
                                <span class="text-sm text-gray-500">
                                    Total Attended
                                </span>

                                <div class="mt-2 text-3xl font-extrabold text-gray-900">
                                    {{ totalAttended }}
                                </div>

                                <div class="mt-2 text-sm text-gray-500">
                                    Check-ins completed
                                </div>
                            </div>

                            <div
                                class="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                                <IconBase name="check-circle" class="h-5 w-5" />
                            </div>
                        </div>
                    </div>

                    <div class="rounded-xl border border-gray-200 p-5">
                        <div class="flex items-start justify-between gap-3">
                            <div>
                                <span class="text-sm text-gray-500">
                                    Attendance Rate
                                </span>

                                <div class="mt-2 text-3xl font-extrabold text-gray-900">
                                    {{ attendanceRate }}%
                                </div>

                                <div class="mt-2 text-sm text-gray-500">
                                    Registered vs attended
                                </div>
                            </div>

                            <div
                                class="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                                <IconBase name="bar-chart" class="h-5 w-5" />
                            </div>
                        </div>
                    </div>

                    <div class="rounded-xl border border-gray-200 p-5">
                        <div class="flex items-start justify-between gap-3">
                            <div>
                                <span class="text-sm text-gray-500">
                                    Not Yet Attended
                                </span>

                                <div class="mt-2 text-3xl font-extrabold text-gray-900">
                                    {{ notAttended }}
                                </div>

                                <div class="mt-2 text-sm text-gray-500">
                                    Registered attendees remaining
                                </div>
                            </div>

                            <div
                                class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                <IconBase name="clock" class="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mb-7 rounded-2xl border border-gray-200 p-5">
                    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h3 class="text-base font-bold text-gray-900">
                                Overall Attendance
                            </h3>

                            <p class="mt-1 text-sm text-gray-500">
                                {{ totalAttended }} of
                                {{ totalRegistered }}
                                registered attendees have checked in
                            </p>
                        </div>

                        <div class="text-right">
                            <div class="text-2xl font-extrabold text-[#285F6b]">
                                {{ attendanceRate }}%
                            </div>

                            <div class="text-xs text-gray-400">
                                attendance rate
                            </div>
                        </div>
                    </div>

                    <div class="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                        <div class="h-full rounded-full bg-[#285F6b] transition-all duration-300" :style="{
                            width: `${attendanceRate}%`,
                        }" />
                    </div>
                </div>

                <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    <div class="xl:col-span-2">
                        <div class="mb-4 flex items-center justify-between">
                            <div>
                                <h3 class="text-base font-bold text-gray-900">
                                    Attendance by Ticket Type
                                </h3>

                                <p class="mt-1 text-sm text-gray-500">
                                    Check-in percentage for each ticket type
                                </p>
                            </div>
                        </div>

                        <div v-if="byTicketType.length" class="space-y-5">
                            <div v-for="row in byTicketType" :key="row.id">
                                <div class="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm">
                                    <div>
                                        <span class="font-semibold text-gray-800">
                                            {{ row.type }}
                                        </span>

                                        <span class="ml-2 text-xs text-gray-400">
                                            {{ row.total }} tickets
                                        </span>
                                    </div>

                                    <span class="font-medium text-gray-500">
                                        {{ row.attended }}
                                        /
                                        {{ row.total }}
                                        ({{ row.percent }}%)
                                    </span>
                                </div>

                                <div class="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                                    <div class="h-full rounded-full bg-[#285F6b] transition-all duration-300" :style="{
                                        width: `${row.percent}%`,
                                    }" />
                                </div>
                            </div>
                        </div>

                        <div v-else class="rounded-xl border border-dashed border-gray-300 px-5 py-10 text-center">
                            <IconBase name="ticket" class="mx-auto h-7 w-7 text-gray-400" />

                            <p class="mt-2 text-sm font-semibold text-gray-700">
                                No ticket attendance data
                            </p>

                            <p class="mt-1 text-xs text-gray-500">
                                Attendance by ticket type will appear when tickets are issued.
                            </p>
                        </div>
                    </div>

                    <div class="rounded-2xl border border-gray-200 p-5">
                        <h3 class="text-base font-bold text-gray-900">
                            Registration Source
                        </h3>

                        <p class="mt-1 text-sm text-gray-500">
                            How attendees registered
                        </p>

                        <div class="mt-5 space-y-4">
                            <div class="flex items-center justify-between rounded-xl bg-blue-50/70 p-4">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                        <IconBase name="ticket" class="h-4 w-4" />
                                    </div>

                                    <div>
                                        <p class="text-sm font-semibold text-gray-900">
                                            Online
                                        </p>

                                        <p class="text-xs text-gray-500">
                                            Online registrations
                                        </p>
                                    </div>
                                </div>

                                <div class="text-right">
                                    <p class="text-xl font-extrabold text-gray-900">
                                        {{ onlineCount }}
                                    </p>

                                    <p class="text-xs text-gray-400">
                                        {{ onlinePercent }}%
                                    </p>
                                </div>
                            </div>

                            <div class="flex items-center justify-between rounded-xl bg-amber-50/70 p-4">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                                        <IconBase name="user-plus" class="h-4 w-4" />
                                    </div>

                                    <div>
                                        <p class="text-sm font-semibold text-gray-900">
                                            Walk-ins
                                        </p>

                                        <p class="text-xs text-gray-500">
                                            On-site registrations
                                        </p>
                                    </div>
                                </div>

                                <div class="text-right">
                                    <p class="text-xl font-extrabold text-gray-900">
                                        {{ walkInCount }}
                                    </p>

                                    <p class="text-xs text-gray-400">
                                        {{ walkInPercent }}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-7 overflow-x-auto rounded-2xl border border-gray-200">
                    <div class="border-b border-gray-200 px-5 py-4">
                        <h3 class="text-base font-bold text-gray-900">
                            Attendee Attendance Details
                        </h3>

                        <p class="mt-1 text-sm text-gray-500">
                            Complete attendee status for the selected event
                        </p>
                    </div>

                    <table v-if="attendees.length" class="w-full text-left text-sm">
                        <thead>
                            <tr
                                class="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                <th class="px-5 py-3">
                                    Attendee
                                </th>

                                <th class="px-5 py-3">
                                    Ticket Type
                                </th>

                                <th class="px-5 py-3">
                                    Source
                                </th>

                                <th class="px-5 py-3">
                                    Attendance
                                </th>

                                <th class="px-5 py-3">
                                    Check-in Time
                                </th>
                            </tr>
                        </thead>

                        <tbody class="divide-y divide-gray-100">
                            <tr v-for="attendee in attendees" :key="attendee.id" class="hover:bg-gray-50/70">
                                <td class="px-5 py-3.5">
                                    <p class="font-semibold text-gray-900">
                                        {{ attendee.name }}
                                    </p>

                                    <p class="mt-0.5 text-xs text-gray-400">
                                        {{ attendee.ticket_id }}
                                    </p>
                                </td>

                                <td class="px-5 py-3.5 text-gray-600">
                                    {{
                                        attendee.ticket_type?.name ||
                                        'General Admission'
                                    }}
                                </td>

                                <td class="px-5 py-3.5">
                                    <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold" :class="attendee.source ===
                                        'walk_in'
                                        ? 'bg-amber-50 text-amber-700'
                                        : 'bg-blue-50 text-blue-700'
                                        ">
                                        {{
                                            formatSource(
                                                attendee.source,
                                            )
                                        }}
                                    </span>
                                </td>

                                <td class="px-5 py-3.5">
                                    <span
                                        class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                                        :class="attendee.status ===
                                            'checked_in'
                                            ? 'bg-green-50 text-green-700'
                                            : 'bg-gray-100 text-gray-600'
                                            ">
                                        <IconBase v-if="
                                            attendee.status ===
                                            'checked_in'
                                        " name="check-circle" class="h-3 w-3" />

                                        {{
                                            attendee.status ===
                                                'checked_in'
                                                ? 'Checked-in'
                                                : 'Registered'
                                        }}
                                    </span>
                                </td>

                                <td class="px-5 py-3.5 text-gray-500">
                                    {{
                                        attendee.checked_in_at
                                            ? formatCheckInDateTime(
                                                attendee.checked_in_at,
                                            )
                                            : '—'
                                    }}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div v-else class="px-5 py-12 text-center">
                        <IconBase name="users" class="mx-auto h-7 w-7 text-gray-400" />

                        <p class="mt-2 text-sm font-semibold text-gray-700">
                            No attendees yet
                        </p>

                        <p class="mt-1 text-xs text-gray-500">
                            Registered attendees will appear here.
                        </p>
                    </div>
                </div>

                <div class="mt-6 flex flex-wrap gap-3">
                    <button type="button"
                        class="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        :disabled="!attendees.length" @click="exportCsv">
                        <IconBase name="download" class="h-4 w-4" />

                        Export CSV
                    </button>
                </div>
            </template>
        </template>
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
}

interface TicketType {
    id: number
    name: string
}

interface Attendee {
    id: number
    name: string
    email: string | null

    ticket_type:
    | TicketType
    | null

    ticket_id: string

    source:
    | 'online'
    | 'walk_in'
    | string

    payment_status:
    | 'pending'
    | 'paid'
    | 'refunded'
    | string

    status:
    | 'registered'
    | 'checked_in'

    checked_in_at:
    | string
    | null

    created_at: string
}

interface AttendeesResponse {
    data: Attendee[]
}

interface ApiErrorResponse {
    data?: {
        message?: string

        errors?: Record<
            string,
            string[]
        >
    }
}

interface TicketTypeAttendance {
    id: string
    type: string
    attended: number
    total: number
    percent: number
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

const attendees =
    ref<Attendee[]>([])

const isLoading =
    ref(false)

const errorMessage =
    ref('')

const totalRegistered =
    computed(() =>
        attendees.value.length,
    )

const totalAttended =
    computed(() =>
        attendees.value.filter(
            attendee =>
                attendee.status ===
                'checked_in',
        ).length,
    )

const notAttended =
    computed(() =>
        Math.max(
            totalRegistered.value -
            totalAttended.value,
            0,
        ),
    )

const attendanceRate =
    computed(() => {
        if (
            totalRegistered.value ===
            0
        ) {
            return 0
        }

        return Math.min(
            Math.round(
                (
                    totalAttended.value /
                    totalRegistered.value
                ) *
                100,
            ),
            100,
        )
    })

const onlineCount =
    computed(() =>
        attendees.value.filter(
            attendee =>
                attendee.source ===
                'online',
        ).length,
    )

const walkInCount =
    computed(() =>
        attendees.value.filter(
            attendee =>
                attendee.source ===
                'walk_in',
        ).length,
    )

const onlinePercent =
    computed(() => {
        if (
            totalRegistered.value ===
            0
        ) {
            return 0
        }

        return Math.round(
            (
                onlineCount.value /
                totalRegistered.value
            ) *
            100,
        )
    })

const walkInPercent =
    computed(() => {
        if (
            totalRegistered.value ===
            0
        ) {
            return 0
        }

        return Math.round(
            (
                walkInCount.value /
                totalRegistered.value
            ) *
            100,
        )
    })

const byTicketType =
    computed<TicketTypeAttendance[]>(
        () => {
            const grouped =
                new Map<
                    string,
                    {
                        id: string
                        type: string
                        total: number
                        attended: number
                    }
                >()

            attendees.value.forEach(
                attendee => {
                    const ticketTypeId =
                        attendee.ticket_type
                            ?.id

                    const ticketTypeName =
                        attendee.ticket_type
                            ?.name ||
                        'General Admission'

                    const key =
                        ticketTypeId
                            ? String(
                                ticketTypeId,
                            )
                            : `general-${ticketTypeName}`

                    const existing =
                        grouped.get(key)

                    if (existing) {
                        existing.total +=
                            1

                        if (
                            attendee.status ===
                            'checked_in'
                        ) {
                            existing.attended +=
                                1
                        }

                        return
                    }

                    grouped.set(
                        key,
                        {
                            id:
                                key,

                            type:
                                ticketTypeName,

                            total:
                                1,

                            attended:
                                attendee.status ===
                                    'checked_in'
                                    ? 1
                                    : 0,
                        },
                    )
                },
            )

            return Array.from(
                grouped.values(),
            )
                .map(row => ({
                    ...row,

                    percent:
                        row.total > 0
                            ? Math.round(
                                (
                                    row.attended /
                                    row.total
                                ) *
                                100,
                            )
                            : 0,
                }))
                .sort(
                    (
                        first,
                        second,
                    ) =>
                        second.total -
                        first.total,
                )
        },
    )

function getApiErrorMessage(
    error: unknown,
    fallback: string,
): string {
    const apiError =
        error as ApiErrorResponse

    const validationMessage =
        Object.values(
            apiError.data?.errors ??
            {},
        )[0]?.[0]

    return (
        validationMessage ??
        apiError.data?.message ??
        fallback
    )
}

async function loadAttendanceReport() {
    if (
        !token.value ||
        !selectedEventId.value
    ) {
        attendees.value =
            []

        return
    }

    isLoading.value =
        true

    errorMessage.value =
        ''

    try {
        const response =
            await $fetch<AttendeesResponse>(
                `${config.public.apiBaseURL}/organizer/events/${selectedEventId.value}/attendees`,
                {
                    method:
                        'GET',

                    headers: {
                        Accept:
                            'application/json',

                        Authorization:
                            `Bearer ${token.value}`,
                    },
                },
            )

        attendees.value =
            response.data ?? []

    } catch (error: unknown) {
        console.error(
            'Failed to load attendance report:',
            error,
        )

        attendees.value =
            []

        errorMessage.value =
            getApiErrorMessage(
                error,
                'Unable to load attendance report.',
            )

    } finally {
        isLoading.value =
            false
    }
}

function formatSource(
    source: string,
): string {
    if (
        source ===
        'walk_in'
    ) {
        return 'Walk-in'
    }

    if (
        source ===
        'online'
    ) {
        return 'Online'
    }

    return source ||
        'Unknown'
}

function formatCheckInDateTime(
    value: string,
): string {
    const date =
        new Date(value)

    return date.toLocaleString(
        'en-US',
        {
            month:
                'short',

            day:
                'numeric',

            year:
                'numeric',

            hour:
                'numeric',

            minute:
                '2-digit',
        },
    )
}

function escapeCsvValue(
    value:
        | string
        | number
        | null
        | undefined,
): string {
    const stringValue =
        String(
            value ?? '',
        )

    return `"${stringValue.replace(
        /"/g,
        '""',
    )}"`
}

function exportCsv() {
    if (
        !attendees.value.length
    ) {
        return
    }

    const headers = [
        'Name',
        'Email',
        'Ticket Type',
        'Ticket ID',
        'Source',
        'Status',
        'Payment Status',
        'Checked In At',
    ]

    const rows =
        attendees.value.map(
            attendee => [
                attendee.name,

                attendee.email ??
                '',

                attendee.ticket_type
                    ?.name ??
                'General Admission',

                attendee.ticket_id,

                formatSource(
                    attendee.source,
                ),

                attendee.status ===
                    'checked_in'
                    ? 'Checked-in'
                    : 'Registered',

                attendee.payment_status,

                attendee.checked_in_at
                    ? formatCheckInDateTime(
                        attendee.checked_in_at,
                    )
                    : '',
            ],
        )

    const csv =
        [
            headers,
            ...rows,
        ]
            .map(row =>
                row
                    .map(
                        escapeCsvValue,
                    )
                    .join(','),
            )
            .join('\n')

    const blob =
        new Blob(
            [csv],
            {
                type:
                    'text/csv;charset=utf-8;',
            },
        )

    const url =
        URL.createObjectURL(
            blob,
        )

    const link =
        document.createElement(
            'a',
        )

    const eventName =
        (
            selectedEvent.value
                ?.name ??
            'attendance-report'
        )
            .trim()
            .replace(
                /[^a-zA-Z0-9]+/g,
                '-',
            )
            .replace(
                /^-|-$/g,
                '',
            )
            .toLowerCase()

    link.href =
        url

    link.download =
        `${eventName}-attendance-report.csv`

    document.body.appendChild(
        link,
    )

    link.click()

    document.body.removeChild(
        link,
    )

    URL.revokeObjectURL(
        url,
    )
}

watch(
    selectedEventId,
    async () => {
        attendees.value =
            []

        await loadAttendanceReport()
    },
    {
        immediate:
            true,
    },
)
</script>