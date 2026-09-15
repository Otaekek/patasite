<script setup lang="ts">
import logo from '../assets/brand/patatrack-logo.png'

defineProps<{
  backgroundImage: string
}>()
</script>

<template>
  <section
    id="top"
    class="relative flex min-h-svh flex-col items-center justify-center overflow-hidden text-center"
  >
    <img
      :src="backgroundImage"
      alt=""
      class="absolute inset-0 h-full w-full object-cover"
    />
    <div class="absolute inset-0 bg-black/70"></div>

    <div class="relative z-10 flex flex-col items-center gap-8 px-6 pt-20 pb-24">
      <img :src="logo" alt="Patatrack" class="w-64 max-w-[70vw] drop-shadow-2xl sm:w-80" />

      <p class="max-w-xl text-balance text-lg leading-relaxed text-white/75">
        Issu de la free party, Patatrack est un collectif qui épouse son environnement pour
        emmener son public dans une ambiance onirique, fondée sur la bienveillance,
        l'échange et le lâcher-prise. Créé par des personnes passionnées, nous avons créé
        notre propre système son, lumière, VJing, et divers éléments de scénographie...
        N'hésitez pas à nous contacter si vous souhaitez collaborer avec nous.
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
