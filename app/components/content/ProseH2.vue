<script setup lang="ts">
// 标题保持纯文本 + 独立的 .header-anchor 图标链接（hover 时淡入），
// 与 PidanUI 官网的 ProseH2 一致；具体外观由 prose.css 的 .doc-body 规则接管。
const props = defineProps<{ id?: string }>();
</script>

<template>
  <h2 :id="props.id">
    <slot />
    <a
      v-if="props.id"
      class="header-anchor"
      :href="`#${props.id}`"
      aria-hidden="true"
      tabindex="-1"
    />
  </h2>
</template>
