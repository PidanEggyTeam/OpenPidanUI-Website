# AGENTS.md · OpenPidanUI-Website 开发约定

本文件写给在本仓库里工作的开发者与 AI 助手：README 只保留面向访客的项目介绍，实现约定集中在这里。

## 项目定位

OpenPidanUI 官网（首页 / 下载 / 文档），纯静态站：

- Nuxt 4（`nuxi generate`，`nitro.prerender.failOnError: true`）
- `@nuxt/content` v3 驱动文档，Markdown 排版走 Nuxt UI 的 Prose
- Nuxt UI 4 承担组件层，Tailwind CSS v4 的 `@theme` 承担设计令牌
- 产物是 assets-only 的静态目录，部署到 Cloudflare Workers Static Assets

设计语言与 PidanUI 官网、冷域观者站共用同一套令牌刻度（品牌黄 / ink 灰阶 / 圆角与阴影刻度 / 三路 dark 变体）。

## 常用命令

```bash
pnpm install
pnpm dev          # 本地开发，默认 http://localhost:3000
pnpm build        # nuxi generate + 注入字体 + 产物校验
pnpm generate     # 只生成静态产物
pnpm preview      # wrangler dev，按 Cloudflare 规则跑静态产物
pnpm deploy       # 构建 + wrangler deploy
pnpm format:check # Prettier 风格检查
```

`pnpm build` 里那两步不要省：

- `scripts/sync-fonts.mjs`：把 HarmonyOS Sans SC 的分包字体复制进 `.output/public/fonts/`；
- `scripts/verify-output.mjs`：逐条校验 `build/routes.ts` 的路由都有产物（`failOnError` 抓不到漏页）。

## 目录结构

```
app/
  pages/            路由；页面文件只做「SEO + 渲染视图」
  components/       按文件名注册（pathPrefix: false），home/ docs/ download/ 分组
  layouts/          default：UHeader + UContainer.page-shell + UFooter
  composables/      useDocsGroups / useReleases / useNav / useScrollReveal / usePageProgress
  data/             nav、社交、友链、首页文案、轮播数据、文档分类
  assets/styles/    main.css 的 @import 顺序固定
content/docs/       文档正文，frontmatter 决定路径与排序
build/routes.ts     预渲染路由唯一入口
server/routes/      构建期接口（/api/releases.json）
shared/             站点常量、Release 数据模型、离线快照
scripts/            字体灌注、产物校验
```

## 数据文件

- `content/docs/*.md` —— 全部文档（唯一内容源），frontmatter 字段见 `content.config.ts`。
- `app/data/nav.ts` —— 主导航项（顶栏与移动端下拉面板共用），外链项带 `external` 标记。
- `app/data/home.ts` —— 首页文案：项目特性、名称沿革、加入社区 / 开发组入口。
- `app/data/showcase.ts` —— 首页「组件展示」的截图清单与说明。
- `app/data/docsCategories.ts` —— 文档分类的图标、描述与权重（分类本身由 frontmatter 自动发现）。
- `app/data/socialLinks.ts` —— 底栏「关注我们」与友情链接。
- `shared/site.ts` / `shared/releases.ts` / `shared/data/releases.snapshot.json` —— 站点常量、Release 数据模型、离线快照。
- `build/routes.ts` —— 预渲染路由的唯一入口。

## 样式分层

`app/assets/styles/` 下 4 个文件，`main.css` 是唯一入口，导入顺序即正确性：

| 文件            | 职责                                                                                      |
| --------------- | ----------------------------------------------------------------------------------------- |
| `main.css`      | 层声明与 `@import` 顺序：theme → preflight → utilities → `@nuxt/ui` → 项目文件            |
| `tokens.css`    | `@theme static` 设计令牌（brand / ink / danger 三套色阶、圆角、阴影、字体别名、容器宽度） |
| `base.css`      | 主题变量真源（浅色 + 深色）、`--ui-*` 语义变量映射、滚动条、过渡基线                      |
| `animation.css` | 页面切换过渡与滚动入场（`data-reveal` 契约）                                              |

- `@nuxt/ui` 必须排在 `tokens.css` 之前，才能用自定义的三路 `dark` 变体覆盖它。
- **Preflight 已启用**：元素级默认值由它提供，`base.css` 只补「压过 Preflight」的项目决定（标题字重、svg 垂直对齐）。
- **断点只用 Tailwind / Nuxt UI 默认值**：`sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536`，移动端临界值 = `lg`（1024）。
- 文档正文排版不引 `@tailwindcss/typography`，统一在 `app.config.ts` 里覆盖 Nuxt UI 的 Prose 主题。

## 外壳与滚动

- 滚动权在浏览器：`body` 自然滚动（`min-height: 100dvh`），**没有**自定义滚动容器；任何滚动监听都应挂 `window`。
- 顶栏 `SiteHeader` 用 `UHeader`（`sticky top-0`），底栏 `SiteFooter` 用 `UFooter`，位于文档流末尾。
- 页面容器是 layout 里的 `UContainer.page-shell`，滚动入场的层级基准即「`.page-shell` > 视图根节点 > 区块」。
- 需要让开吸顶顶栏的地方统一用 `--shell-header-h`（= `--ui-header-height`）：`html` 的 `scroll-padding-top` 与标题的 `scroll-margin-top`。

## 交互与动效

- 主题三态（跟随系统 / 浅色 / 深色）—— `app/components/ThemeToggle.vue`，基于 Nuxt UI 的 `colorMode` + `USwitch` 胶囊开关；首帧由框架注入的脚本落地，避免深色闪白。
- 页面过渡与滚动入场 —— `app/assets/styles/animation.css` 与 `app/composables/useScrollReveal.ts`，遵循 `prefers-reduced-motion`，无 JS 时不打任何标记。
- 顶部加载进度条 —— `app/components/PageProgress.vue` + `app/composables/usePageProgress.ts`（真实推进：路由模块、字体、首屏图片）。
- 返回顶部浮钮 —— `app/components/BackToTop.vue`（监听 `window`，滚动超过 700px 出现）。
- 组件展示轮播 —— `app/components/home/ShowcaseCarousel.vue`（键盘方向键 / Home / End、指针滑动、悬停暂停，手动翻页后停止自动播放）。
- 移动端（≤1024px）汉堡下拉面板，收起时 `inert`，点击路由自动收起。

## 文档的分类与排序

每篇 `.md` 的 frontmatter 带两个必填字段：

```yaml
---
title: 安装 Rainmeter
description: 一句话摘要，会出现在卡片和 SEO 里
category: 用户文档 # 自由命名，同名即同组（中文也可以）
order: 1 # 分类内的显示序号：侧边栏 / 分类页 / 上下篇都按它
categoryOrder: 1 # 分类之间的权重，小的在前；不填按分类名排序
---
```

分类**不需要预先登记**：写一个新的 `category` 值，站点就会自动多出一个分类和 `/docs/category/<分类名>` 页面（`build/routes.ts` 从 frontmatter 收集）。想给某个分类配图标 / 描述 / 强制排序，再去 `app/data/docsCategories.ts` 的 `DOC_CATEGORY_PRESENTATION` 里加一条即可；没配的分类走默认图标与通用描述。

## 下载数据

版本信息在**构建期**从 GitHub Releases（`PidanUI-Team/OpenPidanUI`）拉取，归一化后预渲染成 `/api/releases.json`，访问端零请求。拉取失败时回退到 `shared/data/releases.snapshot.json`，页面会显示「快照」提示。发版后需要重新构建一次本站。

## 硬约束

1. **站内链接一律 `<NuxtLink :to>` + `withBase()`**，不要裸 `<a href>`。
2. **新增页面必须登记 `build/routes.ts`**，否则产物里根本没有这一页。
3. **动态绑定的图标必须登记 `nuxt.config.ts` 的 `icon.clientBundle.icons`**，否则静态站运行时会去 Iconify API 取图。
4. **自有 CSS 全部写进 `@layer base/components`**，不写未分层规则（否则会压掉工具类）。
5. **移动端导航用顶栏下方面板**，不用 Drawer；断点只用 Tailwind 默认阶梯。
6. 构建必须零错误；`prerender.failOnError: true`。

## 改动前后的验证

- 改样式 / 布局 / 组件：至少跑一次 `pnpm generate`，确认预渲染无报错，并抽查首页、`/download`、`/docs` 在浅色与深色下的渲染。
- 改 `nuxt.config.ts` / `app.config.ts`：跑一次 `pnpm exec nuxt prepare`，否则类型与 `#build/ui.css` 是旧的。
- 改 `.vue` / `.ts`：`pnpm exec prettier --check <改动文件>`。
- 构建期网络不可用属于已知情况：`[releases] GitHub 不可用` 只是回退快照的警告，不是失败。

## 提交约定

- 使用 Conventional Commits：`feat` / `fix` / `style` / `refactor` / `docs` / `chore`，描述用中文。
- 一个提交只做一件事；不要顺手把无关文件的格式化改动混进来。
- 涉及视觉改动时，提交信息里写清「哪个区块 / 哪个页面」变了，方便回滚。
