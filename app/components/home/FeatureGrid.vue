<script setup lang="ts">
import { HOME_FEATURES } from '~/data/home';
</script>

<template>
  <UPageGrid style="--grid-min: 250px">
    <UPageCard
      v-for="feature in HOME_FEATURES"
      :key="feature.title"
      :icon="feature.icon"
      :title="feature.title"
      :description="feature.description"
      variant="subtle"
      spotlight
    />
  </UPageGrid>
</template>
