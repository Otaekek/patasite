<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const links = [
  { id: 'scenography', label: 'Scénographie' },
  { id: 'sound', label: 'Son' },
  { id: 'mapping', label: 'Mapping' },
]

const menuOpen = ref(false)

// Scroll spy: the section crossing the middle of the viewport is the active one.
const activeId = ref<string | null>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) activeId.value = entry.target.id
        else if (activeId.value === entry.target.id) activeId.value = null
      }
    },
    { rootMargin: '-50% 0px -50% 0px' },
  )
  for (const link of links) {
    const el = document.getElementById(link.id)
    if (el) observer.observe(el)
  }
})

onUnmounted(() => observer?.disconnect())

function linkClass(id: string) {
  return activeId.value === id
    ? 'text-neon-cyan text-glow'
    : 'text-neon-violet hover:text-neon-cyan hover:text-glow'
}
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur">
    <div class="mx-auto flex max-w-6xl items-center justify-end px-6 py-3">
      <nav class="hidden gap-6 text-sm uppercase tracking-wide sm:flex">
        <a
          v-for="link in links"
          :key="link.id"
          :href="`#${link.id}`"
          class="transition"
          :class="linkClass(link.id)"
          :aria-current="activeId === link.id ? 'location' : undefined"
        >
          {{ link.label }}
        </a>
      </nav>

      <button
        type="button"
        class="text-white/80 hover:text-white sm:hidden"
        aria-label="Toggle menu"
        @click="menuOpen = !menuOpen"
      >
        ☰
      </button>
    </div>

    <nav
      v-if="menuOpen"
      class="flex flex-col gap-4 border-t border-white/10 px-6 py-4 text-sm uppercase tracking-wide sm:hidden"
    >
      <a
        v-for="link in links"
        :key="link.id"
        :href="`#${link.id}`"
        class="transition"
        :class="linkClass(link.id)"
        :aria-current="activeId === link.id ? 'location' : undefined"
        @click="menuOpen = false"
      >
        {{ link.label }}
      </a>
    </nav>
  </header>
</template>
