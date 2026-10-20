<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import logo from '../assets/brand/patatrack-logo.png'
import { isVideo } from '../lib/media'
import musicSrc from '../assets/audio/cosma-yok-yok.mp3'
import noteEighth from '../assets/notes/note-eighth.svg'
import noteBeamed from '../assets/notes/note-beamed.svg'
import noteQuarter from '../assets/notes/note-quarter.svg'
import HighlightedText from './HighlightedText.vue'

defineProps<{
  backgroundImage: string
}>()

const tagline =
  "Issu de la *free party*, Patatrack est un collectif qui épouse son environnement pour emmener son public dans une *ambiance onirique*, fondée sur la bienveillance, l'échange et le lâcher-prise. Créé par des personnes passionnées, nous avons créé notre propre système son, lumière, VJing, et divers éléments de scénographie... N'hésitez pas à *nous contacter* si vous souhaitez collaborer avec nous."

const noteIcons = [noteEighth, noteBeamed, noteQuarter]
const MUSIC_START_TIME = 23

const audio = new Audio(musicSrc)
audio.loop = true

const isPlaying = ref(false)
const notes = ref<{ id: number; icon: string; x: number; rotate: number }[]>([])
let noteIdCounter = 0
let noteInterval: number | undefined

function spawnNote() {
  const id = noteIdCounter++
  notes.value.push({
    id,
    icon: noteIcons[Math.floor(Math.random() * noteIcons.length)],
    x: (Math.random() - 0.5) * 70,
    rotate: (Math.random() - 0.5) * 50,
  })
  setTimeout(() => {
    notes.value = notes.value.filter((n) => n.id !== id)
  }, 1600)
}

function togglePlay() {
  if (isPlaying.value) {
    audio.pause()
    isPlaying.value = false
    clearInterval(noteInterval)
    notes.value = []
  } else {
    audio.currentTime = MUSIC_START_TIME
    audio.play()
    isPlaying.value = true
    spawnNote()
    noteInterval = window.setInterval(spawnNote, 400)
  }
}

onUnmounted(() => {
  audio.pause()
  clearInterval(noteInterval)
})

// custom mouse cursor showing a play/stop glyph while hovering the logo,
// instead of an icon drawn on top of it
function cursorSvg(iconMarkup: string) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><circle cx='16' cy='16' r='15' fill='black' fill-opacity='0.55'/>${iconMarkup}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 16 16, pointer`
}
const playCursor = cursorSvg("<path d='M12 9l12 7-12 7z' fill='white'/>")
const stopCursor = cursorSvg("<rect x='11' y='11' width='10' height='10' rx='1.5' fill='white'/>")
const cursorStyle = computed(() => (isPlaying.value ? stopCursor : playCursor))
</script>

<template>
  <section
    id="top"
    class="relative flex min-h-svh flex-col items-center justify-center overflow-hidden text-center"
  >
    <video
      v-if="isVideo(backgroundImage)"
      :src="backgroundImage"
      class="absolute inset-0 h-full w-full object-cover"
      autoplay
      loop
      muted
      playsinline
    ></video>
    <img
      v-else
      :src="backgroundImage"
      alt=""
      class="absolute inset-0 h-full w-full object-cover"
    />
    <div class="absolute inset-0 bg-black/70"></div>

    <div class="relative z-10 flex flex-col items-center gap-8 px-6 pt-20 pb-24">
      <button
        type="button"
        class="relative inline-block"
        :style="{ cursor: cursorStyle }"
        :aria-label="isPlaying ? 'Stop music' : 'Play music'"
        @click="togglePlay"
      >
        <img
          :src="logo"
          alt="Patatrack"
          class="w-64 max-w-[70vw] scale-100 drop-shadow-2xl transition-transform duration-200 hover:scale-110 sm:w-80"
        />

        <img
          v-for="note in notes"
          :key="note.id"
          :src="note.icon"
          aria-hidden="true"
          class="note-particle pointer-events-none absolute left-1/2 top-1/3 h-5 w-5"
          :style="{ '--note-x': `${note.x}px`, '--note-rotate': `${note.rotate}deg` }"
        />
      </button>

      <p class="max-w-xl text-balance text-lg leading-relaxed text-white/75">
        <HighlightedText :text="tagline" />
      </p>
    </div>

    <a
      href="#scenography"
      class="absolute bottom-14 z-10 animate-bounce text-white/70 hover:text-white"
      aria-label="Scroll down"
    >
      ↓
    </a>
  </section>
</template>

<style scoped>
.note-particle {
  animation: note-float 1.6s ease-out forwards;
}

@keyframes note-float {
  0% {
    transform: translate(-50%, 0) rotate(0deg);
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  100% {
    transform: translate(calc(-50% + var(--note-x)), -70px) rotate(var(--note-rotate));
    opacity: 0;
  }
}
</style>
