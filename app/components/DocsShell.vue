<script setup lang="ts">
/**
 * 文档页外壳：桌面三栏（目录 / 正文 / 本页目录），窄屏把目录折成正文上方的面板。
 * 不用 Drawer —— 与顶栏同一种「grid-rows 0fr↔1fr + inert」的展开方式。
 *
 * 目录顺序以 frontmatter 的 `order` 为准：@nuxt/content 生成的 navigation 按文件系统排，
 * 这里用 order 映射把它纠正回来（分类组之间按 DOC_CATEGORIES 的 order）。
 */
import type { ContentNavigationItem } from '@nuxt/content';

defineProps<{
  tocLinks?: { id: string; text: string; depth: number }[];
  showToc?: boolean;
}>();

const navigation = inject<Ref<ContentNavigationItem[] | null>>('navigation');
const { navRank } = await useDocsGroups();
const open = ref(false);

function sortItems(items: ContentNavigationItem[]): ContentNavigationItem[] {
  return [...items]
    .map((item) => (item.children?.length ? { ...item, children: sortItems(item.children) } : item))
    .sort((a, b) => {
      // 叶子节点用 navRank（分类权重 * 1000 + 组内 order）；分组节点取组内最小 rank
      const rank = (node: ContentNavigationItem) => {
        if (node.children?.length) {
          return Math.min(
            ...node.children.map((child) => navRank.value[child.path ?? ''] ?? 999999),
          );
        }
        return navRank.value[node.path ?? ''] ?? 999999;
      };
      return rank(a) - rank(b);
    });
}

const sortedNavigation = computed(() => sortItems(navigation.value ?? []));
</script>

<template>
  <div class="w-full">
    <div
      class="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[240px_minmax(0,1fr)_200px]"
    >
      <!-- 桌面左侧目录：overflow-x-hidden + 内层 px-2.5 抵消 UContentNavigation
           根节点的 -mx-2.5（hover 底色的外扩量），否则 overflow-y:auto 会
           连带产生一条水平滚动条 -->
      <aside class="hidden lg:block">
        <div class="sticky top-20 max-h-[calc(100vh-6rem)] overflow-x-hidden overflow-y-auto pr-2">
          <div class="px-2.5">
            <UContentNavigation
              v-if="sortedNavigation.length"
              :navigation="sortedNavigation"
              highlight
              :default-open="true"
              :ui="{ link: 'text-sm' }"
            />
          </div>
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
