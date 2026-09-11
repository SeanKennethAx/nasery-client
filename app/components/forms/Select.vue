<template>
    <Multiselect :close-on-select="true" :searchable="props.searchable" :options="props.options"
        :can-clear="props.canClear" :append-to-body="props.appendToBody" :close-on-scroll="props.closeOnScroll"
        :placeholder="props.placeholder" :disabled="props.disabled" no-options-text="This list is empty"
        noResultsText="No result found" :modelValue="props.modelValue"
        @update:modelValue="$emit('update:modelValue', $event)" />
</template>

<script setup lang="ts">
import Multiselect from '@vueform/multiselect'
import '@vueform/multiselect/themes/default.css'

const props = defineProps({
    appendToBody: {
        type: Boolean,
        default: false
    },
    canClear: {
        type: Boolean,
        default: true
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    closeOnScroll: {
        type: Boolean,
        default: false
    },
    modelValue: {
        default: null
    },
    options: {
        type: [Array, Object],
        required: true,
    },
    placeholder: {
        type: String,
        default: 'Select an option',
    },
    searchable: {
        type: Boolean,
        default: true
    },
})

defineEmits(['update:modelValue'])
</script>
