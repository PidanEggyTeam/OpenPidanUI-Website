<script setup lang="ts">
const route = useRoute()
const path = computed(() => route.path.replace(/\/+$/, '') || '/docs')

const { data: page } = await useAsyncData(`doc:${path.value}`, () =>
  queryCollection('docs').path(path.value).first(),
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: '文档不存在', fatal: true })
}

const { data: surround } = await useAsyncData(`doc-surround:${path.value}`, () =>
  // 用 stem 排序：数字前缀丢进 path 之后顺序会乱，stem 才是作者书写的顺序
  queryCollectionItemSurroundings('docs', path.value, { fields: ['description'] }).order('stem', 'ASC'),
)

const tocLinks = computed(() => page.value?.body?.toc?.links ?? [])
const editUrl = computed(
  () => `https://github.com/PidanEggyTeam/OpenPidanUI-Website/edit/main/content/${page.value?.stem}.md`,
)

const prev = computed(() => surround.value?.[0] ?? null)
const next = computed(() => surround.value?.[1] ?? null)

useSeoMeta({
  title: page.value.title,
  description: page.value.description,
})
</script>

<template>
  <DocsShell v-if="page" :toc-links="tocLinks" show-toc>
    <article class="min-w-0">
      <UPageHeader :title="page.title" :description="page.description">
        <template #links>
          <UButton
            :to="editUrl"
            target="_blank"
            rel="noopener noreferrer"
            variant="ghost"
            color="neutral"
            size="xs"
            icon="i-lucide-file-text"
          >
            在 GitHub 上编辑此页
          </UButton>
        </template>
      </UPageHeader>

      <ContentRenderer :value="page" class="mt-8" />

      <nav class="mt-12 grid gap-3 border-t border-default pt-6 sm:grid-cols-2" aria-label="上下篇">
        <NuxtLink
          v-if="prev"
          :to="withBase(prev.path)"
          class="group rounded-lg border border-default p-4 transition-colors hover:bg-elevated"
        >
          <span class="inline-flex items-center gap-1 text-xs text-dimmed">
            <UIcon name="i-lucide-arrow-left" class="size-3.5" />上一篇
          </span>
          <p class="mt-1 text-sm font-medium text-highlighted group-hover:text-primary">{{ prev.title }}</p>
        </NuxtLink>
        <span v-else />

        <NuxtLink
          v-if="next"
          :to="withBase(next.path)"
          class="group rounded-lg border border-default p-4 text-right transition-colors hover:bg-elevated"
        >
          <span class="inline-flex items-center gap-1 text-xs text-dimmed">
            下一篇<UIcon name="i-lucide-arrow-right" class="size-3.5" />
          </span>
          <p class="mt-1 text-sm font-medium text-highlighted group-hover:text-primary">{{ next.title }}</p>
        </NuxtLink>
      </nav>
    </article>
  </DocsShell>
</template>
