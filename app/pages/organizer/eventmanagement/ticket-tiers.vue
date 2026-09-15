<template>
	<div class="space-y-6">
		<div v-if="isLoading" class="rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
			<IconBase name="refresh-cw" class="mx-auto h-6 w-6 animate-spin text-[#285F6b]" />
			<p class="mt-3 text-sm font-semibold text-gray-500">Loading ticket tiers...</p>
		</div>

		<div v-else-if="errorMessage" class="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">
			{{ errorMessage }}
		</div>

		<template v-else-if="event">
			<section class="overflow-hidden rounded-3xl border border-[#285F6b]/15 bg-white shadow-sm">
				<div class="flex flex-col gap-5 bg-[#285F6b] px-6 py-6 text-white sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p class="text-xs font-bold uppercase tracking-[0.16em] text-white/60">Ticket inventory</p>
						<h2 class="mt-2 text-2xl font-black tracking-tight">{{ event.name }}</h2>
						<p class="mt-1 text-sm text-white/70">Track sales, remaining capacity, and pricing for every admission type.</p>
					</div>

					<button type="button"
						class="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-bold text-[#285F6b] shadow-sm transition hover:bg-gray-50"
						@click="addTicketType">
						<IconBase name="plus" class="h-4 w-4" />
						Add ticket type
					</button>
				</div>

				<div class="grid grid-cols-2 gap-px bg-gray-100 sm:grid-cols-4">
					<div class="bg-white p-5">
						<p class="text-xs font-bold uppercase tracking-[0.1em] text-gray-400">Ticket types</p>
						<p class="mt-2 text-2xl font-black text-gray-900">{{ event.ticket_types?.length ?? 0 }}</p>
					</div>
					<div class="bg-white p-5">
						<p class="text-xs font-bold uppercase tracking-[0.1em] text-gray-400">Issued</p>
						<p class="mt-2 text-2xl font-black text-[#285F6b]">{{ totalSold }}</p>
					</div>
					<div class="bg-white p-5">
						<p class="text-xs font-bold uppercase tracking-[0.1em] text-gray-400">Capacity</p>
						<p class="mt-2 text-2xl font-black text-gray-900">{{ totalCapacity }}</p>
					</div>
					<div class="bg-white p-5">
						<p class="text-xs font-bold uppercase tracking-[0.1em] text-gray-400">Available</p>
						<p class="mt-2 text-2xl font-black text-emerald-700">{{ totalAvailable }}</p>
					</div>
				</div>
			</section>

			<div v-if="!event.ticket_types?.length"
				class="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center shadow-sm">
				<div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#285F6b]/10 text-[#285F6b]">
					<IconBase name="tag" class="h-6 w-6" />
				</div>
				<h3 class="mt-5 text-lg font-extrabold text-gray-900">Create your first ticket type</h3>
				<p class="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">Add options such as VIP, Regular, Early Bird, or Student so attendees can choose the right admission.</p>
				<button type="button" class="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#285F6b] px-4 py-2.5 text-sm font-bold text-white" @click="addTicketType">
					<IconBase name="plus" class="h-4 w-4" /> Add ticket type
				</button>
			</div>

			<div v-else class="grid gap-5 xl:grid-cols-2">
				<article v-for="ticket in event.ticket_types" :key="ticket.id"
					class="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-[#285F6b]/25 hover:shadow-md sm:p-6">
					<div class="flex items-start justify-between gap-4">
						<div class="flex min-w-0 items-center gap-3">
							<div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#285F6b]/10 text-[#285F6b]">
								<IconBase name="tag" class="h-5 w-5" />
							</div>
							<div class="min-w-0">
								<h3 class="truncate text-lg font-extrabold text-gray-900">{{ ticket.name }}</h3>
								<p class="mt-0.5 text-sm font-semibold text-[#285F6b]">{{ formatCurrency(ticket.price) }}</p>
							</div>
						</div>

						<div class="flex shrink-0 gap-2">
							<button type="button" :aria-label="`Edit ${ticket.name}`"
								class="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:border-[#285F6b]/30 hover:bg-[#285F6b]/5 hover:text-[#285F6b]"
								@click="editTicketType(ticket)">
								<IconBase name="edit" class="h-4 w-4" />
							</button>
							<button type="button" :aria-label="`Remove ${ticket.name}`"
								class="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
								@click="deleteTicketType(ticket)">
								<IconBase name="trash" class="h-4 w-4" />
							</button>
						</div>
					</div>

					<div class="mt-6 grid grid-cols-3 gap-3">
						<div class="rounded-2xl bg-gray-50 p-4">
							<p class="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400">Issued</p>
							<p class="mt-1.5 text-xl font-black text-gray-900">{{ ticket.sold ?? 0 }}</p>
						</div>
						<div class="rounded-2xl bg-gray-50 p-4">
							<p class="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400">Capacity</p>
							<p class="mt-1.5 text-xl font-black text-gray-900">{{ ticket.capacity }}</p>
						</div>
						<div class="rounded-2xl bg-emerald-50 p-4">
							<p class="text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-600">Available</p>
							<p class="mt-1.5 text-xl font-black text-emerald-800">{{ getAvailability(ticket) }}</p>
						</div>
					</div>

					<div class="mt-6">
						<div class="mb-2 flex items-center justify-between text-xs font-semibold">
							<span class="text-gray-500">{{ getSoldPercentage(ticket) }}% of inventory issued</span>
							<span class="text-gray-700">{{ ticket.sold ?? 0 }} / {{ ticket.capacity }}</span>
						</div>
						<div class="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
							<div class="h-full rounded-full bg-[#285F6b] transition-all duration-300" :style="{ width: `${getSoldPercentage(ticket)}%` }" />
						</div>
					</div>
				</article>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
interface TicketType {
	id: number
	event_id: number
	name: string
	price: string | number
	capacity: number
	sold?: number
}

interface OrganizerEvent {
	id: number

	name: string

	ticket_types?: TicketType[]
}

type EventResponse =
	| OrganizerEvent
	| {
		data: OrganizerEvent
	}

definePageMeta({
	layout: 'dashboard',
	middleware: ['organizer'],
})

const route =
	useRoute()

const config =
	useRuntimeConfig()

const {
	token,
} = useAuth()

const event =
	ref<OrganizerEvent | null>(
		null,
	)

const isLoading =
	ref(false)

const errorMessage =
	ref('')

const totalSold = computed(() =>
	event.value?.ticket_types?.reduce(
		(total, ticket) => total + (ticket.sold ?? 0),
		0,
	) ?? 0,
)

const totalCapacity = computed(() =>
	event.value?.ticket_types?.reduce(
		(total, ticket) => total + ticket.capacity,
		0,
	) ?? 0,
)

const totalAvailable = computed(() =>
	Math.max(totalCapacity.value - totalSold.value, 0),
)

const eventId =
	computed<number | null>(() => {
		const value =
			route.query.event

		if (
			typeof value !==
			'string'
		) {
			return null
		}

		const id =
			Number(value)

		return Number.isFinite(id)
			? id
			: null
	})

function extractEvent(
	response: EventResponse,
): OrganizerEvent {
	if (
		'data' in response &&
		response.data
	) {
		return response.data
	}

	return response as OrganizerEvent
}

async function loadTicketTypes() {
	errorMessage.value =
		''

	if (!token.value) {
		errorMessage.value =
			'You are not authenticated.'

		return
	}

	if (!eventId.value) {
		await navigateTo(
			'/organizer/eventmanagement/all-events',
			{
				replace: true,
			},
		)

		return
	}

	isLoading.value =
		true

	try {
		const response =
			await $fetch<EventResponse>(
				`${config.public.apiBaseURL}/organizer/events/${eventId.value}`,
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

		event.value =
			extractEvent(
				response,
			)

	} catch (error: unknown) {
		console.error(
			'Failed to load ticket types:',
			error,
		)

		const apiError =
			error as {
				data?: {
					message?: string
				}
			}

		errorMessage.value =
			apiError.data?.message ??
			'Unable to load ticket types.'

	} finally {
		isLoading.value =
			false
	}
}
function formatCurrency(
	value: string | number,
): string {
	const amount =
		Number(value)

	if (
		Number.isNaN(amount)
	) {
		return String(value)
	}

	return new Intl.NumberFormat(
		'en-PH',
		{
			style:
				'currency',

			currency:
				'PHP',

			maximumFractionDigits:
				0,
		},
	).format(
		amount,
	)
}

function getAvailability(
	ticket: TicketType,
): number {
	const sold =
		ticket.sold ?? 0

	return Math.max(
		ticket.capacity -
		sold,
		0,
	)
}

function getSoldPercentage(
	ticket: TicketType,
): number {
	if (
		ticket.capacity <= 0
	) {
		return 0
	}

	const sold =
		ticket.sold ?? 0

	return Math.min(
		Math.round(
			(
				sold /
				ticket.capacity
			) *
			100,
		),
		100,
	)
}

async function addTicketType() {
	if (!event.value) {
		return
	}

	await navigateTo({
		path:
			'/organizer/eventmanagement/event-details',

		query: {
			event:
				event.value.id,

			mode:
				'edit',
		},
	})
}

async function editTicketType(
	ticket: TicketType,
) {
	if (!event.value) {
		return
	}

	await navigateTo({
		path:
			'/organizer/eventmanagement/event-details',

		query: {
			event:
				event.value.id,

			mode:
				'edit',
		},
	})
}

/*
 * ============================================================
 * DELETE TICKET TYPE
 * ============================================================
 *
 * Your current EventController updates
 * all ticket types together.
 *
 * So for now it is safer to edit/remove
 * the ticket type inside Edit Event.
 *
 * Later we can create:
 *
 * DELETE /organizer/events/{event}/ticket-types/{ticketType}
 */

async function deleteTicketType(
	ticket: TicketType,
) {
	if (!event.value) {
		return
	}

	await navigateTo({
		path:
			'/organizer/eventmanagement/event-details',

		query: {
			event:
				event.value.id,

			mode:
				'edit',
		},
	})
}

watch(
	eventId,
	() => {
		loadTicketTypes()
	},
)

onMounted(() => {
	loadTicketTypes()
})
</script>
