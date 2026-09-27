<template>
	<Teleport to="body">
		<Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
			enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in"
			leave-from-class="opacity-100" leave-to-class="opacity-0">
			<div v-if="open" class="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
				role="dialog" aria-modal="true" :aria-labelledby="titleId" @click.self="close">
				<div class="w-full max-w-md overflow-hidden rounded-3xl border border-white/60 bg-white shadow-2xl">
					<div class="bg-[#285F6b] px-6 pb-6 pt-5 text-white">
						<div class="flex items-start justify-between gap-4">
							<div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/15">
								<IconBase name="check-circle" class="h-5 w-5" />
							</div>
							<button type="button" aria-label="Close"
								class="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
								@click="close">
								<IconBase name="x" class="h-4 w-4" />
							</button>
						</div>
						<p class="mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/60">Ticket ready</p>
						<h2 :id="titleId" class="mt-1 text-2xl font-black tracking-tight">Get your ticket</h2>
						<p class="mt-2 text-sm leading-6 text-white/75">
							{{ ticketName }}<template v-if="ticketLabel"> · {{ ticketLabel }}</template>
						</p>
					</div>

					<div class="p-6">
						<p class="mb-5 text-sm text-gray-500">
							Choose how you'd like to receive this ticket. You can do both.
						</p>

						<div class="space-y-3">
							<button type="button"
								class="flex w-full items-center gap-3 rounded-2xl border border-gray-200 p-4 text-left transition hover:border-primary-300 hover:bg-primary-50/40"
								@click="$emit('download')">
								<span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50">
									<IconBase name="download" class="h-5 w-5 text-primary-700" />
								</span>
								<span class="min-w-0 flex-1">
									<span class="block text-sm font-bold text-gray-900">Download Ticket</span>
									<span class="block text-xs text-gray-500">Save a PDF copy to this device</span>
								</span>
								<IconBase name="arrow-right" class="h-4 w-4 shrink-0 text-gray-300" />
							</button>

							<button type="button"
								class="flex w-full items-center gap-3 rounded-2xl border border-gray-200 p-4 text-left transition hover:border-primary-300 hover:bg-primary-50/40 disabled:cursor-wait disabled:opacity-60"
								:disabled="emailing" @click="$emit('email')">
								<span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
									:class="emailSent ? 'bg-green-50' : 'bg-primary-50'">
									<IconBase :name="emailSent ? 'check-circle' : 'send'" class="h-5 w-5"
										:class="emailSent ? 'text-green-600' : 'text-primary-700'" />
								</span>
								<span class="min-w-0 flex-1">
									<span class="block text-sm font-bold text-gray-900">
										{{ emailing ? 'Sending…' : emailSent ? 'Sent to your email' : 'Email Ticket' }}
									</span>
									<span class="block text-xs text-gray-500">
										{{ emailSent ? 'Check your inbox for the PDF copy' : 'Send a PDF copy to your verified email' }}
									</span>
								</span>
								<IconBase v-if="!emailSent" name="arrow-right" class="h-4 w-4 shrink-0 text-gray-300" />
							</button>
						</div>

						<p v-if="emailError" class="mt-3 text-sm text-red-600">{{ emailError }}</p>

						<button type="button" class="mt-5 w-full text-center text-xs font-bold text-gray-400 hover:text-gray-600"
							@click="$emit('print')">
							Prefer to print? Open the printable ticket
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
	open: boolean
	ticketName: string
	ticketLabel?: string
	emailing?: boolean
	emailSent?: boolean
	emailError?: string
}>(), {
	ticketLabel: '',
	emailing: false,
	emailSent: false,
	emailError: '',
})

const emit = defineEmits<{
	close: []
	download: []
	email: []
	print: []
}>()

const titleId = useId()

function close() {
	emit('close')
}
</script>
