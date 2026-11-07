<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <header class="border-b border-default bg-elevated/30">
    <div class="mx-auto w-full max-w-page px-4 py-10 sm:px-6 lg:py-14">
      <h1 class="text-3xl font-bold tracking-tight text-highlighted lg:text-4xl">{{ title }}</h1>
      <p v-if="description" class="mt-3 max-w-2xl text-base leading-relaxed text-muted">{{ description }}</p>
    </div>
  </header>
</template>
