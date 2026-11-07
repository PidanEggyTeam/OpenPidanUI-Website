<script setup lang="ts">
// 列表 / 文档页共用的页面主标题：外层节奏走 app.config 的 UPageHeader 紧凑版式，
// 标题字号只有一个来源（与 PidanUI 官网 PageTitle 一致）。
defineProps<{
  title: string;
  description?: string;
}>();
</script>

<template>
  <UPageHeader :description="description">
    <template #title>
      <h1 class="text-[clamp(24px,3.6vw,32px)] font-bold tracking-[-0.01em] text-default">
        {{ title }}
      </h1>
    </template>
  </UPageHeader>
</template>
