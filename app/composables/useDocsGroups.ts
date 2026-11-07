import {
  DEFAULT_CATEGORY_ICON,
  DOC_CATEGORY_PRESENTATION,
  categoryRoute,
} from '~/data/docsCategories'

export interface DocEntry {
  path: string
  title: string
  description?: string
  /** 分类名，来自 frontmatter，可自由命名 */
  category: string
  /** 分类内序号 */
  order: number
  /** 分类间权重 */
  categoryOrder: number
  badge?: string
}

export interface DocGroup {
  name: string
  description?: string
  icon: string
  order: number
  route: string
  entries: DocEntry[]
}

/**
 * 文档分类视图：一次性取回全部文档的元信息（不取正文，避免 payload 变大）。
 *
 * 分类**不预先登记**：frontmatter 里 `category` 写什么就有什么，
 * 同名自动成组；`categoryOrder` 决定分类之间谁在前，`order` 决定组内顺序。
 *
 * 注意是 async：调用方要 `await`，否则 setup 阶段拿到的还是空数组
 * （Nuxt 只在那之后才等 asyncData，动态路由页面里同步读会读到空值）。
 */
export async function useDocsGroups() {
  const { data } = await useAsyncData(
    'docs:entries',
    () =>
      queryCollection('docs')
        .select('path', 'title', 'description', 'category', 'order', 'categoryOrder', 'badge')
        .all(),
    { default: () => [] },
  )

  const entries = computed<DocEntry[]>(() =>
    (data.value as DocEntry[])
      .filter(entry => entry.path !== '/docs')
      .map(entry => ({ ...entry, categoryOrder: entry.categoryOrder ?? 999 }))
      .sort((a, b) => a.order - b.order),
  )

  const presentation = computed(() =>
    Object.fromEntries(DOC_CATEGORY_PRESENTATION.map(item => [item.name, item])),
  )

  const groups = computed<DocGroup[]>(() => {
    const map = new Map<string, DocGroup>()

    for (const entry of entries.value) {
      let group = map.get(entry.category)
      if (!group) {
        const preset = presentation.value[entry.category]
        group = {
          name: entry.category,
          description: preset?.description,
          icon: preset?.icon ?? DEFAULT_CATEGORY_ICON,
          order: preset?.order ?? entry.categoryOrder,
          route: categoryRoute(entry.category),
          entries: [],
        }
        map.set(entry.category, group)
      }
      group.entries.push(entry)
    }

    return [...map.values()].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, 'zh-CN'))
  })

  /** 侧边栏排序用：分类权重 * 1000 + 组内序号 */
  const navRank = computed<Record<string, number>>(() =>
    Object.fromEntries(
      entries.value.map(entry => {
        const group = groups.value.find(g => g.name === entry.category)
        return [entry.path, (group?.order ?? 999) * 1000 + entry.order]
      }),
    ),
  )

  return { entries, groups, navRank }
}
