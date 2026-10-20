<script setup lang="ts">
import { ref } from 'vue'
import Lightbox from './Lightbox.vue'
import VideoTile from './VideoTile.vue'
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
  <section :id="id" class="mx-auto max-w-7xl scroll-mt-20 xl:max-w-none px-6 py-16">
    <div class="grid gap-10 md:grid-cols-[minmax(0,260px)_1fr] md:gap-16 xl:grid-cols-[minmax(240px,1fr)_minmax(0,56rem)_minmax(240px,1fr)] xl:gap-12">
      <div class="min-w-0 md:sticky md:top-24 md:self-start xl:w-full xl:max-w-[300px] xl:justify-self-end">
        <div class="flex min-w-0 items-center gap-3">
          <img
            :src="icon"
            :alt="`${title} icon`"
            :style="{ objectPosition: props.iconPosition }"
            class="h-14 w-14 shrink-0 rounded-full object-cover ring-1 ring-white/15"
          />
          <h2 class="font-display min-w-0 text-3xl tracking-tight text-white/90">{{ title }}</h2>
        </div>
        <p class="mt-4 text-white/60">{{ description }}</p>
      </div>

      <div v-if="images.length" class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          v-for="(src, i) in images"
          :key="src"
          type="button"
          class="relative cursor-pointer rounded-[2rem] transition duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:z-10 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(255,255,255,0.12)]"
          :class="{ 'sm:col-span-2': i === 0 }"
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
