<template>
	<div>
		<div class="mb-6">
			<p class="text-sm font-semibold text-primary-700">
				Client Portal
			</p>

			<h1 class="mt-1 text-2xl font-extrabold text-gray-900">
				Event Details
			</h1>

			<p class="mt-1 text-gray-500">
				View the details of your awarded event, register attendees, and manage tickets.
			</p>
		</div>

		<div v-if="isLoading" class="rounded-2xl border border-gray-200 bg-white p-10 text-center">
			<IconBase name="refresh-cw" class="mx-auto h-5 w-5 animate-spin text-gray-400" />

			<p class="mt-2 text-sm text-gray-500">
				Loading event details...
			</p>
		</div>

		<div v-else-if="errorMessage" class="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
			{{ errorMessage }}
		</div>

		<div v-else-if="eventData" class="space-y-5">
			<div class="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
				<div class="flex flex-wrap items-start justify-between gap-4">
					<div>
						<h2 class="text-xl font-extrabold text-gray-900">
							{{ eventData.event.name }}
						</h2>

						<p class="mt-1 text-sm text-gray-500">
							{{ eventData.event.event_type }}
							&bull;
							{{ formatDate(eventData.event.event_date) }}
						</p>
					</div>

					<span
						class="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
						Awarded
					</span>
				</div>

				<div class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
					<div class="rounded-xl bg-gray-50 p-4">
						<p class="text-xs text-gray-500">
							Location
						</p>

						<p class="mt-1 font-semibold text-gray-900">
							{{
								eventData.event.location ||
								'Not specified'
							}}
						</p>
					</div>

					<div class="rounded-xl bg-gray-50 p-4">
						<p class="text-xs text-gray-500">
							Expected Guests
						</p>

						<p class="mt-1 font-semibold text-gray-900">
							{{
								eventData.event.expected_guests ??
								'Not specified'
							}}
						</p>
					</div>

					<div class="rounded-xl bg-gray-50 p-4">
						<p class="text-xs text-gray-500">
							Start Time
						</p>

						<p class="mt-1 font-semibold text-gray-900">
							{{
								eventData.event.start_time ||
								'Not set'
							}}
						</p>
					</div>

					<div class="rounded-xl bg-gray-50 p-4">
						<p class="text-xs text-gray-500">
							End Time
						</p>

						<p class="mt-1 font-semibold text-gray-900">
							{{
								eventData.event.end_time ||
								'Not set'
							}}
						</p>
					</div>
				</div>

				<div v-if="eventData.event.description" class="mt-5 rounded-xl bg-gray-50 p-4">
					<p class="text-xs text-gray-500">
						Description
					</p>

					<p class="mt-2 text-sm leading-6 text-gray-700">
						{{ eventData.event.description }}
					</p>
				</div>
			</div>

			<div class="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
				<h3 class="text-lg font-bold text-gray-900">
					Selected Organizer
				</h3>

				<div class="mt-4 flex items-center gap-3">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 font-bold text-primary-700">
						{{ organizerInitials }}
					</div>

					<div>
						<p class="font-bold text-gray-900">
							{{ organizerName }}
						</p>

						<p class="text-sm text-gray-500">
							Organizer
						</p>
					</div>
				</div>
			</div>

			<div class="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
				<div class="flex flex-wrap items-start justify-between gap-4">
					<div>
						<p class="text-xs text-gray-500">
							Accepted Package
						</p>

						<h3 class="mt-1 text-lg font-bold text-gray-900">
							{{
								eventData.quotation.package_name ||
								'Custom Package'
							}}
						</h3>
					</div>

					<p class="text-2xl font-extrabold text-gray-900">
						{{
							formatCurrency(
								eventData.quotation
									.quotation_amount,
							)
						}}
					</p>
				</div>

				<div v-if="
					eventData.quotation.inclusions?.length
				" class="mt-5">
					<p class="text-sm font-bold text-gray-900">
						Inclusions
					</p>

					<div class="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
						<div v-for="item in eventData.quotation.inclusions" :key="item.id"
							class="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">
							<IconBase name="check-circle" class="h-4 w-4 text-green-600" />

							{{ item.description }}
						</div>
					</div>
				</div>
			</div>

			<div class="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
				<div class="flex flex-wrap items-start justify-between gap-4">
					<div>
						<h3 class="text-lg font-bold text-gray-900">
							Registration &amp; Tickets
						</h3>

						<p class="mt-1 text-sm text-gray-500">
							Register attendees and manage tickets for this event.
						</p>
					</div>

					<button v-if="registrationAvailable" type="button"
						class="flex items-center gap-2 rounded-xl bg-[#285F6b] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f4a54] disabled:cursor-not-allowed disabled:opacity-50"
						:disabled="!ticketTypes.length" @click="openRegistrationForm">
						<IconBase name="user-plus" class="h-4 w-4" />

						Register Attendee
					</button>
				</div>

				<div v-if="registrationSuccess" class="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
					<div class="flex items-start gap-3">
						<IconBase name="check-circle" class="mt-0.5 h-5 w-5 shrink-0 text-green-600" />

						<div>
							<p class="text-sm font-semibold text-green-800">
								{{ registrationSuccess }}
							</p>

							<p v-if="latestTicket" class="mt-1 text-xs text-green-700">
								{{ latestTicket.ticket_id }}
								has been generated and is ready for check-in.
							</p>
						</div>
					</div>
				</div>

				<div v-if="!registrationAvailable" class="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
					<div class="flex items-start gap-3">
						<IconBase name="alert-circle" class="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

						<div>
							<p class="text-sm font-bold text-gray-900">
								Registration is not available yet
							</p>

							<p class="mt-1 text-sm text-gray-600">
								The organizer has not enabled public registration for this event.
							</p>
						</div>
					</div>
				</div>

				<template v-else>
					<div v-if="ticketTypes.length" class="mt-6">
						<div class="mb-3 flex items-center justify-between">
							<div>
								<h4 class="text-sm font-bold text-gray-900">
									Available Ticket Types
								</h4>

								<p class="mt-0.5 text-xs text-gray-500">
									Choose a ticket type when registering an attendee.
								</p>
							</div>
						</div>

						<div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
							<div v-for="ticketType in ticketTypes" :key="ticketType.id"
								class="rounded-xl border border-gray-200 p-4">
								<div class="flex items-start justify-between gap-3">
									<div>
										<p class="font-bold text-gray-900">
											{{ ticketType.name }}
										</p>

										<p class="mt-1 text-lg font-extrabold text-[#285F6b]">
											{{
												formatCurrency(
													ticketType.price,
												)
											}}
										</p>
									</div>

									<div
										class="flex h-9 w-9 items-center justify-center rounded-xl bg-[#285F6b]/10 text-[#285F6b]">
										<IconBase name="ticket" class="h-4 w-4" />
									</div>
								</div>

								<div class="mt-4 border-t border-gray-100 pt-3">
									<div class="flex items-center justify-between text-xs">
										<span class="text-gray-500">
											Capacity
										</span>

										<span class="font-semibold text-gray-700">
											{{ ticketType.capacity }}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div v-else class="mt-5 rounded-xl border border-dashed border-gray-300 px-5 py-8 text-center">
						<IconBase name="ticket" class="mx-auto h-7 w-7 text-gray-400" />

						<p class="mt-2 text-sm font-semibold text-gray-700">
							Ticket types are not configured yet
						</p>

						<p class="mt-1 text-xs text-gray-500">
							The organizer must configure ticket types before attendees can register.
						</p>
					</div>
				</template>

				<div class="my-6 border-t border-gray-100" />

				<div class="flex flex-wrap items-center justify-between gap-3">
					<div>
						<h4 class="text-sm font-bold text-gray-900">
							Your Tickets
						</h4>

						<p class="mt-0.5 text-xs text-gray-500">
							Tickets registered for this event
						</p>
					</div>

					<button v-if="eventTickets.length" type="button"
						class="text-xs font-semibold text-[#285F6b] hover:underline" @click="loadTickets">
						Refresh
					</button>
				</div>

				<div v-if="isLoadingTickets" class="py-8 text-center">
					<IconBase name="refresh-cw" class="mx-auto h-5 w-5 animate-spin text-gray-400" />

					<p class="mt-2 text-sm text-gray-500">
						Loading tickets...
					</p>
				</div>

				<div v-else-if="ticketError"
					class="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
					{{ ticketError }}
				</div>

				<div v-else-if="eventTickets.length" class="mt-4 space-y-3">
					<div v-for="ticket in eventTickets" :key="ticket.id"
						class="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 p-4">
						<div class="flex min-w-0 items-center gap-3">
							<div
								class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#285F6b]/10 font-bold text-[#285F6b]">
								{{
									getInitials(
										ticket.name,
									)
								}}
							</div>

							<div class="min-w-0">
								<p class="truncate font-bold text-gray-900">
									{{ ticket.name }}
								</p>

								<div class="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
									<span>
										{{
											ticket.ticket_type?.name ||
											'General Admission'
										}}
									</span>

									<span>
										&bull;
									</span>

									<span class="font-mono">
										{{ ticket.ticket_id }}
									</span>
								</div>
							</div>
						</div>

						<div class="flex flex-wrap items-center gap-2">
							<span class="rounded-full px-2.5 py-1 text-xs font-semibold" :class="ticket.status ===
								'checked_in'
								? 'bg-green-50 text-green-700'
								: 'bg-gray-100 text-gray-600'
								">
								{{
									ticket.status ===
										'checked_in'
										? 'Checked-in'
										: 'Registered'
								}}
							</span>

							<button type="button"
								class="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
								@click="viewTicket(ticket)">
								<IconBase name="qr-code" class="h-3.5 w-3.5" />

								View Ticket
							</button>
						</div>
					</div>
				</div>

				<div v-else class="mt-4 rounded-xl border border-dashed border-gray-300 px-5 py-10 text-center">
					<IconBase name="qr-code" class="mx-auto h-7 w-7 text-gray-400" />

					<p class="mt-2 text-sm font-semibold text-gray-700">
						No tickets yet
					</p>

					<p class="mt-1 text-xs text-gray-500">
						Register an attendee to generate your first QR ticket.
					</p>
				</div>
			</div>
		</div>

		<Transition name="fade">
			<div v-if="showRegistrationForm" class="fixed inset-0 z-40 bg-gray-900/40" @click="closeRegistrationForm" />
		</Transition>

		<Transition name="slide">
			<div v-if="showRegistrationForm"
				class="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl">
				<div class="flex items-start justify-between border-b border-gray-200 px-6 py-5">
					<div class="flex items-start gap-3">
						<div
							class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#285F6b] text-white">
							<IconBase name="user-plus" class="h-5 w-5" />
						</div>

						<div>
							<h2 class="text-lg font-bold text-gray-900">
								Register Attendee
							</h2>

							<p class="mt-1 text-sm text-gray-500">
								{{ eventData?.event.name }}
							</p>
						</div>
					</div>

					<button type="button" class="text-gray-400 hover:text-gray-600" @click="closeRegistrationForm">
						<IconBase name="x" class="h-5 w-5" />
					</button>
				</div>

				<div class="flex-1 overflow-y-auto px-6 py-5">
					<div v-if="registrationError"
						class="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
						{{ registrationError }}
					</div>

					<FormsLabel text="Full Name" required />

					<FormsTextField v-model="registrationForm.name" icon="user" placeholder="e.g. Juan Dela Cruz"
						required />

					<div class="mt-4">
						<FormsLabel text="Email Address" />

						<FormsTextField v-model="registrationForm.email" type="email"
							placeholder="e.g. juan@example.com" />
					</div>

					<div class="mt-4">
						<label class="mb-1.5 block text-sm font-semibold text-gray-700">
							Ticket Type
							<span class="text-red-500">
								*
							</span>
						</label>

						<select v-model="registrationForm.ticketTypeId"
							class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-[#285F6b] focus:outline-none focus:ring-2 focus:ring-[#285F6b]/15">
							<option :value="null" disabled>
								Select ticket type
							</option>

							<option v-for="ticketType in ticketTypes" :key="ticketType.id" :value="ticketType.id">
								{{ ticketType.name }}
								—
								{{
									formatCurrency(
										ticketType.price,
									)
								}}
							</option>
						</select>
					</div>

					<div v-if="selectedRegistrationTicketType"
						class="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
						<div class="flex items-center justify-between gap-3">
							<div>
								<p class="text-xs text-gray-500">
									Selected Ticket
								</p>

								<p class="mt-1 font-bold text-gray-900">
									{{ selectedRegistrationTicketType.name }}
								</p>
							</div>

							<p class="text-lg font-extrabold text-[#285F6b]">
								{{
									formatCurrency(
										selectedRegistrationTicketType.price,
									)
								}}
							</p>
						</div>
					</div>

					<div class="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
						<div class="flex items-start gap-3">
							<IconBase name="qr-code" class="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

							<div>
								<p class="text-sm font-semibold text-blue-900">
									QR ticket included
								</p>

								<p class="mt-1 text-xs leading-5 text-blue-700">
									A unique QR ticket will be generated after registration and can be presented during
									event
									check-in.
								</p>
							</div>
						</div>
					</div>
				</div>

				<div class="flex gap-3 border-t border-gray-200 px-6 py-4">
					<FormsButton variant="secondary" class="flex-1" :disabled="isRegistering"
						@click="closeRegistrationForm">
						Cancel
					</FormsButton>

					<FormsButton class="flex-1" :disabled="isRegistering ||
						!registrationForm.name.trim() ||
						!registrationForm.ticketTypeId
						" @click="registerAttendee">
						<IconBase v-if="isRegistering" name="refresh-cw" class="h-4 w-4 animate-spin" />

						<IconBase v-else name="ticket" class="h-4 w-4" />

						{{
							isRegistering
								? 'Registering...'
								: 'Register & Generate Ticket'
						}}
					</FormsButton>
				</div>
			</div>
		</Transition>

		<Transition name="fade">
			<div v-if="showTicketDetails" class="fixed inset-0 z-40 bg-gray-900/40" @click="closeTicketDetails" />
		</Transition>

		<Transition name="slide">
			<div v-if="
				showTicketDetails &&
				activeTicket
			" class="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl">
				<div class="flex items-start justify-between border-b border-gray-200 px-6 py-5">
					<div>
						<h2 class="text-lg font-bold text-gray-900">
							QR Ticket
						</h2>

						<p class="mt-1 text-sm text-gray-500">
							{{ activeTicket.ticket_id }}
						</p>
					</div>

					<button type="button" class="text-gray-400 hover:text-gray-600" @click="closeTicketDetails">
						<IconBase name="x" class="h-5 w-5" />
					</button>
				</div>

				<div class="flex-1 overflow-y-auto px-6 py-6">
					<div class="rounded-2xl border border-gray-200 p-5">
						<div class="text-center">
							<div
								class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#285F6b]/10 text-lg font-bold text-[#285F6b]">
								{{
									getInitials(
										activeTicket.name,
									)
								}}
							</div>

							<h3 class="mt-3 text-lg font-bold text-gray-900">
								{{ activeTicket.name }}
							</h3>

							<p class="mt-1 text-sm text-gray-500">
								{{
									activeTicket.ticket_type?.name ||
									'General Admission'
								}}
							</p>
						</div>

						<div class="my-5 border-t border-gray-100" />

						<div class="space-y-4">
							<div class="flex items-center justify-between gap-3">
								<span class="text-sm text-gray-500">
									Ticket ID
								</span>

								<span class="font-mono text-sm font-bold text-gray-900">
									{{ activeTicket.ticket_id }}
								</span>
							</div>

							<div class="flex items-center justify-between gap-3">
								<span class="text-sm text-gray-500">
									Status
								</span>

								<span class="rounded-full px-2.5 py-1 text-xs font-semibold" :class="activeTicket.status ===
									'checked_in'
									? 'bg-green-50 text-green-700'
									: 'bg-gray-100 text-gray-600'
									">
									{{
										activeTicket.status ===
											'checked_in'
											? 'Checked-in'
											: 'Registered'
									}}
								</span>
							</div>
						</div>
					</div>

					<div class="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-5 text-center">
						<div
							class="mx-auto flex h-40 w-40 items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white">
							<IconBase name="qr-code" class="h-20 w-20 text-gray-800" />
						</div>

						<p class="mt-4 text-sm font-bold text-gray-900">
							Present this ticket at check-in
						</p>

						<p class="mt-1 text-xs text-gray-500">
							The organizer will scan the QR ticket to admit the attendee.
						</p>
					</div>

					<div v-if="activeTicket.qr_value" class="mt-5">
						<p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
							QR Value
						</p>

						<div
							class="break-all rounded-xl border border-gray-200 bg-gray-50 p-3 font-mono text-xs text-gray-500">
							{{ activeTicket.qr_value }}
						</div>
					</div>
				</div>

				<div class="border-t border-gray-200 px-6 py-4">
					<button type="button"
						class="w-full rounded-xl bg-[#285F6b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1f4a54]"
						@click="closeTicketDetails">
						Done
					</button>
				</div>
			</div>
		</Transition>
	</div>
</template>

<script setup lang="ts">
interface TicketType {
	id: number
	event_id: number
	name: string
	price: string | number
	capacity: number
}

interface EventItem {
	id: number
	name: string
	event_type: string
	description: string | null
	event_date: string | null
	location: string | null
	expected_guests: number | null
	start_time: string | null
	end_time: string | null
	status: string
	public_registration: boolean
	require_approval: boolean
	waitlist_enabled: boolean
	contact_name: string | null
	contact_email: string | null
	contact_phone: string | null
	ticket_types?: TicketType[]
}

interface Inclusion {
	id: number
	description: string
}

interface QuotationItem {
	id: number
	quotation_amount: string | number
	package_name: string | null
	timeline: string | null
	quotation_details: string | null
	inclusions: Inclusion[]
}

interface OrganizerUser {
	firstname?: string
	middlename?: string | null
	lastname?: string
}

interface OrganizerItem {
	id: number
	name?: string
	company_name?: string
	user?: OrganizerUser
}

interface ClientEventResponse {
	data: {
		event: EventItem
		quotation: QuotationItem
		organizer?: OrganizerItem
	}
}

interface EventTicket {
	id: number
	name: string
	email: string | null
	ticket_type: TicketType | null
	ticket_id: string
	qr_token?: string
	qr_value?: string
	source: string
	payment_status: string

	status:
	| 'registered'
	| 'checked_in'

	checked_in_at:
	| string
	| null

	created_at: string
}

interface TicketListResponse {
	data: EventTicket[]
}

interface CreateTicketResponse {
	message?: string
	data: EventTicket
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

definePageMeta({
	layout: 'client',
	middleware: ['client'],
})

const route =
	useRoute()

const config =
	useRuntimeConfig()

const {
	token,
	isAuthenticated,
} = useAuth('client')

const eventData =
	ref<ClientEventResponse['data'] | null>(
		null,
	)

const eventTickets =
	ref<EventTicket[]>([])

const isLoading =
	ref(false)

const isLoadingTickets =
	ref(false)

const isRegistering =
	ref(false)

const errorMessage =
	ref('')

const ticketError =
	ref('')

const registrationError =
	ref('')

const registrationSuccess =
	ref('')

const showRegistrationForm =
	ref(false)

const showTicketDetails =
	ref(false)

const activeTicket =
	ref<EventTicket | null>(
		null,
	)

const latestTicket =
	ref<EventTicket | null>(
		null,
	)

const inquiryId =
	computed(() => {
		const value =
			route.query.inquiry

		if (
			typeof value !==
			'string'
		) {
			return null
		}

		const parsed =
			Number(value)

		return Number.isFinite(
			parsed,
		)
			? parsed
			: null
	})

const eventId =
	computed<number | null>(
		() =>
			eventData.value?.event.id ??
			null,
	)

const ticketTypes =
	computed<TicketType[]>(
		() =>
			eventData.value?.event
				.ticket_types ??
			[],
	)

const registrationAvailable =
	computed(
		() =>
			Boolean(
				eventData.value?.event
					.public_registration,
			),
	)

function emptyRegistrationForm() {
	return {
		name: '',
		email: '',

		ticketTypeId:
			null as number | null,
	}
}

const registrationForm =
	reactive(
		emptyRegistrationForm(),
	)

const selectedRegistrationTicketType =
	computed<TicketType | null>(
		() => {
			if (
				!registrationForm.ticketTypeId
			) {
				return null
			}

			return (
				ticketTypes.value.find(
					ticketType =>
						ticketType.id ===
						registrationForm.ticketTypeId,
				) ?? null
			)
		},
	)

const organizerName =
	computed(() => {
		const organizer =
			eventData.value?.organizer

		if (!organizer) {
			return 'Organizer'
		}

		const user =
			organizer.user

		if (user) {
			const name = [
				user.firstname,
				user.middlename,
				user.lastname,
			]
				.filter(Boolean)
				.join(' ')

			if (name) {
				return name
			}
		}

		return (
			organizer.company_name ||
			organizer.name ||
			'Organizer'
		)
	})

const organizerInitials =
	computed(() => {
		const words =
			organizerName.value
				.split(' ')
				.filter(Boolean)

		if (!words.length) {
			return 'OR'
		}

		if (words.length === 1) {
			return (
				words[0]
					?.charAt(0)
					.toUpperCase() ||
				'OR'
			)
		}

		return (
			(
				words[0]?.charAt(0) ||
				''
			) +
			(
				words[
					words.length - 1
				]?.charAt(0) ||
				''
			)
		).toUpperCase()
	})

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

function formatDate(
	dateString: string | null,
): string {
	if (!dateString) {
		return 'Date not set'
	}

	const date =
		new Date(
			dateString.includes('T')
				? dateString
				: `${dateString}T00:00:00`,
		)

	return date.toLocaleDateString(
		'en-US',
		{
			month:
				'long',

			day:
				'numeric',

			year:
				'numeric',
		},
	)
}

function formatCurrency(
	value: string | number,
): string {
	const amount =
		Number(value)

	return new Intl.NumberFormat(
		'en-PH',
		{
			style:
				'currency',

			currency:
				'PHP',

			minimumFractionDigits:
				2,
		},
	).format(
		Number.isNaN(amount)
			? 0
			: amount,
	)
}

function getInitials(
	name: string,
): string {
	return name
		.split(' ')
		.filter(Boolean)
		.slice(0, 2)
		.map(
			word =>
				word.charAt(0),
		)
		.join('')
		.toUpperCase()
}

async function loadEventDetails() {
	errorMessage.value =
		''

	if (
		!isAuthenticated.value ||
		!token.value
	) {
		errorMessage.value =
			'You are not authenticated.'

		return
	}

	if (!inquiryId.value) {
		errorMessage.value =
			'No awarded event was selected.'

		return
	}

	isLoading.value =
		true

	try {
		const response =
			await $fetch<ClientEventResponse>(
				`${config.public.apiBaseURL}/client/inquiries/${inquiryId.value}/event`,
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

		eventData.value =
			response.data

		await loadTickets()

	} catch (error: unknown) {
		console.error(
			'Failed to load event details:',
			error,
		)

		errorMessage.value =
			getApiErrorMessage(
				error,
				'Unable to load event details.',
			)

	} finally {
		isLoading.value =
			false
	}
}

async function loadTickets() {
	if (
		!token.value ||
		!eventId.value
	) {
		eventTickets.value =
			[]

		return
	}

	isLoadingTickets.value =
		true

	ticketError.value =
		''

	try {
		const response =
			await $fetch<TicketListResponse>(
				`${config.public.apiBaseURL}/client/events/${eventId.value}/tickets`,
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

		eventTickets.value =
			response.data ??
			[]

	} catch (error: unknown) {
		console.error(
			'Failed to load event tickets:',
			error,
		)

		eventTickets.value =
			[]

		ticketError.value =
			getApiErrorMessage(
				error,
				'Unable to load event tickets.',
			)

	} finally {
		isLoadingTickets.value =
			false
	}
}

function openRegistrationForm() {
	if (
		!registrationAvailable.value ||
		!ticketTypes.value.length
	) {
		return
	}

	Object.assign(
		registrationForm,
		emptyRegistrationForm(),
	)

	if (
		ticketTypes.value.length ===
		1
	) {
		registrationForm.ticketTypeId =
			ticketTypes.value[0]?.id ??
			null
	}

	registrationError.value =
		''

	registrationSuccess.value =
		''

	showRegistrationForm.value =
		true
}

function closeRegistrationForm() {
	if (
		isRegistering.value
	) {
		return
	}

	showRegistrationForm.value =
		false

	registrationError.value =
		''
}

async function registerAttendee() {
	if (
		!token.value ||
		!eventId.value
	) {
		return
	}

	if (
		!registrationForm.name.trim()
	) {
		registrationError.value =
			'Full name is required.'

		return
	}

	if (
		!registrationForm.ticketTypeId
	) {
		registrationError.value =
			'Please select a ticket type.'

		return
	}

	isRegistering.value =
		true

	registrationError.value =
		''

	try {
		const response =
			await $fetch<CreateTicketResponse>(
				`${config.public.apiBaseURL}/client/events/${eventId.value}/tickets`,
				{
					method:
						'POST',

					headers: {
						Accept:
							'application/json',

						Authorization:
							`Bearer ${token.value}`,
					},

					body: {
						attendee_name:
							registrationForm.name.trim(),

						attendee_email:
							registrationForm.email.trim() ||
							null,

						event_ticket_type_id:
							registrationForm.ticketTypeId,
					},
				},
			)

		latestTicket.value =
			response.data

		registrationSuccess.value =
			response.message ??
			'Attendee registered successfully.'

		showRegistrationForm.value =
			false

		Object.assign(
			registrationForm,
			emptyRegistrationForm(),
		)

		await loadTickets()

		activeTicket.value =
			response.data

		showTicketDetails.value =
			true

	} catch (error: unknown) {
		console.error(
			'Failed to register attendee:',
			error,
		)

		registrationError.value =
			getApiErrorMessage(
				error,
				'Unable to register attendee.',
			)

	} finally {
		isRegistering.value =
			false
	}
}

function viewTicket(
	ticket: EventTicket,
) {
	activeTicket.value =
		ticket

	showTicketDetails.value =
		true
}

function closeTicketDetails() {
	showTicketDetails.value =
		false
}

onMounted(() => {
	loadEventDetails()
})
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
	transition:
		transform 0.25s ease;
}

.slide-enter-from,
.slide-leave-to {
	transform:
		translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
	transition:
		opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>