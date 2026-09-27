<template>
	<div
		class="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#0e2a30] via-[#1f4a54] to-[#2f6f7c] px-6 py-6 text-white shadow-lg shadow-primary-900/10 sm:px-8 sm:py-7">
		<div class="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-cyan-300/10 blur-[90px]" />
		<div class="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-emerald-400/10 blur-[90px]" />

		<div class="relative flex items-center gap-3.5">
			<div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
				<IconBase name="grid" class="h-5 w-5" />
			</div>

			<div>
				<p class="text-xs font-bold uppercase tracking-[0.18em] text-white/50">Super Admin</p>
				<h1 class="text-2xl font-extrabold tracking-tight sm:text-3xl">Platform Control Center</h1>
			</div>
		</div>

		<p class="relative mt-3 max-w-2xl text-sm leading-6 text-white/60">
			Manage organizers, clients, and events across the NaSeRy platform.
		</p>
	</div>
</template>
