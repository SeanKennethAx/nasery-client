<template>
	<div class="relative">
		<button type="button" aria-label="Open notifications"
			class="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
			@click="togglePanel">
			<IconBase name="bell" class="h-[18px] w-[18px]" />
			<span v-if="unreadCount" class="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-700 px-1 text-[10px] font-bold text-white ring-2 ring-white">
				{{ unreadCount > 9 ? '9+' : unreadCount }}
			</span>
		</button>

		<div v-if="open" class="absolute right-0 top-12 z-[80] w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
			<header class="flex items-center justify-between border-b border-gray-100 px-4 py-3.5">
				<div>
					<p class="text-sm font-bold text-gray-900">Notifications</p>
					<p class="mt-0.5 text-xs text-gray-500">{{ unreadCount ? `${unreadCount} unread update${unreadCount === 1 ? '' : 's'}` : 'You are all caught up' }}</p>
				</div>
				<button v-if="unreadCount" type="button" class="text-xs font-bold text-primary-700 hover:text-primary-900" @click="markAllRead">
					Mark all read
				</button>
			</header>

			<div class="max-h-96 overflow-y-auto overscroll-contain">
				<div v-if="loading && !items.length" class="px-5 py-10 text-center text-sm text-gray-500">Loading updates…</div>
				<div v-else-if="!items.length" class="px-5 py-10 text-center">
					<span class="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-700"><IconBase name="bell" class="h-5 w-5" /></span>
					<p class="mt-3 text-sm font-bold text-gray-800">No notifications yet</p>
					<p class="mt-1 text-xs text-gray-500">{{ emptyMessage }}</p>
				</div>

				<article v-for="item in items" :key="item.id" class="group flex gap-3 border-b border-gray-100 px-4 py-3.5 last:border-b-0 hover:bg-gray-50" :class="{ 'bg-primary-50/50': !item.read_at }">
					<span class="mt-1.5 h-2 w-2 shrink-0 rounded-full" :class="item.read_at ? 'bg-gray-300' : 'bg-primary-600'" />
					<button type="button" class="min-w-0 flex-1 text-left" @click="openItem(item)">
						<p class="text-sm font-semibold leading-5 text-gray-900">{{ item.data.message }}</p>
						<div class="mt-1 flex items-center gap-2 text-xs text-gray-500">
							<span class="truncate">{{ item.data.event_title }}</span>
							<span>·</span><span class="shrink-0">{{ relativeTime(item.created_at) }}</span>
						</div>
					</button>
					<div class="flex shrink-0 items-start gap-0.5 opacity-70 transition group-hover:opacity-100">
						<button type="button" class="rounded-lg p-1.5 text-gray-400 hover:bg-white hover:text-primary-700" :title="item.read_at ? 'Mark as unread' : 'Mark as read'" @click="toggleRead(item)">
							<IconBase :name="item.read_at ? 'mail' : 'check'" class="h-4 w-4" />
						</button>
						<button type="button" class="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600" title="Delete notification" @click="remove(item.id)">
							<IconBase name="trash" class="h-4 w-4" />
						</button>
					</div>
				</article>
			</div>

			<footer v-if="page < lastPage" class="border-t border-gray-100 bg-gray-50 px-4 py-3 text-center">
				<button type="button" class="text-xs font-bold text-primary-700" :disabled="loading" @click="load(page + 1, true)">{{ loading ? 'Loading…' : 'Load older notifications' }}</button>
			</footer>
		</div>
	</div>
</template>

<script setup lang="ts">
interface OrganizerNotification {
	id: string
	read_at: string | null
	created_at: string
	data: { type: string; message: string; event_title: string; inquiry_id?: number; quotation_id?: number }
}

const props = withDefaults(defineProps<{
	portal?: 'client' | 'organizer'
}>(), {
	portal: 'organizer',
})

const { token } = useAuth()
const config = useRuntimeConfig()
const open = ref(false)
const loading = ref(false)
const items = ref<OrganizerNotification[]>([])
const unreadCount = ref(0)
const page = ref(1)
const lastPage = ref(1)

const emptyMessage = computed(() => props.portal === 'client'
	? 'New quotations and event updates will appear here.'
	: 'New matching inquiries and accepted offers will appear here.')

const headers = computed(() => ({ Accept: 'application/json', Authorization: `Bearer ${token.value}` }))

async function load(nextPage = 1, append = false) {
	if (!token.value || loading.value) return
	loading.value = true
	try {
		const response = await $fetch<any>(`${config.public.apiBaseURL}/notifications`, { query: { page: nextPage, per_page: 10 }, headers: headers.value })
		items.value = append ? [...items.value, ...(response.data ?? [])] : response.data ?? []
		unreadCount.value = response.unread_count ?? 0
		page.value = response.meta?.current_page ?? nextPage
		lastPage.value = response.meta?.last_page ?? 1
	} finally { loading.value = false }
}

async function togglePanel() { open.value = !open.value; if (open.value) await load() }
async function mutate(path: string, method: 'POST' | 'DELETE' = 'POST') { await $fetch(`${config.public.apiBaseURL}${path}`, { method, headers: headers.value }); await load() }
async function toggleRead(item: OrganizerNotification) { await mutate(`/notifications/${item.id}/${item.read_at ? 'unread' : 'read'}`) }
async function remove(id: string) { await mutate(`/notifications/${id}`, 'DELETE') }
async function markAllRead() { await mutate('/notifications/read-all') }

async function openItem(item: OrganizerNotification) {
	if (!item.read_at) await mutate(`/notifications/${item.id}/read`)
	open.value = false
	if (props.portal === 'client') {
		await navigateTo('/client/my-events')
		return
	}

	await navigateTo(item.data.type === 'quotation_accepted'
		? '/organizer/inquiries/offers'
		: '/organizer/inquiries/match-inquiries')
}

function relativeTime(value: string) {
	const seconds = Math.max(1, Math.floor((Date.now() - new Date(value).getTime()) / 1000))
	if (seconds < 60) return 'Just now'
	if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
	if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
	return `${Math.floor(seconds / 86400)}d ago`
}

onMounted(() => load())
</script>
