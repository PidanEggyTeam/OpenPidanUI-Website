<script setup lang="ts">
/**
 * 文档页外壳：桌面三栏（目录 / 正文 / 本页目录），窄屏把目录折成正文上方的面板。
 * 不用 Drawer —— 与顶栏同一种「grid-rows 0fr↔1fr + inert」的展开方式。
 *
 * 目录顺序以 frontmatter 的 `order` 为准：@nuxt/content 生成的 navigation 按文件系统排，
 * 这里用 order 映射把它纠正回来（分类组之间按 DOC_CATEGORIES 的 order）。
 */
import type { ContentNavigationItem } from '@nuxt/content'
import { DOC_CATEGORIES } from '~/data/docsCategories'

const props = defineProps<{
  tocLinks?: { id: string, text: string, depth: number }[]
  showToc?: boolean
}>()

const navigation = inject<Ref<ContentNavigationItem[] | null>>('navigation')
const { orderMap } = useDocsGroups()
const open = ref(false)

const categoryRank = computed<Record<string, number>>(() =>
  Object.fromEntries(DOC_CATEGORIES.map(c => [`/docs/${c.slug}`, c.order])),
)

function sortItems(items: ContentNavigationItem[]): ContentNavigationItem[] {
  return [...items]
    .map(item => (item.children?.length ? { ...item, children: sortItems(item.children) } : item))
    .sort((a, b) => {
      // 分组节点：用该组第一篇的 order + 分类权重；叶子节点：用自身 order
      const rank = (node: ContentNavigationItem) => {
        if (node.children?.length) {
          const first = node.children[0]
          return (categoryRank.value[node.path ?? ''] ?? 0) * 1000 + (orderMap.value[first?.path ?? ''] ?? 0)
        }
        return orderMap.value[node.path ?? ''] ?? 999
      }
      return rank(a) - rank(b)
    })
}

const sortedNavigation = computed(() => sortItems(navigation.value ?? []))
</script>

<template>
  <div class="mx-auto w-full max-w-page px-4 py-8 sm:px-6 lg:py-12">
    <div class="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[240px_minmax(0,1fr)_200px]">
      <!-- 桌面左侧目录 -->
      <aside class="hidden lg:block">
        <div class="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
          <UContentNavigation
            v-if="sortedNavigation.length"
            :navigation="sortedNavigation"
            highlight
            :default-open="true"
            :ui="{ link: 'text-sm' }"
          />
        </div>
      </aside>

      <div class="min-w-0">
        <!-- 窄屏目录 -->
        <div class="mb-6 lg:hidden">
          <UButton
            block
            variant="soft"
            color="neutral"
            :icon="open ? 'i-lucide-chevron-up' : 'i-lucide-list'"
            :aria-expanded="open"
            aria-controls="docs-mobile-nav"
            @click="open = !open"
          >
            文档目录
          </UButton>
          <div
            id="docs-mobile-nav"
            class="grid overflow-hidden transition-[grid-template-rows] duration-300"
            :class="open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
            :inert="!open"
          >
            <div class="min-h-0 overflow-hidden">
              <UContentNavigation
                v-if="sortedNavigation.length"
                :navigation="sortedNavigation"
                :default-open="false"
                class="rounded-lg border border-default p-2"
                :ui="{ link: 'text-sm' }"
              />
            </div>
          </div>
        </div>

        <slot />
      </div>

      <!-- 右侧本页目录 -->
      <aside v-if="showToc && tocLinks?.length" class="hidden xl:block">
        <div class="sticky top-20">
          <UContentToc :links="tocLinks" title="本页目录" :ui="{ link: 'text-sm' }" />
        </div>
      </aside>
    </div>
  </div>
</template>
