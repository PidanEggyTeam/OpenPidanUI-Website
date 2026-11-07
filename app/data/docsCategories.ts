/**
 * 分类的**展示信息覆盖表**（可选）。
 *
 * 分类本身完全由 content/docs 下每篇的 frontmatter `category` 决定：
 * 同名即同组，写什么名字都行（中文也支持），不需要在这里登记。
 * 这里只用来给某个分类补图标 / 描述 / 强制排序，没配到的分类走默认值。
 */
export interface DocCategoryPresentation {
  /** 与 frontmatter 的 category 完全一致 */
  name: string
  description?: string
  icon?: string
  /** 覆盖 frontmatter 的 categoryOrder */
  order?: number
}

export const DOC_CATEGORY_PRESENTATION: DocCategoryPresentation[] = [
  {
    name: '用户文档',
    description: '从零装好 Rainmeter，到把小组件摆到桌面上。',
    icon: 'i-lucide-book-open',
    order: 1,
  },
  {
    name: '开发者文档',
    description: '仓库怎么分层、怎么编、怎么提交、怎么发版。',
    icon: 'i-lucide-code-xml',
    order: 2,
  },
]

export const DEFAULT_CATEGORY_ICON = 'i-lucide-folder'

export function categoryRoute(name: string): string {
  return `/docs/category/${encodeURIComponent(name)}`
}
