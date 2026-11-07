<script setup lang="ts">
import { HOME_FEATURES } from '~/data/home'
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <UCard
      v-for="(feature, i) in HOME_FEATURES"
      :key="feature.title"
      variant="soft"
      :ui="{ body: 'p-5' }"
      data-reveal
      :style="{ '--reveal-delay': `${i * 55}ms` }"
    >
      <div class="flex items-start gap-3">
        <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <UIcon :name="feature.icon" class="size-5" />
        </span>
        <div class="min-w-0">
          <h3 class="text-sm font-semibold text-highlighted">{{ feature.title }}</h3>
          <p class="mt-1.5 text-sm leading-relaxed text-muted">{{ feature.description }}</p>
        </div>
      </div>
    </UCard>
  </div>
</template>
