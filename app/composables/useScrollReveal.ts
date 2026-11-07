/**
 * 滚动入场：给容器内所有 [data-reveal] 元素打 'in' 标记。
 * 只用于静态区块，不处理动态插入的节点；prefers-reduced-motion 时直接全标 in。
 */
export function useScrollReveal(rootSelector = '[data-reveal-scope]') {
  onMounted(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>(`${rootSelector} [data-reveal]`))
    if (!targets.length) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      targets.forEach(el => el.setAttribute('data-reveal', 'in'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute('data-reveal', 'in')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    )

    targets.forEach(el => observer.observe(el))
    onBeforeUnmount(() => observer.disconnect())
  })
}
