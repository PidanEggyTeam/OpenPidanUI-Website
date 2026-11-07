import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    docs: defineCollection({
      type: 'page',
      source: { include: 'docs/**/*.md' },
      schema: z.object({
        /** 分类 slug，与 app/data/docsCategories.ts 里的定义一一对应 */
        category: z.enum(['user', 'developer']),
        /** 分类内的显示序号：侧边栏、分类页、上下篇都按它排 */
        order: z.number(),
        badge: z.string().optional(),
        draft: z.boolean().default(false),
      }),
    }),
  },
})
