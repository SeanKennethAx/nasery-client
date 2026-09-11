<script setup lang="ts">
const { isAuthenticated, user } = useAuth()
const dashboard = computed(() => user.value?.role === 'organizer'
  ? '/organizer/home'
  : user.value?.role === 'team_member' ? '/team/dashboard' : '/client/my-events')
</script>

<template>
  <div class="public-site min-h-screen bg-[#f8f9f7] text-gray-900">
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-4">Skip to content</a>
    <header class="border-b border-gray-200 bg-white">
      <nav aria-label="Main navigation" class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <NuxtLink to="/" aria-label="NaSeRy home" class="flex items-center gap-2.5">
          <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-700 text-xl font-bold text-white">N</span>
          <span class="text-xl font-extrabold tracking-tight">NaSeRy<span class="text-primary-600">.</span></span>
        </NuxtLink>
        <div class="flex flex-wrap items-center gap-4 text-sm font-semibold sm:gap-7">
          <NuxtLink to="/marketplace" class="text-primary-700 hover:underline">Event marketplace</NuxtLink>
          <NuxtLink to="/organizers" class="text-primary-700 hover:underline">Browse organizers</NuxtLink>
          <NuxtLink v-if="isAuthenticated" :to="dashboard" class="rounded-lg border border-gray-200 px-4 py-2.5 hover:bg-gray-50">My dashboard</NuxtLink>
          <NuxtLink v-else to="/login" class="hover:text-primary-700">Sign in</NuxtLink>
          <NuxtLink v-if="!isAuthenticated || user?.role === 'client'" to="/client/post-event" class="rounded-lg bg-primary-700 px-4 py-2.5 text-white hover:bg-primary-900">Post an event <span aria-hidden="true">↗</span></NuxtLink>
        </div>
      </nav>
    </header>
    <main id="main-content"><slot /></main>
    <footer class="mt-16 border-t border-gray-200">
      <div class="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-5 py-8 text-sm text-gray-500 sm:flex-row sm:px-8">
        <span class="font-bold text-primary-800">NaSeRy · Bring your event to life.</span>
        <span>Explore freely. Sign in when you’re ready to plan.</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.public-site :deep(a:focus-visible), .public-site :deep(button:focus-visible),
.public-site :deep(input:focus-visible), .public-site :deep(select:focus-visible),
.public-site :deep(summary:focus-visible) {
  outline: 3px solid #417f88;
  outline-offset: 4px;
}
</style>
