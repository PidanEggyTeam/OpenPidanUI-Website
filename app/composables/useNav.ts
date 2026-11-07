import { NAV_ITEMS } from '~/data/nav'

/** 当前路径对应的导航 key；外链项永远不返回，避免滚动时莫名高亮。 */
export function useActiveNavKey(): ComputedRef<string | null> {
  const route = useRoute()

  return computed(() => {
    const path = route.path
    // 文档相关路由都算「文档」；首页只在精确匹配时为 active
    const matched = [...NAV_ITEMS]
      .filter(item => !item.external)
      .sort((a, b) => b.href.length - a.href.length)
      .find(item => item.href === '/' ? path === '/' : path === item.href || path.startsWith(`${item.href}/`))
    return matched?.key ?? null
  })
}
