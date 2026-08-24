<template>
	<div class="rounded-2xl border border-gray-200 bg-white p-6">
		<div class="mb-5 flex flex-wrap items-start justify-between gap-3">
			<div>
				<h2 class="text-lg font-bold text-gray-900">
					Attendee Management
				</h2>

				<p class="mt-1 text-sm text-gray-500">
					<span v-if="selectedEvent">
						View and manage attendees for
						<span class="font-semibold text-gray-700">
							{{ selectedEvent.name }}
						</span>
					</span>

					<span v-else>
						View and manage registered attendees
					</span>
				</p>
			</div>

			<div class="flex shrink-0 flex-wrap gap-3">
				<button type="button"
					class="flex items-center gap-2 rounded-xl bg-[#285F6b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1f4a54] disabled:cursor-not-allowed disabled:opacity-50"
					:disabled="!selectedEventId" @click="openRegisterAttendee">
					<IconBase name="user-plus" class="h-4 w-4" />

					Register Attendee
				</button>

				<button type="button"
					class="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
					:disabled="!selectedEventId">
					<IconBase name="upload" class="h-4 w-4" />

					Bulk Import
				</button>

				<button type="button"
					class="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
					:disabled="!selectedEventId ||
						!attendees.length
						" @click="exportAttendees">
					<IconBase name="download" class="h-4 w-4" />

					Export List
				</button>
			</div>
		</div>

		<div v-if="!selectedEventId" class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4">
			<div class="flex items-start gap-3">
				<IconBase name="calendar" class="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

				<div>
					<p class="text-sm font-bold text-gray-900">
						Select an Event
					</p>

					<p class="mt-0.5 text-sm text-gray-600">
						Choose an event from the selector above to view and register attendees.
					</p>
				</div>
			</div>
		</div>

		<template v-else>
			<div v-if="successMessage" class="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
				<div class="flex items-start justify-between gap-3">
					<div class="flex items-start gap-3">
						<IconBase name="check-circle" class="mt-0.5 h-5 w-5 shrink-0 text-green-600" />

						<div>
							<p class="text-sm font-semibold text-green-800">
								{{ successMessage }}
							</p>

							<p v-if="registeredTicket" class="mt-1 text-xs text-green-700">
								Ticket
								{{ registeredTicket.ticket_id }}
								was generated successfully.
							</p>
						</div>
					</div>

					<button type="button" class="text-green-600 hover:text-green-800" @click="clearSuccess">
						<IconBase name="x" class="h-4 w-4" />
					</button>
				</div>
			</div>

			<div v-if="errorMessage"
				class="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
				{{ errorMessage }}
			</div>

			<div class="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
				<div class="w-full lg:max-w-md">
					<FormsTextField v-model="search" icon="search" placeholder="Search attendees..." />
				</div>

				<div class="flex flex-wrap items-center gap-2">
					<button v-for="filter in filters" :key="filter.value" type="button"
						class="rounded-full px-3 py-1.5 text-xs font-semibold transition" :class="activeFilter ===
								filter.value
								? 'bg-gray-900 text-white'
								: 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
							" @click="
							activeFilter =
							filter.value
							">
						{{ filter.label }}

						<span v-if="
							getFilterCount(
								filter.value,
							) !== null
						" class="ml-1 opacity-70">
							{{
								getFilterCount(
									filter.value,
								)
							}}
						</span>
					</button>
				</div>
			</div>

			<div v-if="isLoading" class="py-12 text-center">
				<IconBase name="refresh-cw" class="mx-auto h-5 w-5 animate-spin text-gray-400" />

				<p class="mt-2 text-sm text-gray-500">
					Loading attendees...
				</p>
			</div>

			<div v-else-if="
				filteredAttendees.length
			" class="overflow-x-auto">
				<table class="w-full text-left text-sm">
					<thead>
						<tr
							class="border-b border-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-400">
							<th class="pb-3 pr-4">
								Name
							</th>

							<th class="pb-3 pr-4">
								Email
							</th>

							<th class="pb-3 pr-4">
								Ticket Type
							</th>

							<th class="pb-3 pr-4">
								Ticket ID
							</th>

							<th class="pb-3 pr-4">
								Source
							</th>

							<th class="pb-3 pr-4">
								Status
							</th>

							<th class="pb-3">
								Payment
							</th>
						</tr>
					</thead>

					<tbody class="divide-y divide-gray-100">
						<tr v-for="attendee in filteredAttendees" :key="attendee.id"
							class="transition hover:bg-gray-50/70">
							<td class="py-3.5 pr-4">
								<div class="flex items-center gap-3">
									<div
										class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#285F6b]/10 text-sm font-bold text-[#285F6b]">
										{{
											getInitials(
												attendee.name,
											)
										}}
									</div>

									<div>
										<p class="font-semibold text-gray-900">
											{{
												attendee.name
											}}
										</p>

										<p v-if="
											attendee.checked_in_at
										" class="mt-0.5 text-xs text-gray-400">
											Checked in
											{{
												formatCheckInTime(
													attendee.checked_in_at,
												)
											}}
										</p>
									</div>
								</div>
							</td>

							<td class="py-3.5 pr-4 text-gray-500">
								{{
									attendee.email ||
									'—'
								}}
							</td>

							<td class="py-3.5 pr-4 text-gray-700">
								{{
									attendee.ticket_type
										?.name ||
									'General Admission'
								}}
							</td>

							<td class="py-3.5 pr-4">
								<span class="font-mono text-xs font-semibold text-gray-500">
									{{
										attendee.ticket_id
									}}
								</span>
							</td>

							<td class="py-3.5 pr-4">
								<span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold" :class="sourceClass(
									attendee.source,
								)
									">
									{{
										formatSource(
											attendee.source,
										)
									}}
								</span>
							</td>

							<td class="py-3.5 pr-4">
								<span
									class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
									:class="attendee.status ===
											'checked_in'
											? 'bg-gray-900 text-white'
											: 'border border-gray-200 text-gray-600'
										">
									<IconBase v-if="
										attendee.status ===
										'checked_in'
									" name="check-circle" class="h-3 w-3" />

									{{
										formatStatus(
											attendee.status,
										)
									}}
								</span>
							</td>

							<td class="py-3.5">
								<span class="inline-flex rounded-full px-3 py-1 text-xs font-semibold" :class="paymentClass(
									attendee.payment_status,
								)
									">
									{{
										formatPaymentStatus(
											attendee.payment_status,
										)
									}}
								</span>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div v-else class="rounded-xl border border-dashed border-gray-300 px-5 py-12 text-center">
				<IconBase name="users" class="mx-auto h-7 w-7 text-gray-400" />

				<p class="mt-2 text-sm font-semibold text-gray-700">
					{{
						search ||
							activeFilter !==
							'all'
							? 'No matching attendees'
							: 'No attendees yet'
					}}
				</p>

				<p class="mt-1 text-xs text-gray-500">
					{{
						search ||
							activeFilter !==
							'all'
							? 'Try changing your search or filter.'
							: 'Online registrations, organizer registrations, and paid walk-ins will appear here.'
					}}
				</p>

				<button v-if="
					!search &&
					activeFilter ===
					'all'
				" type="button"
					class="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#285F6b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1f4a54]"
					@click="openRegisterAttendee">
					<IconBase name="user-plus" class="h-4 w-4" />

					Register First Attendee
				</button>
			</div>
		</template>

		<Transition name="fade">
			<div v-if="showRegisterForm" class="fixed inset-0 z-40 bg-gray-900/40" @click="closeRegisterAttendee" />
		</Transition>

		<Transition name="slide">
			<div v-if="showRegisterForm"
				class="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl">
				<div class="flex shrink-0 items-start justify-between border-b border-gray-200 px-6 py-5">
					<div class="flex items-start gap-3">
						<div
							class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#285F6b] text-white">
							<IconBase name="user-plus" class="h-5 w-5" />
						</div>

						<div>
							<h2 class="text-base font-bold text-gray-900">
								Register Attendee
							</h2>

							<p class="mt-0.5 text-sm text-gray-500">
								{{
									selectedEvent?.name ||
									'Selected event'
								}}
							</p>
						</div>
					</div>

					<button type="button" class="text-gray-400 transition hover:text-gray-600"
						@click="closeRegisterAttendee">
						<IconBase name="x" class="h-5 w-5" />
					</button>
				</div>

				<div class="flex-1 overflow-y-auto px-6 py-5">
					<div v-if="registerError"
						class="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
						{{ registerError }}
					</div>

					<div v-if="isLoadingTicketTypes"
						class="mb-5 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
						<div class="flex items-center gap-2 text-sm text-gray-500">
							<IconBase name="refresh-cw" class="h-4 w-4 animate-spin" />

							Loading ticket types...
						</div>
					</div>

					<FormsLabel text="Full Name" required />

					<FormsTextField v-model="registerForm.attendeeName" icon="user" placeholder="e.g. Juan Dela Cruz"
						required />

					<div class="mt-4">
						<FormsLabel text="Email Address" />

						<FormsTextField v-model="registerForm.attendeeEmail" type="email"
							placeholder="e.g. juan@example.com" />
					</div>

					<div class="mt-4">
						<label class="mb-1.5 block text-sm font-semibold text-gray-700">
							Ticket Type
							<span class="text-red-500">
								*
							</span>
						</label>

						<select v-model="registerForm.ticketTypeId"
							class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-[#285F6b] focus:outline-none focus:ring-2 focus:ring-[#285F6b]/15 disabled:cursor-not-allowed disabled:opacity-60"
							:disabled="isLoadingTicketTypes ||
								!ticketTypes.length
								">
							<option :value="null" disabled>
								Select ticket type
							</option>

							<option v-for="ticketType in ticketTypes" :key="ticketType.id" :value="ticketType.id">
								{{ ticketType.name }}
								<span v-if="
									ticketType.price !==
									undefined
								">
									—
									{{
										formatCurrency(
											ticketType.price,
										)
									}}
								</span>
							</option>
						</select>

						<div v-if="
							!isLoadingTicketTypes &&
							!ticketTypes.length
						" class="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
							No ticket types are configured for this event. Configure ticket types in Event Management
							first.
						</div>
					</div>

					<div class="mt-4">
						<label class="mb-1.5 block text-sm font-semibold text-gray-700">
							Payment Status
						</label>

						<select v-model="registerForm.paymentStatus"
							class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-[#285F6b] focus:outline-none focus:ring-2 focus:ring-[#285F6b]/15">
							<option value="paid">
								Paid
							</option>

							<option value="pending">
								Pending
							</option>
						</select>
					</div>

					<div v-if="selectedTicketType" class="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4">
						<div class="mb-3 flex items-center gap-3">
							<div
								class="flex h-9 w-9 items-center justify-center rounded-xl bg-[#285F6b]/10 text-[#285F6b]">
								<IconBase name="ticket" class="h-4 w-4" />
							</div>

							<div>
								<p class="text-sm font-bold text-gray-900">
									{{ selectedTicketType.name }}
								</p>

								<p class="text-xs text-gray-500">
									Selected ticket type
								</p>
							</div>
						</div>

						<div class="grid grid-cols-2 gap-3">
							<div>
								<p class="text-xs text-gray-400">
									Price
								</p>

								<p class="mt-1 text-sm font-semibold text-gray-900">
									{{
										formatCurrency(
											selectedTicketType.price ??
											0,
										)
									}}
								</p>
							</div>

							<div>
								<p class="text-xs text-gray-400">
									Capacity
								</p>

								<p class="mt-1 text-sm font-semibold text-gray-900">
									{{
										selectedTicketType.capacity ??
										'—'
									}}
								</p>
							</div>
						</div>
					</div>

					<div class="mt-5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
						<div class="flex items-start gap-3">
							<IconBase name="qr-code" class="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

							<div>
								<p class="text-sm font-semibold text-blue-900">
									QR ticket will be generated
								</p>

								<p class="mt-1 text-xs leading-5 text-blue-700">
									After registration, the attendee receives a unique ticket ID and QR token that can
									be
									scanned during event check-in.
								</p>
							</div>
						</div>
					</div>
				</div>

				<div class="flex shrink-0 gap-3 border-t border-gray-200 px-6 py-4">
					<FormsButton variant="secondary" class="flex-1" :disabled="isRegistering"
						@click="closeRegisterAttendee">
						Cancel
					</FormsButton>

					<FormsButton class="flex-1" :disabled="isRegistering ||
						!registerForm.attendeeName.trim() ||
						!registerForm.ticketTypeId
						" @click="submitRegisterAttendee">
						<IconBase v-if="isRegistering" name="refresh-cw" class="h-4 w-4 animate-spin" />

						<IconBase v-else name="user-plus" class="h-4 w-4" />

						{{
							isRegistering
								? 'Registering...'
								: 'Register Attendee'
						}}
					</FormsButton>
				</div>
			</div>
		</Transition>

		<Transition name="fade">
			<div v-if="showTicketResult" class="fixed inset-0 z-40 bg-gray-900/40" @click="closeTicketResult" />
		</Transition>

		<Transition name="slide">
			<div v-if="
				showTicketResult &&
				registeredTicket
			" class="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl">
				<div class="flex items-start justify-between border-b border-gray-200 px-6 py-5">
					<div>
						<h2 class="text-lg font-bold text-gray-900">
							Attendee Registered
						</h2>

						<p class="mt-1 text-sm text-gray-500">
							Ticket successfully created
						</p>
					</div>

					<button type="button" class="text-gray-400 hover:text-gray-600" @click="closeTicketResult">
						<IconBase name="x" class="h-5 w-5" />
					</button>
				</div>

				<div class="flex-1 overflow-y-auto px-6 py-6">
					<div class="rounded-2xl border border-gray-200 p-5">
						<div class="flex items-center gap-4">
							<div
								class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#285F6b]/10 text-base font-bold text-[#285F6b]">
								{{
									getInitials(
										registeredTicket.name,
									)
								}}
							</div>

							<div>
								<h3 class="text-base font-bold text-gray-900">
									{{ registeredTicket.name }}
								</h3>

								<p class="mt-0.5 text-sm text-gray-500">
									{{
										registeredTicket.email ||
										'No email provided'
									}}
								</p>
							</div>
						</div>

						<div class="my-5 border-t border-gray-100" />

						<div class="space-y-4">
							<div class="flex items-center justify-between gap-3">
								<span class="text-sm text-gray-500">
									Ticket ID
								</span>

								<span class="font-mono text-sm font-bold text-gray-900">
									{{ registeredTicket.ticket_id }}
								</span>
							</div>

							<div class="flex items-center justify-between gap-3">
								<span class="text-sm text-gray-500">
									Ticket Type
								</span>

								<span class="text-sm font-semibold text-gray-900">
									{{
										registeredTicket.ticket_type
											?.name ||
										'General Admission'
									}}
								</span>
							</div>

							<div class="flex items-center justify-between gap-3">
								<span class="text-sm text-gray-500">
									Source
								</span>

								<span
									class="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700">
									Organizer
								</span>
							</div>

							<div class="flex items-center justify-between gap-3">
								<span class="text-sm text-gray-500">
									Status
								</span>

								<span
									class="rounded-full border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-600">
									Registered
								</span>
							</div>

							<div class="flex items-center justify-between gap-3">
								<span class="text-sm text-gray-500">
									Payment
								</span>

								<span class="rounded-full px-2.5 py-1 text-xs font-semibold" :class="paymentClass(
									registeredTicket.payment_status,
								)
									">
									{{
										formatPaymentStatus(
											registeredTicket.payment_status,
										)
									}}
								</span>
							</div>
						</div>
					</div>

					<div class="mt-5 rounded-2xl border border-green-200 bg-green-50 p-5 text-center">
						<div
							class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-green-600 shadow-sm">
							<IconBase name="qr-code" class="h-7 w-7" />
						</div>

						<h3 class="mt-3 text-sm font-bold text-green-900">
							QR Ticket Generated
						</h3>

						<p class="mt-1 text-xs leading-5 text-green-700">
							This ticket now has a unique QR token and is ready for event check-in.
						</p>
					</div>

					<div v-if="registeredTicket.qr_value" class="mt-5">
						<p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
							QR Ticket Value
						</p>

						<div
							class="break-all rounded-xl border border-gray-200 bg-gray-50 p-3 font-mono text-xs text-gray-500">
							{{ registeredTicket.qr_value }}
						</div>
					</div>
				</div>

				<div class="border-t border-gray-200 px-6 py-4">
					<button type="button"
						class="w-full rounded-xl bg-[#285F6b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1f4a54]"
						@click="closeTicketResult">
						Done
					</button>
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
	price?: string | number
	capacity?: number
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
	| 'organizer'
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

interface RegisteredTicket
	extends Attendee {
	qr_token?: string
	qr_value?: string
}

interface AttendeesResponse {
	data: Attendee[]
}

interface CreateAttendeeResponse {
	message?: string
	data: RegisteredTicket
}

interface EventDetailResponse {
	data?: OrganizerEvent
	id?: number
	name?: string
	event_type?: string
	event_date?: string | null
	location?: string | null
	status?: string
	ticket_types?: TicketType[]
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

		errors?: Record<
			string,
			string[]
		>
	}
}

type AttendeeFilter =
	| 'all'
	| 'registered'
	| 'checked_in'
	| 'online'
	| 'walk_in'
	| 'organizer'

type PaymentStatus =
	| 'paid'
	| 'pending'

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

const search =
	ref('')

const activeFilter =
	ref<AttendeeFilter>(
		'all',
	)

const attendees =
	ref<Attendee[]>([])

const ticketTypes =
	ref<TicketType[]>([])

const isLoading =
	ref(false)

const isLoadingTicketTypes =
	ref(false)

const errorMessage =
	ref('')

const successMessage =
	ref('')

const showRegisterForm =
	ref(false)

const showTicketResult =
	ref(false)

const registerError =
	ref('')

const isRegistering =
	ref(false)

const registeredTicket =
	ref<RegisteredTicket | null>(
		null,
	)

const filters: {
	label: string
	value: AttendeeFilter
}[] = [
		{
			label: 'All',
			value: 'all',
		},
		{
			label: 'Registered',
			value: 'registered',
		},
		{
			label: 'Checked-in',
			value: 'checked_in',
		},
		{
			label: 'Online',
			value: 'online',
		},
		{
			label: 'Walk-ins',
			value: 'walk_in',
		},
		{
			label: 'Organizer',
			value: 'organizer',
		},
	]

function emptyRegisterForm() {
	return {
		attendeeName: '',

		attendeeEmail: '',

		ticketTypeId:
			null as number | null,

		paymentStatus:
			'paid' as PaymentStatus,
	}
}

const registerForm =
	reactive(
		emptyRegisterForm(),
	)

const selectedTicketType =
	computed<TicketType | null>(
		() => {
			if (
				!registerForm.ticketTypeId
			) {
				return null
			}

			return (
				ticketTypes.value.find(
					ticketType =>
						ticketType.id ===
						registerForm.ticketTypeId,
				) ?? null
			)
		},
	)

const filteredAttendees =
	computed(() => {
		const q =
			search.value
				.trim()
				.toLowerCase()

		return attendees.value.filter(
			attendee => {
				let matchesFilter =
					true

				switch (
				activeFilter.value
				) {
					case 'registered':
						matchesFilter =
							attendee.status ===
							'registered'
						break

					case 'checked_in':
						matchesFilter =
							attendee.status ===
							'checked_in'
						break

					case 'online':
						matchesFilter =
							attendee.source ===
							'online'
						break

					case 'walk_in':
						matchesFilter =
							attendee.source ===
							'walk_in'
						break

					case 'organizer':
						matchesFilter =
							attendee.source ===
							'organizer'
						break
				}

				if (!matchesFilter) {
					return false
				}

				if (!q) {
					return true
				}

				return (
					attendee.name
						.toLowerCase()
						.includes(q) ||
					(
						attendee.email ??
						''
					)
						.toLowerCase()
						.includes(q) ||
					attendee.ticket_id
						.toLowerCase()
						.includes(q) ||
					(
						attendee.ticket_type
							?.name ??
						''
					)
						.toLowerCase()
						.includes(q)
				)
			},
		)
	})

function getFilterCount(
	filter: AttendeeFilter,
): number | null {
	switch (filter) {
		case 'all':
			return attendees.value.length

		case 'registered':
			return attendees.value.filter(
				attendee =>
					attendee.status ===
					'registered',
			).length

		case 'checked_in':
			return attendees.value.filter(
				attendee =>
					attendee.status ===
					'checked_in',
			).length

		case 'online':
			return attendees.value.filter(
				attendee =>
					attendee.source ===
					'online',
			).length

		case 'walk_in':
			return attendees.value.filter(
				attendee =>
					attendee.source ===
					'walk_in',
			).length

		case 'organizer':
			return attendees.value.filter(
				attendee =>
					attendee.source ===
					'organizer',
			).length

		default:
			return null
	}
}

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

async function loadAttendees() {
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
					method: 'GET',

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
			'Failed to load attendees:',
			error,
		)

		attendees.value =
			[]

		errorMessage.value =
			getApiErrorMessage(
				error,
				'Unable to load attendees.',
			)

	} finally {
		isLoading.value =
			false
	}
}

async function loadTicketTypes() {
	if (
		!token.value ||
		!selectedEventId.value
	) {
		ticketTypes.value =
			[]

		return
	}

	isLoadingTicketTypes.value =
		true

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
			response.data ??
			(response as OrganizerEvent)

		ticketTypes.value =
			event.ticket_types ??
			[]

		if (
			ticketTypes.value.length ===
			1
		) {
			registerForm.ticketTypeId =
				ticketTypes.value[0]?.id ??
				null
		}

	} catch (error: unknown) {
		console.error(
			'Failed to load ticket types:',
			error,
		)

		ticketTypes.value =
			[]

		registerError.value =
			getApiErrorMessage(
				error,
				'Unable to load ticket types.',
			)

	} finally {
		isLoadingTicketTypes.value =
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
			'Failed to refresh attendee summary:',
			error,
		)
	}
}

async function openRegisterAttendee() {
	if (
		!selectedEventId.value
	) {
		return
	}

	Object.assign(
		registerForm,
		emptyRegisterForm(),
	)

	registerError.value =
		''

	showRegisterForm.value =
		true

	await loadTicketTypes()
}

function closeRegisterAttendee() {
	if (
		isRegistering.value
	) {
		return
	}

	showRegisterForm.value =
		false

	registerError.value =
		''
}

async function submitRegisterAttendee() {
	if (
		!token.value ||
		!selectedEventId.value
	) {
		return
	}

	if (
		!registerForm.attendeeName.trim()
	) {
		registerError.value =
			'Full name is required.'

		return
	}

	if (
		!registerForm.ticketTypeId
	) {
		registerError.value =
			'Please select a ticket type.'

		return
	}

	isRegistering.value =
		true

	registerError.value =
		''

	try {
		const response =
			await $fetch<CreateAttendeeResponse>(
				`${config.public.apiBaseURL}/organizer/events/${selectedEventId.value}/attendees`,
				{
					method: 'POST',

					headers: {
						Accept:
							'application/json',

						Authorization:
							`Bearer ${token.value}`,
					},

					body: {
						attendee_name:
							registerForm.attendeeName.trim(),

						attendee_email:
							registerForm.attendeeEmail.trim() ||
							null,

						event_ticket_type_id:
							registerForm.ticketTypeId,

						payment_status:
							registerForm.paymentStatus,
					},
				},
			)

		registeredTicket.value =
			response.data

		successMessage.value =
			response.message ??
			'Attendee registered successfully.'

		showRegisterForm.value =
			false

		Object.assign(
			registerForm,
			emptyRegisterForm(),
		)

		await Promise.all([
			loadAttendees(),
			refreshTopSummary(),
		])

		showTicketResult.value =
			true

	} catch (error: unknown) {
		console.error(
			'Failed to register attendee:',
			error,
		)

		registerError.value =
			getApiErrorMessage(
				error,
				'Unable to register attendee.',
			)

	} finally {
		isRegistering.value =
			false
	}
}

function closeTicketResult() {
	showTicketResult.value =
		false
}

function clearSuccess() {
	successMessage.value =
		''

	registeredTicket.value =
		null
}

function formatStatus(
	status: Attendee['status'],
): string {
	if (
		status ===
		'checked_in'
	) {
		return 'Checked-in'
	}

	return 'Registered'
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

	if (
		source ===
		'organizer'
	) {
		return 'Organizer'
	}

	return source ||
		'Unknown'
}

function sourceClass(
	source: string,
): string {
	if (
		source ===
		'walk_in'
	) {
		return 'bg-amber-50 text-amber-700'
	}

	if (
		source ===
		'online'
	) {
		return 'bg-blue-50 text-blue-700'
	}

	if (
		source ===
		'organizer'
	) {
		return 'bg-violet-50 text-violet-700'
	}

	return 'bg-gray-100 text-gray-600'
}

function formatPaymentStatus(
	status: string,
): string {
	if (!status) {
		return 'Unknown'
	}

	return (
		status.charAt(0).toUpperCase() +
		status.slice(1)
	)
}

function paymentClass(
	status: string,
): string {
	switch (status) {
		case 'paid':
			return 'bg-green-50 text-green-700'

		case 'pending':
			return 'bg-amber-50 text-amber-700'

		case 'refunded':
			return 'bg-red-50 text-red-600'

		default:
			return 'bg-gray-100 text-gray-600'
	}
}

function formatCheckInTime(
	value: string,
): string {
	const date =
		new Date(value)

	return date.toLocaleTimeString(
		'en-US',
		{
			hour: 'numeric',
			minute: '2-digit',
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

function getInitials(
	name: string,
): string {
	return name
		.split(' ')
		.filter(Boolean)
		.slice(0, 2)
		.map(
			part =>
				part.charAt(0),
		)
		.join('')
		.toUpperCase()
}

function escapeCsvValue(
	value:
		| string
		| number
		| null
		| undefined,
): string {
	return `"${String(
		value ?? '',
	).replace(
		/"/g,
		'""',
	)}"`
}

function exportAttendees() {
	if (
		!attendees.value.length
	) {
		return
	}

	const rows = [
		[
			'Name',
			'Email',
			'Ticket Type',
			'Ticket ID',
			'Source',
			'Status',
			'Payment Status',
			'Checked In At',
		],

		...attendees.value.map(
			attendee => [
				attendee.name,
				attendee.email ?? '',
				attendee.ticket_type
					?.name ??
				'General Admission',
				attendee.ticket_id,
				formatSource(
					attendee.source,
				),
				formatStatus(
					attendee.status,
				),
				formatPaymentStatus(
					attendee.payment_status,
				),
				attendee.checked_in_at ??
				'',
			],
		),
	]

	const csv =
		rows
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
			'attendees'
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
		`${eventName}-attendees.csv`

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
		search.value =
			''

		activeFilter.value =
			'all'

		attendees.value =
			[]

		ticketTypes.value =
			[]

		showRegisterForm.value =
			false

		showTicketResult.value =
			false

		successMessage.value =
			''

		registeredTicket.value =
			null

		await loadAttendees()
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