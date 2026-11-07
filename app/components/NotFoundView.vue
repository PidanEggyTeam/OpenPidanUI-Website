<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
}>()
</script>

<template>
  <div class="mx-auto flex w-full max-w-page flex-col items-center px-4 py-24 text-center sm:px-6">
    <p class="text-6xl font-black tracking-tight text-brand-500">404</p>
    <h1 class="mt-4 text-2xl font-bold text-highlighted">{{ title ?? '这一页不在了' }}</h1>
    <p class="mt-3 max-w-md text-sm leading-relaxed text-muted">
      {{ description ?? '它可能跟着旧版本一起归档了，也可能只是链接拼错了一个字符。' }}
    </p>
    <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
      <UButton to="/" icon="i-lucide-house" size="lg">回到首页</UButton>
      <UButton to="/docs" variant="outline" color="neutral" icon="i-lucide-book-open" size="lg">去读文档</UButton>
    </div>
  </div>
</template>
