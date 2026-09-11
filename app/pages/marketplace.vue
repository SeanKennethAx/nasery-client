<template>
	<div>
		<section class="overflow-hidden border-b border-primary-100 bg-primary-900 text-white">
			<div
				class="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.35fr_.65fr] lg:items-end">
				<div>
					<p class="mb-5 text-xs font-bold uppercase tracking-[.2em] text-primary-200">
						The event marketplace
					</p>
					<h1 class="max-w-3xl text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
						Find events worth<br>
						<span class="font-serif font-normal italic text-primary-100">showing up for.</span>
					</h1>
					<p class="mt-6 max-w-xl text-base leading-relaxed text-white/75">
						Explore real events managed by NaSeRy organizers. Discover what is happening, meet the team
						behind it, and register when tickets are open.
					</p>
				</div>
				<div class="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
					<p class="text-sm font-semibold text-primary-100">
						Open to everyone
					</p>
					<p class="mt-2 text-sm leading-relaxed text-white/70">
						Browse without an account. Event registration links appear only when the organizer has opened
						public registration.
					</p>
				</div>
			</div>
		</section>

		<section aria-labelledby="marketplace-heading" class="mx-auto max-w-7xl px-5 pt-10 sm:px-8 sm:pt-14">
			<div class="mb-6">
				<h2 id="marketplace-heading" class="text-2xl font-bold tracking-tight">
					Explore managed events
				</h2>
				<p class="mt-2 text-sm text-gray-500">
					Search by event, organizer, category, or venue.
				</p>
			</div>

			<div class="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-[2fr_1fr_1fr]">
				<div>
					<label for="event-search" class="mb-2 block text-xs font-semibold text-gray-600">
						Search events
					</label>
					<input id="event-search" v-model="search" type="search" placeholder="Event, organizer, or venue…"
						class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-3 text-sm">
				</div>
				<div>
					<label class="mb-2 block text-xs font-semibold text-gray-600">
						Event type
					</label>
					<FormsSelect v-model="eventType" :options="eventTypes" placeholder="All event types" />
				</div>
				<div>
					<label class="mb-2 block text-xs font-semibold text-gray-600">
						Location
					</label>
					<FormsSelect v-model="location" :options="locations" placeholder="All locations" />
				</div>
			</div>

			<div v-if="status === 'pending'" class="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
				aria-label="Loading events" aria-live="polite">
				<div v-for="item in 3" :key="item"
					class="h-[30rem] animate-pulse rounded-2xl border border-gray-200 bg-white">
					<div class="h-44 bg-gray-200" />
					<div class="space-y-4 p-6">
						<div class="h-5 w-2/3 rounded bg-gray-200" />
						<div class="h-4 w-full rounded bg-gray-100" />
						<div class="h-4 w-4/5 rounded bg-gray-100" />
					</div>
				</div>
			</div>
			<div v-else-if="error" class="mt-8 rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center"
				role="alert">
				<h3 class="text-lg font-bold text-red-900">
					We couldn’t load the event marketplace
				</h3>
				<p class="mt-2 text-sm text-red-700">
					Check that the NaSeRy API is running, then try again.
				</p>
				<button class="mt-5 rounded-lg bg-red-700 px-5 py-3 text-sm font-semibold text-white"
					@click="refresh()">
					Try again
				</button>
			</div>
			<template v-else>
				<div class="my-6 flex items-center justify-between gap-4 text-sm">
					<p role="status" aria-live="polite">
						<span class="font-bold">{{ filteredEvents.length }}</span> {{
							filteredEvents.length === 1 ? 'event' : 'events' }}<span class="text-gray-500"> to
							explore</span>
					</p>
					<button v-if="hasFilters" class="font-semibold text-primary-700 underline" @click="resetFilters">
						Clear filters
					</button>
				</div>
				<div v-if="filteredEvents.length" class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
					<article v-for="event in filteredEvents" :key="event.id"
						class="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-lg">
						<div class="relative flex h-44 items-end overflow-hidden p-6 text-white"
							:style="{ backgroundColor: event.organizer.banner_color }">
							<div aria-hidden="true"
								class="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/10" />
							<div aria-hidden="true"
								class="absolute -bottom-20 left-10 h-40 w-40 rounded-full border border-white/15" />
							<span class="relative rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
								{{ event.event_type }}
							</span>
						</div>
						<div class="flex flex-1 flex-col p-6">
							<div class="flex items-start justify-between gap-3">
								<div>
									<p class="text-xs font-semibold uppercase tracking-wider text-primary-700">
										{{ formatDate(event.event_date) }}
									</p>
									<h3 class="mt-2 text-xl font-bold leading-tight">{{ event.name }}</h3>
								</div>
								<span v-if="event.registration_open"
									class="shrink-0 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
									Registration open
								</span>
							</div>
							<p class="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-600">
								{{
									event.description ||
									'More event details will be announced by the organizer.'
								}}
							</p>
							<div class="mt-5 space-y-2 border-y border-gray-100 py-4 text-sm">
								<p class="flex items-center gap-2 text-gray-600">
									<span aria-hidden="true">⌖</span>
									{{ event.location || 'Venue to be announced' }}
								</p>
								<p class="font-semibold text-gray-800">
									{{ priceLabel(event.ticket_types) }}
								</p>
							</div>
							<div class="mt-5 flex items-center justify-between gap-3">
								<NuxtLink :to="`/organizers/${event.organizer.slug}`"
									class="min-w-0 text-sm text-gray-500 hover:text-primary-700">
									<span class="block text-xs">Managed by</span>
									<span class="block truncate font-bold text-gray-800">
										{{ event.organizer.name }}
									</span>
								</NuxtLink>
								<NuxtLink v-if="event.registration_path" :to="event.registration_path"
									class="shrink-0 rounded-lg bg-primary-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-primary-900">
									Register <span aria-hidden="true">↗</span>
								</NuxtLink>
								<NuxtLink v-else :to="`/organizers/${event.organizer.slug}`"
									class="shrink-0 text-sm font-bold text-primary-700 hover:underline">
									View organizer <span aria-hidden="true">↗</span>
								</NuxtLink>
							</div>
						</div>
					</article>
				</div>
				<div v-else class="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
					<h3 class="text-xl font-bold">
						{{
							hasFilters ?
								'No events match your search' :
								'No public events are available yet'
						}}
					</h3>
					<p class="mt-2 text-sm text-gray-500">
						{{
							hasFilters ?
								'Try another event type, venue, or organizer.' :
								'Events will appear when organizers publish them or open public registration.'
						}}
					</p>
					<button v-if="hasFilters"
						class="mt-6 rounded-lg bg-primary-700 px-5 py-3 text-sm font-semibold text-white"
						@click="resetFilters">
						Clear all filters
					</button>
				</div>
			</template>
		</section>
	</div>
</template>

<script setup lang="ts">
import { useEventMarketplace } from '~/services/eventMarketplaceService'

definePageMeta({ layout: 'public' })
useSeoMeta({
	title: 'Event Marketplace | NaSeRy',
	description: 'Browse public events managed by event organizers on NaSeRy.',
})

const search = ref('')
const eventType = ref('')
const location = ref('')
const { data, status, error, refresh } = await useEventMarketplace()
const events = computed(() => data.value?.data ?? [])
const eventTypes = computed(() => [...new Set(events.value.map(event => event.event_type).filter(Boolean))].sort())
const locations = computed(() => [...new Set(events.value.map(event => event.location).filter((value): value is string => Boolean(value)))].sort())
const filteredEvents = computed(() => {
	const query = search.value.trim().toLowerCase()
	return events.value.filter(event =>
		(!eventType.value || event.event_type === eventType.value)
		&& (!location.value || event.location === location.value)
		&& (!query || [event.name, event.event_type, event.description, event.location, event.organizer.name]
			.filter(Boolean).join(' ').toLowerCase().includes(query))
	)
})
const hasFilters = computed(() => Boolean(search.value || eventType.value || location.value))

function resetFilters() {
	search.value = ''
	eventType.value = ''
	location.value = ''
}

function formatDate(value: string | null) {
	if (!value) return 'Date to be announced'
	return new Intl.DateTimeFormat('en-PH', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`))
}

function formatPrice(value: number) {
	return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(value)
}

function priceLabel(ticketTypes: { price: number }[]) {
	if (!ticketTypes.length) return 'Admission details coming soon'
	const lowest = Math.min(...ticketTypes.map(ticket => Number(ticket.price)))
	return lowest === 0 ? 'Free admission available' : `Tickets from ${formatPrice(lowest)}`
}
</script>