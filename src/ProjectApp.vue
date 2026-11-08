<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import ContactFooter from './components/ContactFooter.vue'
import ShaderBackground from './components/ShaderBackground.vue'
import { diyProjects } from './data/diyProjects'
import { renderProject } from './lib/markdown'

const id = new URLSearchParams(window.location.search).get('id')
const project = diyProjects.find((p) => p.id === id)
const html = project ? renderProject(project.id) : null
document.title = `${project?.name ?? 'Projet DIY'} - Patatrack`
const diyHref = `${import.meta.env.BASE_URL}diy.html`
</script>

<template>
  <ShaderBackground />
  <NavBar />
  <main class="mx-auto max-w-4xl px-6 pb-32 pt-32">
    <a :href="diyHref" class="text-sm uppercase tracking-wide text-neon-violet transition hover:text-neon-cyan hover:text-glow">
      ← Projet DIY
    </a>
    <template v-if="project">
      <h1 class="mt-6 font-display text-4xl text-white title-glow sm:text-5xl">{{ project.name }}</h1>
      <article v-if="html" class="diy-content mt-8" v-html="html"></article>
    </template>
    <p v-else class="mt-6 text-lg text-soft">Projet introuvable.</p>
  </main>
  <ContactFooter />
</template>
