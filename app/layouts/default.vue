<template>
  <div class="flex min-h-screen flex-col bg-default text-default">
    <SiteHeader />
    <main class="flex-1">
      <slot />
    </main>
    <SiteFooter />
    <BackToTop />
  </div>
</template>
