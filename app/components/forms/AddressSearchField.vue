<template>
	<div>
		<FormsLabel :text="label" :required="required" />
		<div class="relative">
			<FormsTextField v-model="query" type="text" :placeholder="placeholder" size="lg" autocomplete="off" :required="required">
				<template #icon>
					<svg viewBox="0 0 20 20" class="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-primary-600">
						<path fill="currentColor" d="M10 1.5a6 6 0 0 0-6 6c0 4.5 6 11 6 11s6-6.5 6-11a6 6 0 0 0-6-6Zm0 8.2a2.2 2.2 0 1 1 0-4.4 2.2 2.2 0 0 1 0 4.4Z" />
					</svg>
				</template>
			</FormsTextField>
			<span v-if="loading" class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">Searching…</span>
			<div v-if="suggestions.length" class="absolute z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white py-1 shadow-xl">
				<button v-for="place in suggestions" :key="placeKey(place)" type="button" class="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-gray-50" @click="select(place)">
					<IconBase name="map-pin" class="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
					<span class="min-w-0"><span class="block text-sm font-semibold text-gray-800">{{ place.display_place || place.display_name }}</span><span class="mt-0.5 block text-xs leading-relaxed text-gray-500">{{ place.display_name }}</span></span>
				</button>
			</div>
		</div>
		<p v-if="error" class="mt-2 text-xs text-red-600">{{ error }}</p>
		<p v-else-if="selected" class="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-700"><IconBase name="check-circle" class="h-3.5 w-3.5" /> Address confirmed</p>
		<p v-else-if="hint" class="mt-1.5 text-xs text-gray-400">{{ hint }}</p>
	</div>
</template>

<script setup lang="ts">
export interface RegistrationLocation {
	address: string
	providerId: string
	latitude: number
	longitude: number
}

interface Place { place_id?: string | number; osm_id?: string | number; osm_type?: string; display_name: string; display_place?: string; lat: string; lon: string }

const props = withDefaults(defineProps<{ modelValue: string; selected: RegistrationLocation | null; label: string; placeholder: string; required?: boolean; hint?: string }>(), { required: false, hint: '' })
const emit = defineEmits<{ 'update:modelValue': [value: string]; 'update:selected': [value: RegistrationLocation | null] }>()
const config = useRuntimeConfig()
const query = computed({ get: () => props.modelValue, set: value => emit('update:modelValue', value) })
const suggestions = ref<Place[]>([])
const loading = ref(false)
const error = ref('')
let timer: ReturnType<typeof setTimeout> | null = null
let applying = false

watch(query, value => {
	if (applying) return
	if (props.selected?.address === value.trim()) return
	emit('update:selected', null)
	error.value = ''
	suggestions.value = []
	if (timer) clearTimeout(timer)
	if (value.trim().length < 3) return
	timer = setTimeout(() => search(value.trim()), 400)
})

onBeforeUnmount(() => { if (timer) clearTimeout(timer) })

async function search(value: string) {
	const key = String(config.public.locationIqApiKey || '')
	if (!key) { error.value = 'Location search is not configured.'; return }
	loading.value = true
	try {
		suggestions.value = await $fetch<Place[]>('https://api.locationiq.com/v1/autocomplete', { query: { key, q: value, limit: 6, countrycodes: 'ph', normalizecity: 1 } })
		if (!suggestions.value.length) error.value = 'No matching addresses found.'
	} catch { error.value = 'Unable to search addresses. Please try again.' }
	finally { loading.value = false }
}

function placeKey(place: Place) { return String(place.place_id || `${place.osm_type}:${place.osm_id}`) }
function select(place: Place) {
	const latitude = Number(place.lat)
	const longitude = Number(place.lon)
	if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) { error.value = 'This address has invalid coordinates.'; return }
	const selected = { address: place.display_name, providerId: String(place.place_id || `${place.osm_type}:${place.osm_id}`), latitude, longitude }
	applying = true
	emit('update:modelValue', selected.address)
	emit('update:selected', selected)
	nextTick(() => { applying = false })
	suggestions.value = []
	error.value = ''
}
</script>
