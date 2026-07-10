<template>
	<div class="mb-5 grid grid-cols-3 gap-2 sm:gap-2.5">
		<button
			type="button"
			class="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white py-2.5 px-1 text-[13px] font-medium text-gray-700 hover:bg-gray-50"
		>
			<svg viewBox="0 0 48 48" class="h-5 w-5 shrink-0">
				<path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
				<path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
				<path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.6C29.6 34.9 26.9 36 24 36c-5.3 0-9.6-3.1-11.3-7.6l-6.6 5.1C9.6 39.6 16.2 44 24 44z"/>
				<path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.6 5.6C40.9 36.7 44 31 44 24c0-1.3-.1-2.7-.4-3.5z"/>
			</svg>
			<span class="hidden sm:inline">Google</span>
		</button>
		<button
			type="button"
			class="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white py-2.5 px-1 text-[13px] font-medium text-gray-700 hover:bg-gray-50"
		>
			<svg viewBox="0 0 24 24" class="h-5 w-5 shrink-0">
				<path fill="#1877F2" d="M24 12.1c0-6.6-5.4-12-12-12S0 5.5 0 12.1c0 6 4.4 10.9 10.1 11.9v-8.4H7.1v-3.5h3v-2.6c0-3 1.8-4.6 4.5-4.6 1.3 0 2.4.1 2.7.1v3.1h-1.9c-1.5 0-1.8.7-1.8 1.7v2.3h3.6l-.5 3.5h-3.1V24C19.6 23 24 18.1 24 12.1z"/>
			</svg>
			<span class="hidden sm:inline">Facebook</span>
		</button>
		<button
			type="button"
			class="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white py-2.5 px-1 text-[13px] font-medium text-gray-700 hover:bg-gray-50"
		>
			<svg viewBox="0 0 24 24" class="h-5 w-5 shrink-0">
				<path fill="#111" d="M16.5 1c.1 1.2-.4 2.4-1.1 3.3-.8.9-2 1.6-3.2 1.5-.1-1.2.4-2.5 1.1-3.3.8-.9 2.1-1.6 3.2-1.5zM20.7 17.2c-.5 1.2-.8 1.7-1.5 2.7-1 1.5-2.4 3.3-4.1 3.3-1.5 0-1.9-1-4-1-2 0-2.5 1-4 1-1.7 0-3-1.7-4-3.1C1 17.2.1 13 1.4 9.9c.9-2.1 2.5-3.4 4.2-3.4 1.6 0 2.6 1 4 1 1.3 0 2.1-1 4-1 1.5 0 3.1.8 4.1 2.2-3.6 2-3 6.9.9 8.5z"/>
			</svg>
			<span class="hidden sm:inline">Apple</span>
		</button>
	</div>

	<div class="relative my-5 text-center text-[13px] text-gray-400">
		<div class="absolute inset-x-0 top-1/2 h-px bg-gray-200" />
		<span class="relative bg-white px-3">or continue with</span>
	</div>
</template>
