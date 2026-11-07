/** 文档分类。`slug` 与 content/docs 下每个文件的 frontmatter `category` 对应，
 *  `order` 决定分类在概览页与导航里的先后。新增分类时三处要一起改：
 *  这里、content 下建目录、build/routes.ts 会自动按这里枚举分类页。 */
export interface DocCategory {
  slug: 'user' | 'developer'
  title: string
  description: string
  icon: string
  order: number
}

export const DOC_CATEGORIES: DocCategory[] = [
  {
    slug: 'user',
    title: '用户文档',
    description: '从零装好 Rainmeter，到把小组件摆到桌面上。',
    icon: 'i-lucide-book-open',
    order: 1,
  },
  {
    slug: 'developer',
    title: '开发者文档',
    description: '仓库怎么分层、怎么编、怎么提交、怎么发版。',
    icon: 'i-lucide-code-xml',
    order: 2,
  },
]

export function findCategory(slug: string): DocCategory | undefined {
  return DOC_CATEGORIES.find(c => c.slug === slug)
}
