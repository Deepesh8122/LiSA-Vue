<template>
  <span 
    class="material-symbols-outlined"
    :class="[size, color]"
  >
    {{ name }}
  </span>
</template>

<script lang="ts">
export default {
  name: 'MaterialIcon',
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: 'text-base',
      validator: (value: string) => ['text-sm', 'text-base', 'text-lg', 'text-xl'].includes(value)
    },
    color: {
      type: String,
      default: undefined
    }
  }
}
</script>