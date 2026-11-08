<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import ContactFooter from './components/ContactFooter.vue'
import ShaderBackground from './components/ShaderBackground.vue'
import { diyProjects, projectHref } from './data/diyProjects'
</script>

<template>
  <ShaderBackground />
  <NavBar />
  <main class="mx-auto max-w-4xl px-6 pb-32 pt-32">
    <h1 class="font-display text-4xl text-white title-glow sm:text-5xl">Projet DIY</h1>
    <p class="mt-6 text-lg text-soft">
      Cette page présente nos projets Do It Yourself. Contenu à venir.
    </p>

    <ul class="mt-12 grid gap-4 sm:grid-cols-2">
      <li v-for="project in diyProjects" :key="project.name">
        <a
          :href="projectHref(project.id)"
          class="block cursor-pointer rounded-lg border border-neon-violet/40 bg-black/70 px-6 py-8 text-center font-display text-2xl text-neon-violet backdrop-blur transition hover:border-neon-cyan hover:text-neon-cyan hover:text-glow"
        >
          {{ project.name }}
        </a>
      </li>
    </ul>
  </main>
  <ContactFooter />
</template>
