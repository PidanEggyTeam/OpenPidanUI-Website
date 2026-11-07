export interface SocialLink {
  key: string
  label: string
  href: string
  icon: string
}

export const SOCIAL_LINKS: SocialLink[] = [
  { key: 'github', label: 'GitHub', href: 'https://github.com/PidanUI-Team/OpenPidanUI', icon: 'i-lucide-github' },
  { key: 'site-repo', label: '本站源码', href: 'https://github.com/PidanEggyTeam/OpenPidanUI-Website', icon: 'i-lucide-code-xml' },
  { key: 'bilibili', label: '哔哩哔哩', href: 'https://space.bilibili.com/', icon: 'i-simple-icons-bilibili' },
  { key: 'qq', label: 'QQ 群', href: '#qq-group', icon: 'i-simple-icons-tencentqq' },
]

export interface FriendLink {
  label: string
  href: string
  description: string
}

/** 友链：先占位，等确认清单后替换。 */
export const FRIEND_LINKS: FriendLink[] = [
  { label: 'PidanUI 官网', href: 'https://pidanui.eggycore.top/', description: '主项目主页与新闻' },
  { label: 'EasiAuto', href: 'https://easiauto.cc/', description: '希沃白板自动化工具' },
  { label: 'GitCode 镜像', href: 'https://gitcode.com/', description: '国内代码镜像' },
]
