<template>
	<div>
		<div v-if="isLoading" class="rounded-2xl border border-gray-200 bg-white p-10 text-center">
			<p class="text-sm text-gray-500">
				Loading ticket types...
			</p>
		</div>

		<div v-else-if="errorMessage" class="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
			{{ errorMessage }}
		</div>

		<div v-else-if="event">
			<div class="mb-5 flex items-start justify-between gap-4">
				<div>
					<p class="text-sm text-gray-500">
						Manage ticket types for
						<span class="font-semibold text-gray-700">
							{{ event.name }}
						</span>
					</p>
				</div>

				<button type="button"
					class="flex shrink-0 items-center gap-2 rounded-xl bg-[#285F6b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1f4a54]"
					@click="addTicketType">
					<IconBase name="plus" class="h-4 w-4" />

					Add Ticket Type
				</button>
			</div>

			<!-- No Ticket Types -->
			<div v-if="!event.ticket_types?.length"
				class="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
				<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
					<IconBase name="tag" class="h-5 w-5" />
				</div>

				<h3 class="mt-4 font-bold text-gray-900">
					No Ticket Types Yet
				</h3>

				<p class="mx-auto mt-1 max-w-md text-sm text-gray-500">
					Add ticket types such as VIP,
					Regular, Early Bird, or Student
					for this event.
				</p>
			</div>

			<!-- Ticket Types -->
			<div v-else class="space-y-5">
				<div v-for="ticket in event.ticket_types" :key="ticket.id"
					class="rounded-2xl border border-gray-200 bg-white p-6">
					<div class="flex items-start justify-between">
						<div>
							<h3 class="text-lg font-bold text-gray-900">
								{{ ticket.name }}
							</h3>

							<p class="mt-1 text-sm text-gray-500">
								{{ ticket.sold ?? 0 }}
								/
								{{ ticket.capacity }}
								sold
							</p>
						</div>

						<div class="flex shrink-0 gap-2">
							<button type="button"
								class="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50" @click="
									editTicketType(ticket)
									">
								<IconBase name="edit" class="h-4 w-4" />
							</button>

							<button type="button"
								class="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50" @click="
									deleteTicketType(
										ticket,
									)
									">
								<IconBase name="trash" class="h-4 w-4" />
							</button>
						</div>
					</div>

					<div class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
						<div>
							<div class="text-sm text-gray-500">
								Price
							</div>

							<div class="mt-1 text-lg font-bold text-gray-900">
								{{
									formatCurrency(
										ticket.price,
									)
								}}
							</div>
						</div>

						<div>
							<div class="text-sm text-gray-500">
								Capacity
							</div>

							<div class="mt-1 text-lg font-bold text-gray-900">
								{{ ticket.capacity }}
							</div>
						</div>

						<div>
							<div class="text-sm text-gray-500">
								Availability
							</div>

							<div class="mt-1 text-lg font-bold text-gray-900">
								{{
									getAvailability(
										ticket,
									)
								}}
							</div>
						</div>
					</div>

					<div class="mt-5">
						<div class="mb-1 flex items-center justify-between text-sm">
							<span class="font-semibold text-gray-900">
								Tickets Sold
							</span>

							<span class="text-gray-500">
								{{ ticket.sold ?? 0 }}
								/
								{{ ticket.capacity }}
							</span>
						</div>

						<div class="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
							<div class="h-full rounded-full bg-[#0ca30c]" :style="{
								width:
									getSoldPercentage(
										ticket,
									) + '%',
							}" />
						</div>
					</div>
				</div>
			</div>
		</div>
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