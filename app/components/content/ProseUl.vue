<script setup lang="ts">
// 覆盖 @nuxt/ui 的 ProseUl：去掉 list-disc / ps-6 / marker:* 工具类，
// 列表样式交给 prose.css 的元素选择器。属性（如 contains-task-list）仍随 Vue 透传。
</script>

<template>
  <ul>
    <slot />
  </ul>
</template>
