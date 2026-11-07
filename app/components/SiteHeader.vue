<script setup lang="ts">
import { NAV_ITEMS } from '~/data/nav';
import { SITE } from '#shared/site';

// 全站顶栏：品牌 + 桌面横排导航 + 主题 / 汉堡（与 PidanUI 官网同构）。
// 移动端（< lg 即 < 1024px）导航收进顶栏正下方的绝对定位面板——
// 刻意不用 USlideover / UDrawer：那不是抽屉，不锁滚动，也没有边缘手势。
const activeKey = useActiveNavKey();
const route = useRoute();
const mobileOpen = ref(false);

const menuItems = computed(() =>
  NAV_ITEMS.map((item) => ({
    label: item.label,
    icon: item.icon,
    to: item.external ? item.href : withBase(item.href),
    target: item.external ? '_blank' : undefined,
    rel: item.external ? 'noopener noreferrer' : undefined,
    // 外链的 ↗ 由 UNavigationMenu 的 externalIcon 自动补（target=_blank 时渲染），
    // 这里不要再传 trailingIcon，否则会出现两个箭头
    // 外链永不参与高亮
    active: !item.external && activeKey.value === item.key,
  })),
);

watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false;
  },
);

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && mobileOpen.value) mobileOpen.value = false;
}

onMounted(() => document.addEventListener('keydown', onKeydown));
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown));
</script>

<template>
  <UHeader
    :toggle="false"
    :title="SITE.brand"
    to="/"
    :ui="{ container: 'max-w-none px-4 sm:px-6 lg:px-8', right: 'flex items-center gap-1' }"
  >
    <!-- UHeader 的 #title 插槽本身是 flex items-end（图标贴底对齐），
         直接把图片与文字塞进去会基线错位；包一层让内部垂直居中。 -->
    <template #title>
      <span class="flex items-center gap-2">
        <img
          class="size-8 shrink-0 rounded-lg object-contain"
          :src="withBase('/images/logo.webp')"
          :alt="SITE.brand"
          width="32"
          height="32"
          decoding="async"
          fetchpriority="high"
        />
        <span>{{ SITE.brand }}</span>
      </span>
    </template>

    <UNavigationMenu :items="menuItems" highlight />

    <template #right>
      <ThemeToggle />
      <UButton
        class="lg:hidden"
        variant="ghost"
        color="neutral"
        square
        :icon="mobileOpen ? 'i-lucide-x' : 'i-lucide-menu'"
        :aria-label="mobileOpen ? '关闭主导航' : '打开主导航'"
        :aria-expanded="mobileOpen"
        aria-controls="site-mobile-nav"
        @click="mobileOpen = !mobileOpen"
      />
    </template>

    <!-- 顶栏正下方的下拉面板：绝对定位，不撑高 sticky header，因此滚动不跳动。
         收起态用 grid-rows-[0fr] + inert：内容不占位、也不进键盘 Tab 序列。 -->
    <template #bottom>
      <div
        id="site-mobile-nav"
        class="absolute inset-x-0 top-full grid overflow-hidden border-b border-default bg-default shadow-lg transition-[grid-template-rows] duration-300 lg:hidden"
        :class="mobileOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
        :inert="!mobileOpen"
      >
        <div class="min-h-0 overflow-hidden">
          <UNavigationMenu orientation="vertical" :items="menuItems" class="p-2" />
        </div>
      </div>
    </template>
  </UHeader>
</template>
