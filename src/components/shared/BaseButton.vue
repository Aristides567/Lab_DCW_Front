<script setup>
const emit = defineEmits(['click'])

const handleClick = (event) => {
  event.stopPropagation()
  emit('click', event)
}
</script>

<template>
  <button
    @click="handleClick"
    class="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <slot />
  </button>
</template>
