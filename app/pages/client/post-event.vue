<template>
	<div class="mx-auto max-w-6xl pb-12">
		<NuxtLink to="/client/my-events"
			class="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-900">
			<IconBase name="arrow-right" class="h-4 w-4 rotate-180" />
			Back to dashboard
		</NuxtLink>

		<section
			class="relative overflow-hidden rounded-3xl bg-primary-900 px-6 py-8 text-white shadow-sm sm:px-10 sm:py-10">
			<div aria-hidden="true" class="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10" />
			<div aria-hidden="true"
				class="absolute -bottom-32 right-36 h-60 w-60 rounded-full border border-white/10" />
			<div class="relative max-w-2xl">
				<p class="text-xs font-bold uppercase tracking-[.2em] text-primary-200">
					Plan your next occasion
				</p>
				<h1 class="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
					Tell us about your event.
				</h1>
				<p class="mt-3 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
					Share the essentials once. Qualified organizers can review your vision and send offers that fit your
					plans.
				</p>
			</div>
		</section>

		<div class="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
			<form class="space-y-5" @submit.prevent="requestInquirySubmission">
				<section class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
					<div
						class="flex flex-col justify-between gap-4 border-b border-gray-100 bg-gradient-to-r from-primary-50/80 to-white px-5 py-5 sm:flex-row sm:items-center sm:px-7">
						<div class="flex items-center gap-3"><span
								class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-700 text-sm font-extrabold text-white shadow-sm">1</span>
							<div>
								<p class="text-[10px] font-extrabold uppercase tracking-[.16em] text-primary-600">
									Getting started</p>
								<h2 class="mt-0.5 text-xl font-extrabold text-gray-900">Event basics</h2>
								<p class="mt-1 text-sm text-gray-500">Tell us what you are planning and when it will
									happen.</p>
							</div>
						</div>
						<span
							class="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary-100 bg-white px-3 py-1.5 text-xs font-semibold text-primary-700">
							<IconBase name="clock" class="h-3.5 w-3.5" /> Takes about 2 minutes
						</span>
					</div>

					<div class="p-5 sm:p-7">
						<div class="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
							<FormsLabel text="Give your event a name" hint="(optional)" />
							<FormsTextField v-model="form.title" size="lg" placeholder="e.g. Marlo & Rena Wedding"
								class="mt-1" />
						</div>

						<div class="mb-3 mt-6 flex items-end justify-between gap-3">
							<div><label class="block text-sm font-bold text-gray-800">What are you celebrating? <span
										class="text-rose-500">*</span></label>
								<p class="mt-1 text-xs text-gray-400">Select one event type. Click it again to clear
									your choice.</p>
							</div><span v-if="form.eventType"
								class="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">{{
									form.eventType }} selected</span>
						</div>
						<div class="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
							<button v-for="type in eventTypes" :key="type.value" type="button"
								:aria-pressed="form.eventType === type.value"
								class="group relative z-0 flex min-h-[5.25rem] cursor-pointer flex-col items-start justify-between overflow-hidden rounded-xl border p-3 text-left transition"
								:class="form.eventType === type.value
									? 'border-primary-700 bg-primary-700 text-white shadow-md shadow-primary-900/10 -translate-y-0.5'
									: 'border-gray-200 bg-white text-gray-600 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-sm'"
								@click.prevent="toggleEventType(type.value)">
								<span aria-hidden="true"
									class="pointer-events-none absolute -bottom-6 -right-6 h-16 w-16 rounded-full"
									:class="form.eventType === type.value ? 'bg-white/10' : 'bg-primary-50'" />
								<span
									class="pointer-events-none flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
									:class="form.eventType === type.value ? 'bg-white/15 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-primary-50 group-hover:text-primary-700'">
									<IconBase :name="type.icon" class="h-4 w-4" />
								</span>
								<span class="pointer-events-none relative text-sm font-bold">{{ type.value }}</span>
							</button>
						</div>

						<div class="mt-6 rounded-2xl border border-primary-100 bg-primary-50/40 p-4 sm:p-5">
							<div class="mb-4 flex items-center gap-2"><span
									class="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-primary-700 shadow-sm">
									<IconBase name="calendar" class="h-4 w-4" />
								</span>
								<div>
									<h3 class="text-sm font-bold text-gray-900">Schedule</h3>
									<p class="text-xs text-gray-500">Choose a future date and your expected event hours.
									</p>
								</div>
							</div>
							<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
								<div class="sm:col-span-2">
									<FormsLabel text="Event date" required />
									<FormsDateField v-model="form.date" name="event_date"
										placeholder="Choose event date" :min-date="minimumEventDate" />
									<p v-if="form.date" class="mt-1.5 text-xs font-semibold text-primary-700">{{
										formattedEventDate }}</p>
								</div>
								<div>
									<FormsLabel text="Start time" required />
									<FormsTimeField v-model="form.startTime" name="start_time"
										placeholder="Select start time" />
								</div>
								<div>
									<FormsLabel text="End time" required />
									<FormsTimeField v-model="form.endTime" name="end_time" placeholder="Select end time"
										:min-time="form.startTime || undefined" />
								</div>
							</div>
							<p v-if="timeError" class="mt-3 text-xs font-semibold text-rose-600">{{ timeError }}</p>
						</div>

						<div class="mt-5 max-w-sm">
							<FormsLabel text="Expected guests" required />
							<FormsTextField v-model="form.guests" type="number" min="1" icon="users" size="lg"
								placeholder="e.g. 150" required />
							<p class="mt-1.5 text-xs text-gray-400">An estimate is okay—you can update this later.</p>
						</div>
					</div>
				</section>

				<section class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
					<div class="mb-6 flex items-start gap-3">
						<span
							class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-sm font-extrabold text-primary-700">2</span>
						<div>
							<h2 class="text-lg font-bold text-gray-900">Place and budget</h2>
							<p class="mt-1 text-sm text-gray-500">Choose the venue area and a comfortable spending
								range.</p>
						</div>
					</div>

					<div class="space-y-6">
						<div>
							<FormsLabel text="Location" required />
							<div class="relative">
								<IconBase name="map-pin"
									class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
								<input v-model="locationQuery" type="text" autocomplete="off"
									placeholder="Search venue, city, or landmark"
									class="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-20 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15"
									@input="handleLocationInput" @focus="handleLocationFocus" @blur="handleLocationBlur"
									@keydown.down.prevent="moveLocationSuggestion(1)"
									@keydown.up.prevent="moveLocationSuggestion(-1)"
									@keydown.enter.prevent="selectActiveLocationSuggestion"
									@keydown.esc="closeLocationSuggestions">
								<span v-if="isSearchingLocation"
									class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">Searching…</span>
								<div v-if="showLocationSuggestions"
									class="absolute z-30 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl">
									<button v-for="(place, index) in locationSuggestions"
										:key="locationSuggestionKey(place, index)" type="button"
										class="flex w-full items-start gap-3 border-b border-gray-100 px-3.5 py-3 text-left last:border-b-0 hover:bg-gray-50"
										:class="activeLocationSuggestionIndex === index ? 'bg-primary-50' : ''"
										@mousedown.prevent="selectLocation(place)">
										<IconBase name="map-pin" class="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
										<div class="min-w-0">
											<p class="truncate text-sm font-semibold text-gray-800">{{
												place.display_place || place.address?.name || place.display_name }}</p>
											<p v-if="place.display_address"
												class="mt-0.5 line-clamp-2 text-xs text-gray-500">{{
													place.display_address }}</p>
										</div>
									</button>
									<div v-if="!isSearchingLocation && locationSuggestions.length === 0"
										class="px-4 py-3 text-sm text-gray-500">No matching locations found.</div>
									<div
										class="border-t border-gray-100 px-3.5 py-2 text-right text-[11px] text-gray-400">
										Search by LocationIQ</div>
								</div>
							</div>
							<p class="mt-1.5 text-xs text-gray-400">Select a result so nearby organizers can be matched
								accurately.</p>
						</div>
						<div class="border-t border-gray-100 pt-5">
							<div class="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
								<div><label class="block text-sm font-semibold text-gray-700">What is your estimated
										budget? <span class="text-rose-500">*</span></label>
									<p class="mt-1 text-xs text-gray-400">This helps organizers prepare offers that fit
										your plans.</p>
								</div>
								<span v-if="form.budget"
									class="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
									<IconBase name="check-circle" class="h-3.5 w-3.5" /> Budget selected
								</span>
							</div>
							<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="radiogroup"
								aria-label="Budget range">
								<button v-for="option in budgetOptions" :key="option.value" type="button" role="radio"
									:aria-checked="form.budget === option.value"
									class="group relative min-h-[6.25rem] overflow-hidden rounded-2xl border p-4 text-left transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
									:class="form.budget === option.value ? 'border-primary-700 bg-primary-700 text-white shadow-md shadow-primary-900/10 -translate-y-0.5' : 'border-gray-200 bg-white hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-sm'"
									@click="form.budget = form.budget === option.value ? '' : option.value">
									<span aria-hidden="true"
										class="absolute -bottom-7 -right-7 h-20 w-20 rounded-full transition"
										:class="form.budget === option.value ? 'bg-white/10' : 'bg-primary-50 group-hover:bg-primary-100/70'" />
									<span class="block text-[10px] font-extrabold uppercase tracking-[.14em]"
										:class="form.budget === option.value ? 'text-primary-100' : 'text-primary-600'">{{
											option.tier }}</span>
									<span class="mt-2 block pr-7 text-base font-extrabold tracking-tight"
										:class="form.budget === option.value ? 'text-white' : 'text-gray-900'">{{
											option.label }}</span>
									<span class="mt-1 block text-xs leading-4"
										:class="form.budget === option.value ? 'text-white/70' : 'text-gray-400'">{{
											option.hint }}</span>
									<span
										class="absolute right-3.5 top-3.5 flex h-5 w-5 items-center justify-center rounded-full border transition"
										:class="form.budget === option.value ? 'border-white bg-white text-primary-700' : 'border-gray-300 bg-white'">
										<IconBase v-if="form.budget === option.value" name="check-circle"
											class="h-3.5 w-3.5" />
									</span>
								</button>
							</div>
						</div>
					</div>

					<div v-if="locationError"
						class="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{
							locationError }}</div>
					<div v-if="hasSelectedLocation"
						class="mt-5 overflow-hidden rounded-2xl border border-primary-100 bg-primary-50/40">
						<div class="flex items-start gap-3 p-4"><span
								class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-700 text-white">
								<IconBase name="map-pin" class="h-5 w-5" />
							</span>
							<div class="min-w-0 flex-1">
								<div class="flex flex-wrap items-center gap-2">
									<p class="font-semibold text-gray-900">{{ form.venueName || 'Selected location' }}
									</p><span
										class="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">Location
										confirmed</span>
								</div>
								<p class="mt-1 text-sm text-gray-500">{{ form.venueAddress }}</p>
							</div><button type="button"
								class="shrink-0 text-xs font-bold text-primary-700 hover:text-primary-900"
								@click="resetLocation">Change</button>
						</div>
						<div ref="mapContainer" class="h-[280px] w-full border-t border-primary-100 bg-gray-100" />
						<div
							class="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-primary-100 bg-white px-4 py-3 text-xs text-gray-500">
							<span class="flex items-center gap-2"><span
									class="h-2.5 w-2.5 rounded-full bg-primary-700 ring-2 ring-primary-100" />Your
								venue</span><span class="flex items-center gap-2"><span
									class="h-2.5 w-2.5 rounded-full bg-gray-600 ring-2 ring-gray-200" />Nearby
								organizer</span><span class="ml-auto">Map data by LocationIQ &amp; OpenStreetMap</span>
						</div>
					</div>
				</section>

				<section class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
					<div class="mb-6 flex items-start gap-3"><span
							class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-sm font-extrabold text-primary-700">3</span>
						<div>
							<h2 class="text-lg font-bold text-gray-900">Your vision</h2>
							<p class="mt-1 text-sm text-gray-500">A little context helps organizers prepare a more
								useful offer.</p>
						</div>
					</div>
					<label class="mb-1.5 block text-sm font-semibold text-gray-700">Additional details <span
							class="font-normal text-gray-400">(optional)</span></label>
					<textarea v-model="form.details" rows="5"
						placeholder="Describe the mood, theme, must-haves, special requests, or anything else organizers should know…"
						class="w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-sm leading-relaxed text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15" />
				</section>

				<section v-if="hasSelectedLocation"
					class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
					<div class="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
						<div>
							<h2 class="text-lg font-bold text-gray-900">Organizers near your event</h2>
							<p class="mt-1 text-sm text-gray-500">Based on each organizer's service area, ratings, and
								your selected venue.</p>
						</div>
						<div class="flex shrink-0 items-center gap-2"><label
								class="text-xs font-semibold text-gray-500">Search within</label>
							<FormsSelect v-model="nearbyRadiusKm" class="min-w-28" :options="nearbyRadiusOptions"
								:can-clear="false" :searchable="false" @update:model-value="refreshNearbyOrganizers" />
						</div>
					</div>
					<div v-if="!isLoadingNearby && !nearbyError"
						class="mb-4 flex items-center justify-between rounded-xl bg-primary-50 px-4 py-3">
						<p class="text-sm text-primary-900"><span class="font-bold">{{ nearbyOrganizers.length }}</span>
							{{ nearbyOrganizers.length === 1 ? 'organizer' : 'organizers' }} available in this area</p>
						<button type="button" class="text-xs font-bold text-primary-700 hover:text-primary-900"
							@click="refreshNearbyOrganizers">Refresh</button>
					</div>
					<div v-if="isLoadingNearby"
						class="rounded-xl border border-gray-200 bg-gray-50 px-4 py-5 text-center text-sm text-gray-500">
						Searching for nearby organizers…</div>
					<div v-else-if="nearbyError"
						class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">{{
							nearbyError }}</div>
					<div v-else-if="nearbyOrganizers.length === 0"
						class="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center">
						<IconBase name="map-pin" class="mx-auto h-6 w-6 text-gray-400" />
						<p class="mt-2 text-sm font-semibold text-gray-700">No nearby organizers found</p>
						<p class="mt-1 text-xs text-gray-500">You can still submit your inquiry for matching.</p>
					</div>
					<div v-else class="grid gap-3 sm:grid-cols-2">
						<article v-for="organizer in nearbyOrganizers" :key="organizer.id"
							class="flex flex-col rounded-xl border border-gray-200 p-4 transition hover:border-primary-300 hover:shadow-sm">
							<div class="flex items-start gap-3"><span
									class="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary-50 text-sm font-extrabold text-primary-700"><img
										v-if="organizer.avatar_url" :src="organizer.avatar_url"
										:alt="`${organizerDisplayName(organizer)} profile`"
										class="h-full w-full object-cover"><span v-else>{{ organizerInitials(organizer)
										}}</span></span>
								<div class="min-w-0 flex-1">
									<p class="truncate font-bold text-gray-900">{{ organizerDisplayName(organizer) }}
									</p>
									<p v-if="organizer.location" class="mt-0.5 truncate text-xs text-gray-500">{{
										organizer.location }}</p>
									<div class="mt-2 flex flex-wrap items-center gap-3 text-xs"><span
											class="flex items-center gap-1 font-semibold text-gray-800">
											<IconBase name="star" class="h-3.5 w-3.5 fill-amber-400 text-amber-500" />{{
												formatRating(organizer.reviews_avg_rating) }} <span
												class="font-normal text-gray-400">({{ organizer.reviews_count }} {{
													organizer.reviews_count === 1 ? 'review' : 'reviews' }})</span>
										</span><span
											class="rounded-full bg-gray-100 px-2 py-1 font-semibold text-gray-600">{{
												formatDistance(organizer.distance_km) }}</span></div>
								</div>
							</div>
							<div v-if="organizer.specialties?.length" class="mt-3 flex flex-wrap gap-1.5"><span
									v-for="specialty in organizer.specialties.slice(0, 3)" :key="specialty"
									class="rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-semibold text-primary-700">{{
										specialty }}</span></div>
							<NuxtLink :to="organizerProfilePath(organizer)"
								class="mt-4 inline-flex items-center justify-center gap-1.5 rounded-lg border border-primary-200 px-3 py-2 text-xs font-bold text-primary-700 hover:border-primary-700 hover:bg-primary-50">
								View profile and reviews
								<IconBase name="arrow-right" class="h-3.5 w-3.5" />
							</NuxtLink>
						</article>
					</div>
				</section>

				<div v-if="errorMessage"
					class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{ errorMessage }}
				</div>
				<button type="submit"
					class="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-700 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-900 disabled:cursor-not-allowed disabled:opacity-50"
					:disabled="!isValid || isSubmitting">
					<template v-if="isSubmitting">Submitting inquiry…</template><template v-else>
						<IconBase name="send" class="h-4 w-4" />Submit inquiry &amp; find organizers
					</template>
				</button>
			</form>

			<aside class="space-y-4 lg:sticky lg:top-6">
				<div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
					<p class="text-xs font-bold uppercase tracking-widest text-primary-700">Inquiry preview</p>
					<h2 class="mt-3 text-lg font-bold text-gray-900">{{ form.title || form.eventType || 'Your event' }}
					</h2>
					<p class="mt-1 text-sm text-gray-500">Review the essentials as you complete the form.</p>
					<dl class="mt-5 space-y-4 border-t border-gray-100 pt-5 text-sm">
						<div class="flex items-start justify-between gap-3">
							<dt class="text-gray-400">Type</dt>
							<dd class="text-right font-semibold text-gray-800">{{ form.eventType || 'Not selected' }}
							</dd>
						</div>
						<div class="flex items-start justify-between gap-3">
							<dt class="text-gray-400">Date</dt>
							<dd class="text-right font-semibold text-gray-800">{{ form.date || 'Not selected' }}</dd>
						</div>
						<div class="flex items-start justify-between gap-3">
							<dt class="text-gray-400">Time</dt>
							<dd class="text-right font-semibold text-gray-800">{{ form.startTime && form.endTime ?
								`${formatTime(form.startTime)} – ${formatTime(form.endTime)}` : 'Not selected' }}</dd>
						</div>
						<div class="flex items-start justify-between gap-3">
							<dt class="text-gray-400">Guests</dt>
							<dd class="text-right font-semibold text-gray-800">
								{{ form.guests || 'Not set' }}
							</dd>
						</div>
						<div class="flex items-start justify-between gap-3">
							<dt class="text-gray-400">Budget</dt>
							<dd class="text-right font-semibold text-gray-800">
								{{ form.budget || 'Not selected' }}
							</dd>
						</div>
						<div class="flex items-start justify-between gap-3">
							<dt class="text-gray-400">Location</dt>
							<dd class="max-w-[11rem] text-right font-semibold text-gray-800">
								{{ form.venueName || 'Not selected' }}
							</dd>
						</div>
					</dl>
				</div>
				<div class="rounded-2xl border border-primary-100 bg-primary-50 p-5">
					<div class="flex gap-3"><span
							class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-primary-700">
							<IconBase name="check-circle" class="h-4 w-4" />
						</span>
						<div>
							<h3 class="text-sm font-bold text-primary-900">No booking commitment</h3>
							<p class="mt-1 text-xs leading-relaxed text-primary-800/70">Submitting lets organizers send
								offers. You
								choose whether to accept one.</p>
						</div>
					</div>
				</div>
			</aside>
		</div>

		<FormsConfirmationModal :open="showSubmitConfirmation" eyebrow="Ready to send"
			title="Submit this event inquiry?"
			description="Nearby organizers will be able to review these details and send you quotations. You can compare every offer before choosing one."
			confirm-label="Yes, submit inquiry" cancel-label="Keep editing" loading-label="Submitting inquiry..."
			:loading="isSubmitting" @cancel="showSubmitConfirmation = false" @confirm="submitInquiry">
			<div class="rounded-2xl border border-gray-200 bg-gray-50 p-4">
				<p class="truncate font-extrabold text-gray-900">{{ form.title || `${form.eventType} event` }}</p>
				<div class="mt-3 grid grid-cols-2 gap-3 text-xs">
					<div><p class="text-gray-400">Schedule</p><p class="mt-1 font-bold text-gray-700">{{ formattedEventDate }}</p></div>
					<div><p class="text-gray-400">Guests</p><p class="mt-1 font-bold text-gray-700">{{ form.guests }}</p></div>
					<div class="col-span-2"><p class="text-gray-400">Venue</p><p class="mt-1 line-clamp-2 font-bold text-gray-700">{{ form.venueName || form.venueAddress }}</p></div>
				</div>
			</div>
		</FormsConfirmationModal>

		<FormsConfirmationModal :open="showSubmissionSuccess" variant="success" eyebrow="Inquiry submitted"
			title="Your event is ready for matching"
			description="Organizers can now review your inquiry and send quotations. Track new offers from My Events."
			confirm-label="Go to My Events" :show-cancel="false" @cancel="goToMyEvents" @confirm="goToMyEvents">
			<div class="flex items-start gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-800">
				<IconBase name="check-circle" class="mt-0.5 h-5 w-5 shrink-0" />
				<p class="text-sm font-semibold leading-6">Your inquiry was saved successfully. There is no booking commitment until you accept an organizer's quotation.</p>
			</div>
		</FormsConfirmationModal>
	</div>
</template>

<script setup lang="ts">
import 'leaflet/dist/leaflet.css'

import type {
	CreateInquiryPayload,
	CreateInquiryResponse,
} from '~/types/inquiry'

import type {
	NearbyOrganizer,
	NearbyOrganizersResponse,
} from '~/types/organizer'

type LocationIqResult = {
	place_id?: string | number
	osm_id?: string | number
	osm_type?: string
	lat: string
	lon: string
	display_name: string
	display_place?: string
	display_address?: string
	address?: {
		name?: string
		[key: string]: unknown
	}
}

definePageMeta({
	layout: 'client',
})

const {
	token,
} = useAuth()

const config = useRuntimeConfig()

const mapContainer =
	ref<HTMLElement | null>(null)

const isSubmitting =
	ref(false)

const showSubmitConfirmation = ref(false)
const showSubmissionSuccess = ref(false)

const errorMessage =
	ref('')

const locationError =
	ref('')

const nearbyError =
	ref('')

const isLoadingNearby =
	ref(false)

const nearbyOrganizers =
	ref<NearbyOrganizer[]>([])

const locationQuery =
	ref('')

const locationSuggestions =
	ref<LocationIqResult[]>([])

const isSearchingLocation =
	ref(false)

const isLocationInputFocused =
	ref(false)

const activeLocationSuggestionIndex =
	ref(-1)

const nearbyRadiusKm = ref(25)
const locationSearchDelayMs = 400

let locationSearchTimer:
	ReturnType<typeof setTimeout> | null = null

let locationSearchController:
	AbortController | null = null

let leafletModule:
	any = null

let leafletMap:
	any = null


let leafletMarkers:
	any[] = []

const eventTypes = [
	{
		value: 'Wedding',
		icon: 'heart',
	},
	{
		value: 'Corporate',
		icon: 'briefcase',
	},
	{
		value: 'Birthday',
		icon: 'gift',
	},
	{
		value: 'Debut',
		icon: 'star',
	},
	{
		value: 'Concert',
		icon: 'music',
	},
	{
		value: 'Conference',
		icon: 'users',
	},
	{
		value: 'Reunion',
		icon: 'users',
	},
	{
		value: 'Seminar',
		icon: 'award',
	},
]

const budgetOptions = [
	{ value: 'Under ₱50,000', tier: 'Essential', label: 'Under ₱50K', hint: 'For simple, meaningful occasions' },
	{ value: '₱50,000 – ₱150,000', tier: 'Intimate', label: '₱50K – ₱150K', hint: 'For intimate, styled celebrations' },
	{ value: '₱150,000 – ₱300,000', tier: 'Signature', label: '₱150K – ₱300K', hint: 'For complete event experiences' },
	{ value: '₱300,000 – ₱500,000', tier: 'Grand', label: '₱300K – ₱500K', hint: 'For larger guest lists and details' },
	{ value: '₱500,000 – ₱800,000', tier: 'Premium', label: '₱500K – ₱800K', hint: 'For elevated event productions' },
	{ value: 'Over ₱800,000', tier: 'Luxury', label: 'Over ₱800K', hint: 'For bespoke, large-scale occasions' },
]

const nearbyRadiusOptions = [
	{ value: 10, label: '10 km' },
	{ value: 25, label: '25 km' },
	{ value: 50, label: '50 km' },
	{ value: 100, label: '100 km' },
]

const form = reactive({
	title: '',
	eventType: '',
	date: '',
	startTime: '',
	endTime: '',

	location: '',
	venueName: '',
	venueAddress: '',
	locationIqPlaceId: '',
	latitude: null as number | null,
	longitude: null as number | null,

	guests: '',
	budget: '',
	details: '',
})

function toggleEventType(eventType: string) {
	form.eventType = form.eventType === eventType
		? ''
		: eventType
}

const locationIqApiKey =
	computed(() => {
		return String(
			config.public
				.locationIqApiKey
			|| ''
		)
	})

const hasSelectedLocation =
	computed(() => {
		return Boolean(
			form.venueAddress &&
			form.locationIqPlaceId &&
			form.latitude !== null &&
			form.longitude !== null
		)
	})

const isValid =
	computed(() => {
		return Boolean(
			form.eventType &&
			form.date &&
			form.startTime &&
			form.endTime &&
			!timeError.value &&
			hasSelectedLocation.value &&
			form.guests &&
			Number(form.guests) > 0 &&
			form.budget
		)
	})

const minimumEventDate = computed(() => {
	const now = new Date()
	const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
	return localDate.toISOString().slice(0, 10)
})

const formattedEventDate = computed(() => {
	if (!form.date) return ''
	return new Intl.DateTimeFormat('en-PH', { dateStyle: 'full' }).format(new Date(`${form.date}T00:00:00`))
})

const timeError = computed(() => {
	if (!form.startTime || !form.endTime) return ''
	return form.endTime <= form.startTime ? 'End time must be later than start time.' : ''
})

const showLocationSuggestions =
	computed(() => {
		return Boolean(
			isLocationInputFocused.value &&
			locationQuery.value.trim().length >= 3 &&
			(
				isSearchingLocation.value ||
				locationSuggestions.value.length > 0
			)
		)
	})

onMounted(() => {
	if (!locationIqApiKey.value) {
		locationError.value =
			'LocationIQ API key is not configured.'
	}
})

onBeforeUnmount(() => {
	if (locationSearchTimer) {
		clearTimeout(locationSearchTimer)
		locationSearchTimer = null
	}

	locationSearchController?.abort()
	locationSearchController = null

	clearMarkers()

	if (leafletMap) {
		leafletMap.remove()
		leafletMap = null
	}
})

function handleLocationFocus() {
	isLocationInputFocused.value = true
}

function handleLocationBlur() {
	window.setTimeout(() => {
		isLocationInputFocused.value = false
		activeLocationSuggestionIndex.value = -1
	}, 150)
}

function closeLocationSuggestions() {
	isLocationInputFocused.value = false
	activeLocationSuggestionIndex.value = -1
}

function handleLocationInput() {
	locationError.value = ''
	activeLocationSuggestionIndex.value = -1

	if (
		hasSelectedLocation.value &&
		locationQuery.value.trim() !== form.venueAddress
	) {
		clearSelectedLocation()
	}

	if (locationSearchTimer) {
		clearTimeout(locationSearchTimer)
		locationSearchTimer = null
	}

	locationSearchController?.abort()
	locationSearchController = null

	const query =
		locationQuery.value.trim()

	if (query.length < 3) {
		locationSuggestions.value = []
		isSearchingLocation.value = false
		return
	}

	if (!locationIqApiKey.value) {
		locationError.value =
			'LocationIQ API key is not configured.'
		return
	}

	locationSearchTimer =
		setTimeout(() => {
			void searchLocations(query)
		}, locationSearchDelayMs)
}

async function searchLocations(
	query: string
) {
	locationSearchController?.abort()

	const controller =
		new AbortController()

	locationSearchController =
		controller

	isSearchingLocation.value = true
	locationError.value = ''

	try {
		const params =
			new URLSearchParams({
				key:
					locationIqApiKey.value,
				q:
					query,
				countrycodes:
					'ph',
				limit:
					'7',
				normalizecity:
					'1',
				dedupe:
					'1',
				'accept-language':
					'en',
			})

		const response =
			await fetch(
				`https://api.locationiq.com/v1/autocomplete?${params.toString()}`,
				{
					signal:
						controller.signal,
				}
			)

		if (response.status === 404) {
			locationSuggestions.value = []
			return
		}

		if (!response.ok) {
			throw new Error(
				`LocationIQ request failed with status ${response.status}.`
			)
		}

		const data =
			await response.json()

		locationSuggestions.value =
			Array.isArray(data)
				? data as LocationIqResult[]
				: []

		activeLocationSuggestionIndex.value =
			locationSuggestions.value.length
				? 0
				: -1

	} catch (error: unknown) {
		if (
			error instanceof DOMException &&
			error.name === 'AbortError'
		) {
			return
		}

		console.error(
			'LocationIQ autocomplete failed:',
			error
		)

		locationSuggestions.value = []
		locationError.value =
			'Unable to search locations. Please check your LocationIQ configuration.'

	} finally {
		if (
			locationSearchController === controller
		) {
			isSearchingLocation.value = false
			locationSearchController = null
		}
	}
}

function moveLocationSuggestion(
	direction: number
) {
	const total =
		locationSuggestions.value.length

	if (!total) {
		return
	}

	isLocationInputFocused.value = true

	const next =
		activeLocationSuggestionIndex.value +
		direction

	if (next < 0) {
		activeLocationSuggestionIndex.value =
			total - 1
		return
	}

	if (next >= total) {
		activeLocationSuggestionIndex.value = 0
		return
	}

	activeLocationSuggestionIndex.value =
		next
}

function selectActiveLocationSuggestion() {
	const index =
		activeLocationSuggestionIndex.value

	if (
		index < 0 ||
		!locationSuggestions.value[index]
	) {
		return
	}

	void selectLocation(
		locationSuggestions.value[index]
	)
}

function locationSuggestionKey(
	place: LocationIqResult,
	index: number
): string {
	return String(
		place.place_id
		|| `${place.osm_type || 'place'}:${place.osm_id || index}`
	)
}

async function selectLocation(
	place: LocationIqResult
) {
	const latitude =
		Number(place.lat)

	const longitude =
		Number(place.lon)

	if (
		!Number.isFinite(latitude) ||
		!Number.isFinite(longitude)
	) {
		locationError.value =
			'The selected location does not contain valid coordinates.'
		return
	}

	const venueName =
		String(
			place.display_place
			|| place.address?.name
			|| place.display_name
			|| 'Selected Location'
		)

	const venueAddress =
		String(
			place.display_name
			|| [
				place.display_place,
				place.display_address,
			]
				.filter(Boolean)
				.join(', ')
			|| venueName
		)

	form.location =
		venueAddress

	form.venueName =
		venueName

	form.venueAddress =
		venueAddress

	form.locationIqPlaceId =
		String(
			place.place_id
			|| `${place.osm_type || 'place'}:${place.osm_id || ''}`
		)

	form.latitude =
		latitude

	form.longitude =
		longitude

	locationQuery.value =
		venueAddress

	locationSuggestions.value = []
	activeLocationSuggestionIndex.value = -1
	isLocationInputFocused.value = false
	locationError.value = ''
	nearbyError.value = ''
	nearbyOrganizers.value = []

	await nextTick()
	await renderMap()
	await fetchNearbyOrganizers()
	await renderMap()
}

function clearSelectedLocation() {
	form.location = ''
	form.venueName = ''
	form.venueAddress = ''
	form.locationIqPlaceId = ''
	form.latitude = null
	form.longitude = null

	nearbyOrganizers.value = []
	nearbyError.value = ''

	clearMarkers()

	if (leafletMap) {
		leafletMap.remove()
		leafletMap = null
	}
}

function resetLocation() {
	locationQuery.value = ''
	locationSuggestions.value = []
	locationError.value = ''
	clearSelectedLocation()

	nextTick(() => {
		const input = document.querySelector<HTMLInputElement>(
			'input[placeholder="Search venue, city, or landmark"]'
		)

		input?.focus()
	})
}

async function refreshNearbyOrganizers() {
	await fetchNearbyOrganizers()
	await nextTick()
	await renderMap()
}

async function fetchNearbyOrganizers() {
	if (
		form.latitude === null ||
		form.longitude === null
	) {
		return
	}

	if (!token.value) {
		nearbyError.value =
			'You are not authenticated.'
		return
	}

	isLoadingNearby.value = true
	nearbyError.value = ''

	try {
		const response =
			await $fetch<NearbyOrganizersResponse>(
				`${config.public.apiBaseURL}/organizers/nearby`,
				{
					method: 'GET',

					headers: {
						Accept:
							'application/json',

						Authorization:
							`Bearer ${token.value}`,
					},

					query: {
						lat:
							form.latitude,

						lng:
							form.longitude,

						radius:
							nearbyRadiusKm.value,
					},
				}
			)

		nearbyOrganizers.value =
			response.data.organizers

	} catch (error: unknown) {
		console.error(
			'Failed to retrieve nearby organizers:',
			error
		)

		nearbyOrganizers.value = []

		const apiError =
			error as {
				data?: {
					message?: string
				}
			}

		nearbyError.value =
			apiError
				?.data
				?.message
			|| 'Unable to retrieve nearby organizers.'

	} finally {
		isLoadingNearby.value = false
	}
}

async function loadLeaflet() {
	if (leafletModule) {
		return leafletModule
	}

	if (!import.meta.client) {
		throw new Error(
			'Leaflet can only load in the browser.'
		)
	}

	const module =
		await import('leaflet')

	leafletModule =
		(module as any).default
		|| module

	return leafletModule
}

async function renderMap() {
	if (
		!mapContainer.value ||
		form.latitude === null ||
		form.longitude === null
	) {
		return
	}

	if (!locationIqApiKey.value) {
		locationError.value =
			'LocationIQ API key is not configured.'
		return
	}

	try {
		const L =
			await loadLeaflet()

		const center:
			[number, number] = [
				Number(form.latitude),
				Number(form.longitude),
			]

		if (!leafletMap) {
			leafletMap =
				L.map(
					mapContainer.value,
					{
						zoomControl:
							true,
					}
				)
					.setView(
						center,
						14
					)

			L.tileLayer(
				`https://{s}-tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${encodeURIComponent(locationIqApiKey.value)}`,
				{
					maxZoom:
						18,

					attribution:
						'&copy; <a href="https://locationiq.com" target="_blank" rel="noopener noreferrer">LocationIQ</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
				}
			)
				.addTo(
					leafletMap
				)
		} else {
			leafletMap.setView(
				center,
				14
			)
		}

		clearMarkers()

		const bounds =
			L.latLngBounds([
				center,
			])

		const venueMarker =
			L.circleMarker(
				center,
				{
					radius:
						9,
					weight:
						3,
					color:
						'#285F6b',
					fillColor:
						'#285F6b',
					fillOpacity:
						1,
				}
			)
				.addTo(
					leafletMap
				)
				.bindPopup(
					`<div style="padding:4px"><strong>${escapeHtml(
						form.venueName || 'Selected Venue'
					)}</strong><br><span>${escapeHtml(
						form.venueAddress
					)}</span></div>`
				)

		leafletMarkers.push(
			venueMarker
		)

		for (
			const organizer
			of nearbyOrganizers.value
		) {
			const position:
				[number, number] = [
					Number(
						organizer.latitude
					),
					Number(
						organizer.longitude
					),
				]

			if (
				!Number.isFinite(position[0]) ||
				!Number.isFinite(position[1])
			) {
				continue
			}

			const name =
				escapeHtml(
					organizerDisplayName(
						organizer
					)
				)

			const rating =
				formatRating(
					organizer.reviews_avg_rating
				)

			const distance =
				formatDistance(
					organizer.distance_km
				)

			const marker =
				L.circleMarker(
					position,
					{
						radius:
							7,
						weight:
							2,
						color:
							'#ffffff',
						fillColor:
							'#4b5563',
						fillOpacity:
							1,
					}
				)
					.addTo(
						leafletMap
					)
					.bindPopup(
						`<div style="padding:4px;min-width:180px"><strong>${name}</strong><div style="margin-top:5px">★ ${rating} (${organizer.reviews_count} reviews)</div><div style="margin-top:3px">${distance}</div></div>`
					)

			leafletMarkers.push(
				marker
			)

			bounds.extend(
				position
			)
		}

		if (
			nearbyOrganizers.value.length
		) {
			leafletMap.fitBounds(
				bounds,
				{
					padding:
						[45, 45],
					maxZoom:
						14,
				}
			)
		} else {
			leafletMap.setView(
				center,
				14
			)
		}

		window.setTimeout(() => {
			leafletMap
				?.invalidateSize()
		}, 0)

	} catch (error) {
		console.error(
			'Failed to display LocationIQ map:',
			error
		)

		locationError.value =
			'Unable to display the LocationIQ map.'
	}
}

function clearMarkers() {
	for (
		const marker
		of leafletMarkers
	) {
		marker.remove()
	}

	leafletMarkers = []
}

type OrganizerWithIdentity =
	NearbyOrganizer & {
		display_name?: string | null
		full_name?: string | null
		user?: {
			firstname?: string | null
			middlename?: string | null
			lastname?: string | null
		} | null
	}

function organizerInitials(
	organizer: NearbyOrganizer
): string {
	return organizerDisplayName(organizer)
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part.charAt(0))
		.join('')
		.toUpperCase()
}

function organizerProfilePath(
	organizer: NearbyOrganizer
): string {
	return `/organizers/${organizer.slug || organizer.id}`
}

function organizerFullName(
	organizer: NearbyOrganizer
): string {
	const record =
		organizer as OrganizerWithIdentity

	const backendFullName =
		String(
			record.full_name || ''
		).trim()

	if (backendFullName) {
		return backendFullName
	}

	return [
		record.user?.firstname,
		record.user?.middlename,
		record.user?.lastname,
	]
		.filter((value) =>
			Boolean(
				String(value || '').trim()
			)
		)
		.map((value) =>
			String(value).trim()
		)
		.join(' ')
}

function organizerDisplayName(
	organizer: NearbyOrganizer
): string {
	const record =
		organizer as OrganizerWithIdentity

	const backendDisplayName =
		String(
			record.display_name || ''
		).trim()

	if (backendDisplayName) {
		return backendDisplayName
	}

	const companyName =
		String(
			organizer.company_name || ''
		).trim()

	if (companyName) {
		return companyName
	}

	const fullName =
		organizerFullName(
			organizer
		)

	if (fullName) {
		return fullName
	}

	return 'Organizer'
}

function formatRating(
	value:
		number
		| string
		| null
		| undefined
): string {
	const rating =
		Number(
			value || 0
		)

	return rating.toFixed(1)
}

function formatTime(value: string): string {
	const [hours, minutes] = value.split(':').map(Number)

	if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
		return value
	}

	return new Intl.DateTimeFormat('en-PH', {
		hour: 'numeric',
		minute: '2-digit',
	}).format(new Date(2000, 0, 1, hours, minutes))
}

function formatDistance(
	value:
		number
		| string
): string {
	const distance =
		Number(value)

	if (
		!Number.isFinite(
			distance
		)
	) {
		return ''
	}

	if (distance < 1) {
		return `${Math.round(
			distance * 1000
		)} m away`
	}

	return `${distance.toFixed(1)} km away`
}

function escapeHtml(
	value: string
): string {
	return value
		.replaceAll(
			'&',
			'&amp;'
		)
		.replaceAll(
			'<',
			'&lt;'
		)
		.replaceAll(
			'>',
			'&gt;'
		)
		.replaceAll(
			'"',
			'&quot;'
		)
		.replaceAll(
			"'",
			'&#039;'
		)
}

function requestInquirySubmission() {
	if (!isValid.value) {
		errorMessage.value =
			'Please complete all required fields and select a valid location.'

		return
	}

	errorMessage.value = ''
	showSubmitConfirmation.value = true
}

function goToMyEvents() {
	showSubmissionSuccess.value = false
	navigateTo('/client/my-events')
}

async function submitInquiry() {
	if (!isValid.value) {
		showSubmitConfirmation.value = false
		errorMessage.value =
			'Please complete all required fields and select a valid location.'

		return
	}

	if (!token.value) {
		showSubmitConfirmation.value = false
		errorMessage.value =
			'You are not authenticated.'

		return
	}

	if (
		form.latitude === null ||
		form.longitude === null
	) {
		showSubmitConfirmation.value = false
		errorMessage.value =
			'Please select a valid location.'

		return
	}

	isSubmitting.value = true
	errorMessage.value = ''

	try {
		const payload:
			CreateInquiryPayload = {
			event_type:
				form.eventType,

			event_date:
				form.date,

			start_time:
				form.startTime,

			end_time:
				form.endTime,

			location:
				form.location,

			venue_name:
				form.venueName
				|| undefined,

			venue_address:
				form.venueAddress,

			// Kept for compatibility with the current backend contract.
			// This now contains the LocationIQ place_id, not a Google Place ID.
			google_place_id:
				form.locationIqPlaceId,

			latitude:
				form.latitude,

			longitude:
				form.longitude,

			expected_guests:
				Number(
					form.guests
				),

			budget_range:
				form.budget,
		}

		if (
			form.title.trim()
		) {
			payload.event_title =
				form.title.trim()
		}

		if (
			form.details.trim()
		) {
			payload.additional_details =
				form.details.trim()
		}

		await $fetch<CreateInquiryResponse>(
			`${config.public.apiBaseURL}/inquiries`,
			{
				method: 'POST',

				headers: {
					Accept:
						'application/json',

					'Content-Type':
						'application/json',

					Authorization:
						`Bearer ${token.value}`,
				},

				body:
					payload,
			}
		)

		showSubmitConfirmation.value = false
		showSubmissionSuccess.value = true

	} catch (error: unknown) {
		console.error(
			'Failed to submit inquiry:',
			error
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

		if (
			apiError
				?.data
				?.errors
		) {
			const firstError =
				Object
					.values(
						apiError
							.data
							.errors
					)
					.flat()
					.at(0)

			if (firstError) {
				errorMessage.value =
					String(
						firstError
					)

				return
			}
		}
		errorMessage.value =
			apiError
				?.data
				?.message
			|| 'Unable to submit your inquiry. Please try again.'

	} finally {
		isSubmitting.value = false
	}
}
</script>
