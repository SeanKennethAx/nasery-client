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
				View your awarded event, share the public registration form, and manage generated tickets.
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
				<div class="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
					<div>
						<h3 class="text-lg font-bold text-gray-900">
							Registration &amp; Tickets
						</h3>

						<p class="mt-1 text-sm text-gray-500">
							Share the registration form with attendees and manage generated tickets.
						</p>
					</div>
					<div v-if="registrationAvailable"
						class="flex w-full flex-wrap items-center justify-center gap-3 xl:w-auto xl:justify-end">
						<button v-if="publicRegistrationUrl" type="button"
							class="inline-flex h-11 min-w-[150px] items-center justify-center gap-2.5 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md"
							@click="copyRegistrationLink">
							<svg v-if="registrationLinkCopied" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
								fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
								stroke-linejoin="round" class="h-4 w-4 shrink-0 text-emerald-600">
								<path d="M20 6 9 17l-5-5" />
							</svg>

							<svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
								stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
								class="h-4 w-4 shrink-0">
								<rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
								<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
							</svg>

							<span class="leading-none">
								{{
									registrationLinkCopied
										? 'Copied'
										: 'Copy Link'
								}}
							</span>
						</button>

						<NuxtLink v-if="publicRegistrationPath" :to="publicRegistrationPath" target="_blank"
							class="inline-flex h-11 min-w-[180px] items-center justify-center gap-2.5 rounded-lg border border-[#285F6b]/30 bg-white px-4 text-sm font-semibold text-[#285F6b] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#285F6b]/50 hover:bg-[#285F6b]/5 hover:shadow-md">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
								stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
								class="h-4 w-4 shrink-0">
								<path d="M15 3h6v6" />
								<path d="M10 14 21 3" />
								<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
							</svg>

							<span class="leading-none">
								Open Form
							</span>
						</NuxtLink>

						<button type="button"
							class="inline-flex h-11 min-w-[180px] items-center justify-center gap-2.5 rounded-lg bg-[#285F6b] px-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1f4a54] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
							:disabled="!availableTicketTypes.length" @click="openRegistrationForm">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
								stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
								class="h-4 w-4 shrink-0">
								<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
								<circle cx="9" cy="7" r="4" />
								<line x1="19" x2="19" y1="8" y2="14" />
								<line x1="22" x2="16" y1="11" y2="11" />
							</svg>

							<span class="leading-none">
								+ Register Attendee
							</span>
						</button>

					</div>
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
					<div v-if="availableTicketTypes.length" class="mt-6">
						<div class="mb-5 flex flex-wrap items-end justify-between gap-3">
							<div>
								<div class="flex items-center gap-2">
									<div
										class="flex h-8 w-8 items-center justify-center rounded-xl bg-[#285F6b]/10 text-[#285F6b]">
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
											stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
											stroke-linejoin="round" class="h-4 w-4">
											<path
												d="M2 9a3 3 0 0 0 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 0 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
											<path d="M13 5v2" />
											<path d="M13 17v2" />
											<path d="M13 11v2" />
										</svg>
									</div>

									<h4 class="text-base font-extrabold text-gray-900">
										Available Ticket Types
									</h4>
								</div>

								<p class="mt-1 pl-10 text-xs text-gray-500">
									Choose the pass that best fits your attendee.
								</p>
							</div>

							<span
								class="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700">
								<span class="h-1.5 w-1.5 rounded-full bg-emerald-500" />
								{{ availableTicketTypes.length }}
								{{ availableTicketTypes.length === 1 ? 'pass available' : 'passes available' }}
							</span>
						</div>

						<div class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
							<div v-for="ticketType in availableTicketTypes" :key="ticketType.id"
								class="group relative overflow-hidden rounded-[22px] border border-[#285F6b]/15 bg-white shadow-[0_8px_30px_rgba(40,95,107,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-[#285F6b]/35 hover:shadow-[0_18px_45px_rgba(40,95,107,0.16)]">
								<div
									class="relative overflow-hidden bg-gradient-to-br from-[#285F6b] via-[#2f6f7c] to-[#3f8a99] px-5 pb-6 pt-5 text-white">
									<div
										class="pointer-events-none absolute -right-10 -top-12 h-28 w-28 rounded-full bg-white/10" />
									<div
										class="pointer-events-none absolute -bottom-10 right-12 h-20 w-20 rounded-full bg-white/5" />

									<div class="relative flex items-start justify-between gap-4">
										<div class="min-w-0">
											<p class="text-[10px] font-bold uppercase tracking-[0.22em] text-white/65">
												NaSeRy Event Pass
											</p>

											<h5 class="mt-2 truncate text-xl font-black tracking-tight">
												{{ ticketType.name }}
											</h5>
										</div>

										<div
											class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm">
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
												stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
												stroke-linejoin="round" class="h-5 w-5">
												<path
													d="M2 9a3 3 0 0 0 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 0 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
												<path d="M13 5v2" />
												<path d="M13 17v2" />
												<path d="M13 11v2" />
											</svg>
										</div>
									</div>
								</div>

								<div class="relative px-5 pb-5 pt-4">
									<div
										class="absolute -left-3.5 top-7 h-7 w-7 rounded-full border border-[#285F6b]/10 bg-[#f8fafb]" />
									<div
										class="absolute -right-3.5 top-7 h-7 w-7 rounded-full border border-[#285F6b]/10 bg-[#f8fafb]" />

									<div class="border-b border-dashed border-gray-200 pb-4">
										<div class="flex items-end justify-between gap-3">
											<div>
												<p
													class="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
													Pass Price
												</p>

												<p class="mt-1 text-2xl font-black tracking-tight text-[#285F6b]">
													{{ formatCurrency(ticketType.price) }}
												</p>
											</div>

											<span
												class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
												<span class="h-1.5 w-1.5 rounded-full bg-emerald-500" />
												Available
											</span>
										</div>
									</div>

									<div class="mt-4 grid grid-cols-2 gap-3">
										<div class="rounded-xl border border-gray-100 bg-gray-50 px-3.5 py-3">
											<div class="flex items-center gap-2 text-gray-400">
												<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
													stroke="currentColor" stroke-width="1.8" class="h-4 w-4">
													<path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
													<circle cx="10" cy="7" r="4" />
												</svg>
												<span class="text-[10px] font-bold uppercase tracking-wide">
													Capacity
												</span>
											</div>

											<p class="mt-1.5 text-lg font-extrabold text-gray-900">
												{{ ticketType.capacity }}
											</p>
										</div>

										<div class="rounded-xl border border-[#285F6b]/10 bg-[#285F6b]/5 px-3.5 py-3">
											<div class="flex items-center gap-2 text-[#285F6b]/60">
												<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
													stroke="currentColor" stroke-width="1.8" class="h-4 w-4">
													<path d="M20 6 9 17l-5-5" />
												</svg>

												<span class="text-[10px] font-bold uppercase tracking-wide">
													Registration
												</span>
											</div>

											<p class="mt-1.5 text-sm font-extrabold text-[#285F6b]">
												Open
											</p>
										</div>
									</div>

									<div
										class="mt-4 flex items-center justify-between gap-3 rounded-xl bg-gradient-to-r from-gray-50 to-white px-3.5 py-3">
										<div class="flex items-center gap-2 text-xs font-semibold text-gray-600">
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
												stroke="currentColor" stroke-width="1.8"
												class="h-4 w-4 shrink-0 text-[#285F6b]">
												<path d="M5 12h14" />
												<path d="m13 6 6 6-6 6" />
											</svg>
											<span>Ready for attendee registration</span>
										</div>

										<span
											class="text-[10px] font-bold uppercase tracking-[0.12em] text-[#285F6b]/70">
											Select Pass
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
						Tickets generated through the public registration form will appear here.
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
						<div class="mb-1.5 flex items-center justify-between gap-3">
							<FormsLabel text="Email Address" required />

							<span v-if="registrationEmailVerification.verified"
								class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
								<span class="h-1.5 w-1.5 rounded-full bg-emerald-500" />
								VERIFIED
							</span>

							<span v-else-if="registrationEmailVerification.sent"
								class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
								<span class="h-1.5 w-1.5 rounded-full bg-amber-500" />
								CODE SENT
							</span>
						</div>

						<div class="flex flex-col gap-2 sm:flex-row">
							<div class="flex-1">
								<FormsTextField v-model="registrationForm.email" type="email"
									placeholder="e.g. juan@example.com"
									:disabled="registrationEmailVerification.verified"
									@update:model-value="handleRegistrationEmailChanged" />
							</div>

							<button type="button"
								class="group inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#285F6b] to-[#347887] px-4 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-300 disabled:shadow-none disabled:hover:translate-y-0"
								:disabled="registrationEmailVerification.sending ||
									registrationEmailVerification.verified ||
									!registrationForm.email.trim() ||
									registrationEmailVerification.resendIn > 0" @click="sendRegistrationVerificationCode">
								<svg v-if="registrationEmailVerification.sending" xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
									stroke-linecap="round" stroke-linejoin="round"
									class="h-4 w-4 shrink-0 animate-spin">
									<path d="M21 12a9 9 0 1 1-2.64-6.36" />
									<path d="M21 3v6h-6" />
								</svg>

								<svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
									stroke="currentColor" stroke-width="2" stroke-linecap="round"
									stroke-linejoin="round" class="h-4 w-4 shrink-0">
									<rect x="3" y="5" width="18" height="14" rx="2" />
									<path d="m3 7 9 6 9-6" />
								</svg>

								{{
									registrationEmailVerification.sending
										? 'Sending...'
										: registrationEmailVerification.sent
											? 'Resend Code'
											: 'Send Code'
								}}
							</button>
						</div>

						<div v-if="registrationEmailVerification.sent && !registrationEmailVerification.verified"
							class="mt-3 overflow-hidden rounded-xl border border-[#285F6b]/20 bg-white">
							<div class="flex items-center justify-between gap-3 bg-[#285F6b] px-4 py-3 text-white">
								<div>
									<p class="text-sm font-bold">
										Verify attendee email
									</p>

									<p class="mt-0.5 text-xs text-white/75">
										Enter the 6-digit PIN sent to {{ registrationForm.email }}
									</p>
								</div>

								<span v-if="registrationEmailVerification.expiresIn > 0"
									class="rounded-lg bg-white/15 px-2.5 py-1 font-mono text-xs font-bold">
									{{ formatRegistrationCountdown(registrationEmailVerification.expiresIn) }}
								</span>
							</div>

							<div class="p-4">
								<div class="flex flex-col gap-2 sm:flex-row">
									<input v-model="registrationEmailVerification.code" type="text" inputmode="numeric"
										autocomplete="one-time-code" maxlength="6" placeholder="000000"
										class="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-center font-mono text-lg font-extrabold tracking-[0.35em] outline-none focus:border-[#285F6b] focus:ring-2 focus:ring-[#285F6b]/10"
										@input="sanitizeRegistrationVerificationCode"
										@keyup.enter="verifyRegistrationEmail">

									<button type="button"
										class="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#285F6b] px-5 text-sm font-bold text-white transition hover:bg-[#1f4a54] disabled:cursor-not-allowed disabled:opacity-50"
										:disabled="registrationEmailVerification.verifying ||
											registrationEmailVerification.code.length !== 6 ||
											registrationEmailVerification.expiresIn <= 0" @click="verifyRegistrationEmail">
										<IconBase
											:name="registrationEmailVerification.verifying ? 'refresh-cw' : 'check-circle'"
											class="h-4 w-4"
											:class="{ 'animate-spin': registrationEmailVerification.verifying }" />

										{{ registrationEmailVerification.verifying ? 'Verifying...' : 'Verify Email' }}
									</button>
								</div>

								<div class="mt-3 flex flex-wrap items-center justify-between gap-2">
									<p v-if="registrationEmailVerification.expiresIn > 0" class="text-xs text-gray-500">
										The verification PIN expires after 10 minutes.
									</p>

									<p v-else class="text-xs font-semibold text-amber-700">
										The code expired. Request a new PIN.
									</p>

									<button type="button"
										class="text-xs font-bold text-[#285F6b] disabled:cursor-not-allowed disabled:text-gray-400"
										:disabled="registrationEmailVerification.sending || registrationEmailVerification.resendIn > 0"
										@click="sendRegistrationVerificationCode">
										{{
											registrationEmailVerification.resendIn > 0
												? `Resend in ${registrationEmailVerification.resendIn}s`
												: 'Resend code'
										}}
									</button>
								</div>
							</div>
						</div>

						<div v-if="registrationEmailVerification.verified"
							class="mt-3 flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
							<div class="flex items-center gap-2">
								<IconBase name="check-circle" class="h-4 w-4 text-emerald-600" />

								<div>
									<p class="text-xs font-bold text-emerald-800">
										Email verified successfully
									</p>

									<p class="text-[11px] text-emerald-700">
										{{ registrationEmailVerification.verifiedEmail }}
									</p>
								</div>
							</div>

							<button type="button" class="text-xs font-bold text-emerald-700 hover:underline"
								@click="changeRegistrationVerifiedEmail">
								Change
							</button>
						</div>

						<p v-if="registrationEmailVerification.error" class="mt-2 text-xs font-semibold text-red-600">
							{{ registrationEmailVerification.error }}
						</p>
					</div>

					<div class="mt-4">
						<FormsLabel text="Contact Number" />

						<FormsTextField v-model="registrationForm.contactNo" type="tel"
							placeholder="e.g. 09171234567" />
					</div>

					<div class="mt-4">
						<label class="mb-1.5 block text-sm font-semibold text-gray-700">
							Ticket Type
							<span class="text-red-500">
								*
							</span>
						</label>

						<FormsSelect v-model="registrationForm.ticketTypeId"
							:options="availableTicketTypes.map(ticketType => ({ value: ticketType.id, label: `${ticketType.name} — ${formatCurrency(ticketType.price)}` }))"
							placeholder="Select ticket type" :can-clear="false" />
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
						!registrationForm.email.trim() ||
						!registrationForm.ticketTypeId ||
						!registrationEmailVerification.verified
						" @click="registerAttendee">
						<IconBase v-if="isRegistering" name="refresh-cw" class="h-4 w-4 animate-spin" />

						<IconBase v-else name="qr-code" class="h-4 w-4" />

						{{
							isRegistering
								? 'Generating QR Ticket...'
								: !registrationEmailVerification.verified
									? 'Verify Email to Continue'
									: 'Register & Generate QR Ticket'
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
			" class="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col overflow-hidden bg-[#f4f8f8] shadow-2xl">

				<div
					class="relative overflow-hidden bg-gradient-to-br from-[#285F6b] via-[#2f6f7c] to-[#3d8796] px-6 pb-6 pt-5 text-white">
					<div class="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10" />
					<div class="pointer-events-none absolute -bottom-20 left-16 h-40 w-40 rounded-full bg-white/5" />

					<div class="relative flex items-start justify-between gap-4">
						<div>
							<span
								class="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/85">
								<span class="h-1.5 w-1.5 rounded-full bg-emerald-300" />
								Official Event Pass
							</span>

							<h2 class="mt-3 text-2xl font-black tracking-tight">
								QR Ticket
							</h2>

							<p class="mt-1 font-mono text-xs font-bold tracking-[0.12em] text-white/70">
								{{ activeTicket.ticket_id }}
							</p>
						</div>

						<button type="button"
							class="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white/80 transition hover:rotate-90 hover:bg-white/20 hover:text-white"
							@click="closeTicketDetails">
							<IconBase name="x" class="h-5 w-5" />
						</button>
					</div>
				</div>

				<div class="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
					<div
						class="overflow-hidden rounded-[24px] border border-[#285F6b]/10 bg-white shadow-[0_12px_40px_rgba(40,95,107,0.08)]">
						<div class="h-1.5 bg-gradient-to-r from-[#285F6b] via-[#3d8796] to-[#285F6b]" />

						<div class="p-5">
							<div class="flex items-center gap-4">
								<div
									class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#285F6b]/10 text-lg font-black text-[#285F6b] ring-1 ring-[#285F6b]/10">
									{{ getInitials(activeTicket.name) }}
								</div>

								<div class="min-w-0 flex-1">
									<p class="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
										Ticket Holder
									</p>

									<h3 class="mt-1 truncate text-lg font-extrabold text-gray-900">
										{{ activeTicket.name }}
									</h3>

									<p class="mt-1 text-sm font-semibold text-[#285F6b]">
										{{ activeTicket.ticket_type?.name || 'General Admission' }}
									</p>
								</div>

								<span class="rounded-full px-3 py-1.5 text-[11px] font-bold" :class="activeTicket.status ===
									'checked_in'
									? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
									: 'bg-[#285F6b]/10 text-[#285F6b] ring-1 ring-[#285F6b]/10'
									">
									{{
										activeTicket.status ===
											'checked_in'
											? 'Checked-in'
											: 'Registered'
									}}
								</span>
							</div>

							<div class="my-5 border-t border-dashed border-gray-200" />

							<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
								<div class="rounded-2xl bg-gray-50 px-4 py-3.5">
									<p class="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
										Ticket ID
									</p>
									<p class="mt-1.5 font-mono text-sm font-black text-gray-900">
										{{ activeTicket.ticket_id }}
									</p>
								</div>

								<div class="rounded-2xl bg-gray-50 px-4 py-3.5">
									<p class="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
										Event Date
									</p>
									<p class="mt-1.5 text-sm font-bold text-gray-900">
										{{
											eventData?.event.event_date
												? formatDate(eventData.event.event_date)
												: 'Date not set'
										}}
									</p>
								</div>

								<div v-if="activeTicket.email" class="rounded-2xl bg-gray-50 px-4 py-3.5">
									<p class="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
										Email
									</p>
									<p class="mt-1.5 break-all text-xs font-semibold text-gray-800">
										{{ activeTicket.email }}
									</p>
								</div>

								<div class="rounded-2xl bg-gray-50 px-4 py-3.5">
									<p class="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
										Location
									</p>
									<p class="mt-1.5 text-sm font-bold text-gray-900">
										{{ eventData?.event.location || 'Not specified' }}
									</p>
								</div>
							</div>
						</div>
					</div>

					<div
						class="relative mt-5 overflow-hidden rounded-[24px] border border-[#285F6b]/10 bg-white p-5 shadow-[0_12px_40px_rgba(40,95,107,0.08)]">
						<div
							class="pointer-events-none absolute -left-4 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-[#f4f8f8]" />
						<div
							class="pointer-events-none absolute -right-4 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-[#f4f8f8]" />

						<div class="text-center">
							<p class="text-[10px] font-bold uppercase tracking-[0.18em] text-[#285F6b]">
								Scan to Verify
							</p>

							<h3 class="mt-1 text-lg font-extrabold text-gray-900">
								Ready for event check-in
							</h3>

							<p class="mx-auto mt-1 max-w-sm text-xs leading-5 text-gray-500">
								This secure QR code is generated directly from this ticket's QR value.
							</p>
						</div>

						<div
							class="mx-auto mt-5 flex h-[230px] w-[230px] items-center justify-center rounded-[24px] border border-gray-200 bg-white p-3 shadow-inner">
							<div v-if="isGeneratingTicketQr" class="text-center">
								<IconBase name="refresh-cw" class="mx-auto h-7 w-7 animate-spin text-[#285F6b]" />
								<p class="mt-2 text-xs font-semibold text-gray-500">
									Generating secure QR...
								</p>
							</div>

							<img v-else-if="activeTicketQrDataUrl" :src="activeTicketQrDataUrl"
								:alt="`QR code for ${activeTicket.ticket_id}`"
								class="h-full w-full rounded-xl object-contain">

							<div v-else class="text-center text-gray-400">
								<IconBase name="qr-code" class="mx-auto h-16 w-16" />
								<p class="mt-2 text-xs font-semibold">
									QR unavailable
								</p>
							</div>
						</div>

						<p v-if="activeTicketQrError"
							class="mx-auto mt-3 max-w-sm rounded-xl bg-red-50 px-3 py-2 text-center text-xs font-semibold text-red-600">
							{{ activeTicketQrError }}
						</p>

						<div
							class="mx-auto mt-4 flex max-w-sm items-center justify-center gap-2 rounded-xl bg-[#285F6b]/5 px-4 py-3 text-xs font-semibold text-[#285F6b]">
							<IconBase name="check-circle" class="h-4 w-4" />
							Present this code to the organizer for scanning.
						</div>
					</div>

					<details v-if="activeTicket.qr_value"
						class="group mt-4 rounded-2xl border border-gray-200 bg-white">
						<summary
							class="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-xs font-bold text-gray-600">
							<span class="flex items-center gap-2">
								<IconBase name="qr-code" class="h-4 w-4 text-[#285F6b]" />
								Secure QR Value
							</span>

							<span class="text-[10px] font-semibold text-gray-400">
								Tap to view
							</span>
						</summary>

						<div class="border-t border-gray-100 px-4 py-3">
							<p class="break-all font-mono text-[10px] leading-5 text-gray-500">
								{{ activeTicket.qr_value }}
							</p>
						</div>
					</details>
				</div>

				<div class="border-t border-gray-200/80 bg-white px-5 py-5 sm:px-6">
					<div v-if="ticketEmailSuccess"
						class="mb-4 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
						<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
							<IconBase name="check-circle" class="h-4 w-4" />
						</div>
						{{ ticketEmailSuccess }}
					</div>

					<div v-if="ticketEmailError"
						class="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
						{{ ticketEmailError }}
					</div>

					<div class="mb-3 flex items-center justify-between gap-3">
						<div>
							<p class="text-sm font-extrabold text-gray-900">
								Ticket Actions
							</p>
							<p class="mt-0.5 text-xs text-gray-500">
								Save a copy or send it to the attendee.
							</p>
						</div>

						<span
							class="rounded-full bg-[#285F6b]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#285F6b]">
							{{ activeTicket.ticket_type?.name || 'Ticket' }}
						</span>
					</div>

					<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
						<button type="button"
							class="group relative overflow-hidden rounded-2xl border border-[#285F6b]/20 bg-white px-4 py-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-[#285F6b]/45 hover:shadow-lg hover:shadow-[#285F6b]/10 disabled:cursor-not-allowed disabled:opacity-50"
							:disabled="!activeTicket.qr_token" @click="downloadActiveTicket">
							<div class="flex items-center gap-3">
								<div
									class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#285F6b]/10 text-[#285F6b] transition group-hover:bg-[#285F6b] group-hover:text-white">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
										stroke="currentColor" stroke-width="2" stroke-linecap="round"
										stroke-linejoin="round" class="h-5 w-5">
										<path d="M12 3v12" />
										<path d="m7 10 5 5 5-5" />
										<path d="M5 21h14" />
									</svg>
								</div>

								<div class="min-w-0">
									<p class="text-sm font-extrabold text-gray-900">
										Download Ticket
									</p>
									<p class="mt-0.5 text-[11px] text-gray-500">
										PDF + secure QR code
									</p>
								</div>
							</div>
						</button>

						<button type="button"
							class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#285F6b] to-[#347887] px-4 py-4 text-left text-white shadow-lg shadow-[#285F6b]/15 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#285F6b]/25 disabled:cursor-not-allowed disabled:opacity-50"
							:disabled="isSendingTicketEmail || !activeTicket.email || !activeTicket.qr_token"
							@click="sendActiveTicketEmail">
							<div
								class="pointer-events-none absolute -right-5 -top-8 h-20 w-20 rounded-full bg-white/10" />

							<div class="relative flex items-center gap-3">
								<div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
									<svg v-if="isSendingTicketEmail" xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
										stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 animate-spin">
										<path d="M21 12a9 9 0 1 1-2.64-6.36" />
										<path d="M21 3v6h-6" />
									</svg>

									<svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
										stroke="currentColor" stroke-width="2" stroke-linecap="round"
										stroke-linejoin="round" class="h-5 w-5">
										<rect x="3" y="5" width="18" height="14" rx="2" />
										<path d="m3 7 9 6 9-6" />
									</svg>
								</div>

								<div class="min-w-0">
									<p class="text-sm font-extrabold">
										{{ isSendingTicketEmail ? 'Sending Ticket...' : 'Email Ticket' }}
									</p>

									<p v-if="activeTicket.email"
										class="mt-0.5 max-w-[180px] truncate text-[11px] text-white/70">
										{{ activeTicket.email }}
									</p>
								</div>
							</div>
						</button>
					</div>

					<p v-if="!activeTicket.email" class="mt-3 text-center text-xs font-semibold text-amber-600">
						No email is attached to this ticket. Download the PDF instead.
					</p>
				</div>
			</div>
		</Transition>
	</div>
</template>

<script setup lang="ts">
import QRCode from 'qrcode'
import type {
	ApiErrorResponse,
	ClientEventResponse,
	EventTicket,
	RegistrationForm,
	TicketEmailResponse,
	TicketListResponse,
	TicketType,
} from '~/types/client-event-details'

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



const registrationLinkCopied = ref(false)

const isSendingTicketEmail = ref(false)
const ticketEmailSuccess = ref('')
const ticketEmailError = ref('')


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

const activeTicketQrDataUrl =
	ref('')

const isGeneratingTicketQr =
	ref(false)

const activeTicketQrError =
	ref('')


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

const availableTicketTypes =
	computed<TicketType[]>(
		() =>
			ticketTypes.value.filter(
				ticketType =>
					!ticketType.sold_out,
			),
	)

const registrationAvailable =
	computed(
		() =>
			Boolean(
				eventData.value?.event
					.public_registration,
			),
	)
const publicRegistrationToken =
	computed<string | null>(
		() =>
			eventData.value?.event
				.public_registration_token ??
			null,
	)

const publicRegistrationPath =
	computed<string | null>(() => {
		if (!publicRegistrationToken.value) {
			return null
		}

		return `/event-registration/${encodeURIComponent(
			publicRegistrationToken.value,
		)}`
	})

const publicRegistrationUrl =
	computed<string | null>(() => {
		if (!publicRegistrationPath.value) {
			return null
		}

		if (import.meta.server) {
			return publicRegistrationPath.value
		}

		return new URL(
			publicRegistrationPath.value,
			window.location.origin,
		).toString()
	})

async function copyRegistrationLink() {
	if (!publicRegistrationUrl.value) {
		return
	}

	try {
		await navigator.clipboard.writeText(
			publicRegistrationUrl.value,
		)
		registrationLinkCopied.value = true

		window.setTimeout(() => {
			registrationLinkCopied.value = false
		}, 2000)
	} catch {
		registrationLinkCopied.value = false
	}
}

type ClientRegistrationForm = RegistrationForm & {
	contactNo: string
}

type RegistrationEmailVerificationState = {
	sending: boolean
	verifying: boolean
	sent: boolean
	verified: boolean
	code: string
	error: string
	verificationToken: string | null
	verifiedEmail: string
	expiresIn: number
	resendIn: number
}

type RegistrationVerificationSendResponse = {
	message?: string
	data?: {
		expires_in?: number
		resend_in?: number
	}
}

type RegistrationVerificationVerifyResponse = {
	message?: string
	data?: {
		verified?: boolean
		email?: string
		verification_token?: string
	}
}

function emptyRegistrationForm(): ClientRegistrationForm {
	return {
		name: '',
		email: '',
		contactNo: '',
		ticketTypeId: null,
	}
}

const registrationForm =
	reactive(
		emptyRegistrationForm(),
	)

const createRegistrationEmailVerificationState =
	(): RegistrationEmailVerificationState => ({
		sending: false,
		verifying: false,
		sent: false,
		verified: false,
		code: '',
		error: '',
		verificationToken: null,
		verifiedEmail: '',
		expiresIn: 0,
		resendIn: 0,
	})

const registrationEmailVerification =
	reactive<RegistrationEmailVerificationState>(
		createRegistrationEmailVerificationState(),
	)

let registrationVerificationTimer:
	ReturnType<typeof setInterval> |
	null = null

const selectedRegistrationTicketType =
	computed<TicketType | null>(
		() => {
			if (
				!registrationForm.ticketTypeId
			) {
				return null
			}

			return (
				availableTicketTypes.value.find(
					ticketType =>
						ticketType.id ===
						registrationForm.ticketTypeId,
				) ?? null
			)
		},
	)


function resetRegistrationEmailVerification() {
	Object.assign(
		registrationEmailVerification,
		createRegistrationEmailVerificationState(),
	)
}

function handleRegistrationEmailChanged() {
	const currentEmail =
		registrationForm.email
			.trim()
			.toLowerCase()

	if (
		registrationEmailVerification.verifiedEmail &&
		currentEmail !==
		registrationEmailVerification
			.verifiedEmail
			.trim()
			.toLowerCase()
	) {
		resetRegistrationEmailVerification()
		return
	}

	if (
		registrationEmailVerification.sent &&
		!registrationEmailVerification.verified
	) {
		registrationEmailVerification.code = ''
		registrationEmailVerification.sent = false
		registrationEmailVerification.error = ''
		registrationEmailVerification.verificationToken = null
		registrationEmailVerification.expiresIn = 0
		registrationEmailVerification.resendIn = 0
	}
}

function changeRegistrationVerifiedEmail() {
	resetRegistrationEmailVerification()
}

function sanitizeRegistrationVerificationCode() {
	registrationEmailVerification.code =
		registrationEmailVerification.code
			.replace(/\D/g, '')
			.slice(0, 6)
}

function formatRegistrationCountdown(
	seconds: number,
): string {
	const safeSeconds =
		Math.max(0, seconds)

	const minutes =
		Math.floor(
			safeSeconds / 60,
		)

	const remainingSeconds =
		safeSeconds % 60

	return `${minutes}:${String(
		remainingSeconds,
	).padStart(2, '0')}`
}

function startRegistrationVerificationTimer() {
	if (registrationVerificationTimer) {
		return
	}

	registrationVerificationTimer =
		setInterval(
			() => {
				if (
					registrationEmailVerification.expiresIn >
					0
				) {
					registrationEmailVerification.expiresIn -=
						1
				}

				if (
					registrationEmailVerification.resendIn >
					0
				) {
					registrationEmailVerification.resendIn -=
						1
				}
			},
			1000,
		)
}

async function sendRegistrationVerificationCode() {
	registrationEmailVerification.error = ''

	if (!publicRegistrationToken.value) {
		registrationEmailVerification.error =
			'Public registration is not available for this event.'
		return
	}

	const email =
		registrationForm.email.trim()

	if (!email) {
		registrationEmailVerification.error =
			'Please enter the attendee email address.'
		return
	}

	const emailPattern =
		/^[^\s@]+@[^\s@]+\.[^\s@]+$/

	if (!emailPattern.test(email)) {
		registrationEmailVerification.error =
			'Please enter a valid email address.'
		return
	}

	if (
		registrationEmailVerification.resendIn >
		0
	) {
		return
	}

	registrationEmailVerification.sending =
		true

	try {
		const response =
			await $fetch<RegistrationVerificationSendResponse>(
				`${config.public.apiBaseURL}/events/register/${encodeURIComponent(
					publicRegistrationToken.value,
				)}/email-verification/send`,
				{
					method: 'POST',

					headers: {
						Accept:
							'application/json',
					},

					body: {
						email,
					},
				},
			)

		registrationEmailVerification.sent =
			true
		registrationEmailVerification.verified =
			false
		registrationEmailVerification.code = ''
		registrationEmailVerification.verificationToken =
			null
		registrationEmailVerification.verifiedEmail =
			''
		registrationEmailVerification.expiresIn =
			Number(
				response.data?.expires_in ??
				600,
			)
		registrationEmailVerification.resendIn =
			Number(
				response.data?.resend_in ??
				60,
			)

		startRegistrationVerificationTimer()
	} catch (error: unknown) {
		registrationEmailVerification.error =
			getApiErrorMessage(
				error,
				'Unable to send the verification code.',
			)
	} finally {
		registrationEmailVerification.sending =
			false
	}
}

async function verifyRegistrationEmail() {
	registrationEmailVerification.error = ''

	if (!publicRegistrationToken.value) {
		registrationEmailVerification.error =
			'Public registration is not available for this event.'
		return
	}

	const email =
		registrationForm.email.trim()

	const code =
		registrationEmailVerification.code.trim()

	if (!/^\d{6}$/.test(code)) {
		registrationEmailVerification.error =
			'Please enter the complete 6-digit verification PIN.'
		return
	}

	if (
		registrationEmailVerification.expiresIn <=
		0
	) {
		registrationEmailVerification.error =
			'This PIN has expired. Please request a new code.'
		return
	}

	registrationEmailVerification.verifying =
		true

	try {
		const response =
			await $fetch<RegistrationVerificationVerifyResponse>(
				`${config.public.apiBaseURL}/events/register/${encodeURIComponent(
					publicRegistrationToken.value,
				)}/email-verification/verify`,
				{
					method: 'POST',

					headers: {
						Accept:
							'application/json',
					},

					body: {
						email,
						code,
					},
				},
			)

		if (
			!response.data?.verified ||
			!response.data
				?.verification_token
		) {
			registrationEmailVerification.error =
				'The attendee email could not be verified.'
			return
		}

		registrationEmailVerification.verified =
			true
		registrationEmailVerification.sent =
			true
		registrationEmailVerification.verifiedEmail =
			response.data.email ??
			email
		registrationEmailVerification.verificationToken =
			response.data
				.verification_token
		registrationEmailVerification.code = ''
	} catch (error: unknown) {
		registrationEmailVerification.error =
			getApiErrorMessage(
				error,
				'The verification code is invalid or expired.',
			)
	} finally {
		registrationEmailVerification.verifying =
			false
	}
}

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
		!publicRegistrationToken.value ||
		!availableTicketTypes.value.length
	) {
		return
	}

	Object.assign(
		registrationForm,
		emptyRegistrationForm(),
	)

	resetRegistrationEmailVerification()

	if (
		availableTicketTypes.value.length ===
		1
	) {
		registrationForm.ticketTypeId =
			availableTicketTypes.value[0]?.id ??
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

	resetRegistrationEmailVerification()
}

async function registerAttendee() {
	if (
		!registrationAvailable.value ||
		!publicRegistrationToken.value
	) {
		registrationError.value =
			'Public registration is not available for this event.'

		return
	}

	if (!registrationForm.name.trim()) {
		registrationError.value =
			'Full name is required.'

		return
	}

	if (!registrationForm.email.trim()) {
		registrationError.value =
			'Attendee email address is required.'

		return
	}

	if (
		!registrationEmailVerification.verified ||
		!registrationEmailVerification.verificationToken ||
		registrationEmailVerification.verifiedEmail
			.trim()
			.toLowerCase() !==
		registrationForm.email
			.trim()
			.toLowerCase()
	) {
		registrationError.value =
			'Please verify the attendee email address before registering.'

		return
	}

	if (!registrationForm.ticketTypeId) {
		registrationError.value =
			'Please select a ticket type.'

		return
	}

	isRegistering.value = true
	registrationError.value = ''
	registrationSuccess.value = ''

	try {
		const response =
			await $fetch<{
				message?: string
				data: {
					tickets: EventTicket[]
				}
			}>(
				`${config.public.apiBaseURL}/events/register/${encodeURIComponent(
					publicRegistrationToken.value,
				)}`,
				{
					method: 'POST',

					headers: {
						Accept: 'application/json',

						Authorization:
							`Bearer ${token.value}`,
					},

					body: {
						attendees: [
							{
								name:
									registrationForm.name.trim(),

								email:
									registrationForm.email.trim(),

								contact_no:
									registrationForm.contactNo.trim() ||
									null,

								event_ticket_type_id:
									registrationForm.ticketTypeId,

								email_verification_token:
									registrationEmailVerification.verificationToken,

								/*
								 * Laravel can use this metadata when writing
								 * the registration audit/source table.
								 */
								registration_source:
									'client',
							},
						],
					},
				},
			)

		const generatedTicket =
			response.data.tickets?.[0]

		if (!generatedTicket) {
			throw new Error(
				'The attendee was registered but no ticket was returned.',
			)
		}

		latestTicket.value =
			generatedTicket

		registrationSuccess.value =
			response.message ??
			'Attendee registered and QR ticket generated successfully.'

		Object.assign(
			registrationForm,
			emptyRegistrationForm(),
		)

		showRegistrationForm.value =
			false

		await loadTickets()

		activeTicket.value =
			generatedTicket

		ticketEmailSuccess.value = ''
		ticketEmailError.value = ''

		showTicketDetails.value =
			true

		await generateActiveTicketQr()

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

async function generateActiveTicketQr() {
	activeTicketQrDataUrl.value = ''
	activeTicketQrError.value = ''

	const qrValue =
		activeTicket.value?.qr_value

	if (!qrValue) {
		activeTicketQrError.value =
			'QR value is not available for this ticket.'
		return
	}

	isGeneratingTicketQr.value =
		true

	try {
		activeTicketQrDataUrl.value =
			await QRCode.toDataURL(
				qrValue,
				{
					width: 420,
					margin: 2,
					errorCorrectionLevel: 'M',
					color: {
						dark: '#172033',
						light: '#FFFFFF',
					},
				},
			)
	} catch (error) {
		console.error(
			'Unable to generate QR preview:',
			error,
		)

		activeTicketQrError.value =
			'Unable to generate the QR preview.'
	} finally {
		isGeneratingTicketQr.value =
			false
	}
}

function viewTicket(
	ticket: EventTicket,
) {
	ticketEmailSuccess.value = ''
	ticketEmailError.value = ''

	activeTicket.value =
		ticket

	showTicketDetails.value =
		true

	void generateActiveTicketQr()
}

function downloadActiveTicket() {
	const qrToken = activeTicket.value?.qr_token

	if (!qrToken) {
		ticketEmailError.value =
			'The downloadable ticket is not available.'
		return
	}

	window.open(
		`${config.public.apiBaseURL}/tickets/${encodeURIComponent(qrToken)}/download`,
		'_blank',
	)
}

async function sendActiveTicketEmail() {
	const ticket = activeTicket.value

	if (!ticket?.qr_token || !ticket.email) {
		ticketEmailError.value =
			'This ticket does not have a valid email address.'
		return
	}

	isSendingTicketEmail.value = true
	ticketEmailSuccess.value = ''
	ticketEmailError.value = ''

	try {
		const response = await $fetch<TicketEmailResponse>(
			`${config.public.apiBaseURL}/tickets/${encodeURIComponent(ticket.qr_token)}/email`,
			{
				method: 'POST',
				headers: {
					Accept: 'application/json',
				},
				body: {
					email: ticket.email,
				},
			},
		)

		ticketEmailSuccess.value =
			response.message ||
			`The ticket was sent to ${ticket.email}.`
	} catch (error: unknown) {
		ticketEmailError.value = getApiErrorMessage(
			error,
			'Unable to send the ticket email.',
		)
	} finally {
		isSendingTicketEmail.value = false
	}
}

function closeTicketDetails() {
	showTicketDetails.value =
		false

	activeTicketQrDataUrl.value =
		''

	activeTicketQrError.value =
		''
}

onMounted(() => {
	startRegistrationVerificationTimer()
	loadEventDetails()
})

onBeforeUnmount(() => {
	if (registrationVerificationTimer) {
		clearInterval(
			registrationVerificationTimer,
		)

		registrationVerificationTimer =
			null
	}
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
