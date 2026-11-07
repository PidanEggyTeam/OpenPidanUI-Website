<script setup lang="ts">
import { ABOUT_TEXT, ABOUT_TIMELINE } from '~/data/home'
import { PROMO_IMAGE } from '#shared/site'

useScrollReveal()

const promoFailed = ref(false)
</script>

<template>
  <div data-reveal-scope>
    <!-- 1. Hero -->
    <section class="border-b border-default bg-elevated/20">
      <div class="mx-auto grid w-full max-w-page items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:py-20">
        <div class="min-w-0">
          <UBadge color="primary" variant="subtle" size="md">PidanUI 配套组件 · 开源</UBadge>

          <h1 class="brand-gradient mt-5 text-4xl leading-tight font-black tracking-tight text-highlighted sm:text-5xl">
            Open<em>PidanUI</em>
          </h1>

          <p class="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            用代码，为 PidanUI 构建更安全、更稳定的美化体验。
            组件全部模块化、可审查，不替换任何系统文件。
          </p>

          <div class="mt-8 flex flex-wrap gap-3">
            <UButton :to="withBase('/download')" size="lg" icon="i-lucide-download" class="shadow-brand">
              立即下载
            </UButton>
            <UButton :to="withBase('/docs')" size="lg" variant="outline" color="neutral" icon="i-lucide-book-open">
              查看文档
            </UButton>
          </div>

          <p class="mt-6 text-xs text-dimmed">
            当前提供 Rainmeter 小组件及其设置程序 · 支持 Windows 10 及以上
          </p>
        </div>

        <div class="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-default bg-elevated">
          <img
            v-if="!promoFailed"
            :src="PROMO_IMAGE"
            alt="OpenPidanUI 桌面效果宣传图"
            width="1200"
            height="900"
            class="h-full w-full object-cover"
            fetchpriority="high"
            @error="promoFailed = true"
          >
          <div v-else class="flex h-full w-full flex-col items-center justify-center gap-3 text-dimmed">
            <UIcon name="i-lucide-palette" class="size-10" />
            <p class="text-sm">宣传图加载失败</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. 特性 -->
    <section class="mx-auto w-full max-w-page px-4 py-14 sm:px-6 lg:py-20">
      <header class="mb-8 max-w-2xl">
        <h2 class="text-2xl font-bold tracking-tight text-highlighted sm:text-3xl">为什么是 OpenPidanUI</h2>
        <p class="mt-3 text-sm leading-relaxed text-muted sm:text-base">
          桌面美化最容易踩的两个坑是「改坏系统」和「装完不敢卸」。这一版把这两件事都当作硬约束。
        </p>
      </header>
      <FeatureGrid />
    </section>

    <!-- 3. 组件展示 -->
    <section class="border-y border-default bg-elevated/20">
      <div class="mx-auto w-full max-w-page px-4 py-14 sm:px-6 lg:py-20">
        <header class="mb-8 max-w-2xl">
          <h2 class="text-2xl font-bold tracking-tight text-highlighted sm:text-3xl">看看它长什么样</h2>
          <p class="mt-3 text-sm leading-relaxed text-muted sm:text-base">
            截图目前是占位素材，只用来确认版式；正式宣传图会在上线前整体替换。
          </p>
        </header>
        <ShowcaseCarousel />
      </div>
    </section>

    <!-- 4. 关于 -->
    <section class="mx-auto w-full max-w-page px-4 py-14 sm:px-6 lg:py-20">
      <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-highlighted sm:text-3xl">关于 OpenPidanUI</h2>
          <p v-for="line in ABOUT_TEXT" :key="line" class="mt-3 text-sm leading-relaxed text-muted sm:text-base">
            {{ line }}
          </p>
          <UButton :to="withBase('/docs/developer')" variant="link" class="mt-4 px-0" trailing-icon="i-lucide-arrow-right">
            看看仓库结构
          </UButton>
        </div>

        <ol class="relative space-y-6 border-l border-default pl-6">
          <li v-for="item in ABOUT_TIMELINE" :key="item.time" class="relative" data-reveal>
            <span class="absolute top-1.5 -left-[29px] size-2 rounded-full bg-primary ring-4 ring-default" />
            <p class="text-xs font-medium tracking-wide text-primary">{{ item.time }}</p>
            <h3 class="mt-1 text-sm font-semibold text-highlighted">{{ item.title }}</h3>
            <p class="mt-1 text-sm leading-relaxed text-muted">{{ item.description }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- 5. 加入开发 -->
    <section class="border-t border-default bg-elevated/20">
      <div class="mx-auto w-full max-w-page px-4 py-14 sm:px-6 lg:py-20">
        <header class="mb-8 max-w-2xl">
          <h2 class="text-2xl font-bold tracking-tight text-highlighted sm:text-3xl">一起把它做完</h2>
          <p class="mt-3 text-sm leading-relaxed text-muted sm:text-base">
            组件按模块划分，一个人也能维护一个模块。遇到问题先在文档里翻一翻，再来群里说。
          </p>
        </header>
        <JoinDevSection />
      </div>
    </section>
  </div>
</template>
