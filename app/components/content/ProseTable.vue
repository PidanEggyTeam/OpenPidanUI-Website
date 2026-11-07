<script setup lang="ts">
// 覆盖 @nuxt/ui 的 ProseTable：它默认把 <table> 包进 overflow-x-auto 的 div
// 并套 border-separate。这里改成中性 .table-scroll 包裹（样式在 prose.css），
// <table> 本身保持干净语义标签。
</script>

<template>
  <div class="table-scroll">
    <table>
      <slot />
    </table>
  </div>
</template>
