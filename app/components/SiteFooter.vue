<script setup lang="ts">
import { NAV_ITEMS } from '~/data/nav'
import { FRIEND_LINKS, SOCIAL_LINKS } from '~/data/socialLinks'
import { SITE } from '#shared/site'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="mt-16 border-t border-default bg-elevated/40">
    <div class="mx-auto grid w-full max-w-page gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3">
      <!-- 左：品牌 + 站内导航（无 JS 时的兜底） -->
      <div>
        <div class="flex items-center gap-2">
          <img src="/images/logo.webp" alt="" width="28" height="28" class="h-7 w-7 rounded-md">
          <span class="font-semibold text-highlighted">{{ SITE.brand }}</span>
        </div>
        <p class="mt-3 max-w-xs text-sm leading-relaxed text-muted">
          PidanUI 的辅助组件开源代码库：模块化、可审查、不修改系统文件。
        </p>
        <nav class="mt-4 flex flex-wrap gap-x-4 gap-y-2" aria-label="页脚导航">
          <NuxtLink
            v-for="item in NAV_ITEMS.filter(i => !i.external)"
            :key="item.key"
            :to="withBase(item.href)"
            class="text-sm text-muted transition-colors hover:text-highlighted"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>
      </div>

      <!-- 中：社交 -->
      <div>
        <h2 class="text-sm font-semibold text-highlighted">关注我们</h2>
        <ul class="mt-3 space-y-2">
          <li v-for="link in SOCIAL_LINKS" :key="link.key">
            <a
              :href="link.href"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-highlighted"
            >
              <UIcon :name="link.icon" class="size-4" />
              {{ link.label }}
            </a>
          </li>
        </ul>
      </div>

      <!-- 右：友链 -->
      <div>
        <h2 class="text-sm font-semibold text-highlighted">友情链接</h2>
        <ul class="mt-3 space-y-2">
          <li v-for="link in FRIEND_LINKS" :key="link.href">
            <a
              :href="link.href"
              target="_blank"
              rel="noopener noreferrer"
              class="group inline-flex flex-col text-sm text-muted transition-colors hover:text-highlighted"
            >
              <span class="inline-flex items-center gap-1">
                {{ link.label }}
                <UIcon name="i-lucide-arrow-up-right" class="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
              </span>
              <span class="text-xs text-dimmed">{{ link.description }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div class="border-t border-default/70">
      <div class="mx-auto w-full max-w-page px-4 py-4 sm:px-6">
        <p class="text-xs leading-relaxed text-dimmed">
          © {{ year }} {{ SITE.brand }} · 本项目为《蛋仔派对》同人创作，非官方出品，与网易游戏、微软无隶属或赞助关系。
          代码以 {{ SITE.license }} 授权；游戏素材权利归原权利人。
        </p>
      </div>
    </div>
  </footer>
</template>
