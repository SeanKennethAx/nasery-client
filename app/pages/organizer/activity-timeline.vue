<template>
	<div>
		<div class="mb-1 text-xs font-semibold text-primary-700">
			Organizer Portal
		</div>

		<h1 class="text-2xl font-extrabold text-gray-900">
			Activity Timeline
		</h1>

		<p class="mt-1 mb-6 text-gray-500">
			Full activity log across all your managed events
		</p>

		<div v-if="isLoading"
			class="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
			Loading activity timeline...
		</div>

		<div v-else-if="errorMessage" class="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
			{{ errorMessage }}
		</div>

		<div v-else class="flex gap-6">
			<div class="w-72 shrink-0 space-y-2">
				<div class="mb-1 text-xs font-semibold tracking-wide text-gray-400">
					EVENTS
				</div>

				<button type="button"
					class="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold" :class="selectedEventKey === null
						? 'bg-[#285F6b] text-white'
						: 'border border-gray-200 text-gray-700 hover:bg-gray-50'
						" @click="selectAllEvents">
					<span>
						All Events
					</span>

					<span class="rounded-full px-2 py-0.5 text-xs font-bold" :class="selectedEventKey === null
						? 'bg-white/20 text-white'
						: 'bg-gray-100 text-gray-600'
						">
						{{ totalActivities }}
					</span>
				</button>

				<button v-for="ev in timelineEvents" :key="ev.key" type="button"
					class="w-full rounded-xl border px-4 py-3 text-left hover:bg-gray-50" :class="selectedEventKey === ev.key
						? 'border-[#285F6b] bg-[#285F6b]/5'
						: 'border-gray-200'
						" @click="selectEvent(ev)">
					<div class="flex items-center justify-between gap-2">
						<span class="truncate text-sm font-bold text-gray-900">
							{{ ev.name }}
						</span>

						<span class="shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold" :class="eventBadgeClass(
							ev.status,
						)
							">
							{{
								formatEventStatus(
									ev.status,
								)
							}}
						</span>
					</div>

					<div class="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500">
						<IconBase name="calendar" class="h-3.5 w-3.5" />

						{{
							formatDate(
								ev.eventDate,
							)
						}}
					</div>

					<div class="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
						<IconBase name="map-pin" class="h-3.5 w-3.5" />

						{{
							ev.location ||
							'Location not set'
						}}
					</div>
				</button>

				<div v-if="!timelineEvents.length"
					class="rounded-xl border border-dashed border-gray-300 p-5 text-center text-xs text-gray-500">
					No events found.
				</div>
			</div>

			<div class="min-w-0 flex-1">
				<div class="mb-4 flex items-center gap-3">
					<div class="flex-1">
						<FormsTextField v-model="searchQuery" icon="search" placeholder="Search activities..." />
					</div>

					<IconBase name="filter" class="h-4 w-4 shrink-0 text-gray-400" />

					<div class="flex shrink-0 gap-2">
						<button v-for="filter in statusFilters" :key="filter" type="button"
							class="rounded-lg px-3 py-2 text-sm font-semibold" :class="selectedStatus === filter
								? 'bg-[#285F6b] text-white'
								: 'border border-gray-200 text-gray-600 hover:bg-gray-50'
								" @click="
									selectedStatus =
									filter
									">
							{{ filter }}
						</button>
					</div>
				</div>

				<div class="mb-4 flex items-center justify-between">
					<div class="flex gap-2">
						<span class="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
							{{ doneCount }}
							Completed
						</span>

						<span class="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
							{{ inProgressCount }}
							In Progress
						</span>

						<span class="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
							{{ pendingCount }}
							Pending
						</span>
					</div>

					<span class="text-sm text-gray-400">
						{{ totalActivities }}
						activities
					</span>
				</div>

				<Transition name="fade-slide" mode="out-in">
					<div :key="selectedEventKey ||
						'all'
						">
						<div v-if="selectedEventData"
							class="mb-5 flex items-center justify-between rounded-xl bg-[#285F6b] px-5 py-4 text-white">
							<div>
								<div class="text-base font-bold">
									{{
										selectedEventData
											.name
									}}
								</div>

								<div class="mt-1 flex items-center gap-3 text-xs text-white/70">
									<span class="flex items-center gap-1">
										<IconBase name="calendar" class="h-3.5 w-3.5" />

										{{
											formatDate(
												selectedEventData
													.eventDate,
											)
										}}
									</span>

									<span class="flex items-center gap-1">
										<IconBase name="map-pin" class="h-3.5 w-3.5" />

										{{
											selectedEventData
												.location ||
											'Location not set'
										}}
									</span>
								</div>
							</div>

							<span class="shrink-0 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
								{{
									formatEventStatus(
										selectedEventData
											.status,
									)
								}}
							</span>
						</div>

						<div class="mb-5 flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
							<IconBase name="clipboard-list" class="h-4 w-4 shrink-0 text-gray-400" />

							{{ summaryMessage }}
						</div>

						<div class="space-y-3">
							<div v-for="activity in filteredActivities" :key="activity.id"
								class="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4">
								<IconBase v-if="
									activity.status ===
									'completed'
								" name="check-circle" class="mt-0.5 h-5 w-5 shrink-0 text-green-600" />

								<IconBase v-else-if="
									activity.status ===
									'in_progress'
								" name="clock" class="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />

								<span v-else class="mt-1 h-4 w-4 shrink-0 rounded-full border-2 border-gray-300" />

								<div class="min-w-0 flex-1">
									<div class="flex items-center gap-2 text-xs">
										<span class="font-semibold text-primary-700">
											{{
												activity.event
													?.name ||
												'Event'
											}}
										</span>

										<span v-if="
											activity.category
										" class="text-gray-400">
											{{
												activity.category
											}}
										</span>
									</div>

									<div class="mt-0.5 text-sm font-bold text-gray-900">
										{{ activity.title }}
									</div>

									<p class="mt-0.5 text-sm text-gray-500">
										{{
											activity.description ||
											'No description'
										}}
									</p>

									<div class="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-gray-400">
										<span class="flex items-center gap-1">
											<IconBase name="calendar" class="h-3.5 w-3.5" />

											{{
												formatActivityDate(
													activity.activity_at,
												)
											}}
										</span>

										<span v-if="
											activity.person
										" class="flex items-center gap-1">
											<IconBase name="user" class="h-3.5 w-3.5" />

											{{
												activity.person
											}}
										</span>

										<span v-if="
											activity.tag
										" class="flex items-center gap-1">
											<IconBase name="tag" class="h-3.5 w-3.5" />

											{{
												activity.tag
											}}
										</span>
									</div>
								</div>

								<span class="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold" :class="activityStatusClass(
									activity.status,
								)
									">
									{{
										formatActivityStatus(
											activity.status,
										)
									}}
								</span>
							</div>

							<div v-if="filteredActivities.length === 0"
								class="rounded-2xl border border-gray-200 bg-white p-10 text-center">
								<div
									class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
									<IconBase name="clipboard-list" class="h-5 w-5" />
								</div>

								<h3 class="mt-4 text-base font-bold text-gray-900">
									{{
										selectedEventData
											? `No activity yet for ${selectedEventData.name}`
											: 'No activities yet'
									}}
								</h3>

								<p class="mx-auto mt-1 max-w-md text-sm leading-6 text-gray-500">
									<template v-if="
										selectedStatus !== 'All' ||
										searchQuery.trim()
									">
										No activities match your current search or filter.
									</template>

									<template v-else>
										Activities will appear here as you add milestones,
										updates, tasks, and progress for this event.
									</template>
								</p>

								<button v-if="
									selectedEventData?.eventId
								" type="button" class="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#285F6b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1f4a54]"
									@click="openAddActivity">
									<IconBase name="plus" class="h-4 w-4" />

									Add Activity
								</button>
							</div>
						</div>
					</div>
				</Transition>
			</div>
		</div>
		<!-- Add Activity Overlay -->
		<Transition name="fade">
			<div v-if="showAddActivity" class="fixed inset-0 z-40 bg-gray-900/40" @click="closeAddActivity" />
		</Transition>

		<!-- Add Activity Slide-over -->
		<Transition name="slide">
			<div v-if="showAddActivity"
				class="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-white shadow-2xl">
				<div class="flex shrink-0 items-start justify-between border-b border-gray-200 px-6 py-5">
					<div>
						<p class="text-xs font-semibold uppercase tracking-wide text-primary-700">
							{{ selectedEventData?.name }}
						</p>

						<h2 class="mt-1 text-lg font-bold text-gray-900">
							Add Activity
						</h2>

						<p class="mt-1 text-sm text-gray-500">
							Add a milestone, update, or task for this event.
						</p>
					</div>

					<button type="button" class="text-gray-400 hover:text-gray-600" @click="closeAddActivity">
						<IconBase name="x" class="h-5 w-5" />
					</button>
				</div>

				<div class="flex-1 overflow-y-auto px-6 py-5">
					<div v-if="activityFormError"
						class="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
						{{ activityFormError }}
					</div>

					<div>
						<FormsLabel text="Activity Title" required />

						<FormsTextField v-model="activityForm.title" placeholder="e.g. Venue walkthrough" />
					</div>

					<div class="mt-4">
						<label class="mb-1.5 block text-sm font-semibold text-gray-700">
							Description
						</label>

						<textarea v-model="activityForm.description" rows="4"
							placeholder="Add details about this activity..."
							class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15" />
					</div>

					<div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
						<div>
							<label class="mb-1.5 block text-sm font-semibold text-gray-700">
								Category
							</label>

							<FormsSelect v-model="activityForm.category"
								:options="['Planning', 'Venue', 'Catering', 'Staff', 'Logistics', 'Marketing', 'Registration', 'Other']"
								placeholder="Select category" />
						</div>

						<div>
							<label class="mb-1.5 block text-sm font-semibold text-gray-700">
								Tag
							</label>

							<FormsSelect v-model="activityForm.tag"
								:options="['Milestone', 'Update', 'Action', 'Reminder']" placeholder="Select tag" />
						</div>
					</div>

					<div class="mt-4">
						<FormsLabel text="Person / Assigned To" />

						<FormsTextField v-model="activityForm.person" placeholder="e.g. Venue Coordinator" />
					</div>

					<div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
						<div>
							<label class="mb-1.5 block text-sm font-semibold text-gray-700">
								Status
							</label>

							<FormsSelect v-model="activityForm.status"
								:options="[{ value: 'pending', label: 'Pending' }, { value: 'in_progress', label: 'In Progress' }, { value: 'completed', label: 'Completed' }]"
								:can-clear="false" :searchable="false" />
						</div>

						<div>
							<FormsLabel text="Date & Time" />

							<FormsDateTimeField v-model="activityForm.activityAt" name="activity_at"
								placeholder="Choose date and time" />
						</div>
					</div>
				</div>

				<div class="shrink-0 border-t border-gray-200 px-6 py-4">
					<div class="flex justify-end gap-3">
						<button type="button"
							class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
							:disabled="isSavingActivity" @click="closeAddActivity">
							Cancel
						</button>

						<button type="button"
							class="flex items-center gap-2 rounded-xl bg-[#285F6b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1f4a54] disabled:cursor-not-allowed disabled:opacity-60"
							:disabled="isSavingActivity" @click="saveActivity">
							<IconBase v-if="isSavingActivity" name="refresh-cw" class="h-4 w-4 animate-spin" />

							<IconBase v-else name="check-circle" class="h-4 w-4" />

							{{
								isSavingActivity
									? 'Saving...'
									: 'Save Activity'
							}}
						</button>
					</div>
				</div>
			</div>
		</Transition>

	</div>
</template>

<script setup lang="ts">

interface OrganizerEvent {
	id: number
	inquiry_id: number | null
	quotation_id: number | null

	name: string
	event_type: string
	event_date: string | null
	location: string | null

	status: string
}

interface OfferInquiry {
	id: number
	event_title: string | null
	event_type: string
	event_date: string | null
	location: string | null
}

interface OrganizerQuotation {
	id: number
	inquiry_id: number
	organizer_id: number

	quotation_status:
	| 'pending'
	| 'accepted'
	| 'rejected'
	| 'withdrawn'

	inquiry?: OfferInquiry
	event?: OrganizerEvent | null
}

interface ActivityTimelineEvent {
	key: string

	eventId: number | null
	quotationId: number | null

	name: string
	eventType: string

	eventDate: string | null
	location: string | null

	status: string

	hasRealEvent: boolean
}

interface ActivityEvent {
	id: number
	name: string
	event_type: string
}

interface EventActivity {
	id: number
	event_id: number

	title: string
	description: string | null

	category: string | null
	tag: string | null
	person: string | null

	status:
	| 'pending'
	| 'in_progress'
	| 'completed'

	activity_at: string | null

	event?: ActivityEvent
}

interface EventResponse {
	data: OrganizerEvent[]
}

interface QuotationResponse {
	data: OrganizerQuotation[]
}

interface ActivityResponse {
	data: EventActivity[]
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

const timelineEvents =
	useState<ActivityTimelineEvent[]>(
		'organizerActivityTimelineEvents',
		() => [],
	)

const organizerEvents =
	useState<OrganizerEvent[]>(
		'organizerEvents',
		() => [],
	)

const quotations =
	useState<OrganizerQuotation[]>(
		'organizerEventQuotations',
		() => [],
	)

const activities =
	ref<EventActivity[]>([])

const selectedEventId =
	ref<number | null>(null)

const selectedEventKey =
	ref<string | null>(null)

const showAddActivity =
	ref(false)

const isSavingActivity =
	ref(false)

const activityFormError =
	ref('')

const activityForm =
	reactive({
		title: '',
		description: '',
		category: '',
		tag: '',
		person: '',
		status: 'pending' as EventActivity['status'],
		activityAt: '',
	})

const selectedStatus =
	ref('All')

const searchQuery =
	ref('')

const isLoading =
	ref(false)

const errorMessage =
	ref('')

const statusFilters = [
	'All',
	'Completed',
	'In Progress',
	'Pending',
]
function resetActivityForm() {
	activityForm.title = ''
	activityForm.description = ''
	activityForm.category = ''
	activityForm.tag = ''
	activityForm.person = ''
	activityForm.status = 'pending'
	activityForm.activityAt = ''
	activityFormError.value = ''
}

function openAddActivity() {
	if (
		!selectedEventData.value?.eventId
	) {
		return
	}

	resetActivityForm()

	showAddActivity.value =
		true
}

function closeAddActivity() {
	if (
		isSavingActivity.value
	) {
		return
	}

	showAddActivity.value =
		false

	resetActivityForm()
}
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

async function saveActivity() {
	if (
		!token.value ||
		!selectedEventData.value?.eventId
	) {
		return
	}

	if (
		!activityForm.title.trim()
	) {
		activityFormError.value =
			'Activity title is required.'

		return
	}

	isSavingActivity.value =
		true

	activityFormError.value =
		''

	try {
		const response =
			await $fetch<{
				message?: string
				data: EventActivity
			}>(
				`${config.public.apiBaseURL}/organizer/events/${selectedEventData.value.eventId}/activities`,
				{
					method: 'POST',

					headers: {
						Accept:
							'application/json',

						Authorization:
							`Bearer ${token.value}`,
					},

					body: {
						title:
							activityForm.title.trim(),

						description:
							activityForm.description.trim() ||
							null,

						category:
							activityForm.category ||
							null,

						tag:
							activityForm.tag ||
							null,

						person:
							activityForm.person.trim() ||
							null,

						status:
							activityForm.status,

						activity_at:
							activityForm.activityAt ||
							null,
					},
				},
			)

		activities.value.unshift(
			response.data,
		)

		showAddActivity.value =
			false

		resetActivityForm()

	} catch (error: unknown) {
		console.error(
			'Failed to create activity:',
			error,
		)

		activityFormError.value =
			getApiErrorMessage(
				error,
				'Unable to create activity.',
			)

	} finally {
		isSavingActivity.value =
			false
	}
}

function syncTimelineEvents() {
	const items:
		ActivityTimelineEvent[] = []

	for (
		const event of
		organizerEvents.value
	) {
		const quotation =
			quotations.value.find(
				item =>
					item.id ===
					event.quotation_id,
			)

		items.push({
			key:
				`event-${event.id}`,

			eventId:
				event.id,

			quotationId:
				event.quotation_id,

			name:
				event.name,

			eventType:
				event.event_type,

			eventDate:
				event.event_date,

			location:
				event.location,

			status:
				event.status,

			hasRealEvent:
				true,
		})
	}

	for (
		const quotation of
		quotations.value
	) {
		if (
			quotation.quotation_status !==
			'accepted'
		) {
			continue
		}

		const alreadyHasEvent =
			organizerEvents.value.some(
				event =>
					event.quotation_id ===
					quotation.id,
			)

		if (alreadyHasEvent) {
			continue
		}

		items.push({
			key:
				`quotation-${quotation.id}`,

			eventId:
				null,

			quotationId:
				quotation.id,

			name:
				quotation.inquiry
					?.event_title ||
				`${quotation.inquiry
					?.event_type ||
				'Event'} Event`,

			eventType:
				quotation.inquiry
					?.event_type ||
				'Event',

			eventDate:
				quotation.inquiry
					?.event_date ??
				null,

			location:
				quotation.inquiry
					?.location ??
				null,

			status:
				'awarded',

			hasRealEvent:
				false,
		})
	}

	timelineEvents.value =
		items
}
async function loadTimeline() {
	if (!token.value) {
		errorMessage.value =
			'You are not authenticated.'

		return
	}

	isLoading.value =
		true

	errorMessage.value =
		''

	try {
		const [
			eventResponse,
			quotationResponse,
			activityResponse,
		] = await Promise.all([
			$fetch<EventResponse>(
				`${config.public.apiBaseURL}/organizer/events`,
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

			$fetch<QuotationResponse>(
				`${config.public.apiBaseURL}/organizer/quotations`,
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

			$fetch<ActivityResponse>(
				`${config.public.apiBaseURL}/organizer/activities`,
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

		organizerEvents.value =
			eventResponse.data ?? []

		quotations.value =
			quotationResponse.data ?? []

		activities.value =
			activityResponse.data ?? []

		syncTimelineEvents()

	} catch (error: unknown) {
		console.error(
			'Failed to load Activity Timeline:',
			error,
		)

		errorMessage.value =
			getApiErrorMessage(
				error,
				'Unable to load Activity Timeline.',
			)

	} finally {
		isLoading.value =
			false
	}
}

function selectAllEvents() {
	selectedEventId.value =
		null

	selectedEventKey.value =
		null
}

function selectEvent(
	event: ActivityTimelineEvent,
) {
	selectedEventKey.value =
		event.key

	selectedEventId.value =
		event.eventId
}

const selectedEventData =
	computed(() => {
		if (
			!selectedEventKey.value
		) {
			return null
		}

		return (
			timelineEvents.value.find(
				event =>
					event.key ===
					selectedEventKey.value,
			) ?? null
		)
	})

const filteredActivities =
	computed(() => {
		const query =
			searchQuery.value
				.trim()
				.toLowerCase()

		return activities.value.filter(
			activity => {
				if (
					selectedEventKey.value
				) {
					if (
						selectedEventId.value ===
						null
					) {
						return false
					}

					if (
						activity.event_id !==
						selectedEventId.value
					) {
						return false
					}
				}
				if (
					selectedStatus.value ===
					'Completed' &&
					activity.status !==
					'completed'
				) {
					return false
				}

				if (
					selectedStatus.value ===
					'In Progress' &&
					activity.status !==
					'in_progress'
				) {
					return false
				}

				if (
					selectedStatus.value ===
					'Pending' &&
					activity.status !==
					'pending'
				) {
					return false
				}

				/*
				 * Search.
				 */
				if (query) {
					const searchable = [
						activity.title,
						activity.description,
						activity.category,
						activity.person,
						activity.tag,
						activity.event?.name,
					]
						.filter(Boolean)
						.join(' ')
						.toLowerCase()

					if (
						!searchable.includes(
							query,
						)
					) {
						return false
					}
				}

				return true
			},
		)
	})

const totalActivities =
	computed(
		() =>
			activities.value.length,
	)

const doneCount =
	computed(
		() =>
			activities.value.filter(
				activity =>
					activity.status ===
					'completed',
			).length,
	)

const inProgressCount =
	computed(
		() =>
			activities.value.filter(
				activity =>
					activity.status ===
					'in_progress',
			).length,
	)

const pendingCount =
	computed(
		() =>
			activities.value.filter(
				activity =>
					activity.status ===
					'pending',
			).length,
	)
const summaryMessage =
	computed(() => {
		if (
			selectedEventData.value
		) {
			if (
				!selectedEventData.value
					.hasRealEvent
			) {
				return `No activity yet for ${selectedEventData.value.name} — event setup has not started.`
			}

			return `Showing activity for ${selectedEventData.value.name} — newest first`
		}

		return `Showing all activity across ${timelineEvents.value.length} events — newest first`
	})
function formatDate(
	value: string | null,
): string {
	if (!value) {
		return 'Date not set'
	}

	const date =
		new Date(
			value.includes('T')
				? value
				: `${value}T00:00:00`,
		)

	return date.toLocaleDateString(
		'en-US',
		{
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		},
	)
}

function formatActivityDate(
	value: string | null,
): string {
	if (!value) {
		return 'Date not set'
	}

	const date =
		new Date(value)

	return date.toLocaleString(
		'en-US',
		{
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: '2-digit',
		},
	)
}

function formatEventStatus(
	status: string,
): string {
	switch (status) {
		case 'published':
			return 'Published'

		case 'confirmed':
			return 'Confirmed'

		case 'ongoing':
			return 'Ongoing'

		case 'completed':
			return 'Completed'

		case 'cancelled':
			return 'Cancelled'

		case 'awarded':
			return 'Awarded'

		default:
			return 'Draft'
	}
}

function eventBadgeClass(
	status: string,
): string {
	switch (status) {
		case 'published':
		case 'confirmed':
			return 'bg-green-50 text-green-700'

		case 'ongoing':
			return 'bg-blue-50 text-blue-700'

		case 'completed':
			return 'bg-gray-100 text-gray-600'

		case 'cancelled':
			return 'bg-red-50 text-red-600'

		case 'awarded':
			return 'bg-green-50 text-green-700'

		default:
			return 'bg-gray-100 text-gray-600'
	}
}

function formatActivityStatus(
	status: EventActivity['status'],
): string {
	switch (status) {
		case 'completed':
			return 'Completed'

		case 'in_progress':
			return 'In Progress'

		default:
			return 'Pending'
	}
}

function activityStatusClass(
	status: EventActivity['status'],
): string {
	if (
		status ===
		'completed'
	) {
		return 'bg-green-50 text-green-700'
	}

	if (
		status ===
		'in_progress'
	) {
		return 'bg-blue-50 text-blue-700'
	}

	return 'text-gray-400'
}

onMounted(() => {
	loadTimeline()
})
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
	transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-slide-enter-from {
	opacity: 0;
	transform: translateY(6px);
}

.fade-slide-leave-to {
	opacity: 0;
	transform: translateY(-6px);
}

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
