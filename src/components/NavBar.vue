<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { diyProjects, projectHref } from '../data/diyProjects'

// Works from any page: section links always point back to the home page.
const base = import.meta.env.BASE_URL
const onDiyPage = /\/(diy|project)(\.html)?$/.test(window.location.pathname)

const drawerLinks = [
  { id: 'top', label: 'Accueil', href: base },
  { id: 'scenography', label: 'Scénographie', href: `${base}#scenography` },
  { id: 'sound', label: 'Son', href: `${base}#sound` },
  { id: 'mapping', label: 'Mapping', href: `${base}#mapping` },
  { id: 'diy', label: 'Projet DIY', href: `${base}diy.html` },
  { id: 'contact', label: 'Contact', href: onDiyPage ? '#contact' : `${base}#contact` },
]

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
  if (onDiyPage) activeId.value = 'diy'
  for (const id of drawerLinks.map((link) => link.id)) {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  }
})

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') menuOpen.value = false
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  observer?.disconnect()
  window.removeEventListener('keydown', onKeydown)
})

function linkClass(id: string) {
  return activeId.value === id
    ? 'text-neon-cyan text-glow'
    : 'text-neon-violet hover:text-neon-cyan hover:text-glow'
}
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur">
    <div class="flex items-center justify-between px-4 py-3 sm:px-6">
      <div class="flex items-center gap-4">
        <button
          type="button"
          class="group flex h-9 w-9 cursor-pointer flex-col items-center justify-center gap-1.5 rounded"
          aria-label="Ouvrir le menu"
          aria-controls="side-menu"
          :aria-expanded="menuOpen"
          @click="menuOpen = true"
        >
          <span class="h-0.5 w-6 bg-white/80 transition group-hover:bg-neon-cyan"></span>
          <span class="h-0.5 w-6 bg-white/80 transition group-hover:bg-neon-cyan"></span>
          <span class="h-0.5 w-6 bg-white/80 transition group-hover:bg-neon-cyan"></span>
        </button>

        <a
          :href="base"
          class="font-body text-lg font-extrabold uppercase tracking-wider transition"
          :class="activeId === 'top' ? 'text-neon-cyan text-glow' : 'text-white hover:text-neon-cyan hover:text-glow'"
          :aria-current="activeId === 'top' ? 'location' : undefined"
        >
          Patatrack
        </a>
      </div>

      <nav class="hidden gap-6 text-sm uppercase tracking-wide sm:flex">
        <a
          v-for="link in links"
          :key="link.id"
          :href="`${base}#${link.id}`"
          class="transition"
          :class="linkClass(link.id)"
          :aria-current="activeId === link.id ? 'location' : undefined"
        >
          {{ link.label }}
        </a>
      </nav>
    </div>
  </header>

  <!-- Left slide-in menu -->
  <Transition name="fade">
    <div v-if="menuOpen" class="fixed inset-0 z-[60] bg-black/60" @click="menuOpen = false"></div>
  </Transition>
  <Transition name="slide">
    <aside
      v-if="menuOpen"
      id="side-menu"
      class="fixed inset-y-0 left-0 z-[70] flex w-72 max-w-[85vw] flex-col border-r border-white/10 bg-black/95 px-6 py-4 backdrop-blur"
      aria-label="Menu"
    >
      <button
        type="button"
        class="mb-8 cursor-pointer self-end text-2xl leading-none text-white/80 hover:text-neon-cyan"
        aria-label="Fermer le menu"
        @click="menuOpen = false"
      >
        ✕
      </button>
      <nav class="flex flex-col gap-6 text-lg uppercase tracking-wide">
        <div v-for="link in drawerLinks" :key="link.id" class="group/item">
          <a
            :href="link.href"
            class="transition"
            :class="linkClass(link.id)"
            :aria-current="activeId === link.id ? 'location' : undefined"
            @click="menuOpen = false"
          >
            {{ link.label }}
          </a>
          <!-- Preview of the DIY projects on hover / keyboard focus -->
          <div
            v-if="link.id === 'diy'"
            class="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-300 ease-out group-focus-within/item:grid-rows-[1fr] group-focus-within/item:opacity-100 group-hover/item:grid-rows-[1fr] group-hover/item:opacity-100"
          >
            <ul class="flex min-h-0 flex-col gap-3 overflow-hidden pt-0 border-l border-neon-violet/40 pl-4 text-base">
              <li class="h-0 shrink-0" aria-hidden="true"></li>
              <li v-for="project in diyProjects" :key="project.id" class="shrink-0">
                <a
                  :href="projectHref(project.id)"
                  class="text-soft transition hover:text-neon-cyan hover:text-glow"
                  @click="menuOpen = false"
                >
                  {{ project.name }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </aside>
  </Transition>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.25s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
