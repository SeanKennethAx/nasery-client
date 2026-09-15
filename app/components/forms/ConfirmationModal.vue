<template>
	<Teleport to="body">
		<Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
			enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in"
			leave-from-class="opacity-100" leave-to-class="opacity-0">
			<div v-if="open"
				class="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
				role="dialog" aria-modal="true" :aria-labelledby="titleId" @click.self="cancel">
				<div class="w-full max-w-md overflow-hidden rounded-3xl border border-white/60 bg-white shadow-2xl">
					<div class="bg-[#285F6b] px-6 pb-6 pt-5 text-white">
						<div class="flex items-start justify-between gap-4">
							<div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/15">
								<IconBase :name="variant === 'success' ? 'check-circle' : icon" class="h-5 w-5" />
							</div>
							<button v-if="!loading" type="button" aria-label="Close"
								class="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
								@click="cancel">
								<IconBase name="x" class="h-4 w-4" />
							</button>
						</div>
						<p class="mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/60">{{ eyebrow }}</p>
						<h2 :id="titleId" class="mt-1 text-2xl font-black tracking-tight">{{ title }}</h2>
						<p class="mt-2 text-sm leading-6 text-white/75">{{ description }}</p>
					</div>

					<div class="p-6">
						<slot />

						<div class="mt-6 grid gap-3" :class="showCancel ? 'grid-cols-2' : 'grid-cols-1'">
							<button v-if="showCancel" type="button"
								class="h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
								:disabled="loading" @click="cancel">
								{{ cancelLabel }}
							</button>
							<button type="button"
								class="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#285F6b] px-4 text-sm font-bold text-white shadow-lg shadow-[#285F6b]/20 transition hover:bg-[#1f4a54] disabled:cursor-wait disabled:opacity-60"
								:disabled="loading" @click="$emit('confirm')">
								<IconBase :name="loading ? 'refresh-cw' : variant === 'success' ? 'arrow-right' : confirmIcon"
									class="h-4 w-4" :class="{ 'animate-spin': loading }" />
								{{ loading ? loadingLabel : confirmLabel }}
							</button>
						</div>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
	open: boolean
	title: string
	description: string
	eyebrow?: string
	variant?: 'confirmation' | 'success'
	icon?: string
	confirmIcon?: string
	confirmLabel?: string
	cancelLabel?: string
	loadingLabel?: string
	loading?: boolean
	showCancel?: boolean
}>(), {
	eyebrow: 'Please confirm',
	variant: 'confirmation',
	icon: 'send',
	confirmIcon: 'check-circle',
	confirmLabel: 'Continue',
	cancelLabel: 'Not yet',
	loadingLabel: 'Working...',
	loading: false,
	showCancel: true,
})

const emit = defineEmits<{
	confirm: []
	cancel: []
}>()

const titleId = useId()

function cancel() {
	if (!props.loading) emit('cancel')
}
</script>
