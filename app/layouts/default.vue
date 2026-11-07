<script setup lang="ts">
// ============================================================
// 全站壳层：顶栏 + 主内容 + 底栏（与 PidanUI 官网同一套结构）
//
// 滚动模型：body 自然滚动，顶栏 UHeader 自带 sticky top-0。
// 页面容器 .page-shell（UContainer）只负责宽度与内边距，
// 滚动入场以此为层级基准（见 useScrollReveal）。
// ============================================================
const nuxtApp = useNuxtApp();
const {
  progress,
  active: progressActive,
  done: progressDone,
  completeRendering,
  start,
  markPageLoaded,
} = usePageProgress();

const offLoadingStart = nuxtApp.hook('page:loading:start', () => start(false));
const offLoadingEnd = nuxtApp.hook('page:loading:end', () => markPageLoaded());

// 新页 DOM 已就绪：让进度条等字体 / 图片就绪后收尾，并重新给区块打标，
// 让视口外的块滚动时才淡入。
// 用异步补刷而不是立即执行 —— 从页面中部跳转时，新页的滚动回顶发生在
// 这一帧之后；立刻量尺寸会把所有块误判成「已在视口上方」而跳过动画。
const offPageFinish = nuxtApp.hook('page:finish', () => {
  completeRendering();
  scheduleScrollRevealRefresh();
});

// 页面过渡结束后再补一次：out-in 期间量到的位置带着过渡位移，不可靠
const offTransitionFinish = nuxtApp.hook('page:transition:finish', () => {
  scheduleScrollRevealRefresh();
});

// 全站区块的滚动入场（首屏交错 + 视口外按需淡入）
useScrollReveal();

onMounted(() => {
  completeRendering();
});

onBeforeUnmount(() => {
  offLoadingStart();
  offLoadingEnd();
  offPageFinish();
  offTransitionFinish();
});
</script>

<template>
  <PageProgress :progress="progress" :active="progressActive" :done="progressDone" />

  <!-- 纵向三段式：顶栏 sticky、主区撑满剩余高度、底栏留在文档流末尾 -->
  <div class="flex min-h-dvh flex-col">
    <SiteHeader />

    <!-- 主内容地标：浏览器阅读模式据此定位正文，忽略顶栏与底栏 -->
    <main id="content" class="flex-1" role="main">
      <UContainer class="page-shell py-6 sm:py-8 lg:py-10">
        <slot />
      </UContainer>
    </main>

    <SiteFooter />
  </div>

  <BackToTop />
</template>
