<template>
	<div>
		<section class="overflow-hidden border-b border-primary-100 bg-primary-900 text-white">
			<div
				class="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.35fr_.65fr] lg:items-end">
				<div>
					<p class="mb-5 text-xs font-bold uppercase tracking-[.2em] text-primary-200">
						The organizer directory
					</p>
					<h1 class="max-w-2xl text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
						Great events start<br />with the <span
							class="font-serif font-normal italic text-primary-100">right
							people.</span>
					</h1>
					<p class="mt-6 max-w-lg text-base leading-relaxed text-white/75">
						Meet the teams behind memorable occasions.
						Explore their work, discover their services, and find a match for your next event.
					</p>
					<p class="mt-6 flex items-center gap-2 text-sm font-medium text-primary-100">
						<span aria-hidden="true"
							class="flex h-5 w-5 items-center justify-center rounded-full bg-white/15">✓</span>
						Free to explore. No account needed.
					</p>
				</div>
				<div class="rounded-2xl border border-white/15 bg-white/10 p-7 backdrop-blur-sm sm:p-8">
					<p class="text-xs font-bold uppercase tracking-widest text-primary-100">
						From inspiration to celebration
					</p>
					<ol class="mt-6 space-y-6">
						<li v-for="(step, index) in [{ title: 'Find your people', text: 'Browse by specialty and location.' }, { title: 'Get to know their work', text: 'Explore services and past event portfolios.' }, { title: 'Tell us what you’re planning', text: 'Sign in to post an inquiry and receive offers.' }]"
							:key="step.title" class="flex gap-4">
							<span
								class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 text-xs font-bold text-primary-100">
								0{{ index + 1 }}
							</span>
							<div>
								<h2 class="font-semibold">{{ step.title }}</h2>
								<p class="mt-1 text-sm text-white/65">{{ step.text }}</p>
							</div>
						</li>
					</ol>
				</div>
			</div>
		</section>

		<section aria-labelledby="directory-heading" class="mx-auto max-w-7xl px-5 pt-10 sm:px-8 sm:pt-14">
			<div class="mb-6">
				<h2 id="directory-heading" class="text-2xl font-bold tracking-tight">
					Discover event organizers
				</h2>
				<p class="mt-2 text-sm text-gray-500">
					Different specialties. A shared passion for bringing people together.
				</p>
			</div>
			<div class="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-[2fr_1fr_1fr]">
				<div>
					<label for="organizer-search" class="mb-2 block text-xs font-semibold text-gray-600">
						Search organizers
					</label>
					<input id="organizer-search" v-model="search" type="search"
						placeholder="Name, location, or service…"
						class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-3 text-sm" />
				</div>
				<div>
					<label class="mb-2 block text-xs font-semibold text-gray-600">
						Event specialty
					</label>
					<FormsSelect v-model="specialty" :options="specialties" placeholder="All specialties" />
				</div>
				<div>
					<label class="mb-2 block text-xs font-semibold text-gray-600">Location</label>
					<FormsSelect v-model="region" :options="regions" placeholder="All locations" />
				</div>
			</div>
			<div v-if="status === 'pending'" class="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
				aria-label="Loading organizers" aria-live="polite">
				<div v-for="item in 3" :key="item"
					class="h-96 animate-pulse rounded-2xl border border-gray-200 bg-white">
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
					We couldn’t load the organizer directory
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
				<div class="my-6 flex flex-wrap items-center justify-between gap-4 text-sm">
					<div class="flex items-center gap-3">
						<p role="status" aria-live="polite"><span class="font-bold">{{ filtered.length }}</span> {{
							filtered.length
								=== 1 ? 'organizer' : 'organizers' }}<span class="text-gray-500"> to explore</span></p>
						<button v-if="hasFilters" class="font-semibold text-primary-700 underline"
							@click="resetFilters">
							Clear filters
						</button>
					</div>
					<div class="flex items-center gap-2"><label class="text-gray-500">Sort by</label>
						<FormsSelect v-model="sort" class="min-w-56" :options="sortOptions" :can-clear="false"
							:searchable="false" />
					</div>
				</div>
				<div v-if="filtered.length" class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
					<article v-for="organizer in filtered" :key="organizer.slug"
						class="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-lg">
						<PortfolioCover :color="organizer.banner_color" :label="organizer.specialties[0] || 'Events'"
							compact />
						<div class="flex flex-1 flex-col p-6">
							<div class="mb-4 flex items-center gap-3"><span
									class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
									:style="{ backgroundColor: organizer.banner_color }">{{ initials(organizer.name)
									}}</span>
								<div>
									<h3 class="font-bold">{{ organizer.name }}</h3>
									<p class="mt-1 text-xs text-gray-500">{{ organizer.location || 'Location not added'
									}}</p>
								</div>
							</div>
							<p class="text-sm leading-relaxed text-gray-600">
								{{
									organizer.bio ||
									'Open this profile to see the organizer’s specialties and completed events.'
								}}
							</p>
							<div class="mb-6 mt-4 flex flex-wrap gap-2">
								<span v-for="tag in organizer.specialties" :key="tag"
									class="rounded-md bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700">
									{{ tag }}
								</span>
							</div>
							<div class="mt-auto flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
								<span class="text-xs text-gray-500">
									{{ organizer.portfolio_events_count }}
									completed {{ organizer.portfolio_events_count === 1 ? 'event' : 'events' }}
								</span>
								<NuxtLink :to="`/organizers/${organizer.slug}`"
									:aria-label="`View portfolio of ${organizer.name}`"
									class="text-sm font-bold text-primary-700 hover:underline">
									View portfolio <span aria-hidden="true">↗</span>
								</NuxtLink>
							</div>
						</div>
					</article>
				</div>
				<div v-else class="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
					<h3 class="text-xl font-bold">{{ emptyTitle }}</h3>
					<p class="mt-2 text-sm text-gray-500">{{ emptyDescription }}</p>
					<button v-if="hasFilters"
						class="mt-6 rounded-lg bg-primary-700 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-900"
						@click="resetFilters">
						Clear all filters
					</button>
				</div>
			</template>
			<div v-if="canPostEvent"
				class="mt-14 flex flex-col justify-between gap-6 rounded-2xl bg-primary-900 p-8 text-white sm:flex-row sm:items-center sm:p-10">
				<div>
					<h2 class="text-2xl font-semibold">
						Have an event in mind?
					</h2>
					<p class="mt-2 max-w-xl text-sm leading-relaxed text-white/75">
						Share your vision, budget, and date. Sign in as a
						client to post an inquiry and let organizers send their offers.
					</p>
				</div>
				<NuxtLink to="/client/post-event"
					class="shrink-0 self-start rounded-lg bg-white px-5 py-3 text-sm font-bold text-primary-900 hover:bg-primary-50 sm:self-auto">
					Post an event <span aria-hidden="true">↗</span>
				</NuxtLink>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
import { useOrganizerDirectory } from '~/services/organizerPortfolioService'

definePageMeta({ layout: 'public', alias: ['/organizers'] })
useSeoMeta({ title: 'Browse Event Organizers | NaSeRy', description: 'Explore organizer profiles, services, and past events. Browse without an account and sign in when you are ready to post an inquiry.' })

const search = ref('')
const specialty = ref('')
const region = ref('')
const sort = ref('name')
const sortOptions = [
	{ value: 'name', label: 'Name (A–Z)' },
	{ value: 'work', label: 'Most portfolio projects' },
]
const { user } = useAuth()
const { data, status, error, refresh } = await useOrganizerDirectory()
const organizers = computed(() => data.value?.data ?? [])
const specialties = computed(() => [...new Set(organizers.value.flatMap(item => item.specialties))].sort())
const regions = computed(() => [...new Set(organizers.value.map(item => item.location).filter((item): item is string => Boolean(item)))].sort())
const filtered = computed(() => {
	const query = search.value.trim().toLowerCase()
	return organizers.value.filter(item =>
		(!specialty.value || item.specialties.includes(specialty.value)) &&
		(!region.value || item.location === region.value) &&
		(!query || [item.name, item.location, item.bio, ...item.specialties].filter(Boolean).join(' ').toLowerCase().includes(query))
	).sort((a, b) => sort.value === 'work' ? b.portfolio_events_count - a.portfolio_events_count || a.name.localeCompare(b.name) : a.name.localeCompare(b.name))
})
const hasFilters = computed(() => Boolean(search.value || specialty.value || region.value))
const emptyTitle = computed(() => hasFilters.value ? 'No organizers match your search' : 'No organizer profiles are available yet')
const emptyDescription = computed(() => hasFilters.value ? 'Try another name, specialty, or location.' : 'Organizer profiles will appear here after accounts are created.')
const canPostEvent = computed(() => !user.value || user.value.role === 'client')
function resetFilters() { search.value = ''; specialty.value = ''; region.value = '' }
function initials(name: string) {
	return name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part.charAt(0).toUpperCase()).join('') || 'OR'
}
</script>