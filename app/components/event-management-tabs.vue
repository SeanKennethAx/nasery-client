<template>
	<div>
		<div class="mb-6 flex items-start justify-between">
			<div>
				<h1 class="text-2xl font-extrabold text-gray-900">Event Creation &amp; Management</h1>
				<p class="mt-1 text-gray-500">Configure events and manage ticket tiers</p>
			</div>
			<button type="button"
				class="flex shrink-0 items-center gap-2 rounded-xl bg-[#285F6b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1f4a54]"
				@click="openCreateEvent">
				<IconBase name="plus" class="h-4 w-4" /> Create New Event
			</button>
		</div>

		<div class="mb-6 inline-flex rounded-xl bg-gray-100 p-1">
			<template v-for="tab in tabs" :key="tab.label">
				<NuxtLink v-if="!tab.disabled" :to="tab.to"
					class="rounded-lg px-4 py-2 text-sm font-semibold transition" :class="route.path === tab.path
						? 'bg-white text-gray-900 shadow-sm'
						: 'bg-transparent text-gray-500 hover:bg-white/60 hover:text-gray-700'
						">
					{{ tab.label }}
				</NuxtLink>

				<button v-else type="button" disabled
					class="cursor-not-allowed rounded-lg px-4 py-2 text-sm font-semibold text-gray-400 opacity-60">
					{{ tab.label }}
				</button>
			</template>
		</div>

		<Transition name="fade">
			<div v-if="showCreateEvent" class="fixed inset-0 z-40 bg-gray-900/40" @click="closeCreateEvent" />
		</Transition>

		<Transition name="slide">
			<div v-if="showCreateEvent"
				class="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-white shadow-2xl">
				<div class="flex shrink-0 items-start justify-between border-b border-gray-200 px-6 py-5">
					<div class="flex items-start gap-3">
						<div
							class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#285F6b] text-white">
							<IconBase name="calendar" class="h-5 w-5" />
						</div>
						<div>
							<h2 class="text-base font-bold text-gray-900">Create New Event</h2>
							<p class="text-sm text-gray-500">Fill in your event details below</p>
						</div>
					</div>
					<button type="button" class="text-gray-400 hover:text-gray-600" @click="closeCreateEvent">
						<IconBase name="x" class="h-5 w-5" />
					</button>
				</div>

				<div
					class="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-gray-200 px-6 scroll-smooth">
					<button v-for="tab in createTabs" :key="tab.label" :ref="(el) => setTabRef(tab.label, el)"
						type="button"
						class="flex shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-3 text-sm font-semibold"
						:class="activeCreateTab === tab.label ? 'border-primary-700 text-primary-700' : 'border-transparent text-gray-400 hover:text-gray-600'"
						@click="activeCreateTab = tab.label">
						<IconBase :name="tab.icon" class="h-4 w-4" /> {{ tab.label }}
					</button>
				</div>

				<div class="flex-1 overflow-y-auto px-6 py-5">
					<div v-if="createEventError"
						class="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
						{{ createEventError }}
					</div>

					<template v-if="activeCreateTab === 'Basic Info'">
						<FormsLabel text="Event Name" required />
						<FormsTextField v-model="eventForm.name" placeholder="e.g. Santos-Reyes Wedding Reception" />

						<label class="mb-1.5 mt-4 block text-sm font-semibold text-gray-700">Event Type <span
								class="text-rose-500">*</span></label>
						<FormsSelect v-model="eventForm.eventType" :options="eventTypes" placeholder="Select event type" :can-clear="false" />

						<label class="mb-1.5 mt-4 block text-sm font-semibold text-gray-700">Description</label>
						<textarea v-model="eventForm.description" rows="4"
							placeholder="Describe the event — theme, programme, highlights, and any special notes..."
							class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15" />

						<div class="mt-4 grid grid-cols-2 gap-3">
							<div>
								<FormsLabel text="Event Date" required />
								<FormsDateField v-model="eventForm.eventDate" name="event_date" placeholder="Choose event date" />
							</div>
							<div>
								<label class="mb-1.5 block text-sm font-semibold text-gray-700">Status</label>
								<FormsSelect v-model="eventForm.status" :options="statusOptions" :can-clear="false" />
							</div>
						</div>

						<div class="mt-4 grid grid-cols-2 gap-3">
							<div>
								<FormsLabel text="Start Time" />
								<FormsTimeField v-model="eventForm.startTime" name="start_time" placeholder="Select start time" />
							</div>
							<div>
								<FormsLabel text="End Time" />
								<FormsTimeField v-model="eventForm.endTime" name="end_time" placeholder="Select end time" :min-time="eventForm.startTime || undefined" />
							</div>
						</div>

						<div class="mt-4">
							<FormsLabel text="Tags" hint="(comma-separated)" />
							<FormsTextField v-model="eventForm.tags" icon="tag"
								placeholder="e.g. Wedding, Garden, Outdoor" />
						</div>
					</template>

					<template v-else-if="activeCreateTab === 'Venue'">
						<FormsLabel text="Venue Name" />
						<FormsTextField v-model="eventForm.venueName" placeholder="e.g. Manila Convention Center" />

						<div class="mt-4">
							<FormsLabel text="Address" />
							<FormsTextField v-model="eventForm.address" placeholder="Street address" />
						</div>

						<div class="mt-4 grid grid-cols-2 gap-3">
							<div>
								<FormsLabel text="City / Area" />
								<FormsTextField v-model="eventForm.city" placeholder="e.g. Makati" />
							</div>
							<div>
								<FormsLabel text="Capacity" />
								<FormsTextField v-model="eventForm.capacity" type="number" placeholder="e.g. 500" />
							</div>
						</div>
					</template>

					<template v-else-if="activeCreateTab === 'Ticket Zones'">
						<div class="space-y-3">
							<div v-for="(zone, i) in eventForm.zones" :key="i"
								class="rounded-xl border border-gray-200 p-3">
								<div class="mb-2 flex items-center justify-between">
									<span class="text-xs font-semibold text-gray-400">Zone {{ i + 1 }}</span>
									<button v-if="eventForm.zones.length > 1" type="button"
										class="text-gray-400 hover:text-red-500" @click="removeZone(i)">
										<IconBase name="trash" class="h-4 w-4" />
									</button>
								</div>
								<FormsTextField v-model="zone.name" placeholder="Zone name (e.g. VIP Front Row)"
									class="mb-2" />
								<div class="grid grid-cols-2 gap-2">
									<FormsTextField v-model="zone.price" placeholder="Price (₱)" />
									<FormsTextField v-model="zone.capacity" type="number" placeholder="Capacity" />
								</div>
							</div>
						</div>
						<button type="button"
							class="mt-3 flex items-center gap-1 text-sm font-semibold text-primary-700"
							@click="addZone">
							<IconBase name="plus" class="h-3.5 w-3.5" /> Add Zone
						</button>
					</template>

					<template v-else-if="activeCreateTab === 'Settings'">
						<label class="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3.5">
							<span class="text-sm font-medium text-gray-700">Allow public registration</span>
							<input v-model="eventForm.publicRegistration" type="checkbox"
								class="h-4 w-4 accent-primary-700" />
						</label>
						<label
							class="mt-3 flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3.5">
							<span class="text-sm font-medium text-gray-700">Require approval before confirming</span>
							<input v-model="eventForm.requireApproval" type="checkbox"
								class="h-4 w-4 accent-primary-700" />
						</label>
						<label
							class="mt-3 flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3.5">
							<span class="text-sm font-medium text-gray-700">Enable waitlist when sold out</span>
							<input v-model="eventForm.waitlistEnabled" type="checkbox"
								class="h-4 w-4 accent-primary-700" />
						</label>
					</template>

					<template v-else-if="activeCreateTab === 'Contact'">
						<FormsLabel text="Contact Person" />
						<FormsTextField v-model="eventForm.contactName" placeholder="e.g. Maria Santos" />

						<div class="mt-4">
							<FormsLabel text="Email" />
							<FormsTextField v-model="eventForm.contactEmail" type="email"
								placeholder="you@example.com" />
						</div>

						<div class="mt-4">
							<FormsLabel text="Phone" />
							<FormsTextField v-model="eventForm.contactPhone" type="tel"
								placeholder="+63 9XX XXX XXXX" />
						</div>
					</template>
				</div>

				<div class="shrink-0 border-t border-gray-200 px-6 py-4">
					<button type="button"
						class="flex w-full items-center justify-center gap-2 rounded-xl bg-[#285F6b] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1f4a54] disabled:cursor-not-allowed disabled:opacity-60"
						:disabled="isSubmittingEvent" @click="goNext">
						{{
							isSubmittingEvent
								? 'Creating...'
								: isLastTab
									? 'Create Event'
									: 'Next'
						}}

						<IconBase v-if="!isSubmittingEvent" name="arrow-right" class="h-4 w-4" />
					</button>
				</div>
			</div>
		</Transition>
	</div>
</template>

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

<script setup lang="ts">
const config = useRuntimeConfig()
const route = useRoute()

const {
	token,
} = useAuth()

const isSubmittingEvent = ref(false)
const createEventError = ref('')

/*
 * Keep track of the currently selected event / quotation.
 */
const selectedEventId =
	computed<string | null>(() => {
		const value =
			route.query.event

		return typeof value === 'string'
			? value
			: null
	})

const selectedQuotationId =
	computed<string | null>(() => {
		const value =
			route.query.quotation

		return typeof value === 'string'
			? value
			: null
	})

const hasSelectedEvent =
	computed(() =>
		Boolean(
			selectedEventId.value ||
			selectedQuotationId.value,
		),
	)

function selectedQuery():
	Record<string, string> {
	const query:
		Record<string, string> = {}

	if (selectedEventId.value) {
		query.event =
			selectedEventId.value
	}

	if (selectedQuotationId.value) {
		query.quotation =
			selectedQuotationId.value
	}

	return query
}

const tabs =
	computed(() => [
		{
			label:
				'All Events',

			path:
				'/organizer/eventmanagement/all-events',

			to: {
				path:
					'/organizer/eventmanagement/all-events',
			},

			disabled:
				false,
		},

		{
			label:
				'Event Details',

			path:
				'/organizer/eventmanagement/event-details',

			to: {
				path:
					'/organizer/eventmanagement/event-details',

				query:
					selectedQuery(),
			},

			disabled:
				!hasSelectedEvent.value,
		},

		{
			label:
				'Ticket Tiers',

			path:
				'/organizer/eventmanagement/ticket-tiers',

			to: {
				path:
					'/organizer/eventmanagement/ticket-tiers',

				query:
					selectedQuery(),
			},

			disabled:
				!hasSelectedEvent.value,
		},

		{
			label:
				'Preparation Tracking',

			path:
				'/organizer/eventmanagement/preparation-tracking',

			to: {
				path:
					'/organizer/eventmanagement/preparation-tracking',

				query:
					selectedQuery(),
			},

			disabled:
				!hasSelectedEvent.value,
		},
	])
const createTabs = [
	{
		label:
			'Basic Info',

		icon:
			'file-text',
	},

	{
		label:
			'Venue',

		icon:
			'map-pin',
	},

	{
		label:
			'Ticket Zones',

		icon:
			'tag',
	},

	{
		label:
			'Settings',

		icon:
			'settings',
	},

	{
		label:
			'Contact',

		icon:
			'phone',
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

const statusOptions = [
	'Draft',
	'Published',
]

const showCreateEvent =
	ref(false)

const activeCreateTab =
	ref<string>(
		createTabs[0]?.label ??
		'Basic Info',
	)

const tabButtonRefs:
	Record<string, HTMLElement> = {}

function setTabRef(
	label: string,
	el:
		| Element
		| ComponentPublicInstance
		| null,
) {
	if (
		el instanceof HTMLElement
	) {
		tabButtonRefs[label] =
			el
	}
}

watch(
	activeCreateTab,
	(label) => {
		nextTick(() => {
			tabButtonRefs[
				label
			]?.scrollIntoView({
				behavior:
					'smooth',

				inline:
					'nearest',

				block:
					'nearest',
			})
		})
	},
)

function emptyEventForm() {
	return {
		name: '',

		eventType:
			'',

		description:
			'',

		eventDate:
			'',

		status:
			'Draft',

		startTime:
			'',

		endTime:
			'',

		tags:
			'',

		venueName:
			'',

		address:
			'',

		city:
			'',

		capacity:
			'',

		zones: [
			{
				name:
					'',

				price:
					'',

				capacity:
					'',
			},
		],

		publicRegistration:
			true,

		requireApproval:
			false,

		waitlistEnabled:
			false,

		contactName:
			'',

		contactEmail:
			'',

		contactPhone:
			'',
	}
}

const eventForm =
	reactive(
		emptyEventForm(),
	)

function openCreateEvent() {
	Object.assign(
		eventForm,
		emptyEventForm(),
	)

	activeCreateTab.value =
		createTabs[0]?.label ??
		'Basic Info'

	createEventError.value =
		''

	showCreateEvent.value =
		true
}

async function createEvent() {
	if (!token.value) {
		createEventError.value =
			'Your session has expired.'

		return
	}

	if (
		!eventForm.name.trim() ||
		!eventForm.eventType ||
		!eventForm.eventDate
	) {
		createEventError.value =
			'Event name, event type, and event date are required.'

		activeCreateTab.value =
			'Basic Info'

		return
	}

	isSubmittingEvent.value =
		true

	createEventError.value =
		''

	try {
		const response =
			await $fetch<{
				data?: {
					id?: number
				}
			}>(
				`${config.public.apiBaseURL}/organizer/events`,
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
						name:
							eventForm.name.trim(),

						event_type:
							eventForm.eventType,

						description:
							eventForm.description
								.trim() ||
							null,

						event_date:
							eventForm.eventDate,

						start_time:
							eventForm.startTime ||
							null,

						end_time:
							eventForm.endTime ||
							null,

						location:
							[
								eventForm.venueName,
								eventForm.address,
								eventForm.city,
							]
								.map(
									item =>
										item.trim(),
								)
								.filter(
									Boolean,
								)
								.join(
									', ',
								) ||
							null,

						expected_guests:
							eventForm.capacity
								? Number(
									eventForm.capacity,
								)
								: null,

						status:
							eventForm.status.toLowerCase(),

						ticket_types:
							eventForm.zones
								.filter(zone => zone.name.trim())
								.map(zone => ({
									name: zone.name.trim(),
									price: Number(zone.price || 0),
									capacity: Number(zone.capacity || 0),
								})),

						public_registration:
							eventForm.publicRegistration,

						require_approval:
							eventForm.requireApproval,

						waitlist_enabled:
							eventForm.waitlistEnabled,

						contact_name:
							eventForm.contactName.trim() || null,

						contact_email:
							eventForm.contactEmail.trim() || null,

						contact_phone:
							eventForm.contactPhone.trim() || null,
					},
				},
			)

		showCreateEvent.value =
			false

		createEventError.value =
			''

		/*
		 * If backend returns the newly created event ID,
		 * go directly to its details.
		 */
		if (
			response.data?.id
		) {
			await navigateTo({
				path:
					'/organizer/eventmanagement/event-details',

				query: {
					event:
						response.data.id,
				},
			})

			return
		}

		await navigateTo(
			'/organizer/eventmanagement/all-events',
		)

	} catch (error: unknown) {
		console.error(
			'Failed to create event:',
			error,
		)

		const apiError =
			error as {
				data?: {
					message?: string
				}
			}

		createEventError.value =
			apiError.data?.message ??
			'Unable to create event.'

	} finally {
		isSubmittingEvent.value =
			false
	}
}

function closeCreateEvent() {
	if (
		isSubmittingEvent.value
	) {
		return
	}

	showCreateEvent.value =
		false

	createEventError.value =
		''
}

function addZone() {
	eventForm.zones.push({
		name:
			'',

		price:
			'',

		capacity:
			'',
	})
}

function removeZone(
	index: number,
) {
	eventForm.zones.splice(
		index,
		1,
	)
}

const currentTabIndex =
	computed(() =>
		createTabs.findIndex(
			tab =>
				tab.label ===
				activeCreateTab.value,
		),
	)

const isLastTab =
	computed(
		() =>
			currentTabIndex.value ===
			createTabs.length - 1,
	)

async function goNext() {
	if (
		isLastTab.value
	) {
		await createEvent()

		return
	}

	const nextTab =
		createTabs[
		currentTabIndex.value + 1
		]

	if (nextTab) {
		activeCreateTab.value =
			nextTab.label
	}
}
</script>
