export default defineAppConfig({
  ui: {
    colors: {
      primary: 'brand',
      neutral: 'ink',
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
})
