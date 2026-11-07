export default defineAppConfig({
  // 图标一律渲染成内联 <svg>：静态站首屏就要有图标
  icon: {
    mode: 'svg',
  },

  ui: {
    colors: {
      primary: 'brand',
      neutral: 'ink',
      error: 'danger',
    },

    /* ---- UPageHeader ----
       Nuxt UI 的默认值偏营销页（py-8 + sm:text-4xl）。列表页需要的是
       「下边框 + pb-5」的紧凑节奏，与 PidanUI 官网一致。 */
    pageHeader: {
      slots: {
        root: 'py-0 pb-5 mb-6 border-b border-default',
        wrapper: 'flex flex-row flex-wrap items-end justify-between gap-x-4 gap-y-3',
        description: 'mt-1.5 text-[13px] text-dimmed',
        links: 'flex flex-wrap gap-2',
      },
    },

    /* ---- UPageGrid ----
       默认 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 是固定列数，卡片宽度
       会被视口牵着走。改为 auto-fill：密度由调用点的 --grid-min 决定
       （首页特性 250 / 分类索引 220），min(…, 100%) 顺带兜住窄屏。
       末尾的 ! 只用于压掉主题里的 sm:/lg: 列数。 */
    pageGrid: {
      base:
        'relative grid gap-3.5! ' +
        'grid-cols-[repeat(auto-fill,minmax(min(var(--grid-min,clamp(280px,28vw,360px)),100%),1fr))]!',
    },

    // Markdown 排版全部走 Nuxt UI 的 Prose 组件，不引 @tailwindcss/typography。
    // 这里只做「品牌一致性」的少量覆盖，其余保持框架默认（升级时不用跟着改）。
    prose: {
      a: {
        base: 'font-medium text-primary underline underline-offset-4 hover:opacity-80',
      },
      code: {
        base: 'rounded-md border border-default bg-elevated px-1.5 py-0.5 font-mono text-[0.9em] font-normal before:content-none after:content-none',
      },
      pre: {
        base: 'my-6 overflow-x-auto rounded-lg border border-default bg-elevated p-4 text-sm leading-relaxed',
      },
      h1: {
        base: 'scroll-m-20 text-3xl font-bold tracking-tight text-highlighted',
      },
      h2: {
        base: 'scroll-m-20 text-2xl font-bold tracking-tight text-highlighted mt-10 mb-3',
      },
      h3: {
        base: 'scroll-m-20 text-lg font-semibold tracking-tight text-highlighted mt-8 mb-2',
      },
      table: {
        base: 'my-6 w-full text-sm',
      },
      th: {
        base: 'border-b border-default px-3 py-2 text-left font-semibold text-highlighted',
      },
      td: {
        base: 'border-b border-default/60 px-3 py-2 align-top text-toned',
      },
      li: {
        base: 'my-1',
      },
    },
  },
});
