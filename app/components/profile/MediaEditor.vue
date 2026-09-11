<template>
  <div>
    <div class="grid gap-3 sm:grid-cols-2">
      <label class="group flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 transition hover:border-primary-300 hover:bg-primary-50/40">
        <span class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-700 text-xs font-bold text-white"><img v-if="user?.avatar_url" :src="user.avatar_url" alt="" class="h-full w-full object-cover" /><span v-else>{{ initials }}</span></span>
        <span class="min-w-0"><span class="block text-sm font-bold text-gray-800">Profile picture</span><span class="block text-xs text-gray-400">Choose a square image</span></span>
        <input type="file" accept="image/jpeg,image/png,image/webp" class="sr-only" @change="selectFile('avatar', $event)" />
      </label>
      <label class="group flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 transition hover:border-primary-300 hover:bg-primary-50/40">
        <span class="flex h-10 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary-700 text-white"><img v-if="user?.cover_url" :src="user.cover_url" alt="" class="h-full w-full object-cover" /><IconBase v-else name="camera" class="h-4 w-4" /></span>
        <span class="min-w-0"><span class="block text-sm font-bold text-gray-800">Cover photo</span><span class="block text-xs text-gray-400">Choose a wide image</span></span>
        <input type="file" accept="image/jpeg,image/png,image/webp" class="sr-only" @change="selectFile('cover', $event)" />
      </label>
    </div>
    <p class="mt-2 text-xs text-gray-400">JPG, PNG, or WebP · Profile 5 MB · Cover 8 MB</p>
    <div v-if="isUploading" class="mt-3 rounded-lg bg-primary-50 px-3 py-2 text-xs font-semibold text-primary-700">Uploading image…</div>
    <div v-if="mediaError" class="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700" role="alert">{{ mediaError }}</div>
  </div>
</template>

<script setup lang="ts">
const { user, token, initials } = useAuth()
const config = useRuntimeConfig()
const isUploading = ref(false)
const mediaError = ref('')

async function selectFile(kind: 'avatar' | 'cover', event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file || !token.value) return
  mediaError.value = ''
  const limit = kind === 'avatar' ? 5 : 8
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > limit * 1024 * 1024) {
    mediaError.value = `Choose a JPG, PNG, or WebP image under ${limit} MB.`
    return
  }
  const body = new FormData()
  body.append(kind, file)
  isUploading.value = true
  try {
    const response = await $fetch<{ avatar_url: string | null; cover_url: string | null }>(`${config.public.apiBaseURL}/auth/profile/media`, { method: 'POST', headers: { Accept: 'application/json', Authorization: `Bearer ${token.value}` }, body })
    if (user.value) user.value = { ...user.value, avatar_url: response.avatar_url, cover_url: response.cover_url }
  } catch (error: any) {
    const errors = error?.data?.errors as Record<string, string[]> | undefined
    mediaError.value = errors ? Object.values(errors).flat()[0] || 'Unable to upload image.' : error?.data?.message || 'Unable to upload image.'
  } finally {
    isUploading.value = false
  }
}
</script>
