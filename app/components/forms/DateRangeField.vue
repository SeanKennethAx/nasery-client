<template>
    <flat-pickr v-model="dateValue" :id="id" :name="name" :config="config" :disabled="disabled"
        :placeholder="placeholder" :class="[
            'appearance-none block w-full px-3 py-2.5 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm',
            disabled && 'cursor-not-allowed bg-gray-100 text-gray-500'
        ]" @on-change="updateValue" />
</template>

<script setup lang="ts">
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'

const props = withDefaults(defineProps<{
    id?: string
    name?: string
    modelValue?: string[]
    placeholder?: string
    minDate?: string
    maxDate?: string
    disabled?: boolean
}>(), {
    name: '',
    modelValue: () => [],
    placeholder: 'Select a date range',
    disabled: false,
})

const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()
const dateValue = ref<string[]>([...props.modelValue])
const config = computed(() => ({
    mode: 'range' as const,
    dateFormat: 'Y-m-d',
    altInput: true,
    altFormat: 'M j, Y',
    disableMobile: true,
    minDate: props.minDate || undefined,
    maxDate: props.maxDate || undefined,
}))

watch(() => props.modelValue, value => {
    dateValue.value = value ? [...value] : []
}, { deep: true })

function updateValue(_selectedDates: Date[], dateString: string) {
    const values = dateString ? dateString.split(' to ') : []
    if (values.length === 2 || values.length === 0) emit('update:modelValue', values)
}
</script>
