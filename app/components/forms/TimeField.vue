<template>
    <flat-pickr v-model="timeValue" :config="config" :id="id" :name="name" :disabled="disabled"
        :placeholder="placeholder" :class="[
            'appearance-none block w-full px-4 h-11 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-700 focus:border-primary-700 focus:z-10 sm:text-sm',
            disabled && 'cursor-not-allowed bg-gray-100 text-gray-500'
        ]" @on-change="updateValue" />
</template>

<script setup lang="ts">
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'

const props = withDefaults(defineProps<{
    id?: string
    name?: string
    modelValue?: string
    value?: string
    placeholder?: string
    minTime?: string
    maxTime?: string
    disabled?: boolean
}>(), {
    name: '', modelValue: '', value: '', placeholder: 'Select a time', disabled: false,
})

const emit = defineEmits<{
    'update:modelValue': [value: string]
    'update:value': [value: string]
}>()
const timeValue = ref(props.modelValue || props.value || '')
const config = computed(() => ({
    enableTime: true,
    noCalendar: true,
    dateFormat: 'H:i',
    altInput: true,
    altFormat: 'h:i K',
    time_24hr: false,
    disableMobile: true,
    minTime: props.minTime || undefined,
    maxTime: props.maxTime || undefined,
}))

watch(() => [props.modelValue, props.value], ([modelValue, value]) => {
    timeValue.value = modelValue || value || ''
})

function updateValue(_selectedDates: Date[], timeString: string) {
    const value = timeString || ''
    emit('update:modelValue', value)
    emit('update:value', value)
}
</script>
