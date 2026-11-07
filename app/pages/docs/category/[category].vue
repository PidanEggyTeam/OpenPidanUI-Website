<script setup lang="ts">
import { findCategory } from '~/data/docsCategories'

const route = useRoute()
const slug = computed(() => String(route.params.category ?? ''))
const category = computed(() => findCategory(slug.value))

if (!category.value) {
  throw createError({ statusCode: 404, statusMessage: '分类不存在', fatal: true })
}

const { groups } = useDocsGroups()
const group = computed(() => groups.value.find(g => g.slug === slug.value))

useSeoMeta({
  title: `${category.value.title} · 文档`,
  description: category.value.description,
})
</script>

<template>
  <div>
    <PageHeading :title="category!.title" :description="category!.description" />

    <div class="mx-auto w-full max-w-page px-4 py-10 sm:px-6">
      <ol class="space-y-3">
        <li v-for="entry in group?.entries ?? []" :key="entry.path">
          <NuxtLink
            :to="withBase(entry.path)"
            class="group flex items-start gap-4 rounded-xl border border-default bg-elevated/40 p-4 transition-colors hover:border-primary/40 hover:bg-elevated"
          >
            <span class="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 font-mono text-xs font-medium text-primary">
              {{ entry.order }}
            </span>
            <span class="min-w-0 flex-1">
              <span class="flex flex-wrap items-center gap-2">
                <span class="text-sm font-medium text-highlighted">{{ entry.title }}</span>
                <UBadge v-if="entry.badge" variant="subtle" color="primary" size="sm">{{ entry.badge }}</UBadge>
              </span>
              <span v-if="entry.description" class="mt-1 block text-sm leading-relaxed text-muted">
                {{ entry.description }}
              </span>
            </span>
            <UIcon name="i-lucide-arrow-right" class="mt-1 size-4 shrink-0 text-dimmed transition-colors group-hover:text-primary" />
          </NuxtLink>
        </li>
      </ol>

      <UButton :to="withBase('/docs')" variant="link" class="mt-6 px-0" icon="i-lucide-arrow-left">
        返回文档概览
      </UButton>
    </div>
  </div>
</template>
