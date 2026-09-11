<template>
    <flat-pickr v-model="dateValue" :id="id" :name="name" :config="config" :disabled="disabled"
        :placeholder="placeholder" :class="[
            dateType === 'duty-schedule' && 'h-11 text-center rounded-none border-l-0 border-r-0 border border-gray-300 focus:outline-none',
            dateType === 'calendar' && 'h-11 text-center rounded-none border-0 focus:outline-none bg-transparent',
            !dateType && 'h-11 rounded-lg border border-gray-200 focus:outline-none focus:ring-primary focus:border-primary',
            disabled && 'cursor-not-allowed bg-gray-100 text-gray-500',
            'appearance-none block w-full px-5 py-3 placeholder-gray-500 text-gray-900 focus:z-10 sm:text-sm'
        ]" @on-change="updateValue" />
</template>

<script setup lang="ts">
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'

const props = withDefaults(defineProps<{
    id?: string
    dateType?: string
    disablePreviousWeeks?: boolean
    name?: string
    modelValue?: string
    placeholder?: string
    minDate?: string
    maxDate?: string
    disabled?: boolean
}>(), {
    disablePreviousWeeks: false,
    name: '',
    modelValue: '',
    placeholder: 'Select a date',
    disabled: false,
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const dateValue = ref(props.modelValue)
const config = computed(() => ({
    dateFormat: 'Y-m-d',
    altInput: true,
    altFormat: 'F j, Y',
    disableMobile: true,
    minDate: props.minDate || (props.disablePreviousWeeks ? 'today' : undefined),
    maxDate: props.maxDate || undefined,
}))

watch(() => props.modelValue, value => {
    dateValue.value = value || ''
})

function updateValue(_selectedDates: Date[], dateString: string) {
    emit('update:modelValue', dateString || '')
}
</script>
