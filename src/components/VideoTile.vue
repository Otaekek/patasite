<script setup lang="ts">
defineProps<{
  src: string
}>()
</script>

<template>
  <video :src="src" class="aspect-square w-full rounded object-cover" preload="metadata" muted playsinline></video>

  <div class="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
    <svg viewBox="0 0 24 24" class="h-14 w-14 drop-shadow-lg" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="black" fill-opacity="0.45" />
      <path d="M9.5 7.5v9l7-4.5z" fill="white" />
    </svg>
  </div>
</template>
