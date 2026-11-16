export interface Link {
  label?: string;
  href: string;
  icon: string;
}

/** 社交链接 */
export const SOCIAL_LINKS: Link[] = [
  {
    // label: 'GitHub',
    href: 'https://github.com/PidanUI-Team',
    icon: 'i-simple-icons-github',
  },
  {
    // label: 'GitCode',
    href: 'https://gitcode.com/PidanUI-Team',
    icon: 'i-simple-icons-atomgit',
  },
  {
    // label: '哔哩哔哩',
    href: 'https://space.bilibili.com/3546563248916693',
    icon: 'i-simple-icons-bilibili',
  },
  {
    // label: 'QQ 群',
    href: 'https://qm.qq.com/q/Km93h8YWAw',
    icon: 'i-simple-icons-tencentqq',
  },
];

/** 友情链接 */
export const FRIEND_LINKS: Link[] = [
  {
    label: 'PidanUI 官网',
    href: 'https://pidanui.eggycore.top',
    icon: 'i-lucide-palette',
  },
  {
    label: 'PidanUI 上线了官网',
    href: 'https://eggyui.mysxl.cn',
    icon: 'i-lucide-globe',
  },
  {
    label: '皮蛋镜像站',
    href: 'https://link3.cc/eggycore',
    icon: 'i-lucide-archive',
  },
  {
    label: 'BSOD-MEMZ的个人基地',
    href: 'https://xxtsoft.top',
    icon: 'i-simple-icons-windows',
  },
  {
    label: '红蓝灯的秘密基地',
    href: 'https://cn-rbl.github.io',
    icon: 'i-lucide-lightbulb',
  },
  {
    label: '冷域观者的个人网站',
    href: 'https://coldfield.skystarlight.top',
    icon: 'i-lucide-snowflake',
  },
];
