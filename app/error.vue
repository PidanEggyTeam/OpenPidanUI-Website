<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const is404 = computed(() => props.error?.statusCode === 404)

useSeoMeta({ title: is404.value ? '页面不存在' : '出错了' })
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NotFoundView
        v-if="is404"
        title="这一页不在了"
        description="它可能跟着旧版本一起归档了，也可能只是链接拼错了一个字符。"
      />
      <div v-else class="mx-auto flex max-w-page flex-col items-center px-4 py-24 text-center">
        <p class="text-5xl font-black text-brand-500">{{ error?.statusCode ?? 500 }}</p>
        <h1 class="mt-4 text-2xl font-bold text-highlighted">出了点问题</h1>
        <p class="mt-3 max-w-md text-sm leading-relaxed text-muted">
          {{ error?.statusMessage || error?.message || '页面渲染失败，请稍后重试。' }}
        </p>
        <UButton class="mt-8" to="/" icon="i-lucide-house" @click="clearError({ redirect: '/' })">回到首页</UButton>
      </div>
    </NuxtLayout>
  </UApp>
</template>
