<template>
    <flat-pickr v-model="dateValue" :config="config" :id="id" :name="name" :disabled="disabled"
        :placeholder="placeholder" :class="[
            'appearance-none block w-full px-3 h-11 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm',
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
    placeholder?: string
    minDate?: string
    maxDate?: string
    disabled?: boolean
}>(), {
    name: '', modelValue: '', placeholder: 'Select date and time', disabled: false,
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const dateValue = ref(props.modelValue)
const config = computed(() => ({
    enableTime: true,
    dateFormat: 'Y-m-d\\TH:i',
    altInput: true,
    altFormat: 'F j, Y at h:i K',
    time_24hr: false,
    disableMobile: true,
    minDate: props.minDate || undefined,
    maxDate: props.maxDate || undefined,
}))

watch(() => props.modelValue, value => {
    dateValue.value = value || ''
})

function updateValue(_selectedDates: Date[], dateString: string) {
    emit('update:modelValue', dateString || '')
}
</script>
