<script setup lang="ts">
import { ref } from 'vue'
import Lightbox from './Lightbox.vue'
import VideoTile from './VideoTile.vue'
import HighlightedText from './HighlightedText.vue'
import { isVideo } from '../lib/media'

const props = withDefaults(
  defineProps<{
    id: string
    title: string
    description: string
    icon: string
    iconPosition?: string
    images: string[]
  }>(),
  { iconPosition: 'center top' },
)

const lightboxIndex = ref<number | null>(null)
</script>

<template>
  <section :id="id" class="mx-auto max-w-7xl scroll-mt-20 px-6 py-16">
    <div class="grid gap-10 md:grid-cols-[minmax(0,260px)_1fr] md:gap-12 lg:grid-cols-[minmax(0,360px)_1fr]">
      <div class="min-w-0 md:sticky md:top-24 md:self-start">
        <div class="relative z-10 flex min-w-0 flex-col items-center gap-4 text-center">
          <img
            :src="icon"
            :alt="`${title} icon`"
            :style="{ objectPosition: props.iconPosition }"
            class="h-24 w-24 shrink-0 rounded-full object-cover ring-1 ring-white/15"
          />
          <h2 class="font-display title-glow min-w-0 text-3xl tracking-tight text-white">{{ title }}</h2>
        </div>
        <div class="relative isolate mt-4">
          <!-- Hides the background pattern behind the text, fading it back in at the edges -->
          <div
            aria-hidden="true"
            class="pointer-events-none absolute -inset-x-6 -inset-y-12 -z-10 md:-inset-x-16 bg-[radial-gradient(closest-side,#000_60%,transparent)]"
          ></div>
          <p class="font-body text-lg leading-relaxed text-soft"><HighlightedText :text="description" /></p>
        </div>
      </div>

      <div v-if="images.length" class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          v-for="(src, i) in images"
          :key="src"
          type="button"
          class="relative cursor-pointer rounded-[2rem] transition-[transform,box-shadow] duration-300 ease-out will-change-transform backface-hidden hover:z-10 hover:scale-[1.03]"
          :class="
            i === 0
              ? 'shadow-[0_0_24px_-6px_var(--color-neon-purple),0_0_60px_-12px_var(--color-neon-blue)] hover:shadow-[0_0_32px_-4px_var(--color-neon-purple),0_0_80px_-8px_var(--color-neon-blue)] sm:col-span-2'
              : 'hover:shadow-[0_0_40px_rgba(255,255,255,0.12)]'
          "
          :aria-label="`View ${title} ${isVideo(src) ? 'video' : 'photo'} full screen`"
          @click="lightboxIndex = i"
        >
          <VideoTile v-if="isVideo(src)" :src="src" :wide="i === 0" />
          <img
            v-else
            :src="src"
            :alt="`${title} photo`"
            loading="lazy"
            class="w-full rounded-[2rem] object-cover"
            :class="i === 0 ? 'aspect-[2/1]' : 'aspect-square'"
          />
        </button>
      </div>

      <!-- No photos yet for this section - loud, unmistakable placeholder -->
      <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div
          v-for="n in 4"
          :key="n"
          class="flex aspect-square w-full items-center justify-center rounded border-2 border-dashed border-yellow-400/60 bg-[repeating-linear-gradient(45deg,rgba(250,204,21,0.15),rgba(250,204,21,0.15)_10px,transparent_10px,transparent_20px)] p-2 text-center text-xs font-bold uppercase tracking-wide text-yellow-400"
        >
          Placeholder — visuals coming soon
        </div>
      </div>
    </div>

    <Lightbox
      v-if="lightboxIndex !== null"
      :images="images"
      :initial-index="lightboxIndex"
      @close="lightboxIndex = null"
    />
  </section>
</template>
