<script setup lang="ts">
import { ref } from 'vue'

const links = [
  { id: 'scenography', label: 'Scénographie' },
  { id: 'sound', label: 'Son' },
  { id: 'light', label: 'Lumière' },
  { id: 'mapping', label: 'Mapping' },
]

const menuOpen = ref(false)
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur">
    <div class="mx-auto flex max-w-6xl items-center justify-end px-6 py-3">
      <nav class="hidden gap-6 text-sm uppercase tracking-wide text-white/70 sm:flex">
        <a
          v-for="link in links"
          :key="link.id"
          :href="`#${link.id}`"
          class="transition-colors hover:text-white"
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
      class="flex flex-col gap-4 border-t border-white/10 px-6 py-4 text-sm uppercase tracking-wide text-white/80 sm:hidden"
    >
      <a
        v-for="link in links"
        :key="link.id"
        :href="`#${link.id}`"
        class="hover:text-white"
        @click="menuOpen = false"
      >
        {{ link.label }}
      </a>
    </nav>
  </header>
</template>
