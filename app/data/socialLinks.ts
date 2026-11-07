export interface SocialLink {
  key: string;
  label: string;
  href: string;
  icon: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    key: 'github',
    label: 'GitHub',
    href: 'https://github.com/PidanUI-Team/OpenPidanUI',
    // 品牌图标一律走 simple-icons，与 PidanUI 官网底栏一致；
    // lucide 没有品牌图标，写 i-lucide-github 会渲染成空白
    icon: 'i-simple-icons-github',
  },
  {
    key: 'site-repo',
    label: '本站源码',
    href: 'https://github.com/PidanEggyTeam/OpenPidanUI-Website',
    icon: 'i-lucide-folder-git-2',
  },
  {
    key: 'bilibili',
    label: '哔哩哔哩',
    href: 'https://space.bilibili.com/',
    icon: 'i-simple-icons-bilibili',
  },
  { key: 'qq', label: 'QQ 群', href: '#qq-group', icon: 'i-simple-icons-tencentqq' },
];

export interface FriendLink {
  label: string;
  href: string;
  description: string;
}

/** 友链：先占位，等确认清单后替换。 */
export const FRIEND_LINKS: FriendLink[] = [
  { label: 'PidanUI 官网', href: 'https://pidanui.eggycore.top/', description: '主项目主页与新闻' },
  { label: 'EasiAuto', href: 'https://easiauto.cc/', description: '希沃白板自动化工具' },
  { label: 'GitCode 镜像', href: 'https://gitcode.com/', description: '国内代码镜像' },
];
