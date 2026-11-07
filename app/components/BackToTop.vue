<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

// ============================================================
// 返回顶部浮钮
// ------------------------------------------------------------
// 滚动的是 window（body 自然滚动），超过 700px 才出现。
// 只用颜色 / 边框 / 阴影做 hover 反馈，不做位移。
// ============================================================

/** 出现阈值（px） */
const SHOW_AFTER = 700;

const shown = ref(false);
const route = useRoute();

let frame = 0;

function update(): void {
  shown.value = window.scrollY > SHOW_AFTER;
}

function onScroll(): void {
  if (frame) return;
  frame = window.requestAnimationFrame(() => {
    frame = 0;
    update();
  });
}

function scrollToTop(): void {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  try {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  } catch {
    window.scrollTo(0, 0);
  }
  shown.value = false;
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
  update();
});

watch(
  () => route.fullPath,
  () => requestAnimationFrame(update),
);

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
  if (frame) {
    window.cancelAnimationFrame(frame);
    frame = 0;
  }
});
</script>

<template>
  <button
    class="back-to-top"
    :class="{ 'is-shown': shown }"
    type="button"
    aria-label="返回顶部"
    :tabindex="shown ? 0 : -1"
    :aria-hidden="shown ? undefined : 'true'"
    @click="scrollToTop"
  >
    <UIcon name="i-lucide-arrow-up" class="size-5" aria-hidden="true" />
  </button>
</template>

<style scoped>
.back-to-top {
  position: fixed;
  right: 16px;
  bottom: 20px;
  z-index: 85;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  padding: 0;
  color: var(--ink-2);
  background: color-mix(in srgb, var(--card) 72%, transparent);
  border: 1px solid var(--line);
  border-radius: var(--radius-m);
  box-shadow: 0 10px 30px -18px rgb(0 0 0 / 0.35);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

@media (prefers-reduced-motion: no-preference) {
  .back-to-top {
    transition:
      opacity 0.26s var(--ease-out-soft),
      visibility 0s linear 0.26s,
      background-color 0.2s var(--ease-inout),
      border-color 0.2s var(--ease-inout),
      color 0.2s var(--ease-inout);
  }
}

.back-to-top.is-shown {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transition-delay: 0s;
}

.back-to-top:hover {
  color: var(--brand-deep);
  background: var(--card);
  border-color: var(--color-brand-deep-a35);
}

.back-to-top:focus-visible {
  outline: 2px solid var(--color-brand-deep-a35);
  outline-offset: 2px;
}
</style>
