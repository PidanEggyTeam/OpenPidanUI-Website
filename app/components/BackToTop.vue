<script setup lang="ts">
const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > 600
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

function toTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-200"
    enter-from-class="opacity-0 translate-y-2"
    leave-active-class="transition duration-150"
    leave-to-class="opacity-0 translate-y-2"
  >
    <UButton
      v-if="visible"
      class="fixed right-4 bottom-4 z-40 shadow-float lg:right-6 lg:bottom-6"
      icon="i-lucide-arrow-up"
      color="neutral"
      variant="solid"
      aria-label="回到顶部"
      @click="toTop"
    />
  </Transition>
</template>
