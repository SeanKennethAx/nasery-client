<script setup lang="ts">
defineProps<{
	name: string
}>()
</script>

<template>
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"
		stroke-linejoin="round">
		<template v-if="name === 'home'">
			<path d="M3 11.5 12 4l9 7.5" />
			<path d="M5 10v10h5v-6h4v6h5V10" />
		</template>
		<template v-else-if="name === 'chart-bar'">
			<line x1="18" y1="20" x2="18" y2="10" />
			<line x1="12" y1="20" x2="12" y2="4" />
			<line x1="6" y1="20" x2="6" y2="14" />
		</template>
		<template v-else-if="name === 'file-text'">
			<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
			<polyline points="14 2 14 8 20 8" />
			<line x1="16" y1="13" x2="8" y2="13" />
			<line x1="16" y1="17" x2="8" y2="17" />
		</template>
		<template v-else-if="name === 'calendar'">
			<rect x="3" y="4" width="18" height="18" rx="2" />
			<line x1="16" y1="2" x2="16" y2="6" />
			<line x1="8" y1="2" x2="8" y2="6" />
			<line x1="3" y1="10" x2="21" y2="10" />
		</template>
		<template v-else-if="name === 'clipboard-list'">
			<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
			<rect x="9" y="3" width="6" height="4" rx="1" />
			<line x1="9" y1="12" x2="15" y2="12" />
			<line x1="9" y1="16" x2="13" y2="16" />
		</template>
		<template v-else-if="name === 'users'">
			<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
			<circle cx="9" cy="7" r="4" />
			<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
			<path d="M16 3.13a4 4 0 0 1 0 7.75" />
		</template>
		<template v-else-if="name === 'log-out'">
			<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
			<polyline points="16 17 21 12 16 7" />
			<line x1="21" y1="12" x2="9" y2="12" />
		</template>
		<template v-else-if="name === 'x'">
			<line x1="18" y1="6" x2="6" y2="18" />
			<line x1="6" y1="6" x2="18" y2="18" />
		</template>
		<template v-else-if="name === 'clock'">
			<circle cx="12" cy="12" r="10" />
			<polyline points="12 6 12 12 16 14" />
		</template>
		<template v-else-if="name === 'trending-up'">
			<polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
			<polyline points="17 6 23 6 23 12" />
		</template>
		<template v-else-if="name === 'cash'">
			<circle cx="12" cy="12" r="10" />
			<path d="M12 6v12M15.5 9.5c0-1.5-1.6-2.5-3.5-2.5s-3.5 1-3.5 2.5 1.6 2 3.5 2.5 3.5 1 3.5 2.5-1.6 2.5-3.5 2.5-3.5-1-3.5-2.5" />
		</template>
		<template v-else-if="name === 'bell'">
			<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
			<path d="M13.73 21a2 2 0 0 1-3.46 0" />
		</template>
		<template v-else-if="name === 'arrow-right'">
			<line x1="5" y1="12" x2="19" y2="12" />
			<polyline points="12 5 19 12 12 19" />
		</template>
		<template v-else-if="name === 'award'">
			<circle cx="12" cy="8" r="6" />
			<polyline points="8.5 13.5 7 22 12 19 17 22 15.5 13.5" />
		</template>
		<template v-else-if="name === 'check-circle'">
			<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
			<polyline points="22 4 12 14.01 9 11.01" />
		</template>
		<template v-else-if="name === 'x-circle'">
			<circle cx="12" cy="12" r="10" />
			<line x1="15" y1="9" x2="9" y2="15" />
			<line x1="9" y1="9" x2="15" y2="15" />
		</template>
		<template v-else-if="name === 'user'">
			<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
			<circle cx="12" cy="7" r="4" />
		</template>
		<template v-else-if="name === 'star'">
			<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
		</template>
		<template v-else-if="name === 'map-pin'">
			<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
			<circle cx="12" cy="10" r="3" />
		</template>
		<template v-else-if="name === 'send'">
			<polygon points="22 2 15 22 11 13 2 9 22 2" />
		</template>
		<template v-else-if="name === 'message'">
			<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
		</template>
		<template v-else-if="name === 'tag'">
			<path d="M20.59 13.41 13.42 20.6a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" />
			<circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none" />
		</template>
		<template v-else-if="name === 'plus'">
			<line x1="12" y1="5" x2="12" y2="19" />
			<line x1="5" y1="12" x2="19" y2="12" />
		</template>
		<template v-else-if="name === 'menu'">
			<line x1="3" y1="6" x2="21" y2="6" />
			<line x1="3" y1="12" x2="21" y2="12" />
			<line x1="3" y1="18" x2="21" y2="18" />
		</template>
	</svg>
</template>
