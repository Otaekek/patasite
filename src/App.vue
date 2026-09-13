<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import Hero from './components/Hero.vue'
import GallerySection from './components/GallerySection.vue'
import ContactFooter from './components/ContactFooter.vue'
import ShaderBackground from './components/ShaderBackground.vue'
import { gallerySections, titleImages } from './data/gallery'

const heroBackground = titleImages[0]
</script>

<template>
  <ShaderBackground />
  <NavBar />
  <main class="pb-16">
    <Hero :background-image="heroBackground" />
    <GallerySection
      v-for="section in gallerySections"
      :key="section.id"
      :id="section.id"
      :title="section.title"
      :description="section.description"
      :icon="section.icon"
      :icon-position="section.iconPosition"
      :images="section.images"
    />
  </main>
  <ContactFooter />
</template>
