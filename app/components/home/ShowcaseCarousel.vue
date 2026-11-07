<script setup lang="ts">
import { SHOWCASE_ITEMS } from '~/data/showcase';

const items = SHOWCASE_ITEMS;
const index = ref(0);
const dir = ref<'next' | 'prev'>('next');
const paused = ref(false);
const reduceMotion = ref(false);

let timer: ReturnType<typeof setInterval> | null = null;
let pointerStartX: number | null = null;

const current = computed(() => items[index.value]!);

function start() {
  stop();
  if (reduceMotion.value || paused.value || items.length < 2) return;
  timer = setInterval(() => step(1, true), 6000);
}

function stop() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function step(delta: 1 | -1, auto = false) {
  dir.value = delta > 0 ? 'next' : 'prev';
  index.value = (index.value + delta + items.length) % items.length;
  // 手动翻页后停止自动播放（WCAG 2.2.2：用户操作后不应继续自动移动）
  if (!auto) {
    paused.value = true;
    stop();
  }
}

function goTo(target: number) {
  if (target === index.value) return;
  dir.value = target > index.value ? 'next' : 'prev';
  index.value = target;
  paused.value = true;
  stop();
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    step(-1);
  } else if (event.key === 'ArrowRight') {
    event.preventDefault();
    step(1);
  } else if (event.key === 'Home') {
    event.preventDefault();
    goTo(0);
  } else if (event.key === 'End') {
    event.preventDefault();
    goTo(items.length - 1);
  }
}

function onPointerDown(event: PointerEvent) {
  pointerStartX = event.clientX;
}

function onPointerUp(event: PointerEvent) {
  if (pointerStartX === null) return;
  const delta = event.clientX - pointerStartX;
  pointerStartX = null;
  if (Math.abs(delta) < 40) return;
  step(delta < 0 ? 1 : -1);
}

function preload(around: number) {
  for (const offset of [1, -1]) {
    const item = items[(around + offset + items.length) % items.length];
    if (!item) continue;
    const img = new Image();
    img.src = item.image;
  }
}

function onVisibility() {
  if (document.hidden) stop();
  else start();
}

onMounted(() => {
  reduceMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  start();
  preload(index.value);
  document.addEventListener('visibilitychange', onVisibility);
});

onBeforeUnmount(() => {
  stop();
  document.removeEventListener('visibilitychange', onVisibility);
});

watch(index, (value) => preload(value));
</script>

<template>
  <div
    class="relative mx-auto w-full max-w-3xl"
    role="region"
    aria-roledescription="轮播"
    aria-label="组件截图"
    tabindex="0"
    @keydown="onKeydown"
    @mouseenter="
      paused = true;
      stop();
    "
    @mouseleave="
      paused = false;
      start();
    "
    @focusin="
      paused = true;
      stop();
    "
    @focusout="
      paused = false;
      start();
    "
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp"
  >
    <!-- 固定画框：容器高度只由 aspect 决定，与图片原始比例无关，切图不跳 -->
    <div
      class="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-default bg-elevated"
    >
      <Transition :name="`slide-${dir}`" mode="out-in">
        <figure
          :key="current!.id"
          class="absolute inset-0 flex flex-col items-center justify-center p-3 sm:p-5"
        >
          <img
            :src="current!.image"
            :width="current!.width"
            :height="current!.height"
            :alt="current!.alt"
            class="max-h-full w-auto max-w-full object-contain"
            :fetchpriority="index === 0 ? 'high' : 'auto'"
            loading="lazy"
            decoding="async"
          />
        </figure>
      </Transition>

      <!-- 左右切换 -->
      <UButton
        class="absolute top-1/2 left-2 -translate-y-1/2 shadow-card"
        icon="i-lucide-chevron-left"
        color="neutral"
        variant="soft"
        square
        aria-label="上一张"
        @click="step(-1)"
      />
      <UButton
        class="absolute top-1/2 right-2 -translate-y-1/2 shadow-card"
        icon="i-lucide-chevron-right"
        color="neutral"
        variant="soft"
        square
        aria-label="下一张"
        @click="step(1)"
      />
    </div>

    <!-- 说明与指示点 -->
    <div class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <p class="line-clamp-2 min-h-10 text-sm leading-relaxed text-muted">
        <span class="font-medium text-highlighted">{{ current!.title }}</span>
        <span class="mx-1.5 text-dimmed">·</span>{{ current!.caption }}
      </p>

      <div class="flex shrink-0 items-center gap-1.5" role="tablist" aria-label="选择截图">
        <button
          v-for="(item, i) in items"
          :key="item.id"
          type="button"
          role="tab"
          :aria-selected="i === index"
          :aria-label="`第 ${i + 1} 张：${item.title}`"
          class="h-2 rounded-full transition-all"
          :class="
            i === index ? 'w-6 bg-primary' : 'w-2 bg-elevated ring-1 ring-default hover:bg-accented'
          "
          @click="goTo(i)"
        />
      </div>
    </div>

    <p class="sr-only" aria-live="polite">
      第 {{ index + 1 }} 张，共 {{ items.length }} 张：{{ current!.title }}
    </p>
  </div>
</template>

<style scoped>
.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
}

.slide-next-enter-from {
  opacity: 0;
  transform: translateX(24px);
}

.slide-next-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}

.slide-prev-enter-from {
  opacity: 0;
  transform: translateX(-24px);
}

.slide-prev-leave-to {
  opacity: 0;
  transform: translateX(24px);
}

@media (prefers-reduced-motion: reduce) {
  .slide-next-enter-active,
  .slide-next-leave-active,
  .slide-prev-enter-active,
  .slide-prev-leave-active {
    transition: opacity 0.2s ease;
  }

  .slide-next-enter-from,
  .slide-next-leave-to,
  .slide-prev-enter-from,
  .slide-prev-leave-to {
    transform: none;
  }
}
</style>
