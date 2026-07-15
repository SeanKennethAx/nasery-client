<template>
	<div>
		<div class="mb-6 flex items-start gap-3 rounded-xl bg-primary-50 p-4 text-sm text-gray-700">
			<IconBase name="bell" class="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />
			<p>You only see inquiries that match your <strong>service tags</strong> and <strong>operation area</strong>.
				Submit detailed offers to win events.</p>
		</div>

		<div class="space-y-5">
			<div v-for="inquiry in inquiries" :key="inquiry.title"
				class="rounded-2xl border border-gray-200 bg-white p-6">
				<div class="flex items-start justify-between">
					<div>
						<div class="flex items-center gap-2">
							<h3 class="text-lg font-bold text-gray-900">
								{{ inquiry.title }}</h3>
							<span
								class="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">
								<IconBase name="check-circle" class="h-3.5 w-3.5" />
								Matched
							</span>
						</div>
						<div class="mt-1 text-sm text-gray-400">
							Posted by <span class="font-semibold text-gray-600">{{ inquiry.postedBy }}</span> &bull; {{
								inquiry.date }}
						</div>
					</div>
					<span
						class="shrink-0 rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-500">
						{{ inquiry.offers }} offers
					</span>
				</div>

				<p class="mt-3 text-sm text-gray-600">
					{{ inquiry.description }}
				</p>
				<p class="mt-1 text-sm font-medium text-primary-700">
					Matches: {{ inquiry.matches }}
				</p>

				<div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
					<div class="rounded-lg bg-gray-50 p-3">
						<div class="flex items-center gap-1.5 text-xs text-gray-500">
							<IconBase name="calendar" class="h-3.5 w-3.5" />
							Event Date
						</div>
						<div class="mt-1 text-sm font-bold text-gray-900">
							{{ inquiry.eventDate }}
						</div>
					</div>
					<div class="rounded-lg bg-gray-50 p-3">
						<div class="flex items-center gap-1.5 text-xs text-gray-500">
							<IconBase name="map-pin" class="h-3.5 w-3.5" />
							Location
						</div>
						<div class="mt-1 text-sm font-bold text-gray-900">
							{{ inquiry.location }}
							'</div>
					</div>
					<div class="rounded-lg bg-gray-50 p-3">
						<div class="flex items-center gap-1.5 text-xs text-gray-500">
							<IconBase name="users" class="h-3.5 w-3.5" />
							Guests
						</div>
						<div class="mt-1 text-sm font-bold text-gray-900">
							{{ inquiry.guests }}</div>
					</div>
					<div class="rounded-lg bg-gray-50 p-3">
						<div class="flex items-center gap-1.5 text-xs text-gray-500">
							<IconBase name="cash" class="h-3.5 w-3.5" />
							Budget
						</div>
						<div class="mt-1 text-sm font-bold text-gray-900">
							{{ inquiry.budget }}
						</div>
					</div>
				</div>

				<div class="mt-4">
					<div class="mb-2 text-xs font-semibold tracking-wide text-gray-400">
						REQUIREMENTS
					</div>
					<div class="flex flex-wrap gap-2">
						<span v-for="req in inquiry.requirements" :key="req"
							class="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600">
							{{ req }}
						</span>
					</div>
				</div>

				<div class="mt-5 flex gap-3">
					<button type="button"
						class="flex items-center gap-2 rounded-xl bg-primary-700 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-900"
						@click="openOfferForm(inquiry)">
						<IconBase name="send" class="h-4 w-4" />
						Submit Offer
					</button>
					<button type="button"
						class="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
						<IconBase name="message" class="h-4 w-4" />
						Ask Question
					</button>
				</div>
			</div>
		</div>

		<Transition name="fade">
			<div v-if="showOfferForm" class="fixed inset-0 z-40 bg-gray-900/40" @click="closeOfferForm" />
		</Transition>

		<Transition name="slide">
			<div v-if="showOfferForm"
				class="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl">
				<div class="flex shrink-0 items-start justify-between border-b border-gray-200 px-6 py-5">
					<div class="flex items-start gap-3">
						<div
							class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-700 text-white">
							<IconBase name="file-text" class="h-5 w-5" />
						</div>
						<div>
							<h2 class="text-base font-bold text-gray-900">
								New Inquiry Form
							</h2>
							<p class="text-sm text-gray-500">
								Fill in your event offer details</p>
						</div>
					</div>
					<button type="button" class="text-gray-400 hover:text-gray-600" @click="closeOfferForm">
						<IconBase name="x" class="h-5 w-5" />
					</button>
				</div>

				<div class="flex-1 overflow-y-auto px-6 py-5">
					<div class="mb-2 flex items-center gap-2 text-xs font-semibold tracking-wide text-gray-400">
						<IconBase name="calendar" class="h-3.5 w-3.5" />
						EVENT INFORMATION
					</div>

					<label class="mb-1.5 mt-4 block text-sm font-semibold text-gray-700">
						Event / Inquiry Title *
					</label>
					<input v-model="offerForm.title" type="text"
						class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15" />

					<div class="mt-4 grid grid-cols-2 gap-3">
						<div>
							<label class="mb-1.5 block text-sm font-semibold text-gray-700">
								Event Type *</label>
							<select v-model="offerForm.eventType"
								class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15">
								<option v-for="type in eventTypes" :key="type" :value="type">{{ type }}</option>
							</select>
						</div>
						<div>
							<label class="mb-1.5 block text-sm font-semibold text-gray-700">Event Date *</label>
							<input v-model="offerForm.eventDate" type="date"
								class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15" />
						</div>
					</div>

					<div class="mt-4 grid grid-cols-2 gap-3">
						<div>
							<label class="mb-1.5 block text-sm font-semibold text-gray-700">
								Location / Area *
							</label>
							<div class="relative">
								<IconBase name="map-pin"
									class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
								<input v-model="offerForm.location" type="text" placeholder="e.g. Davao City"
									class="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15" />
							</div>
						</div>
						<div>
							<label class="mb-1.5 block text-sm font-semibold text-gray-700">
								Expected Guests
							</label>
							<div class="relative">
								<IconBase name="users"
									class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
								<input v-model="offerForm.guests" type="number" placeholder="e.g. 250"
									class="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15" />
							</div>
						</div>
					</div>

					<label class="mb-1.5 mt-4 block text-sm font-semibold text-gray-700">
						Your Quoted Budget / Price Range *
					</label>
					<div class="relative">
						<IconBase name="cash"
							class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
						<input v-model="offerForm.budget" type="text" placeholder="e.g. ₱150,000 – ₱250,000"
							class="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15" />
					</div>

					<div class="mb-2 mt-6 flex items-center gap-2 text-xs font-semibold tracking-wide text-gray-400">
						<IconBase name="tag" class="h-3.5 w-3.5" /> PACKAGE DETAILS
					</div>

					<p class="mb-2 text-xs text-gray-400">
						Quick-fill from template
					</p>
					<div class="space-y-2">
						<button v-for="template in packageTemplates" :key="template" type="button"
							class="flex w-full items-center justify-between rounded-xl border border-gray-200 px-3.5 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
							@click="applyTemplate(template)">
							{{ template }}
							<span class="text-xs font-semibold text-primary-700">
								Apply &rarr;
							</span>
						</button>
					</div>

					<label class="mb-1.5 mt-4 block text-sm font-semibold text-gray-700">
						Package / Offer Name
					</label>
					<input v-model="offerForm.packageName" type="text"
						placeholder="e.g. Full Coordination Premium Package"
						class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15" />

					<label class="mb-1.5 mt-4 block text-sm font-semibold text-gray-700">
						Timeline / Lead Time
					</label>
					<div class="relative">
						<IconBase name="clock"
							class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
						<input v-model="offerForm.timeline" type="text"
							placeholder="e.g. Full coordination · 3 months lead time"
							class="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15" />
					</div>

					<label class="mb-1.5 mt-4 block text-sm font-semibold text-gray-700">
						Inclusions / Services
					</label>
					<div class="space-y-2">
						<input v-for="(inclusion, i) in offerForm.inclusions" :key="i" v-model="offerForm.inclusions[i]"
							type="text" :placeholder="`Inclusion ${i + 1}`"
							class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15" />
					</div>
					<button type="button" class="mt-2 flex items-center gap-1 text-sm font-semibold text-primary-700"
						@click="addInclusion">
						<IconBase name="plus" class="h-3.5 w-3.5" />
						Add Inclusion
					</button>

					<div class="mb-2 mt-6 flex items-center gap-2 text-xs font-semibold tracking-wide text-gray-400">
						<IconBase name="cash" class="h-3.5 w-3.5" />
						COST BREAKDOWN
					</div>
					<div class="space-y-2">
						<div v-for="(line, i) in offerForm.costBreakdown" :key="i" class="flex gap-2">
							<input v-model="line.label" type="text" placeholder="e.g. Venue rental"
								class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15" />
							<input v-model="line.amount" type="text" placeholder="₱0"
								class="w-32 shrink-0 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15" />
						</div>
					</div>
					<button type="button" class="mt-2 flex items-center gap-1 text-sm font-semibold text-primary-700"
						@click="addLineItem">
						<IconBase name="plus" class="h-3.5 w-3.5" />
						Add Line Item
					</button>

					<div class="mb-2 mt-6 flex items-center gap-2 text-xs font-semibold tracking-wide text-gray-400">
						<IconBase name="message" class="h-3.5 w-3.5" />
						COVER MESSAGE
					</div>
					<label class="mb-1.5 block text-sm font-semibold text-gray-700">
						Your pitch to the client
					</label>
					<textarea v-model="offerForm.pitch" rows="4"
						placeholder="Introduce yourself and explain why you're the best fit for this event..."
						class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15" />
				</div>

				<div class="flex shrink-0 gap-3 border-t border-gray-200 px-6 py-4">
					<button type="button"
						class="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
						@click="closeOfferForm">
						Cancel
					</button>
					<button type="button"
						class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-900"
						@click="submitOffer">
						<IconBase name="send" class="h-4 w-4" />
						Submit Inquiry
					</button>
				</div>
			</div>
		</Transition>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const eventTypes = ['Corporate Event', 'Wedding', 'Birthday Party', 'Social Event', 'Product Launch', 'Conference', 'Other']

const packageTemplates = ['Full Coordination Package', 'Premium AV & Entertainment', 'Catering & Food Services']

const showOfferForm = ref(false)

function emptyOfferForm() {
	return {
		title: '',
		eventType: eventTypes[0],
		eventDate: '',
		location: '',
		guests: '',
		budget: '',
		packageName: '',
		timeline: '',
		inclusions: [''],
		costBreakdown: [{ label: '', amount: '' }],
		pitch: ''
	}
}

const offerForm = reactive(emptyOfferForm())

function inferEventType(inquiry) {
	if (inquiry.matches.includes('Corporate')) return 'Corporate Event'
	if (inquiry.matches.includes('Wedding')) return 'Wedding'
	if (inquiry.matches.includes('Social')) return 'Birthday Party'
	return 'Other'
}

function openOfferForm(inquiry) {
	Object.assign(offerForm, emptyOfferForm())
	offerForm.title = inquiry.title
	offerForm.eventType = inferEventType(inquiry)
	showOfferForm.value = true
}

function closeOfferForm() {
	showOfferForm.value = false
}

function applyTemplate(template) {
	offerForm.packageName = template
}

function addInclusion() {
	offerForm.inclusions.push('')
}

function addLineItem() {
	offerForm.costBreakdown.push({ label: '', amount: '' })
}

function submitOffer() {
	closeOfferForm()
}

const inquiries = [
	{
		title: 'Corporate Annual Gala',
		postedBy: 'Promi Boys Corporation',
		date: 'May 20, 2026',
		description: 'Annual company gala with dinner, entertainment, and awards ceremony. Looking for full event management services.',
		matches: 'Corporate Events, Davao City area',
		eventDate: 'June 15, 2026',
		location: 'Davao City',
		guests: 500,
		budget: '₱500,000 – ₱800,000',
		requirements: ['Venue booking and setup', 'Catering for 500 guests', 'Audio-visual equipment', 'Stage and lighting design', 'Entertainment coordination'],
		offers: 5
	},
	{
		title: 'Wedding Reception',
		postedBy: 'Rena & Marlo',
		date: 'May 21, 2026',
		description: 'Garden wedding reception with catering and entertainment. Romantic outdoor setup needed.',
		matches: 'Wedding Events, Davao City area',
		eventDate: 'July 20, 2026',
		location: 'Davao City',
		guests: 200,
		budget: '₱300,000 – ₱500,000',
		requirements: ['Garden venue setup', 'Floral arrangements', 'Catering for 200 guests', 'Live music or DJ', 'Photography coordination'],
		offers: 3
	},
	{
		title: 'Birthday Party – 50th Celebration',
		postedBy: 'Axalan Family',
		date: 'May 22, 2026',
		description: '50th birthday celebration, elegant dinner party with close friends and family.',
		matches: 'Social Events,  Davao City area',
		eventDate: 'June 5, 2026',
		location: 'Davao City',
		guests: 150,
		budget: '₱150,000 – ₱250,000',
		requirements: ['Venue decoration', 'Catering and drinks', 'Sound system', 'Photography'],
		offers: 2
	}
]
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
