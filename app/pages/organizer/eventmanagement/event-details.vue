<template>
	<div>
		<div v-if="isLoading"
			class="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
			Loading event details...
		</div>

		<div v-else-if="errorMessage" class="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
			{{ errorMessage }}
		</div>
		<div v-else-if="event && isEditMode" class="rounded-2xl border border-gray-200 bg-white">
			<div class="flex flex-wrap items-start justify-between gap-4 border-b border-gray-200 px-6 py-5">
				<div>
					<h2 class="text-xl font-bold text-gray-900">
						Edit Event
					</h2>

					<p class="mt-1 text-sm text-gray-500">
						Configure your event information and planning details.
					</p>
				</div>

				<button type="button"
					class="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
					@click="cancelEdit">
					Cancel
				</button>
			</div>

			<div class="flex items-center gap-1 overflow-x-auto border-b border-gray-200 px-6">
				<button v-for="tab in editTabs" :key="tab.label" type="button"
					class="flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-3 py-3 text-sm font-semibold"
					:class="activeEditTab === tab.label
						? 'border-primary-700 text-primary-700'
						: 'border-transparent text-gray-400 hover:text-gray-600'
						" @click="activeEditTab = tab.label">
					<IconBase :name="tab.icon" class="h-4 w-4" />

					{{ tab.label }}
				</button>
			</div>

			<div class="p-6">
				<div v-if="saveError"
					class="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
					{{ saveError }}
				</div>

				<div v-if="saveSuccess"
					class="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
					{{ saveSuccess }}
				</div>

				<template v-if="activeEditTab === 'Basic Info'">
					<FormsLabel text="Event Name" required />

					<FormsTextField v-model="editForm.name" placeholder="Event name" />

					<label class="mb-1.5 mt-4 block text-sm font-semibold text-gray-700">
						Event Type
						<span class="text-rose-500">*</span>
					</label>

					<FormsSelect v-model="editForm.eventType" :options="eventTypes" placeholder="Select event type"
						:can-clear="false" />

					<label class="mb-1.5 mt-4 block text-sm font-semibold text-gray-700">
						Description
					</label>

					<textarea v-model="editForm.description" rows="4" placeholder="Describe the event..."
						class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15" />

					<div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
						<div>
							<FormsLabel text="Event Date" required />

							<FormsDateField v-model="editForm.eventDate" name="event_date"
								placeholder="Choose event date" />
						</div>

						<div>
							<label class="mb-1.5 block text-sm font-semibold text-gray-700">
								Status
							</label>

							<FormsSelect v-model="editForm.status"
								:options="[{ value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }]"
								:can-clear="false" :searchable="false" />
						</div>
					</div>

					<div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
						<div>
							<FormsLabel text="Start Time" />

							<FormsTimeField v-model="editForm.startTime" name="start_time"
								placeholder="Select start time" />
						</div>

						<div>
							<FormsLabel text="End Time" />

							<FormsTimeField v-model="editForm.endTime" name="end_time" placeholder="Select end time"
								:min-time="editForm.startTime || undefined" />
						</div>
					</div>
				</template>

				<template v-else-if="activeEditTab === 'Venue'">
					<FormsLabel text="Venue / Location" />

					<FormsTextField v-model="editForm.location" icon="map-pin" placeholder="Venue or location" />

					<div class="mt-4">
						<FormsLabel text="Expected Guests / Capacity" />

						<FormsTextField v-model="editForm.expectedGuests" type="number" placeholder="e.g. 150" />
					</div>
				</template>

				<template v-else-if="activeEditTab === 'Ticket Types'">
					<div class="space-y-3">
						<div v-for="(type, index) in editForm.ticketTypes" :key="index"
							class="rounded-xl border border-gray-200 p-4">
							<div class="mb-3 flex items-center justify-between">
								<p class="text-sm font-bold text-gray-900">
									Ticket Type {{ index + 1 }}
								</p>

								<button v-if="
									editForm.ticketTypes.length >
									1
								" type="button" class="text-red-500 hover:text-red-700" @click="removeTicketType(index)">
									<IconBase name="trash" class="h-4 w-4" />
								</button>
							</div>

							<FormsLabel text="Ticket Type Name" />

							<FormsTextField v-model="type.name" placeholder="e.g. VIP" />

							<div class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
								<div>
									<FormsLabel text="Price" />

									<FormsTextField v-model="type.price" placeholder="e.g. 2500" />
								</div>

								<div>
									<FormsLabel text="Capacity" />

									<FormsTextField v-model="type.capacity" type="number" placeholder="e.g. 50" />
								</div>
							</div>
						</div>
					</div>

					<button type="button" class="mt-4 flex items-center gap-2 text-sm font-semibold text-primary-700"
						@click="addTicketType">
						<IconBase name="plus" class="h-4 w-4" />

						Add Ticket Type
					</button>
				</template>

				<template v-else-if="activeEditTab === 'Settings'">
					<label class="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-4">
						<div>
							<p class="text-sm font-semibold text-gray-900">
								Public Registration
							</p>

							<p class="mt-1 text-xs text-gray-500">
								Allow guests to register publicly.
							</p>
						</div>

						<input v-model="editForm.publicRegistration" type="checkbox"
							class="h-4 w-4 accent-primary-700" />
					</label>

					<label class="mt-3 flex items-center justify-between rounded-xl border border-gray-200 px-4 py-4">
						<div>
							<p class="text-sm font-semibold text-gray-900">
								Require Approval
							</p>

							<p class="mt-1 text-xs text-gray-500">
								Require organizer approval before
								confirming registration.
							</p>
						</div>

						<input v-model="editForm.requireApproval" type="checkbox" class="h-4 w-4 accent-primary-700" />
					</label>

					<label class="mt-3 flex items-center justify-between rounded-xl border border-gray-200 px-4 py-4">
						<div>
							<p class="text-sm font-semibold text-gray-900">
								Enable Waitlist
							</p>

							<p class="mt-1 text-xs text-gray-500">
								Enable waitlist when tickets are sold
								out.
							</p>
						</div>

						<input v-model="editForm.waitlistEnabled" type="checkbox" class="h-4 w-4 accent-primary-700" />
					</label>

				</template>

				<template v-else-if="activeEditTab === 'Contact'">
					<FormsLabel text="Contact Person" />

					<FormsTextField v-model="editForm.contactName" placeholder="Contact person" />

					<div class="mt-4">
						<FormsLabel text="Email" />

						<FormsTextField v-model="editForm.contactEmail" type="email" placeholder="example@email.com" />
					</div>

					<div class="mt-4">
						<FormsLabel text="Phone" />

						<FormsTextField v-model="editForm.contactPhone" type="tel" placeholder="+63..." />
					</div>

				</template>
			</div>

			<div class="flex flex-wrap justify-end gap-3 border-t border-gray-200 px-6 py-4">
				<button type="button"
					class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
					:disabled="isSaving" @click="cancelEdit">
					Cancel
				</button>

				<button type="button"
					class="flex items-center gap-2 rounded-xl bg-[#285F6b] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1f4a54] disabled:cursor-not-allowed disabled:opacity-60"
					:disabled="isSaving" @click="saveEvent">
					<IconBase :name="isSaving
						? 'refresh-cw'
						: 'check-circle'
						" class="h-4 w-4" :class="{
							'animate-spin':
								isSaving,
						}" />

					{{
						isSaving
							? 'Saving...'
							: 'Save Changes'
					}}
				</button>
			</div>
		</div>

		<div v-else-if="event" class="rounded-2xl border border-gray-200 bg-white p-6">
			<div class="flex flex-wrap items-start justify-between gap-4">
				<div>
					<h2 class="text-xl font-bold text-gray-900">
						{{ event.name }}
					</h2>

					<p class="mt-1 text-sm text-gray-500">
						Event configuration and details
					</p>
				</div>

				<span class="rounded-full px-3 py-1 text-xs font-semibold" :class="event.status === 'published'
					? 'bg-gray-900 text-white'
					: 'border border-gray-200 bg-white text-gray-600'
					">
					{{ formatStatus(event.status) }}
				</span>
			</div>

			<div class="mt-6 grid grid-cols-1 gap-x-12 gap-y-6 sm:grid-cols-2">
				<div>
					<div class="text-sm text-gray-500">
						Event Name
					</div>

					<div class="mt-1 text-base font-bold text-gray-900">
						{{ event.name }}
					</div>
				</div>

				<div>
					<div class="text-sm text-gray-500">
						Event Type
					</div>

					<div class="mt-1 text-base font-bold text-gray-900">
						{{ event.event_type }}
					</div>
				</div>

				<div>
					<div class="text-sm text-gray-500">
						Event Date
					</div>

					<div class="mt-1 flex items-center gap-1.5 text-base font-bold text-gray-900">
						<IconBase name="calendar" class="h-4 w-4 text-gray-400" />

						{{ formatDate(event.event_date) }}
					</div>
				</div>

				<div>
					<div class="text-sm text-gray-500">
						Location
					</div>

					<div class="mt-1 flex items-center gap-1.5 text-base font-bold text-gray-900">
						<IconBase name="map-pin" class="h-4 w-4 text-gray-400" />

						{{ event.location || 'Not set' }}
					</div>
				</div>

				<div>
					<div class="text-sm text-gray-500">
						Expected Guests
					</div>

					<div class="mt-1 flex items-center gap-1.5 text-base font-bold text-gray-900">
						<IconBase name="users" class="h-4 w-4 text-gray-400" />

						{{ event.expected_guests ?? 0 }}
					</div>
				</div>

				<div>
					<div class="text-sm text-gray-500">
						Start Time
					</div>

					<div class="mt-1 text-base font-bold text-gray-900">
						{{ event.start_time || 'Not set' }}
					</div>
				</div>

				<div>
					<div class="text-sm text-gray-500">
						End Time
					</div>

					<div class="mt-1 text-base font-bold text-gray-900">
						{{ event.end_time || 'Not set' }}
					</div>
				</div>
			</div>

			<div v-if="event.description" class="mt-6 rounded-xl bg-gray-50 p-4">
				<p class="text-sm font-semibold text-gray-900">
					Description
				</p>

				<p class="mt-2 text-sm leading-6 text-gray-600">
					{{ event.description }}
				</p>
			</div>

			<div class="mt-6">
				<div class="mb-2 flex items-center justify-between">
					<span class="text-sm font-semibold text-gray-900">
						Event Readiness
					</span>

					<span class="text-sm text-gray-500">
						{{ readiness }}%
					</span>
				</div>

				<div class="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
					<div class="h-full rounded-full bg-[#285F6b]" :style="{
						width: `${readiness}%`,
					}" />
				</div>
			</div>

			<div class="mt-6">
				<button type="button"
					class="flex items-center gap-2 rounded-xl bg-[#285F6b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1f4a54]"
					@click="enterEditMode">
					<IconBase name="edit" class="h-4 w-4" />

					Edit Event
				</button>
			</div>
		</div>

		<!-- ===================================================== -->
		<!-- AWARDED QUOTATION DETAILS -->
		<!-- ===================================================== -->
		<div v-else-if="quotationData" class="rounded-2xl border border-green-200 bg-white p-6">
			<div class="flex flex-wrap items-start justify-between gap-4">
				<div>
					<p class="text-xs font-bold uppercase tracking-wide text-green-600">
						Client Awarded Your Bid
					</p>

					<h2 class="mt-2 text-xl font-bold text-gray-900">
						{{
							quotationData.inquiry.event_title ||
							`${quotationData.inquiry.event_type} Event`
						}}
					</h2>

					<p class="mt-1 text-sm text-gray-500">
						{{ formatDate(quotationData.inquiry.event_date) }}

						<template v-if="quotationData.inquiry.location">
							&bull;
							{{ quotationData.inquiry.location }}
						</template>
					</p>
				</div>

				<span
					class="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
					Awarded
				</span>
			</div>

			<div class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
				<div class="rounded-xl bg-gray-50 p-4">
					<div class="text-xs text-gray-500">
						Accepted Package
					</div>

					<div class="mt-1 font-bold text-gray-900">
						{{
							quotationData.quotation.package_name ||
							'Custom Package'
						}}
					</div>
				</div>

				<div class="rounded-xl bg-gray-50 p-4">
					<div class="text-xs text-gray-500">
						Agreed Amount
					</div>

					<div class="mt-1 font-bold text-primary-700">
						{{
							formatCurrency(
								quotationData.quotation.quotation_amount,
							)
						}}
					</div>
				</div>

				<div class="rounded-xl bg-gray-50 p-4">
					<div class="text-xs text-gray-500">
						Timeline
					</div>

					<div class="mt-1 font-bold text-gray-900">
						{{
							quotationData.quotation.timeline ||
							'Not specified'
						}}
					</div>
				</div>
			</div>

			<div class="mt-6 grid grid-cols-1 gap-x-12 gap-y-6 sm:grid-cols-2">
				<div>
					<div class="text-sm text-gray-500">Event Type</div>
					<div class="mt-1 text-base font-bold text-gray-900">
						{{ quotationData.inquiry.event_type }}
					</div>
				</div>

				<div>
					<div class="text-sm text-gray-500">Expected Guests</div>
					<div class="mt-1 text-base font-bold text-gray-900">
						{{ quotationData.inquiry.expected_guests }}
					</div>
				</div>

				<div>
					<div class="text-sm text-gray-500">Location</div>
					<div class="mt-1 text-base font-bold text-gray-900">
						{{ quotationData.inquiry.location || 'Not set' }}
					</div>
				</div>

				<div>
					<div class="text-sm text-gray-500">Inquiry Status</div>
					<div class="mt-1 text-base font-bold text-gray-900">
						{{ formatStatus(quotationData.inquiry.status) }}
					</div>
				</div>
			</div>

			<div v-if="quotationData.quotation.quotation_details" class="mt-6 rounded-xl bg-gray-50 p-4">
				<p class="text-sm font-semibold text-gray-900">
					Proposal
				</p>

				<p class="mt-2 text-sm leading-6 text-gray-600">
					{{ quotationData.quotation.quotation_details }}
				</p>
			</div>

			<div v-if="quotationData.quotation.inclusions?.length" class="mt-6">
				<p class="text-sm font-semibold text-gray-900">
					Inclusions
				</p>

				<div class="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
					<div v-for="item in quotationData.quotation.inclusions" :key="item.id"
						class="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">
						<IconBase name="check-circle" class="h-4 w-4 text-green-600" />

						{{ item.description }}
					</div>
				</div>
			</div>

			<div class="mt-6">
				<div class="mb-2 flex items-center justify-between">
					<span class="text-sm font-semibold text-gray-900">
						Event Readiness
					</span>

					<span class="text-sm text-gray-500">
						20%
					</span>
				</div>

				<div class="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
					<div class="h-full w-[20%] rounded-full bg-[#285F6b]" />
				</div>
			</div>

			<div class="mt-6">
				<button type="button"
					class="flex items-center gap-2 rounded-xl bg-[#285F6b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1f4a54] disabled:cursor-not-allowed disabled:opacity-60"
					:disabled="isCreatingEvent" @click="editAwardedEvent">
					<IconBase :name="isCreatingEvent ? 'refresh-cw' : 'edit'" class="h-4 w-4"
						:class="{ 'animate-spin': isCreatingEvent }" />

					{{
						isCreatingEvent
							? 'Preparing Event...'
							: 'Edit Event'
					}}
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
interface EventTicketType {
	id: number
	event_id?: number
	name: string
	price: string | number
	capacity: number
}

interface OrganizerEvent {
	id: number
	inquiry_id: number | null
	quotation_id: number | null

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

	ticket_types?: EventTicketType[]
}

type EventResponse =
	| OrganizerEvent
	| {
		data: OrganizerEvent
	}
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

interface EventInclusion {
	id: number
	description: string
}

interface QuotationEventData {
	planning_started?: boolean

	quotation: {
		id: number
		quotation_amount: string | number
		package_name: string | null
		timeline: string | null
		quotation_details: string | null
		quotation_status: string
		inclusions: EventInclusion[]
	}

	inquiry: {
		id: number
		event_title: string | null
		event_type: string
		event_date: string | null
		location: string | null
		expected_guests: number
		budget_range: string | null
		additional_details: string | null
		status: string
	}

	event: OrganizerEvent | null
}

interface QuotationEventResponse {
	message: string
	data: QuotationEventData
}

interface StartPlanningResponse {
	message: string
	data: {
		planning_started: boolean
		event: OrganizerEvent
	}
}

interface TicketTypeForm {
	name: string
	price: string
	capacity: string
}

definePageMeta({
	layout: 'dashboard',
	middleware: ['organizer'],
})

const route = useRoute()
const config = useRuntimeConfig()

const {
	token,
} = useAuth()

const event =
	ref<OrganizerEvent | null>(null)

const quotationData =
	ref<QuotationEventData | null>(null)

const isCreatingEvent =
	ref(false)

const isLoading =
	ref(false)

const isSaving =
	ref(false)

const errorMessage =
	ref('')

const saveError =
	ref('')

const saveSuccess =
	ref('')

const editTabs = [
	{
		label: 'Basic Info',
		icon: 'file-text',
	},
	{
		label: 'Venue',
		icon: 'map-pin',
	},
	{
		label: 'Ticket Types',
		icon: 'tag',
	},
	{
		label: 'Settings',
		icon: 'settings',
	},
	{
		label: 'Contact',
		icon: 'phone',
	},
]

const eventTypes = [
	'Wedding',
	'Corporate',
	'Conference',
	'Birthday',
	'Social',
	'Charity',
	'Other',
]

const activeEditTab =
	ref('Basic Info')

const eventId =
	computed<number | null>(() => {
		const value =
			route.query.event

		if (
			typeof value !== 'string'
		) {
			return null
		}

		const id =
			Number(value)

		return Number.isFinite(id)
			? id
			: null
	})

const quotationId =
	computed<number | null>(() => {
		const value =
			route.query.quotation

		if (
			typeof value !== 'string'
		) {
			return null
		}

		const id =
			Number(value)

		return Number.isFinite(id)
			? id
			: null
	})


const isEditMode =
	computed(
		() =>
			route.query.mode ===
			'edit',
	)

const editForm =
	reactive({
		name: '',
		eventType: '',
		description: '',
		eventDate: '',
		status: 'draft',

		startTime: '',
		endTime: '',

		location: '',
		expectedGuests: '',

		ticketTypes: [
			{
				name: '',
				price: '',
				capacity: '',
			},
		] as TicketTypeForm[],

		publicRegistration: true,
		requireApproval: false,
		waitlistEnabled: false,

		contactName: '',
		contactEmail: '',
		contactPhone: '',
	})

const readiness =
	computed(() => {
		if (!event.value) {
			return 0
		}

		let score = 20

		if (event.value.name) {
			score += 10
		}

		if (event.value.event_date) {
			score += 10
		}

		if (event.value.location) {
			score += 15
		}

		if (
			event.value.expected_guests
		) {
			score += 10
		}

		if (
			event.value.start_time
		) {
			score += 10
		}

		if (
			event.value.end_time
		) {
			score += 10
		}

		if (
			event.value.description
		) {
			score += 5
		}

		return Math.min(
			score,
			100,
		)
	})

function fillEditForm() {
	if (!event.value) {
		return
	}

	editForm.name =
		event.value.name ?? ''

	editForm.eventType =
		event.value.event_type ?? ''

	editForm.description =
		event.value.description ?? ''

	editForm.eventDate =
		event.value.event_date
			? event.value.event_date.substring(
				0,
				10,
			)
			: ''

	editForm.status =
		event.value.status ||
		'draft'

	editForm.startTime =
		event.value.start_time
			? event.value.start_time.substring(0, 5)
			: ''

	editForm.endTime =
		event.value.end_time
			? event.value.end_time.substring(0, 5)
			: ''

	editForm.location =
		event.value.location ?? ''

	editForm.expectedGuests =
		event.value.expected_guests !== null &&
			event.value.expected_guests !== undefined
			? String(event.value.expected_guests)
			: ''

	editForm.ticketTypes =
		event.value.ticket_types?.length
			? event.value.ticket_types.map(
				type => ({
					name:
						type.name ?? '',

					price:
						String(type.price ?? ''),

					capacity:
						String(type.capacity ?? ''),
				}),
			)
			: [
				{
					name: '',
					price: '',
					capacity: '',
				},
			]

	editForm.publicRegistration =
		Boolean(event.value.public_registration)

	editForm.requireApproval =
		Boolean(event.value.require_approval)

	editForm.waitlistEnabled =
		Boolean(event.value.waitlist_enabled)

	editForm.contactName =
		event.value.contact_name ?? ''

	editForm.contactEmail =
		event.value.contact_email ?? ''

	editForm.contactPhone =
		event.value.contact_phone ?? ''
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
			month: 'long',
			day: 'numeric',
			year: 'numeric',
		},
	)
}

function formatCurrency(
	value: string | number,
): string {
	const amount =
		Number(value)

	if (Number.isNaN(amount)) {
		return String(value)
	}

	return new Intl.NumberFormat(
		'en-PH',
		{
			style: 'currency',
			currency: 'PHP',
			maximumFractionDigits: 0,
		},
	).format(amount)
}


function formatStatus(
	status: string,
): string {
	if (!status) {
		return 'Draft'
	}

	return (
		status.charAt(0).toUpperCase() +
		status.slice(1)
	)
}

async function loadDetails() {
	errorMessage.value = ''

	if (!token.value) {
		errorMessage.value =
			'You are not authenticated.'

		return
	}

	if (
		!eventId.value &&
		!quotationId.value
	) {
		await navigateTo(
			'/organizer/eventmanagement/all-events',
			{
				replace: true,
			},
		)

		return
	}

	isLoading.value = true

	event.value = null
	quotationData.value = null

	try {
		/*
		 * Existing event.
		 */
		if (eventId.value) {
			const response =
				await $fetch<EventResponse>(
					`${config.public.apiBaseURL}/organizer/events/${eventId.value}`,
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

			event.value =
				extractEvent(response)

			fillEditForm()

			return
		}

		if (quotationId.value) {
			const response =
				await $fetch<QuotationEventResponse>(
					`${config.public.apiBaseURL}/organizer/quotations/${quotationId.value}/event-data`,
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

			quotationData.value =
				response.data

			if (response.data.event) {
				event.value =
					response.data.event

				fillEditForm()
			}
		}

	} catch (error: unknown) {
		console.error(
			'Failed to load event details:',
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
			'Unable to load event details.'

	} finally {
		isLoading.value = false
	}
}

function addTicketType() {
	editForm.ticketTypes.push({
		name: '',
		price: '',
		capacity: '',
	})
}

function removeTicketType(
	index: number,
) {
	editForm.ticketTypes.splice(
		index,
		1,
	)
}

async function enterEditMode() {
	if (!event.value) {
		return
	}

	fillEditForm()

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

async function cancelEdit() {
	if (!event.value) {
		return
	}

	await navigateTo({
		path:
			'/organizer/eventmanagement/event-details',

		query: {
			event:
				event.value.id,
		},
	})
}


async function editAwardedEvent() {
	if (
		!token.value ||
		!quotationData.value
	) {
		return
	}

	/*
	 * If an event already exists, simply open edit mode.
	 */
	if (quotationData.value.event) {
		await navigateTo({
			path:
				'/organizer/eventmanagement/event-details',

			query: {
				event:
					quotationData.value.event.id,

				mode:
					'edit',
			},
		})

		return
	}
	isCreatingEvent.value = true
	errorMessage.value = ''

	try {
		const response =
			await $fetch<StartPlanningResponse>(
				`${config.public.apiBaseURL}/organizer/quotations/${quotationData.value.quotation.id}/start-planning`,
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

		await navigateTo({
			path:
				'/organizer/eventmanagement/event-details',

			query: {
				event:
					response.data.event.id,

				mode:
					'edit',
			},
		})

	} catch (error: unknown) {
		console.error(
			'Failed to prepare event for editing:',
			error,
		)

		const apiError =
			error as {
				data?: {
					message?: string
				}
			}

		window.alert(
			apiError.data?.message ??
			'Unable to prepare this event for editing.',
		)

	} finally {
		isCreatingEvent.value = false
	}
}

async function saveEvent() {
	if (
		!token.value ||
		!event.value
	) {
		return
	}

	if (
		!editForm.name.trim() ||
		!editForm.eventType ||
		!editForm.eventDate
	) {
		saveError.value =
			'Event name, event type, and event date are required.'

		activeEditTab.value =
			'Basic Info'

		return
	}

	isSaving.value = true

	saveError.value = ''
	saveSuccess.value = ''

	try {
		const response =
			await $fetch<EventResponse>(
				`${config.public.apiBaseURL}/organizer/events/${event.value.id}`,
				{
					method: 'PUT',

					headers: {
						Accept:
							'application/json',

						Authorization:
							`Bearer ${token.value}`,
					},

					body: {
						name:
							editForm.name.trim(),

						event_type:
							editForm.eventType,

						description:
							editForm.description.trim() ||
							null,

						event_date:
							editForm.eventDate,

						location:
							editForm.location.trim() ||
							null,

						expected_guests:
							editForm.expectedGuests
								? Number(
									editForm.expectedGuests,
								)
								: null,

						start_time:
							editForm.startTime ||
							null,

						end_time:
							editForm.endTime ||
							null,

						status:
							editForm.status,

						ticket_types:
							editForm.ticketTypes
								.filter(
									type =>
										type.name.trim(),
								)
								.map(
									type => ({
										name:
											type.name.trim(),

										price:
											Number(type.price || 0),

										capacity:
											Number(type.capacity || 0),
									}),
								),

						public_registration:
							editForm.publicRegistration,

						require_approval:
							editForm.requireApproval,

						waitlist_enabled:
							editForm.waitlistEnabled,

						contact_name:
							editForm.contactName.trim() ||
							null,

						contact_email:
							editForm.contactEmail.trim() ||
							null,

						contact_phone:
							editForm.contactPhone.trim() ||
							null,
					},
				},
			)

		event.value =
			extractEvent(response)

		fillEditForm()

		saveSuccess.value =
			'Event updated successfully.'

		window.setTimeout(
			async () => {
				await navigateTo({
					path:
						'/organizer/eventmanagement/event-details',

					query: {
						event:
							event.value?.id,
					},
				})
			},
			700,
		)

	} catch (error: unknown) {
		console.error(
			'Failed to update event:',
			error,
		)

		const apiError =
			error as {
				data?: {
					message?: string

					errors?: Record<
						string,
						string[]
					>
				}
			}

		const validationError =
			apiError.data?.errors
				? Object.values(
					apiError.data.errors,
				)[0]?.[0]
				: null

		saveError.value =
			validationError ??
			apiError.data?.message ??
			'Unable to save event.'

	} finally {
		isSaving.value = false
	}
}

watch(
	[
		eventId,
		quotationId,
	],
	() => {
		loadDetails()
	},
)

onMounted(() => {
	loadDetails()
})
</script>
