<script setup lang="ts">
import type { SiteRelease } from '#shared/releases'

defineProps<{
  release: SiteRelease
  /** 最新版用大卡片，历史版本用紧凑卡片 */
  featured?: boolean
}>()
</script>

<template>
  <UCard :variant="featured ? 'soft' : 'outline'" :ui="{ body: featured ? 'p-6' : 'p-5' }">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div class="min-w-0">
        <div class="flex flex-wrap items-center gap-2">
          <h3 class="text-lg font-semibold text-highlighted">{{ release.name }}</h3>
          <UBadge v-if="release.prerelease" color="warning" variant="subtle" size="sm">测试版</UBadge>
          <UBadge v-else color="primary" variant="subtle" size="sm">稳定版</UBadge>
        </div>
        <p class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-dimmed">
          <span class="font-mono">{{ release.tag }}</span>
          <span class="inline-flex items-center gap-1">
            <UIcon name="i-lucide-clock" class="size-3.5" />{{ release.publishedAtLabel }}
          </span>
          <a
            :href="release.htmlUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 text-primary hover:underline"
          >
            完整更新说明<UIcon name="i-lucide-arrow-up-right" class="size-3" />
          </a>
        </p>
      </div>
    </div>

    <p v-if="release.notes" class="mt-4 text-sm leading-relaxed whitespace-pre-line text-muted">
      {{ release.notes }}
    </p>

    <div class="mt-5 space-y-2">
      <AssetRow v-for="asset in release.assets" :key="asset.name" :asset="asset" />
      <p v-if="!release.assets.length" class="text-sm text-dimmed">这个版本没有可下载的资产文件。</p>
    </div>
  </UCard>
</template>
