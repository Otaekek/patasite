<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { isVideo } from '../lib/media'

const props = defineProps<{
  images: string[]
  initialIndex: number
}>()
const emit = defineEmits<{ close: [] }>()

const current = ref(props.initialIndex)
const currentSrc = computed(() => props.images[current.value])

function next() {
  current.value = (current.value + 1) % props.images.length
}
function prev() {
  current.value = (current.value - 1 + props.images.length) % props.images.length
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
  else if (e.key === 'ArrowRight') next()
  else if (e.key === 'ArrowLeft') prev()
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  document.body.style.overflow = 'hidden'
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
      @click.self="emit('close')"
    >
      <button
        type="button"
        class="absolute right-4 top-4 text-3xl leading-none text-white/70 hover:text-white"
        aria-label="Close"
        @click="emit('close')"
      >
        ×
      </button>

      <button
        v-if="images.length > 1"
        type="button"
        class="absolute left-2 text-5xl leading-none text-white/70 hover:text-white sm:left-6"
        aria-label="Previous image"
        @click="prev"
      >
        ‹
      </button>

      <!-- keyed by src so switching slides fully remounts the element,
           guaranteeing autoplay fires again for each new video -->
      <video
        v-if="isVideo(currentSrc)"
        :key="currentSrc"
        :src="currentSrc"
        class="max-h-[90vh] max-w-[90vw] object-contain"
        controls
        autoplay
        playsinline
      ></video>
      <img v-else :key="currentSrc" :src="currentSrc" alt="" class="max-h-[90vh] max-w-[90vw] object-contain" />

      <button
        v-if="images.length > 1"
        type="button"
        class="absolute right-2 text-5xl leading-none text-white/70 hover:text-white sm:right-6"
        aria-label="Next image"
        @click="next"
      >
        ›
      </button>
    </div>
  </Teleport>
</template>
