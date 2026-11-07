// 占位图：旧截图压成的 webp（长边 1280 / q60-78，合计约 190 KB），**仅用于确认版式**，
// 部署前会整体替换成正式的宣传图（届时 `image` 直接写图床 CDN 的绝对 URL 即可，组件对本地路径与绝对 URL 一视同仁）。
export interface ShowcaseItem {
  id: string
  title: string
  caption: string
  image: string
  width: number
  height: number
  alt: string
}

export const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: 'desktop',
    title: '桌面整体效果',
    caption: '壁纸、图标与任务栏的整体观感，右上角是 Rainmeter 小组件。',
    image: '/images/showcase/desktop.webp',
    width: 1280,
    height: 720,
    alt: 'EggyUI 时期的桌面整体效果：蛋仔壁纸、图标组、任务栏与右上角小组件',
  },
  {
    id: 'dev-center',
    title: '开发人员中心',
    caption: '早期的一体化控制面板，主题色切换、磁贴编辑都在这里。',
    image: '/images/showcase/dev-center.webp',
    width: 1052,
    height: 780,
    alt: 'EggyUI 开发人员中心界面：主题色、编辑磁贴与小工具入口',
  },
  {
    id: 'taskbar',
    title: '任务栏与搜索',
    caption: '任务栏居中、搜索框与图标风格，是当时最常被问到的一处。',
    image: '/images/showcase/taskbar.webp',
    width: 466,
    height: 154,
    alt: 'EggyUI 时期的任务栏与搜索框特写',
  },
  {
    id: 'teaser-1',
    title: '小组件演示',
    caption: '组件随壁纸与主题联动，音量、时间与播放信息都在同一块区域。',
    image: '/images/showcase/teaser-1.webp',
    width: 1280,
    height: 720,
    alt: '小组件在桌面上的演示画面',
  },
  {
    id: 'teaser-2',
    title: '主题变体',
    caption: '换主题色不需要重装，切回默认主题即可完全恢复。',
    image: '/images/showcase/teaser-2.webp',
    width: 1280,
    height: 720,
    alt: '另一套主题下的桌面效果',
  },
]
