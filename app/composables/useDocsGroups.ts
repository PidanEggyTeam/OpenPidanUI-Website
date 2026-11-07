import { DOC_CATEGORIES, type DocCategory } from '~/data/docsCategories'

export interface DocEntry {
  path: string
  title: string
  description?: string
  category: DocCategory['slug']
  order: number
  badge?: string
}

export interface DocGroup extends DocCategory {
  entries: DocEntry[]
}

/**
 * 文档分类视图：一次性取回全部文档的元信息（不取正文，避免 payload 变大），
 * 按 frontmatter 的 `category` 分组、`order` 升序。
 *
 * 侧边栏仍走 @nuxt/content 的 navigation（由目录生成），排序在 DocsShell 里用这里的 order 映射纠正。
 */
export function useDocsGroups() {
  const { data } = useAsyncData(
    'docs:entries',
    () =>
      queryCollection('docs')
        .select('path', 'title', 'description', 'category', 'order', 'badge')
        .all(),
    { default: () => [] },
  )

  const entries = computed<DocEntry[]>(() =>
    (data.value as DocEntry[])
      .filter(entry => entry.path !== '/docs')
      .sort((a, b) => a.order - b.order),
  )

  const orderMap = computed<Record<string, number>>(() =>
    Object.fromEntries(entries.value.map(entry => [entry.path, entry.order])),
  )

  const groups = computed<DocGroup[]>(() =>
    [...DOC_CATEGORIES]
      .sort((a, b) => a.order - b.order)
      .map(category => ({
        ...category,
        entries: entries.value.filter(entry => entry.category === category.slug),
      })),
  )

  return { entries, groups, orderMap }
}
