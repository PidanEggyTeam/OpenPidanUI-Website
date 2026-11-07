<script setup lang="ts">
import { NAV_ITEMS } from '~/data/nav'

const activeKey = useActiveNavKey()
const route = useRoute()
const open = ref(false)

watch(() => route.fullPath, () => { open.value = false })

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') open.value = false
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-default bg-default/85 backdrop-blur">
    <div class="mx-auto flex h-16 w-full max-w-page items-center gap-3 px-4 sm:px-6">
      <NuxtLink :to="withBase('/')" class="flex shrink-0 items-center gap-2" aria-label="回到首页">
        <img src="/images/logo.webp" alt="" width="32" height="32" class="h-8 w-8 rounded-lg">
        <span class="text-base font-semibold tracking-tight text-highlighted">OpenPidanUI</span>
      </NuxtLink>

      <nav class="ml-4 hidden items-center gap-1 lg:flex" aria-label="主导航">
        <template v-for="item in NAV_ITEMS" :key="item.key">
          <a
            v-if="item.external"
            :href="item.href"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm text-muted transition-colors hover:bg-elevated hover:text-highlighted"
          >
            {{ item.label }}
            <UIcon :name="item.trailingIcon ?? 'i-lucide-arrow-up-right'" class="size-3.5" />
          </a>
          <NuxtLink
            v-else
            :to="withBase(item.href)"
            class="inline-flex items-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-elevated hover:text-highlighted"
            :class="activeKey === item.key ? 'bg-elevated text-highlighted' : 'text-muted'"
          >
            {{ item.label }}
          </NuxtLink>
        </template>
      </nav>

      <div class="ml-auto flex items-center gap-2">
        <UColorModeButton />
        <UButton
          class="lg:hidden"
          :icon="open ? 'i-lucide-x' : 'i-lucide-menu'"
          color="neutral"
          variant="ghost"
          :aria-expanded="open"
          aria-controls="mobile-nav"
          aria-label="切换导航"
          @click="open = !open"
        />
      </div>
    </div>

    <!-- 移动端导航：顶栏下方面板（不用 Drawer） -->
    <div
      id="mobile-nav"
      class="grid overflow-hidden border-t border-default transition-[grid-template-rows] duration-300 lg:hidden"
      :class="open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
      :inert="!open"
    >
      <div class="min-h-0 overflow-hidden">
        <nav class="mx-auto flex w-full max-w-page flex-col gap-1 px-4 py-3" aria-label="移动端导航">
          <template v-for="item in NAV_ITEMS" :key="item.key">
            <a
              v-if="item.external"
              :href="item.href"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center justify-between rounded-md px-3 py-2.5 text-sm text-muted hover:bg-elevated"
            >
              {{ item.label }}
              <UIcon :name="item.trailingIcon ?? 'i-lucide-arrow-up-right'" class="size-4" />
            </a>
            <NuxtLink
              v-else
              :to="withBase(item.href)"
              class="rounded-md px-3 py-2.5 text-sm hover:bg-elevated"
              :class="activeKey === item.key ? 'bg-elevated text-highlighted' : 'text-muted'"
            >
              {{ item.label }}
            </NuxtLink>
          </template>
        </nav>
      </div>
    </div>
  </header>
</template>
