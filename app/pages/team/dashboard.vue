<template>
    <div>
        <div class="mb-7">
            <p class="text-sm font-semibold text-primary-700">Team Member Portal</p>
            <h1 class="mt-1 text-2xl font-extrabold text-gray-900">Hi there, {{ firstName }} 👋</h1>
            <p class="mt-1 text-gray-500">View your assigned event tasks and update your progress.</p>
        </div>
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <div v-for="card in stats" :key="card.label" class="rounded-2xl border border-gray-200 bg-white p-5">
                <div class="flex items-start justify-between">
                    <div>
                        <p class="text-sm text-gray-500">{{ card.label }}</p>
                        <p class="mt-4 text-3xl font-extrabold text-gray-900">{{ card.value }}</p>
                    </div>
                    <div class="flex h-10 w-10 items-center justify-center rounded-xl" :class="card.iconClass">
                        <IconBase :name="card.icon" class="h-5 w-5" />
                    </div>
                </div>
            </div>
        </div>
        <div v-if="errorMessage" class="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{{
            errorMessage }}</div>
        <div v-if="loading"
            class="mt-6 rounded-2xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">Loading your
            assignments...</div>
        <div v-else class="mt-6 space-y-5">
            <article v-for="group in groupedTasks" :key="group.event.id"
                class="rounded-2xl border border-gray-200 bg-white p-6">
                <div class="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-5">
                    <div class="flex items-center gap-3">
                        <div
                            class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                            <IconBase name="calendar" class="h-5 w-5" />
                        </div>
                        <div>
                            <h2 class="text-lg font-bold text-gray-900">{{ group.event.name }}</h2>
                            <p class="mt-0.5 text-sm text-gray-500">{{ group.event.event_type }} · {{
                                formatDate(group.event.event_date) }}</p>
                        </div>
                    </div><span class="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">{{
                        group.tasks.length }} task{{ group.tasks.length === 1 ? '' : 's' }}</span>
                </div>
                <div class="divide-y divide-gray-100">
                    <div v-for="task in group.tasks" :key="task.id" class="py-5 last:pb-0">
                        <div class="flex items-start gap-3">
                            <div class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                                :class="task.is_completed ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'">
                                <IconBase :name="task.is_completed ? 'check-circle' : 'clock'" class="h-5 w-5" />
                            </div>
                            <div class="min-w-0 flex-1">
                                <div class="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <h3 class="text-sm font-semibold text-gray-900">{{ task.label }}</h3>
                                        <p v-if="task.completion_note" class="mt-1 text-xs text-gray-500">{{
                                            task.completion_note }}</p>
                                    </div><span v-if="task.is_completed"
                                        class="rounded-full px-2.5 py-1 text-xs font-semibold"
                                        :class="reviewClass(task.review_status)">{{ reviewLabel(task.review_status)
                                        }}</span>
                                </div>
                                <p v-if="task.review_status === 'changes_requested'"
                                    class="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">The
                                    organizer requested changes. Update the work and submit it again.</p>
                                <div v-if="!task.is_completed" class="mt-3 flex flex-col gap-2 sm:flex-row"><input
                                        v-model="notes[task.id]"
                                        class="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary-500"
                                        placeholder="Completion note (optional)"><button
                                        class="rounded-lg bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                                        :disabled="completingId === task.id" @click="completeTask(task)">{{
                                            completingId ===task.id?'Saving...':'Mark Completed' }}</button></div>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
            <div v-if="!tasks.length"
                class="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
                <IconBase name="check-circle" class="mx-auto h-8 w-8 text-primary-700" />
                <h2 class="mt-3 font-bold text-gray-900">You’re all caught up</h2>
                <p class="mt-1 text-sm text-gray-500">New assignments from your organizer will appear here.</p>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
interface Task { id: number; label: string; is_completed: boolean; completion_note: string | null; review_status: string; event: { id: number; name: string; event_type: string; event_date: string | null } }
definePageMeta({ layout: 'team', middleware: ['team'] }); const config = useRuntimeConfig(); const { token, firstName } = useAuth('team_member'); const tasks = ref<Task[]>([]), loading = ref(true), errorMessage = ref(''), completingId = ref<number | null>(null), notes = reactive<Record<number, string>>({})
const groupedTasks = computed(() => Object.values(tasks.value.reduce<Record<number, { event: Task['event']; tasks: Task[] }>>((groups, task) => { (groups[task.event.id] ??= { event: task.event, tasks: [] }).tasks.push(task); return groups }, {})))
const stats = computed(() => [{ label: 'Assigned Tasks', value: tasks.value.length, icon: 'clipboard-list', iconClass: 'bg-gray-100 text-gray-500' }, { label: 'Assigned Events', value: groupedTasks.value.length, icon: 'calendar', iconClass: 'bg-blue-50 text-blue-600' }, { label: 'Ready to Work', value: tasks.value.filter(t => !t.is_completed).length, icon: 'clock', iconClass: 'bg-amber-50 text-amber-600' }, { label: 'Completed', value: tasks.value.filter(t => t.is_completed).length, icon: 'check-circle', iconClass: 'bg-green-50 text-green-600' }])
async function load() { loading.value = true; try { const response = await $fetch<{ data: { tasks: Task[] } }>(`${config.public.apiBaseURL}/team/dashboard`, { headers: { Authorization: `Bearer ${token.value}`, Accept: 'application/json' } }); tasks.value = response.data.tasks } catch (error: any) { errorMessage.value = error.data?.message ?? 'Unable to load assignments.' } finally { loading.value = false } }
async function completeTask(task: Task) { completingId.value = task.id; try { await $fetch(`${config.public.apiBaseURL}/team/tasks/${task.id}/complete`, { method: 'PUT', headers: { Authorization: `Bearer ${token.value}`, Accept: 'application/json' }, body: { completion_note: notes[task.id] || null } }); await load() } catch (error: any) { errorMessage.value = error.data?.message ?? 'Unable to complete task.' } finally { completingId.value = null } }
const formatDate = (value: string | null) => value ? new Date(value).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Date not set'; const reviewLabel = (status: string) => status === 'verified' ? 'Verified' : status === 'changes_requested' ? 'Changes Requested' : 'Awaiting Review'; const reviewClass = (status: string) => status === 'verified' ? 'bg-green-50 text-green-700' : status === 'changes_requested' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'; onMounted(load)
</script>
