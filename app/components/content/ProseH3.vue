<script setup lang="ts">
// 同 ProseH2：保持纯文本标题 + 独立的 .header-anchor 图标链接
const props = defineProps<{ id?: string }>();
</script>

<template>
  <h3 :id="props.id">
    <slot />
    <a
      v-if="props.id"
      class="header-anchor"
      :href="`#${props.id}`"
      aria-hidden="true"
      tabindex="-1"
    />
  </h3>
</template>
