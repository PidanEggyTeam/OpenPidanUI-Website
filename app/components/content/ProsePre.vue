<script setup lang="ts">
// ============================================================
// 自定义 ProsePre：代码块顶部信息栏（与 PidanUI 官网一致）
//   <div class="code-block language-x">
//     <div class="code-head">
//       <span class="lang">X</span>
//       <button class="copy" />
//     </div>
//     <pre class="… shiki">…</pre>
//   </div>
// 复制逻辑自带，不依赖任何全局客户端脚本；外观全部在 prose.css。
// ============================================================
const props = defineProps<{
  code?: string;
  language?: string | null;
  filename?: string | null;
  highlights?: number[];
  meta?: string | null;
  class?: string | null;
}>();

const preRef = ref<HTMLElement | null>(null);
const copied = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;

/** text / plaintext 视为「无语言」：信息栏只留复制按钮 */
const lang = computed(() => {
  const value = props.language ?? '';
  return value === 'text' || value === 'plaintext' ? '' : value;
});

/** 语言展示名：常用缩写归一为大写全称 */
const langLabel = computed(() => {
  if (!lang.value) return '';
  const alias: Record<string, string> = {
    js: 'javascript',
    ts: 'typescript',
    md: 'markdown',
    sh: 'shell',
    yml: 'yaml',
  };
  return (alias[lang.value] ?? lang.value).toUpperCase();
});

async function copy() {
  // MDC 会传入 code；极少数情况下拿不到时退回 DOM 文本
  const text = props.code ?? preRef.value?.textContent ?? '';
  try {
    await navigator.clipboard.writeText(text);
    copied.value = true;
    clearTimeout(timer);
    timer = setTimeout(() => {
      copied.value = false;
    }, 1500);
  } catch {
    // 非安全上下文没有剪贴板权限：静默失败，不打断阅读
  }
}

onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <div :class="['code-block', `language-${lang || 'text'}`]">
    <div class="code-head">
      <span class="lang">{{ langLabel }}</span>
      <button
        class="copy"
        :class="{ copied }"
        type="button"
        title="复制代码"
        aria-label="复制代码"
        @click="copy"
      />
    </div>
    <pre ref="preRef" :class="props.class"><slot /></pre>
  </div>
</template>
