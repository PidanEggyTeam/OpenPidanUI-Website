export interface NavItem {
  key: string;
  label: string;
  href: string;
  icon: string;
  /** 外链：新窗口打开、带 ↗、永不参与高亮 */
  external?: boolean;
  trailingIcon?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { key: 'home', label: '首页', href: '/', icon: 'i-lucide-house' },
  { key: 'download', label: '下载', href: '/download', icon: 'i-lucide-download' },
  { key: 'docs', label: '文档', href: '/docs', icon: 'i-lucide-book-open' },
  {
    key: 'news',
    label: '新闻',
    href: 'https://pidanui.eggycore.top/posts/',
    icon: 'i-lucide-newspaper',
    external: true,
    trailingIcon: 'i-lucide-arrow-up-right',
  },
];
