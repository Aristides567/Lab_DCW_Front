<template>
  <div class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4" v-if="visible">
    <div class="bg-white rounded-2xl shadow-xl p-6 max-w-lg w-full relative max-h-[90vh] overflow-y-auto">
      <slot />
      <button
        class="absolute top-2 right-2 text-white bg-red-600 px-3 py-1 rounded-full hover:bg-red-800"
        @click="$emit('close')"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  visible: Boolean
})
</script>
