<template>
	<div v-if="status === 'pending'" class="mx-auto max-w-7xl animate-pulse px-5 pt-10 sm:px-8" aria-live="polite"
		aria-label="Loading organizer profile">
		<div class="h-64 rounded-2xl bg-gray-200" />
		<div class="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
			<div class="h-72 rounded-2xl bg-gray-200" />
			<div class="h-72 rounded-2xl bg-gray-100" />
		</div>
	</div>
	<div v-else-if="error" class="mx-auto max-w-2xl px-5 py-20 text-center" role="alert">
		<h1 class="text-2xl font-bold">
			We couldn’t load this organizer
		</h1>
		<p class="mt-3 text-sm text-gray-500">
			Check that the NaSeRy API is running, then try again.
		</p>
		<button class="mt-6 rounded-lg bg-primary-700 px-5 py-3 text-sm font-bold text-white" @click="refresh()">
			Try again
		</button>
	</div>
	<div v-else-if="organizer" class="mx-auto max-w-7xl px-5 pt-7 sm:px-8">
		<NuxtLink to="/organizers"
			class="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:underline">
			<span aria-hidden="true">←</span> All organizers
		</NuxtLink>
		<section class="overflow-hidden rounded-2xl border border-gray-200 bg-white">
			<PortfolioCover :color="organizer.banner_color" :label="organizer.name" />
			<div class="flex flex-col justify-between gap-6 p-6 sm:p-8 lg:flex-row lg:items-center">
				<div class="flex items-start gap-4"><span
						class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white"
						:style="{ backgroundColor: organizer.banner_color }">
						{{ initials(organizer.name) }}
					</span>
					<div>
						<h1 class="text-2xl font-bold tracking-tight sm:text-3xl">{{ organizer.name }}</h1>
						<p class="mt-2 text-sm text-gray-500">{{ organizer.location || 'Location not added' }}</p>
						<div class="mt-3 flex flex-wrap gap-2">
							<span v-for="tag in organizer.specialties" :key="tag"
								class="rounded-md bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700">
								{{ tag }}
							</span>
						</div>
						<p v-if="organizer.reviews_count" class="mt-3 text-sm font-semibold text-amber-700">
							★ {{ organizer.average_rating.toFixed(1) }} · {{ organizer.reviews_count }}
							{{
								organizer.reviews_count === 1 ?
									'review' : 'reviews' }}
						</p>
					</div>
				</div>
				<a href="#past-events"
					class="self-start rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold hover:bg-gray-50 lg:self-auto">
					Explore past work ↓
				</a>
			</div>
		</section>
		<div class="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_320px]">
			<div class="space-y-8">
				<section aria-labelledby="about-heading" class="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
					<p class="mb-3 text-xs font-bold uppercase tracking-widest text-primary-700">
						Meet your event team
					</p>
					<h2 id="about-heading" class="text-xl font-bold">
						About {{ organizer.name }}
					</h2>
					<p class="mt-4 text-sm leading-7 text-gray-600">
						{{ organizer.bio || 'This organizer has not added an introduction yet.' }}
					</p>
					<p v-if="organizer.years_experience" class="mt-4 text-sm font-semibold text-primary-800">
						Experience:
						{{ organizer.years_experience }}
					</p>
					<div v-if="organizer.website || organizer.facebook || organizer.instagram"
						class="mt-5 flex flex-wrap gap-4 text-sm font-semibold">
						<a v-if="organizer.website" :href="organizer.website" target="_blank" rel="noopener noreferrer"
							class="text-primary-700 underline">
							Website ↗
						</a>
						<a v-if="organizer.facebook" :href="organizer.facebook" target="_blank"
							rel="noopener noreferrer" class="text-primary-700 underline">
							Facebook ↗
						</a>
						<a v-if="organizer.instagram" :href="organizer.instagram" target="_blank"
							rel="noopener noreferrer" class="text-primary-700 underline">
							Instagram ↗
						</a>
					</div>
				</section>
				<section aria-labelledby="services-heading"
					class="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
					<h2 id="services-heading" class="text-xl font-bold">Services & expertise</h2>
					<p class="mt-2 text-sm text-gray-500">Specialties published by this organizer.</p>
					<div v-if="organizer.specialties.length" class="mt-6 grid gap-3 sm:grid-cols-2">
						<div v-for="(service, index) in organizer.specialties" :key="service"
							class="flex items-center gap-4 rounded-xl bg-primary-50 p-4"><span
								class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-bold text-primary-700">{{
									String(index + 1).padStart(2, '0') }}</span>
							<h3 class="text-sm font-bold">{{ service }}</h3>
						</div>
					</div>
					<p v-else class="mt-6 text-sm text-gray-500">No specialties have been published yet.</p>
					<div v-if="organizer.tags?.length" class="mt-6 flex flex-wrap gap-2"><span
							v-for="tag in organizer.tags" :key="tag"
							class="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600">{{ tag }}</span>
					</div>
				</section>
				<section id="past-events" aria-labelledby="work-heading" class="scroll-mt-6">
					<div class="mb-5 flex items-center justify-between gap-3">
						<h2 id="work-heading" class="text-xl font-bold">Past events & portfolio</h2>
						<span class="text-sm text-gray-500">
							{{ organizer.events.length }} completed
							{{
								organizer.events.length === 1 ?
									'event' : 'events'
							}}
						</span>
					</div>
					<div v-if="organizer.events.length" class="grid gap-5 sm:grid-cols-2">
						<article v-for="event in organizer.events" :key="event.id"
							class="overflow-hidden rounded-xl border border-gray-200 bg-white">
							<PortfolioCover :color="organizer.banner_color" :label="event.title" compact />
							<div class="p-5">
								<p class="text-xs font-semibold text-primary-700">
									{{ event.category }}
									<template v-if="event.year">
										· {{ event.year }}
									</template>
								</p>
								<h3 class="mt-2 font-bold">{{ event.title }}</h3>
								<p v-if="event.venue" class="mt-2 text-xs text-gray-500">{{ event.venue }}</p>
								<details v-if="event.description" class="mt-4 border-t border-gray-100 pt-3">
									<summary class="cursor-pointer text-sm font-semibold text-primary-700">
										Project overview
									</summary>
									<p class="mt-3 text-sm leading-relaxed text-gray-600">{{ event.description }}</p>
								</details>
							</div>
						</article>
					</div>
					<div v-else
						class="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-sm text-gray-500">
						This organizer has not published any completed events yet.
					</div>
				</section>
			</div>
			<aside class="rounded-2xl border border-primary-100 bg-primary-50 p-7 lg:sticky lg:top-6">
				<p class="text-xs font-bold uppercase tracking-widest text-primary-700">
					Your next occasion
				</p>
				<h2 class="mt-4 text-2xl font-bold leading-tight text-primary-900">
					Inspired by what<br />you see?
				</h2>
				<p class="mt-4 text-sm leading-relaxed text-gray-600">
					Tell us about your event to receive offers from matching
					organizers. Posting an inquiry doesn’t book this team.
				</p>
				<template v-if="user?.role !== 'organizer'">
					<NuxtLink to="/client/post-event"
						class="mt-6 block rounded-lg bg-primary-700 px-5 py-3 text-center text-sm font-bold text-white hover:bg-primary-900">
						Post an event inquiry ↗
					</NuxtLink>
					<p class="mt-3 text-center text-xs text-gray-500">
						{{
							user?.role === 'client' ?
								'Share your vision in the inquiry form.' :
								'You’ll be asked to sign in as a client.'
						}}
					</p>
				</template>
				<p v-else class="mt-5 text-sm font-medium text-primary-800">
					Event inquiries are posted from client accounts.
				</p>
				<div class="mt-7 border-t border-primary-200 pt-5">
					<h3 class="text-sm font-semibold">
						Still exploring?
					</h3>
					<NuxtLink to="/organizers" class="mt-2 inline-block text-sm text-primary-700 underline">
						Browse other organizers
					</NuxtLink>
				</div>
			</aside>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useOrganizerPortfolio } from '~/services/organizerPortfolioService'

definePageMeta({ layout: 'public', key: route => route.path })
const route = useRoute()
const identifier = computed(() => String(route.params.slug))
const { data, status, error, refresh } = await useOrganizerPortfolio(identifier)
if (error.value && (error.value.statusCode === 404 || error.value.status === 404)) {
	throw createError({ statusCode: 404, statusMessage: 'Organizer not found' })
}
const organizer = computed(() => data.value?.data)
useSeoMeta({ title: () => `${organizer.value?.name || 'Organizer'} | NaSeRy`, description: () => organizer.value?.bio || 'View this event organizer’s services and completed events.' })
const { user } = useAuth()
function initials(name: string) {
	return name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part.charAt(0).toUpperCase()).join('') || 'OR'
}
</script>