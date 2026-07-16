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
			<path
				d="M12 6v12M15.5 9.5c0-1.5-1.6-2.5-3.5-2.5s-3.5 1-3.5 2.5 1.6 2 3.5 2.5 3.5 1 3.5 2.5-1.6 2.5-3.5 2.5-3.5-1-3.5-2.5" />
		</template>
		<template v-else-if="name === 'bell'">
			<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
			<path d="M13.73 21a2 2 0 0 1-3.46 0" />
		</template>
		<template v-else-if="name === 'arrow-right'">
			<line x1="5" y1="12" x2="19" y2="12" />
			<polyline points="12 5 19 12 12 19" />
		</template>
		<template v-else-if="name === 'arrow-left'">
			<line x1="19" y1="12" x2="5" y2="12" />
			<polyline points="12 19 5 12 12 5" />
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
			<polygon
				points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
		</template>
		<template v-else-if="name === 'map-pin'">
			<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
			<circle cx="12" cy="10" r="3" />
		</template>
		<template v-else-if="name === 'send'">
			<polygon points="22 2 15 22 11 13 2 9 22 2" />
		</template>
		<template v-else-if="name === 'message'">
			<path
				d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
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
		<template v-else-if="name === 'edit'">
			<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
			<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
		</template>
		<template v-else-if="name === 'trash'">
			<polyline points="3 6 5 6 21 6" />
			<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
		</template>
		<template v-else-if="name === 'peso'">
			<text x="12" y="17.5" text-anchor="middle" font-size="15" font-weight="700" fill="currentColor"
				stroke="none">₱</text>
		</template>
		<template v-else-if="name === 'search'">
			<circle cx="11" cy="11" r="8" />
			<line x1="21" y1="21" x2="16.65" y2="16.65" />
		</template>
		<template v-else-if="name === 'filter'">
			<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
		</template>
		<template v-else-if="name === 'settings'">
			<circle cx="12" cy="12" r="3" />
			<path
				d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
		</template>
		<template v-else-if="name === 'phone'">
			<path
				d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
		</template>
		<template v-else-if="name === 'upload'">
			<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
			<polyline points="17 8 12 3 7 8" />
			<line x1="12" y1="3" x2="12" y2="15" />
		</template>
		<template v-else-if="name === 'download'">
			<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
			<polyline points="7 10 12 15 17 10" />
			<line x1="12" y1="15" x2="12" y2="3" />
		</template>
		<template v-else-if="name === 'qr-code'">
			<rect x="3" y="3" width="7" height="7" />
			<rect x="14" y="3" width="7" height="7" />
			<rect x="3" y="14" width="7" height="7" />
			<line x1="14" y1="14" x2="14" y2="21" />
			<line x1="21" y1="14" x2="21" y2="14.01" />
			<line x1="17.5" y1="17.5" x2="17.5" y2="17.5" />
			<line x1="14" y1="21" x2="21" y2="21" />
		</template>
		<template v-else-if="name === 'user-plus'">
			<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
			<circle cx="8.5" cy="7" r="4" />
			<line x1="20" y1="8" x2="20" y2="14" />
			<line x1="23" y1="11" x2="17" y2="11" />
		</template>
		<template v-else-if="name === 'credit-card'">
			<rect x="1" y="4" width="22" height="16" rx="2" />
			<line x1="1" y1="10" x2="23" y2="10" />
		</template>
		<template v-else-if="name === 'activity'">
			<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
		</template>
		<template v-else-if="name === 'sparkles'">
			<path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L6 10l6.2-1.8L12 2z" />
		</template>
		<template v-else-if="name === 'heart'">
			<path
				d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
		</template>
		<template v-else-if="name === 'briefcase'">
			<rect x="2" y="7" width="20" height="14" rx="2" />
			<path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
		</template>
		<template v-else-if="name === 'gift'">
			<polyline points="20 12 20 22 4 22 4 12" />
			<rect x="2" y="7" width="20" height="5" />
			<line x1="12" y1="22" x2="12" y2="7" />
			<path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
			<path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
		</template>
		<template v-else-if="name === 'music'">
			<path d="M9 18V5l12-2v13" />
			<circle cx="6" cy="18" r="3" />
			<circle cx="18" cy="16" r="3" />
		</template>
		<template v-else-if="name === 'chevron-down'">
			<polyline points="6 9 12 15 18 9" />
		</template>
		<template v-else-if="name === 'circle'">
			<circle cx="12" cy="12" r="9" />
		</template>
		<template v-else-if="name === 'utensils'">
			<path d="M3 2v7c0 1.1.9 2 2 2s2-.9 2-2V2" />
			<path d="M5 11v11" />
			<path d="M14 2v11a3 3 0 0 0 3 3h0" />
			<path d="M18 2v20" />
		</template>
		<template v-else-if="name === 'mic'">
			<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
			<path d="M19 10v2a7 7 0 0 1-14 0v-2" />
			<line x1="12" y1="19" x2="12" y2="23" />
			<line x1="8" y1="23" x2="16" y2="23" />
		</template>
		<template v-else-if="name === 'camera'">
			<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
			<circle cx="12" cy="13" r="4" />
		</template>
		<template v-else-if="name === 'truck'">
			<rect x="1" y="3" width="15" height="13" />
			<polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
			<circle cx="5.5" cy="18.5" r="2.5" />
			<circle cx="18.5" cy="18.5" r="2.5" />
		</template>
	</svg>
</template>

<script setup lang="ts">
defineProps<{
	name: string
}>()
</script>
