<script setup lang="ts">
import { computed } from 'vue'

// Renders text where *words between asterisks* are highlighted, cycling
// through the neon palette so each highlight gets the next color.
const props = defineProps<{ text: string }>()

const colors = ['text-neon-purple', 'text-neon-blue', 'text-neon-cyan', 'text-neon-violet']

const parts = computed(() => {
  let n = 0
  return props.text.split(/(\*[^*]+\*)/).map((part) => {
    const highlighted = part.length > 2 && part.startsWith('*') && part.endsWith('*')
    return highlighted
      ? { text: part.slice(1, -1), color: colors[n++ % colors.length] }
      : { text: part, color: null }
  })
})
</script>

<template>
  <template v-for="(part, i) in parts" :key="i">
    <span v-if="part.color" :class="[part.color, 'text-glow']">{{ part.text }}</span>
    <template v-else>{{ part.text }}</template>
  </template>
</template>
