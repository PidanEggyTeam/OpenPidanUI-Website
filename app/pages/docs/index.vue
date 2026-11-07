<script setup lang="ts">
useSeoMeta({
  title: '文档',
  description: 'OpenPidanUI 文档：安装 Rainmeter、导入小组件、组件设置，以及仓库结构、构建调试与发版流程。',
})

const { groups } = await useDocsGroups()
</script>

<template>
  <div>
    <PageHeading
      title="文档"
      description="按用途分成两类：左边给使用者，右边给想改代码的人。第一次来建议从「安装 Rainmeter」开始。"
    />

    <div class="mx-auto w-full max-w-page px-4 py-10 sm:px-6">
      <DocsGroupCards :groups="groups" />

      <UAlert
        class="mt-8"
        color="neutral"
        variant="subtle"
        icon="i-lucide-circle-alert"
        title="文档还在补"
        description="首版只写了最必要的部分。发现哪一步说不清楚，直接去仓库提 issue，比在群里问更快。"
      />
    </div>
  </div>
</template>
