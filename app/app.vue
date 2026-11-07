<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content';
import { SITE } from '#shared/site';

const { data: navigation } = await useAsyncData('navigation', () =>
  queryCollectionNavigation('docs'),
);

provide('navigation', navigation as Ref<ContentNavigationItem[] | null>);

useHead({
  htmlAttrs: { lang: 'zh-CN' },
  titleTemplate: (title?: string) =>
    title ? `${title} · ${SITE.brand}` : `${SITE.brand} · PidanUI 配套组件`,
});

useSeoMeta({
  description: SITE.description,
  ogType: 'website',
  ogSiteName: SITE.brand,
  ogTitle: `${SITE.brand} · PidanUI 配套组件`,
  ogDescription: SITE.description,
  twitterCard: 'summary_large_image',
});
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
