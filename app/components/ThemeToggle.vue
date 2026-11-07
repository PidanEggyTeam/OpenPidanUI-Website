<script setup lang="ts">
/**
 * 主题开关：与 PidanUI 官网一致的**胶囊开关**（USwitch size=lg），三态循环。
 *
 * 循环顺序：跟随系统 → 浅色 → 深色 → 跟随系统。
 *   滑块位置 = 当前实际是否深色（跟随系统时随系统走）
 *   滑块图标 = 当前模式（跟随系统 = 太阳+月亮，浅色 = 太阳，深色 = 月亮）
 * 点击一律按循环走，不读开关回传的布尔值——三态塞进二值开关只能这么做。
 */
const colorMode = useColorMode();

type Mode = 'system' | 'light' | 'dark';
const ORDER: Mode[] = ['system', 'light', 'dark'];
const LABELS: Record<Mode, string> = {
  system: '跟随系统',
  light: '浅色模式',
  dark: '深色模式',
};

/** 服务端没有 localStorage、也没有 prefers-color-scheme，只能先渲染 system + 浅色，
 *  挂载后再切到真实状态，避免 aria-label / 图标与 SSR 不一致触发 hydration 警告。 */
const mounted = ref(false);
onMounted(() => {
  mounted.value = true;
});

const mode = computed<Mode>(() => (mounted.value ? (colorMode.preference as Mode) : 'system'));
const label = computed(() => LABELS[mode.value] ?? '跟随系统');
const isDark = computed(() => mounted.value && colorMode.value === 'dark');

/** 跟随系统时两侧都用「太阳+月亮」，让滑块自身也能读出这是自动模式 */
const AUTO_ICON = 'i-lucide-sun-moon';
const checkedIcon = computed(() => (mode.value === 'system' ? AUTO_ICON : 'i-lucide-moon'));
const uncheckedIcon = computed(() => (mode.value === 'system' ? AUTO_ICON : 'i-lucide-sun'));

function cycle() {
  const next = ORDER[(ORDER.indexOf(mode.value) + 1) % ORDER.length] ?? 'system';
  colorMode.preference = next;
}
</script>

<template>
  <USwitch
    size="lg"
    color="primary"
    :model-value="isDark"
    :checked-icon="checkedIcon"
    :unchecked-icon="uncheckedIcon"
    :title="`当前：${label}（点击切换）`"
    :aria-label="`切换主题，当前${label}`"
    @update:model-value="cycle"
  />
</template>
