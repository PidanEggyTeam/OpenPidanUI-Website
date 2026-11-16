/** 首页宣传图 */
export const PROMO_IMAGE = 'https://img.remit.ee/i/UQi9eaPKuGU4';

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export const HOME_FEATURES: FeatureItem[] = [
  {
    icon: 'i-lucide-terminal',
    title: '.NET 10 技术栈',
    description: '组件全面转向 .NET 10，告别易语言，杀软误报也少了一大截。',
  },
  {
    icon: 'i-lucide-star',
    title: '继承 EggyUI 设计理念',
    description:
      '组件的外观风格继承了 EggyUI 的蛋仔风设计理念，你看到的组件的样子还是那个熟悉的样子。',
  },
  {
    icon: 'i-lucide-layers',
    title: '模块化组件',
    description: '每个组件独立发布、独立更新，出问题只换那一个，不用整包重装。',
  },
  {
    icon: 'i-simple-icons-github',
    title: '开源透明',
    description: '源码可审查，欢迎提交 issue 与 PR。改了什么、为什么改，都能在提交记录里找到。',
  },
];

export interface ShowcaseItem {
  id?: string;
  title?: string;
  caption?: string;
  image: string;
  width?: number;
  height?: number;
  alt?: string;
}

export const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: 'widgets-1',
    title: 'Rainmeter 小组件演示',
    caption: '目前这些小组还在完善中。',
    image: 'https://img.remit.ee/i/UQi9eaPKuGU4',
    width: 1280,
    height: 720,
    alt: '小组件在桌面上的演示画面',
  },
  {
    image: 'https://via.placeholder.com/1920x1080.webp',
  },
];

export interface TimelineItem {
  time: string;
  title: string;
  description: string;
}

/** 名称沿革：只讲事实，不复述争议。 */
export const ABOUT_TIMELINE: TimelineItem[] = [
  {
    time: '2024-04',
    title: 'EggyUI 启动',
    description: '以易语言为主要技术栈起步。',
  },
  {
    time: '2026-10',
    title: 'Finale Mini 发布',
    description: 'EggyUI 收官版本，随后归档停止维护。',
  },
  {
    time: '2026',
    title: '更名 OpenPidanUI',
    description: 'OpenEggyUI 全面重构，转向 .NET 10，并恢复开发。',
  },
  {
    time: '至今',
    title: '随 PidanUI 一起更新',
    description: '组件按模块发布，与主项目同步迭代。',
  },
];

export const ABOUT_TEXT = [
  'OpenPidanUI 是 PidanUI 的开源辅助组件库，源于当初未能推进的 OpenEggyUI 项目。',
];

export interface JoinCard {
  title: string;
  description: string;
  icon: string;
  links: {
    label: string;
    to: string;
    external?: boolean;
    icon?: string;
  }[];
}

export const JOIN_CARDS: JoinCard[] = [
  {
    title: '加入社区',
    description: '装上了想反馈问题，或者只是来看看别人怎么用。',
    icon: 'i-lucide-users',
    links: [
      {
        label: 'QQ 群',
        to: 'https://qm.qq.com/q/Km93h8YWAw',
        external: true,
        icon: 'i-simple-icons-tencentqq',
      },
      {
        label: '哔哩哔哩',
        to: 'https://space.bilibili.com/3546563248916693',
        external: true,
        icon: 'i-simple-icons-bilibili',
      },
    ],
  },
  {
    title: '加入开发组',
    description: '组件都是模块化的，挑一个感兴趣的模块就能上手。',
    icon: 'i-lucide-code-xml',
    links: [
      {
        label: 'GitHub',
        to: 'https://github.com/PidanUI-Team',
        external: true,
        icon: 'i-simple-icons-github',
      },
      {
        label: 'GitCode',
        to: 'https://gitcode.com/PidanUI-Team',
        external: true,
        icon: 'i-simple-icons-atomgit',
      },
      { label: '开发者文档', to: '/docs/developer' },
    ],
  },
];
