<template>
  <div class="flex h-screen overflow-hidden bg-gray-50">
    <aside class="shrink-0 overflow-hidden border-r border-gray-200 bg-white transition-all duration-200" :class="sidebarOpen ? 'w-64' : 'w-0 border-r-0'">
      <div class="flex h-full w-64 flex-col overflow-y-auto">
        <div class="flex items-center gap-2.5 px-5 py-5"><div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-700 text-sm font-bold text-white">N</div><div><div class="text-base font-bold leading-tight text-gray-900">NaSeRy</div><div class="text-[11px] text-gray-400">Event Management System</div></div></div>
        <div class="px-5 pb-3"><span class="inline-flex items-center gap-1.5 rounded-md bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700"><span class="h-1.5 w-1.5 rounded-full bg-primary-600" />Team Member Portal</span></div>
        <nav class="flex-1 space-y-1 px-3"><NuxtLink to="/team/dashboard" class="flex items-center gap-3 rounded-lg bg-primary-700 px-3 py-2.5 text-sm font-semibold text-white"><IconBase name="clipboard-list" class="h-[18px] w-[18px]" />My Assignments</NuxtLink></nav>
        <div class="border-t border-gray-100 px-4 py-4">
          <button type="button" class="mb-1 flex w-full items-center gap-3 rounded-lg p-1.5 text-left hover:bg-gray-50" @click="openProfilePanel"><div class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-700 text-sm font-bold text-white"><img v-if="user?.avatar_url" :src="user.avatar_url" alt="" class="h-full w-full object-cover" /><span v-else>{{ initials }}</span></div><div class="min-w-0"><div class="truncate text-sm font-semibold text-gray-900">{{ fullName }}</div><div class="text-xs text-gray-400">Team Member</div></div></button>
          <p class="mb-3 px-1.5 text-[11px] text-gray-400">Click profile to customise</p>
          <button type="button" class="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700" @click="signOut"><IconBase name="log-out" class="h-4 w-4" />Sign out</button>
        </div>
      </div>
    </aside>
    <div class="flex min-w-0 flex-1 flex-col">
      <header class="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 py-3.5"><div class="flex items-center gap-4"><button type="button" class="text-gray-400 hover:text-gray-600" @click="sidebarOpen = !sidebarOpen"><IconBase :name="sidebarOpen ? 'x' : 'menu'" class="h-5 w-5" /></button><div><div class="text-xs text-gray-400">Team Member Portal</div><div class="text-sm font-bold text-gray-900">My Assignments</div></div></div><span class="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700"><span class="h-1.5 w-1.5 rounded-full bg-green-500" />System Online</span></header>
      <main class="flex-1 overflow-y-auto p-6"><slot /></main>
    </div>

    <Transition name="fade"><div v-if="showProfilePanel" class="fixed inset-0 z-40 bg-gray-900/40" @click="closeProfilePanel" /></Transition>
    <Transition name="slide">
      <section v-if="showProfilePanel" class="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-white shadow-2xl" aria-labelledby="team-profile-title">
        <div class="relative shrink-0 pb-10"><div class="h-24 bg-primary-700"><img v-if="user?.cover_url" :src="user.cover_url" alt="" class="h-full w-full object-cover" /></div><button type="button" aria-label="Close profile" class="absolute right-4 top-4 text-white/80 hover:text-white" @click="closeProfilePanel"><IconBase name="x" class="h-5 w-5" /></button><div class="absolute -bottom-1 left-6 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-primary-50 text-lg font-bold text-primary-700 shadow-sm"><img v-if="user?.avatar_url" :src="user.avatar_url" alt="" class="h-full w-full object-cover" /><span v-else>{{ draftInitials }}</span></div></div>
        <div class="border-b border-gray-200 px-6 pb-5"><p class="text-xs font-bold uppercase tracking-widest text-primary-700">Team member profile</p><h2 id="team-profile-title" class="mt-1 text-xl font-bold text-gray-900">{{ draftFullName || 'Your profile' }}</h2><p class="mt-1 text-sm text-gray-500">Update the contact details your organizer sees.</p></div>
        <div class="flex-1 overflow-y-auto px-6 py-6">
          <ProfileMediaEditor class="mb-6" />
          <div class="mb-6 flex items-start gap-3 rounded-xl border border-primary-100 bg-primary-50 p-4"><span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-primary-700"><IconBase name="user" class="h-4 w-4" /></span><div><p class="text-sm font-bold text-primary-900">Personal information</p><p class="mt-1 text-xs leading-relaxed text-primary-800/70">Keep this current so your organizer can identify and contact you.</p></div></div>
          <div class="grid gap-4 sm:grid-cols-2"><div><label class="profile-label">First name *</label><input v-model="draft.firstname" class="profile-input" autocomplete="given-name" /></div><div><label class="profile-label">Middle name</label><input v-model="draft.middlename" class="profile-input" autocomplete="additional-name" /></div></div>
          <div class="mt-4"><label class="profile-label">Last name *</label><input v-model="draft.lastname" class="profile-input" autocomplete="family-name" /></div>
          <div class="my-6 border-t border-gray-100" />
          <div><label class="profile-label">Email address</label><input v-model="draft.email" type="email" class="profile-input" autocomplete="email" /></div>
          <div class="mt-4"><label class="profile-label">Phone number</label><input v-model="draft.phone" class="profile-input" placeholder="+639171234567" autocomplete="tel" /><p class="mt-1.5 text-xs text-gray-400">Use the Philippine format +639XXXXXXXXX.</p></div>
          <div class="mt-4"><label class="profile-label">Address</label><textarea v-model="draft.address" rows="3" class="profile-input resize-none" autocomplete="street-address" /></div>
          <div v-if="saveError" class="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{{ saveError }}</div>
          <div v-if="saveSuccess" class="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700" role="status">Profile updated successfully.</div>
        </div>
        <div class="flex shrink-0 gap-3 border-t border-gray-200 px-6 py-4"><button type="button" class="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50" @click="closeProfilePanel">Cancel</button><button type="button" class="flex-1 rounded-xl bg-primary-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-primary-900 disabled:cursor-not-allowed disabled:opacity-50" :disabled="isSaving || !canSave" @click="saveProfile">{{ isSaving ? 'Saving…' : 'Save changes' }}</button></div>
      </section>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types/auth'

const { user, fullName, initials, token, logout } = useAuth('team_member')
const config = useRuntimeConfig()
const sidebarOpen = ref(true)
const showProfilePanel = ref(false)
const isSaving = ref(false)
const saveError = ref('')
const saveSuccess = ref(false)
const draft = reactive({ firstname: '', middlename: '', lastname: '', email: '', phone: '', address: '' })
const draftFullName = computed(() => [draft.firstname, draft.middlename, draft.lastname].map(value => value.trim()).filter(Boolean).join(' '))
const draftInitials = computed(() => [draft.firstname, draft.lastname].map(value => value.trim().charAt(0).toUpperCase()).join('') || 'TM')
const canSave = computed(() => Boolean(draft.firstname.trim() && draft.lastname.trim()))

function syncDraft() {
  if (!user.value) return
  Object.assign(draft, { firstname: user.value.firstname ?? '', middlename: user.value.middlename ?? '', lastname: user.value.lastname ?? '', email: user.value.email ?? '', phone: user.value.phone ?? '', address: user.value.address ?? '' })
}
function openProfilePanel() { syncDraft(); saveError.value = ''; saveSuccess.value = false; showProfilePanel.value = true }
function closeProfilePanel() { showProfilePanel.value = false }

async function saveProfile() {
  if (!token.value || !canSave.value) return
  isSaving.value = true; saveError.value = ''; saveSuccess.value = false
  try {
    const response = await $fetch<{ message: string; user: User }>(`${config.public.apiBaseURL}/auth/profile`, { method: 'PUT', headers: { Accept: 'application/json', Authorization: `Bearer ${token.value}` }, body: { firstname: draft.firstname.trim(), middlename: draft.middlename.trim() || null, lastname: draft.lastname.trim(), email: draft.email.trim().toLowerCase() || null, phone: draft.phone.trim() || null, address: draft.address.trim() || null } })
    user.value = { ...user.value!, ...response.user }
    saveSuccess.value = true
  } catch (error: any) {
    const errors = error?.data?.errors as Record<string, string[]> | undefined
    saveError.value = errors ? Object.values(errors).flat()[0] || 'Unable to save your profile.' : error?.data?.message || 'Unable to save your profile.'
  } finally { isSaving.value = false }
}
async function signOut() { logout(); await navigateTo('/login') }
</script>

<style scoped>
.profile-label { @apply mb-1.5 block text-sm font-semibold text-gray-700; }
.profile-input { @apply w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15; }
.fade-enter-active, .fade-leave-active, .slide-enter-active, .slide-leave-active { transition: all 180ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>
