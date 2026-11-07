<script setup lang="ts">
import { JOIN_CARDS } from '~/data/home'
</script>

<template>
  <div class="grid gap-4 md:grid-cols-2">
    <UCard v-for="card in JOIN_CARDS" :key="card.title" variant="outline" data-reveal :ui="{ body: 'p-6' }">
      <div class="flex items-center gap-3">
        <span class="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <UIcon :name="card.icon" class="size-5" />
        </span>
        <h3 class="text-base font-semibold text-highlighted">{{ card.title }}</h3>
      </div>

      <p class="mt-3 text-sm leading-relaxed text-muted">{{ card.description }}</p>

      <div v-if="card.tags.length" class="mt-4 flex flex-wrap gap-2">
        <UBadge v-for="tag in card.tags" :key="tag" variant="subtle" color="neutral" size="sm">{{ tag }}</UBadge>
      </div>

      <div class="mt-5 flex flex-wrap gap-2">
        <template v-for="link in card.links" :key="link.label">
          <UButton
            v-if="link.external"
            :to="link.to"
            target="_blank"
            rel="noopener noreferrer"
            variant="soft"
            color="neutral"
            size="sm"
            trailing-icon="i-lucide-arrow-up-right"
          >
            {{ link.label }}
          </UButton>
          <UButton v-else :to="withBase(link.to)" variant="soft" size="sm">
            {{ link.label }}
          </UButton>
        </template>
      </div>
    </UCard>
  </div>
</template>
