/**
 * 站内路径统一入口。
 * 部署在根路径时它等于原样返回；将来若要挂到子路径（如 /OpenPidanUI-Website/），
 * 把 baseURL 配上，这里自动补前缀——所有链接都必须经过它。
 */
export function withBase(path: string): string {
  if (!path.startsWith('/')) return path
  const base = useRuntimeConfig().app.baseURL || '/'
  if (base === '/') return path
  return `${base.replace(/\/$/, '')}${path}`
}
