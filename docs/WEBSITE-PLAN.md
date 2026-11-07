# OpenPidanUI 官网规划

> 本文是 `D:\TestProject\PidanWebSite\newwebsite.md`（初版页面规划）的续篇与落地版：
> 初版定了「有哪些页面、长什么样」，本文把它补成「每个区块写什么、技术上怎么做、按什么顺序做、哪里会翻车」。
> 写成时间：2026-11-07。技术选型与版本号以当日实测为准，执行时请重新核对一次 `package.json` 锚点。

---

## 1. 项目与目标

### 1.1 这个站在讲什么

OpenPidanUI 是 **PidanUI 的辅助组件开源代码库**（.NET 10 / C# / WPF / Rainmeter 配套工具）。官网要回答三个问题：

1. **这是什么** —— 不是又一套桌面美化，而是让 PidanUI「不修改系统文件」这件事能落地的配套组件；
2. **我能拿到什么** —— 目前是 Rainmeter 小组件及其设置程序，后续按模块发布；
3. **我能不能改** —— 仓库结构、构建方式、提交约定、发版流程。

一句话定位（Hero 副标题候选，出自 `D:\TestProject\Eggix\README.md` 原句）：

> 用代码，为 PidanUI 构建更安全、更稳定的美化体验。

### 1.2 三类读者，三种路径

| 读者 | 从哪进 | 30 秒内要拿到什么 |
| --- | --- | --- |
| 玩家 | Hero 的「下载」按钮 | 一个能装的 `.rmskin` / `.zip`，以及「装完怎么用」的文档入口 |
| 想贡献的开发者 | Hero 的「查看文档」/ 首页「加入开发」 | 仓库结构、构建命令、提交规范 |
| 外部审查者 | 导航「关于」/ 底栏版权 | 许可证、素材来源、与原作的关系声明 |

### 1.3 成功标准（可验收，不是形容词）

- 从首页点两下能到达任一版本的可下载资产（首页 → 下载 → 资产按钮）。
- 用户文档的第 1 篇能在**不离开本站**的情况下完成「装 Rainmeter → 导入小组件 → 看到效果」。
- 开发者文档的第 2 篇能让人在本机跑出一次成功的构建。
- 构建产物零外部字体/图标请求（字体与图标全部自包含）。

---

## 2. 信息架构

### 2.1 导航（4 项，其中一个外链）

| 序号 | 标签 | 目标 | 图标 | 说明 |
| --- | --- | --- | --- | --- |
| 1 | 首页 | `/` | `i-lucide-house` | |
| 2 | 下载 | `/download` | `i-lucide-download` | |
| 3 | 文档 | `/docs` | `i-lucide-book-open` | |
| 4 | 新闻 | `https://pidanui.eggycore.top/posts/` | `i-lucide-newspaper` | **外链，带 `↗`**（`trailingIcon: 'i-lucide-arrow-up-right'`、`target="_blank"`） |

要点：

- 外链项 **永不返回 active**（`useActiveNavKey()` 里对 `external: true` 直接返回 `null`），否则滚动到页尾时会莫名高亮。
- 导航数据只有一份（`app/data/nav.ts`），顶栏、移动端面板、底栏的站内导航共用它。

### 2.2 路由清单

| 路由 | 文件 | 是否预渲染 |
| --- | --- | --- |
| `/` | `app/pages/index.vue` | ✅ |
| `/download` | `app/pages/download.vue` | ✅ |
| `/docs` | `app/pages/docs/index.vue` | ✅ |
| `/docs/<group>` | 由 `content/docs/*/index.md` 生成 | ✅ |
| `/docs/<group>/<slug>` | `app/pages/docs/[...slug].vue` | ✅ |
| `/api/releases.json` | `server/routes/api/releases.json.ts` | ✅（产物文件） |
| `/404.html` | `app/error.vue` | ✅ |

**没有** `/posts`、`/about`、`/personality-test` —— 新闻外链，关于并入首页区块。

### 2.3 站点地图（心智模型）

```
/home ──┬── 下载（Releases）
        ├── 文档 ──┬── 用户文档（安装 / 导入 / 设置 / FAQ）
        │          └── 开发者文档（仓库 / 构建 / 提交 / 发版）
        └── 新闻 ↗（外部博客）
```

---

## 3. 页面规格

### 3.1 首页

自上而下五个区块，**首屏必须一次说清「是什么 + 去哪下」**。

#### 区块 1 · Hero（左文右图）

| 元素 | 内容 | 备注 |
| --- | --- | --- |
| 眉标 | `UBadge`：`PidanUI 配套组件` | `color="primary" variant="subtle"` |
| 主标题 | `Open` + 强调色 `PidanUI` | 渐变字用 `--brand-grad`，只对 `PidanUI` 生效 |
| 副标题 | 见 1.1 的一句话 | 两行内，长句截断 |
| 按钮 | 主：`立即下载` → `/download`；次：`查看文档` → `/docs` | 主按钮 `size="lg"`，次按钮 `variant="outline"` |
| 右图 | 宣传图 `https://img.remit.ee/i/hsjlCZAGQuf2` | 走 `SafeImage`（带 `width/height` + `onerror` 兜底），`fetchpriority="high"` |

降级：图床挂掉时显示品牌底色 + Logo 占位块，**不能让 Hero 高度塌陷**（图片容器固定 `aspect-[4/3]`）。

#### 区块 2 · 项目特性（6 张卡）

数据在 `app/data/home.ts` 的 `HOME_FEATURES`，`UPageSection` + `UPageGrid`（`v-for` `UPageCard variant="subtle" spotlight`）。

| # | 标题 | 一句话 | 出处 |
| --- | --- | --- | --- |
| 1 | .NET 10 技术栈 | 告别易语言，正面解决高 DPI 缩放与杀软误报 | README「项目特色」第 1 条 |
| 2 | 不修改系统文件 | 不替换 `imageres.dll.mun` / `shell32.dll.mun`，卸载＝切回默认主题 | 第 2 条 |
| 3 | 精简版美化 | 只保留主题与 Rainmeter 小组件，体验接近原版 Windows | 第 3 条 |
| 4 | 模块化组件 | 每个组件独立发布，出问题只换一个模块 | README「发展与更新模式」 |
| 5 | 开源透明 | 代码可审查，欢迎提交 PR | README 结尾 |
| 6 | 组件全家桶 | PowerShell 部署脚本 / 小组件设置程序 / AvatarMaker | README「包含内容」 |

#### 区块 3 · 组件展示（可左右切换）

这是全站唯一需要自定义交互的区块，规格要写死（避免做成「看起来能点但其实只有 Tab」）：

**数据结构**（`app/data/showcase.ts`）

```ts
export interface ShowcaseItem {
  id: string;
  title: string;        // 「Rainmeter 小组件设置程序」
  caption: string;      // 一句话，固定 2 行（line-clamp-2）——防止切换时高度跳动
  image: string;        // '/images/showcase/xxx.webp'
  width: number;        // 必填，给 <img> 定尺寸，杜绝 CLS
  height: number;
  alt: string;
  historical?: boolean; // 当前阶段全部为 true → 渲染「历史截图（EggyUI 时期）」徽章
}
```

**交互规格**

| 能力 | 规格 |
| --- | --- |
| 左右切换 | 两个 `UButton square variant="soft"`，`aria-label="上一张 / 下一张"`，循环取模，永不 disabled |
| 指示点 | `role="tablist"`；每个点 `button` + `aria-selected` + `aria-label="第 n 张：标题"`；当前点用 `w-6` 拉长 |
| 键盘 | 容器 `tabindex="0"`，只在容器内焦点时响应 `←` `→` `Home` `End`（不挂全局 keydown，避免劫持页面滚动） |
| 触摸 | `pointerdown/up` 位移 > 40px 翻页，`touch-action: pan-y`（竖向滚动交给页面） |
| 自动播放 | 6s 一次；`mouseenter`/`focusin` 暂停，离开恢复；`visibilitychange` 隐藏即停；`prefers-reduced-motion: reduce` 时**完全不开** |
| 防抖动 | 外层固定画框 `aspect-[16/10]`，幻灯片绝对定位居中，图片 `object-contain max-h-full`——容器高度只由画框决定 |
| 预加载 | `onMounted` 预取 next/prev 两张；首张 `fetchpriority="high"`，其余 `loading="lazy"` |
| 过渡 | `<Transition :name="'slide-' + dir" mode="out-in">`，仅 `opacity + translateX(±24px)`；减少动效时退化为淡入 |
| 播报 | `<p class="sr-only" aria-live="polite">第 n 张，共 m 张：标题</p>` |

`dir` 由动作决定（`next`/`prev`），保证点「上一张」时新图从左侧进入。

#### 区块 4 · 关于 OpenPidanUI

左侧短文案 + 右侧时间轴（`UPageSection` + 两列）。时间轴数据（`app/data/home.ts` 的 `ABOUT_TIMELINE`）：

| 时间 | 事件 |
| --- | --- |
| 2024-04 | EggyUI 启动 |
| 2026-10 | EggyUI `Finale Mini` 发布，随后归档 |
| 2026 | OpenEggyUI 全面重构，更名为 **OpenPidanUI** |
| 至今 | 随 PidanUI 一起更新，模块化发布 |

文案纪律（重要）：**只讲沿革，不复述分裂与争议**。初版参考资料里约 60% 篇幅是内部争议与点名，一律不引用。结尾放一段中性声明：本项目为《蛋仔派对》同人创作，与网易游戏、微软无隶属或赞助关系。

#### 区块 5 · 加入开发

`UPageSection` + 两列 `UPageCard variant="outline"`：

- **加入社区**：QQ 群 / B 站（沿用 `SOCIAL_LINKS` 中对应项）
- **加入开发组**：GitHub 仓库入口 + 文档「开发者文档」入口；正文列技术栈标签：`.NET 10` `C#` `WPF` `Rainmeter` `PowerShell`

> 素材 `D:\TestProject\keep1\2.jpg` 是「EggyUI 开发人员中心」旧界面，若要用在此区块，必须打「历史截图」标注，且不得沿用图中「招聘 X 人」的旧文案。

### 3.2 下载页

布局参考 `D:\TestProject\EasiAutoWeb\app\pages\download\index.vue`：**主下载面板 + 版本列表 + 说明区**，而不是一长串平铺卡片。

#### 数据来源

构建期抓取 `https://api.github.com/repos/PidanUI-Team/OpenPidanUI/releases?per_page=20`，
归一化成自定义 schema 后预渲染成 `/api/releases.json`（详见 5.3）。

#### 区块顺序

1. **页头**：`下载 OpenPidanUI 组件` + 副标题「当前仅提供 Rainmeter 小组件」+ 数据来源徽章（`source: github` 显示「实时」/`snapshot` 显示「快照」）。
2. **最新版面板**：版本号（`tag` → `version`）、发布时间、主按钮区（第一个匹配资产的下载按钮）、`UAlert` 显示「数据更新于 2026-11-07」。
3. **资产行**（每个 release 一组，`AssetRow`）：文件名 / 大小（`size` 格式化 `MB` 两位小数）/ 下载次数 / 下载按钮；只显示 `.rmskin` 与 `.zip`，其他资产折叠进「其他文件」。
4. **历史版本**：竖排卡片（`ReleaseCard`），`prerelease` 打 `UBadge color="warning"`，正文 `notes` 压成纯文本（最多 20 行 + 「查看完整更新说明 ↗」外链 `html_url`）。
5. **安装前须知**：三条 chip —— `Windows 10 及以上`、`需先装 Rainmeter`、`卸载＝切回默认主题`；下方一句「不修改任何系统文件」。
6. **文档引导**：`去读安装文档 →`。

#### 空态与降级

- `releases.length === 0` → 显示「仓库暂无 Release」占位 + 「去 Releases 页面 ↗」。
- `source === 'snapshot'` → 顶部黄色 `UAlert`：「本次数据来自构建时快照（GitHub 暂不可达），可能不是最新版本」。
- release body 里如果有 HTML，**一律压成纯文本**（不引入运行时 Markdown 渲染）。

### 3.3 文档页

#### 3.3.1 `/docs` 概览页

两张分组卡（`DocsGroupCards`），来自同一份 navigation 数据：

- **用户文档**：安装 Rainmeter、导入小组件、设置程序、FAQ
- **开发者文档**：仓库结构、构建与调试、提交规范、发版流程

每张卡：分组图标 + 标题 + 一句说明 + 该组条目数 + 「进入 →」。卡片下的条目列表直接链到各篇。

> 不要用 `definePageMeta({ redirect: '/docs/user' })`：`static` 预设没有服务端重定向，只会变成客户端跳转。

#### 3.3.2 文章页 `/docs/[...slug]`

三栏（`lg` 以上）：左侧 256px 目录（sticky）、中间正文、右侧「本页目录」（`UContentToc`）。
`lg` 以下：目录收成正文上方的折叠面板（见 3.3.3），本页目录不显示。

正文结构：

1. 面包屑（`用户文档 / 安装 Rainmeter`）
2. `UPageHeader`：标题 + 描述 + 右下角「在 GitHub 编辑此页」（`page.stem` 拼 `.../edit/main/content/docs/<stem>.md`）
3. `<ContentRenderer :value="page" />`
4. 上一页 / 下一页（`queryCollectionItemSurroundings`，按 `stem` 升序保证与侧边栏一致）
5. 页脚反馈：「这页有用吗？」（GitHub issue 链接，不做后端）

#### 3.3.3 移动端目录（禁 Drawer）

```text
[ 文档目录 ▾ ]              ← UButton block variant="soft"
┌──────────────────────────┐
│ 折叠面板（grid-rows 0fr↔1fr，关闭时 inert）│
└──────────────────────────┘
```

与 PidanUI 官网顶栏下方面板同一套模式（`grid-template-rows` 过渡 + `inert`），不用 `USlideover` / `UDrawer`。

#### 3.3.4 八篇文档的标题与大纲（首版内容清单）

**用户文档（`content/docs/1.user/`）**

| 篇 | 标题 | 一句话大纲 |
| --- | --- | --- |
| 1 | 安装 Rainmeter | Rainmeter 是什么、从官网下载、安装选项（标准安装 / 便携）、首次启动会看到什么 |
| 2 | 导入小组件 | `.rmskin` 双击安装流程、皮肤目录在哪、如何刷新、多显示器与缩放场景注意点 |
| 3 | 组件设置程序 | HomeSettings 能改什么（主题色、贴图、音频、开机启动）、保存后如何生效、配置文件位置 |
| 4 | 常见问题 | 杀软误报（.NET 单文件打包的典型现象）、高 DPI 模糊、卸载后残留、组件不刷新 |

**开发者文档（`content/docs/2.developer/`）**

| 篇 | 标题 | 一句话大纲 |
| --- | --- | --- |
| 1 | 仓库结构 | `Eggix-Rainmeter-Widgets/`、`RainmeterIntegration/`、`UseHelp/` 各自职责，模块边界 |
| 2 | 构建与调试 | 需要 .NET 10 SDK + VS 2026，`dotnet build` / 调试附加到 Rainmeter、常见编译错误 |
| 3 | 提交规范 | 分支命名、提交信息前缀、PR 前自查项、代码风格（C# 与 XAML） |
| 4 | 发版流程 | 打 tag → 生成资产（`.rmskin` / `.zip`）→ 写 Release Notes → 本站自动跟进（构建期抓取） |

写作要求：每篇 300–800 字，至少一张代码块或截图；标题层级只用 `##` / `###`（`toc.depth: 3`）。

### 3.4 404

`app/error.vue` + `NotFoundView`：保留顶栏与底栏，中间大号 `404`、一句「这一页可能已经跟着旧版本归档了」、两个按钮（回首页 / 去文档）。

---

## 4. 视觉与设计系统

### 4.1 色彩

沿用 PidanUI 官网的品牌色（用户明确「Logo 从 PidanUI 官网复制」，配色也顺势统一）：

| 令牌 | 值 | 用途 |
| --- | --- | --- |
| `--brand` | `#ffc53d` | 品牌主黄（大面积装饰、渐变起点） |
| `--brand-deep` | `#ff9f1a` | **可交互主色**（`--ui-primary` 指这里，因为浅黄做文字不可读） |
| `--brand-soft` | `#fff7e0` | 浅底强调块 |
| `--brand-grad` | `linear-gradient(...)` | 标题渐变 |
| `--ink` / `--ink-2` / `--ink-3` | `#1d2129` / `#4e5969` / `#86909c` | 文本三级 |
| `--bg` / `--card` / `--line` | `#fafbfc` / `#fff` / `#f0f1f3` | 浅色底 |
| 深色组 | `--bg:#17171a`、`--card:#1f1f23`、`--line:#2a2f36` | `[data-theme=dark]` 与 system 分支两份**逐字一致** |

`tokens.css` 必须用 `@theme static` 暴露 `--color-brand-50…950` / `--color-ink-50…950`（`--color-*: initial` 清空默认调色板后补齐 Nuxt UI 依赖的键）；灰阶**不能命名为 `neutral`**（Nuxt UI 保留名会回退）。

### 4.2 字体

| 用途 | 字体 | 来源 |
| --- | --- | --- |
| UI 正文 | HarmonyOS Sans SC（400 / 500 / 700） | `harmonyos-sans-sc-webfont-splitted`（npm，构建后脚本灌注） |
| 代码 | Cascadia Code | `@fontsource/cascadia-code`（Vite 处理） |

字体栈（`base.css`）：`--font-ui: 'HarmonyOS Sans SC', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif`；`--font-code: 'Cascadia Code', Consolas, monospace`。

**仓库不存字体文件**，产物自包含（细节见 5.6）。

### 4.3 版式与间距

- 版心 `--container-page: 1400px`（→ `max-w-page`）；正文文档页正文列限宽 `72ch`。
- 纵向节奏抽成常量 `SECTION_UI`（`UPageSection` 的 padding / body / footer），首页五个区块共用，不各写一套。
- 断点只用 Tailwind 默认阶梯：`sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536`；移动端临界 = `lg`（与 PidanUI 一致，避免两套阈值）。

### 4.4 图标

只用两个集合：`@iconify-json/lucide`（界面图标）+ `@iconify-json/simple-icons`（品牌/社交）。
`app.config.ts` 设 `icon.mode: 'svg'`；**所有动态绑定的图标**（导航项、社交链接、轮播箭头、文档分组）必须登记进 `nuxt.config.ts` 的 `icon.clientBundle.icons`，否则静态站会在运行时去 Iconify API 取图，离线即空白。

### 4.5 深浅色

用 Nuxt UI 自带 `colorMode`（`preference: 'system'`、`storageKey: 'openpidanui-theme'`、`disableTransition: false`），顶栏右侧放 `UColorModeButton`。
PidanUI 官网之所以关掉它另写 `useTheme`，是因为它要维护 `[data-theme]` 三态；新站没有这个包袱，用框架的即可。

### 4.6 动效

只做两类：

1. **页面切换**：`page-*` 过渡（`out-in`，180ms 淡入）。
2. **滚动入场**：`data-reveal` 上浮 28px / 700ms / 交错 55ms，用 `useScrollReveal`（IntersectionObserver）打标。

全部有 `@media (prefers-reduced-motion: reduce)` 分支：位移归零，只留透明度。

### 4.7 无障碍底线

- 轮播：可暂停、可键盘操作、有 `aria-live` 播报（WCAG 2.2.2 要求自动播放内容可暂停）。
- 焦点可见：所有交互元素保留 `focus-visible:ring`（不要 `outline-none` 了事）。
- 对比度：`--brand-deep` 上的白字 ≥ 4.5:1；浅黄底上的文字用 `--ink`。
- 图片：全部有 `alt`；纯装饰图 `alt=""`。

---

## 5. 技术方案

技术栈（用户已定，此处只钉版本）：Nuxt 4 + Vue 3 + TypeScript + Tailwind CSS v4 + `@nuxt/content` v3 + **Nuxt UI v4**（样式层全量）+ Iconify，SSG 部署到 Cloudflare Workers。

版本锚点（2026-11-07 实测）：`nuxt 4.6.4`、`@nuxt/ui 4.12.0`、`@nuxt/content 3.16.2`、`vue 3.5.45`、`tailwindcss 4.3.5`、`@tailwindcss/vite 4.3.5`、`wrangler 4.158.0`。
TypeScript 用别名 `typescript@npm:@typescript/typescript6@^6.0.2`（TS 7 原生编译器尚未被 `typescript-eslint` / `vue-tsc` 跟上）。

### 5.1 部署形态：assets-only Worker

**结论**：`nuxt generate` → `.output/public` → `wrangler deploy`（`wrangler.jsonc` **没有 `main` 字段**）。

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "openpidanui-website",
  "compatibility_date": "2026-11-01",
  "observability": { "enabled": true },
  "assets": {
    "directory": ".output/public",
    "not_found_handling": "404-page",
    "html_handling": "auto-trailing-slash"
  }
}
```

理由：

- 纯 SSG 不需要 Worker 运行时；assets-only 的静态请求不计费、无冷启动。
- **不要**用 `cloudflare-module` / `cloudflare-pages` 预设：它们会产出 Worker 包与 `.wrangler/deploy/config.json`，让 `wrangler deploy` 找不到入口（`D:\TestProject\EasiAutoWeb\scripts\copy-fonts.mjs` 末尾专门删 `.output/server` 与 `.wrangler` 就是在补这个坑）。
- 因此在 `nuxt.config.ts` 里显式 `nitro: { preset: 'static' }`，杜绝 Cloudflare CI 上的环境变量把预设切走。

配套的预渲染设置（与 PidanUI 官网一致，`nuxt.config.ts:191-193`）：

```ts
nitro: { preset: 'static' },
prerender: {
  crawlLinks: false,        // 路由由 build/routes.ts 全量枚举，不依赖爬虫
  failOnError: true,        // 缺页必须让 CI 失败
  autoSubfolderIndex: false // /download → download.html（无尾斜杠）
},
experimental: { payloadExtraction: 'client' },
```

`autoSubfolderIndex: false` 与 Cloudflare 的 `html_handling: auto-trailing-slash` 是**成对**的：前者产出 `download.html`，后者让 `/download` 直接命中它而不 301。改成 `true` 会让站内所有无尾斜杠链接吃一次 301。

404：`not_found_handling: '404-page'` + 枚举里保留 `/404.html`。**绝不能用 `single-page-application`**（那会把所有 404 返回成 200 的首页）。

### 5.2 静态资源的缓存头

`public/_headers`（Cloudflare 支持）：

```
/_nuxt/*
  Cache-Control: public, max-age=31536000, immutable

/fonts/*
  Cache-Control: public, max-age=31536000, immutable

/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

### 5.3 下载数据：构建期抓取 + 预渲染 JSON

| 方案 | 限流风险 | 首屏 | 新鲜度 | 结论 |
| --- | --- | --- | --- | --- |
| A 构建期抓 → 预渲染 `/api/releases.json` | 每次构建 1 次 | 0 请求（payload 内联） | 需重建 | ✅ **采用** |
| B 客户端直连 GitHub API | 60/h **按访客 IP**（NAT 后共享） | 有 loading 闪烁 | 实时 | ✗ 校园网/公司网必挂 |
| C Worker 代理 + Cache API | 5000/h（要 secret） | 1 请求 | 近实时 | ✗ 为一个几乎不变的列表引入运行时与密钥 |

实现要点：

- `server/routes/api/releases.json.ts`：单次请求，带
  `Accept: application/vnd.github+json`、`X-GitHub-Api-Version: 2022-11-28`、
  **`User-Agent`（Node 下不给必 403）**、可选 `Authorization: Bearer $GITHUB_TOKEN`，
  以及 `signal: AbortSignal.timeout(5000)`（墙内/断网不要卡住构建）。
- **catch 里永不抛错**：失败就返回 `shared/data/releases.snapshot.json`（入库的一份真实数据），并标 `source: 'snapshot'`；否则 `failOnError: true` 会把一次网络抖动放大成构建失败。
- 归一化到自定义 schema（`shared/releases.ts`），组件只认它，不泄漏 GitHub 的字段形状：
  `tag / version / name / publishedAt / publishedAtLabel（构建期格式化）/ prerelease / notes（纯文本，截断 20 行）/ htmlUrl / assets[{name,size,downloadCount,url}]`。
- 页面用 `useFetch<ReleasesPayload>('/api/releases.json')`，`nuxt generate` 时内联进 payload，客户端首屏零请求。
- 新鲜度补偿（可选，M6 之后）：`.github/workflows/rebuild.yml` 加每日 cron + `workflow_dispatch`；「发版即刷新」需要在 OpenPidanUI 仓库侧配 `repository_dispatch`，首版不做。

### 5.4 文档站：目录即分组

内容集合（`content.config.ts`）：

```ts
docs: defineCollection({
  type: 'page',
  source: { include: 'docs/**/*.md' },
  schema: z.object({
    badge: z.string().optional(),
    draft: z.boolean().default(false),
  }),
})
```

目录结构（数字前缀 = 路径剥离 + 排序，Content v3 官方约定）：

```
content/docs/
├─ 1.user/
│  ├─ .navigation.yml        # title: 用户文档 / navigation.icon: i-lucide-book-open
│  ├─ 1.index.md             # → /docs/user
│  ├─ 2.install-rainmeter.md
│  ├─ 3.import-widget.md
│  └─ 4.faq.md
└─ 2.developer/
   ├─ .navigation.yml        # title: 开发者文档 / navigation.icon: i-lucide-code-xml
   ├─ 1.index.md             # → /docs/developer
   ├─ 2.repo-structure.md
   ├─ 3.build-and-debug.md
   └─ 4.release-flow.md
```

- 侧边栏：`queryCollectionNavigation('docs', ['description'])` → `UContentNavigation`（`highlight`、`default-open`）。二级分组由目录自动得出，**不发明 `nav` 字段**（那是 EasiAuto 的做法，平铺分组，扩不了三级）。
- 文章页：`queryCollection('docs').path(withoutTrailingSlash(route.path)).first()`，取不到 `throw createError(404)`。
- 上下篇：`queryCollectionItemSurroundings(...).order('stem','ASC')` —— 用 `stem` 而不是 `path`，因为数字前缀要在两处保持同一顺序。
- 本页目录：`page.body.toc.links` → `UContentToc`（需 `content.build.markdown.toc: { depth: 3, searchDepth: 3 }`）。

**路由枚举**：`build/routes.ts` 取代 PidanUI 的 `build/post-index.ts`，导出 `buildRoutes()`；在 `nuxt.config.ts` 的 `hooks['prerender:routes']` 里灌进去。

```ts
export function buildRoutes(): string[] {
  const routes = ['/', '/download', '/docs', '/api/releases.json', '/404.html'];
  walkDocs(DOCS_DIR, '/docs', routes);   // 递归 content/docs，剥数字前缀、跳过 .navigation.yml 与 draft
  return routes;
}
```

**必须配一个产物级断言**：`failOnError: true` 只能抓「枚举了但渲染报错」，抓不到「该枚举却漏了」。`scripts/verify-output.mjs` 在 generate 之后逐条检查 `buildRoutes()` 的每个路由在 `.output/public` 里都有对应文件，缺一个就 `exit 1`。

### 5.5 Markdown 排版：Nuxt UI Prose

**结论**：用 Nuxt UI v4 的 Prose 组件，**不抄** PidanUI 官网那 641 行手写 `prose.css`，**也不装** `@tailwindcss/typography`。

- 「样式层全量用 Nuxt UI」的直接推论：Prose 由 `--ui-*` 语义变量驱动，与全站组件同源；
- 装 typography 会让 `.prose`（`--tw-prose-*`）与 Nuxt UI 的 prose 主题同时作用于同一批元素，谁赢取决于 CSS 顺序，每次升级都可能翻车；
- 定制面收敛到一个文件（`app.config.ts` 的 `ui.prose.*`），可 review。

需要覆盖的几项：`a`（`text-primary underline underline-offset-4`）、`code`（`bg-elevated rounded-md px-1.5`，并 `before/after:content-none` 去掉反引号）、`pre`（`rounded-lg border p-4 text-sm overflow-x-auto`）、`table/th/td`（边框与 `text-toned`）、`h2`（`scroll-m-20 text-2xl font-bold`）。

另需在 `main.css` 补 Nuxt UI 官方的 shiki 深色规则，并让 `h1~h4` 的 `scroll-margin-top` 对齐 `--ui-header-height`（否则锚点跳转会被顶栏盖住）。

### 5.6 字体自包含（仓库不存字体文件）

| 通道 | 做法 | 理由 |
| --- | --- | --- |
| HarmonyOS Sans SC | devDependency 装 `harmonyos-sans-sc-webfont-splitted`；`nuxt generate` **之后**由 `scripts/sync-fonts.mjs` 把 400/500/700 三档 CSS 与分片 `woff2` 平铺复制到 `.output/public/fonts/`，并生成 `fonts/harmonyos.css` | 分片数百个，交给 Vite 会拖慢构建且产物目录不可控；放 `public/` 又要求字体入库 |
| Cascadia Code | `main.css` 顶部 `@import '@fontsource/cascadia-code/latin-400.css'`（需要时加 700） | 只有几个小文件，Vite 会自动 hash 并复制 |

`nuxt.config.ts` 里 `ui: { fonts: false }` 关掉 `@nuxt/fonts`（否则它会接管字体加载并尝试外部请求）。
`sync-fonts.mjs` 末尾额外**删除 `.output/server` 与 `.wrangler`**（如果存在），防止 `wrangler deploy` 顺着 Nitro 的重定向文件跑偏。

### 5.7 工程配置要点

- `main.css` 只用官方双行入口：

  ```css
  @import "tailwindcss";
  @import "@nuxt/ui";
  @import "./tokens.css";
  @import "./base.css";
  @import "./animation.css";
  ```

  **项目自有 CSS 全部写进 `@layer base` / `@layer components`，不写未分层规则。**
  PidanUI 官网靠「未分层规则压过工具类」维持旧样式，代价是每加一个工具类都要回头删语义类声明；新站没有历史包袱，不复制这个约束。

- `content: { experimental: { sqliteConnector: 'native' } }` —— 用 Node 24 内置 `node:sqlite`，免掉 `better-sqlite3` 的原生编译（相对 PidanUI 的一处改进）。
- `pnpm-workspace.yaml`：`nodeLinker: hoisted`（Tailwind oxide 在 isolated 布局下会只链一半）。
- `.node-version` 固定 `24`，CI 用同版本。

### 5.8 目录结构（复制 / 改写 / 新增）

| 路径 | 动作 | 来源/说明 |
| --- | --- | --- |
| `LICENSE` | 保留 | 已有 AGPL-3.0 |
| `README.md` | 新增 | 技术栈、三命令、目录约定、许可证口径 |
| `.gitignore` `.gitattributes` `.prettierrc.json` `.prettierignore` `.node-version` `pnpm-workspace.yaml` `tsconfig.json` `eslint.config.mjs` | 复制 | 来自 `PidanUI-Website-Nuxt`，`allowBuilds` 去掉 `better-sqlite3` |
| `nuxt.config.ts` `content.config.ts` | 改写 | 见 5.1 / 5.3 / 5.4 / 5.7 |
| `wrangler.jsonc` | 新增 | 见 5.1 |
| `build/routes.ts` | 改写 | 由 `build/post-index.ts` 演化成文档路由枚举 |
| `build/rehype-external-links.ts` | 复制 | 站外链接补 `target=_blank rel=noopener` |
| `scripts/sync-fonts.mjs` | 新增 | 基于 `EasiAutoWeb/scripts/copy-fonts.mjs` + 清理 `.output/server`/`.wrangler` |
| `scripts/verify-output.mjs` | 新增 | 产物级路由断言 |
| `server/routes/api/releases.json.ts` | 新增 | 见 5.3 |
| `shared/site.ts` `shared/releases.ts` `shared/data/releases.snapshot.json` `shared/utils/{date,title}.ts` | 改写/新增 | `site.ts` 改品牌与仓库地址；其余新建 |
| `content/docs/**` | 新增 | 8 篇，见 3.3.4 |
| `public/_headers` `public/robots.txt` | 新增 | |
| `public/images/**` | 复制 | Logo / favicon / 默认封面来自 `PidanUI-Website-Nuxt/public/images/` |
| `app/app.vue` `app/app.config.ts` `app/error.vue` | 改写 | `app.vue` 里 `provide('navigation')` |
| `app/assets/styles/{main,tokens,base,animation}.css` | 改写 | 删掉 `prose.css` |
| `app/layouts/default.vue` | 改写 | 顶栏 + `UContainer` 主区 + 底栏 + `BackToTop` |
| `app/layouts/docs.vue` | 新增 | `UPage(#left UPageAside)` + `<slot/>` |
| `app/pages/{index,download}.vue` `app/pages/docs/{index,[...slug]}.vue` | 改写/新增 | 页面文件只做「SEO + 渲染 View」 |
| `app/components/{SiteHeader,SiteFooter,BackToTop,PageProgress,SafeImage,PageTitle}.vue` | 改写/复制 | 底栏去掉 FeedPulse，右栏换友链 |
| `app/components/home/{HomeView,FeatureGrid,ShowcaseCarousel,JoinDevSection}.vue` | 改写/新增 | Hero 等 section 从单文件拆开 |
| `app/components/docs/{DocsMobileNav,DocsGroupCards}.vue` | 新增 | |
| `app/components/download/{ReleaseCard,AssetRow}.vue` | 新增 | 参考 `EasiAutoWeb` 的 `VersionCard` 思路重写 |
| `app/composables/{useNav,useReleases,useScrollReveal}.ts` | 改写/新增 | `useNav` 加 `docs` 分区；`useReleases` 加筛选与分组 |
| `app/data/{nav,socialLinks,friendLinks,home,showcase}.ts` | 改写/新增 | |
| `app/utils/base.ts` | 复制 | `withBase()` |

`package.json` 脚本：

```jsonc
{
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt generate && node scripts/sync-fonts.mjs && node scripts/verify-output.mjs",
    "preview": "wrangler dev",
    "deploy": "pnpm build && wrangler deploy",
    "lint": "eslint .",
    "format:check": "prettier --check ."
  }
}
```

---

## 6. 内容与素材清单

### 6.1 文案（可直接抄的）

- Hero 主标题：`OpenPidanUI`（`PidanUI` 用渐变强调）
- Hero 副标题：用代码，为 PidanUI 构建更安全、更稳定的美化体验。
- Hero 眉标：`PidanUI 配套组件 · 开源`
- 特性区标题：`为什么是 OpenPidanUI`
- 展示区标题：`看看它长什么样`
- 关于区标题：`关于 OpenPidanUI`
- 加入区标题：`一起把它做完`
- 底栏版权：`© {{ 年 }} OpenPidanUI · 本项目为《蛋仔派对》同人创作，非官方出品，与网易游戏、微软无隶属关系。`

### 6.2 图片素材

| 用途 | 文件 | 处理 |
| --- | --- | --- |
| Hero 右图 | 外链 `https://img.remit.ee/i/hsjlCZAGQuf2` | 走 `SafeImage`；列为「后续自托管」TODO |
| Logo / favicon | `PidanUI-Website-Nuxt/public/images/{logo.webp,favicon.ico}` | 直接复制 |
| 展示区 5 图 | `D:\TestProject\keep1\` 的 `3BB46CD387D27FA3D9A650380DEBC1B5.png`（桌面效果图）、`Eggy UI For Windows Server 2025 Test-*.png`（任务栏特写）、`2.jpg`（开发人员中心）、`vlcsnap-*.png` ×2 | 转 webp（长边 ≤1920、单张 ≤300KB），全部 `historical: true` |
| 文档配图 | 后续真实截图 | 首版可先用占位块 + `alt` 说明 |

> 素材纪律：`keep1` 里的图**全部是 EggyUI 时期**的，使用时必须在图上打「历史截图（EggyUI 时期）」徽章，并在 `alt` 里写明。不得用它们暗示当前版本的界面。

### 6.3 社交与友链

- 社交（`app/data/socialLinks.ts`）：GitHub、GitCode、B 站、QQ 群、（若确认）Discord/Matrix、站点源码仓库。
- 友链（`app/data/friendLinks.ts`，**待确认清单**）：PidanUI 官网、EasiAuto 官网、GitCode 组织页等，先用占位条目。

---

## 7. 工程规范（硬约束）

改编自 `D:\TestProject\PidanUI-Website-Nuxt\.github\copilot-instructions.md`，新站直接沿用：

1. **站内链接必须 `<NuxtLink :to>` + `withBase()`**，禁止裸 `<a href>` 指站内路由（会整页刷新，过渡与进度条全废）。
2. **构建必须零错误零警告**；`failOnError: true`，预渲染 404 直接失败。
3. **新增页面必须登记 `build/routes.ts`**，否则产物里根本没有这一页。
4. **新增动态图标必须登记 `icon.clientBundle.icons`**。
5. **`public/` 只放图片 / `_headers` / `robots.txt`**，不写自写 JS/CSS 再用 `app.head` 注入。
6. **不允许自定义滚动容器**：body 自然滚动，`overflow-x: clip`（不能 `hidden`，否则 sticky 失效）；让开顶栏统一用 `--shell-header-h`。
7. **移动端导航用顶栏下方面板**，禁止 `USlideover` / `UDrawer`。
8. **断点只用默认阶梯**，移动端临界 = `lg`。
9. **每个 view 组件单一根节点**（首屏入场选择器依赖结构）。
10. **样式规范**：`main.css` 的 `@import` 顺序不可改；`tokens.css` 用 `@theme static`；灰阶不命名 `neutral`；语句必须带分号（Prettier + ESLint 双保险）。
11. **数据访问**：组件里禁止直接 `queryCollection`；文档数据经 composable 或页面 `useAsyncData` 一次取出。
12. **验收 = `pnpm build` 通过 + 五档宽度实看（1440 / 1024 / 1023 / 768 / 375）+ `format:check` + `lint`**，无单元测试。

---

## 8. 里程碑（可回滚单提交）

分支：从 `main`（当前 `b7a201d`）切 `feat/site-v1`，每个里程碑一个提交，**每一步都必须 `pnpm build` 通过**。

> 推送 `orgfork` 前先 `git -c http.schannelCheckRevoke=false ls-remote --heads orgfork`：
> 本机 Git 的 schannel 吊销检查读不到 CRL，直连会报 `CRYPT_E_NO_REVOCATION_CHECK`；
> 用 `-c http.schannelCheckRevoke=false`（或 `-c http.sslBackend=openssl`）单次绕过，不改全局配置。
> 若 `main` 已分叉，先 `rebase`，不要强推。

| # | 提交 | 内容 | 验收 |
| --- | --- | --- | --- |
| M0 | `chore: 初始化 Nuxt 4 + Tailwind 4 + Nuxt UI 4 工程骨架` | package / pnpm-workspace / tsconfig / eslint / prettier / gitignore / `.node-version`；最小 `nuxt.config.ts`；`app/app.vue`；空壳 `layouts/default.vue`；`pages/index.vue` | `pnpm install` 无警告；`pnpm build` 成功；`.output/public/index.html` 存在；lint 与 format 通过 |
| M1 | `feat(shell): 品牌令牌、三段式外壳与 404` | `tokens/base/main/animation.css`、`app.config.ts`、`SiteHeader/SiteFooter/BackToTop/PageProgress`、`data/{nav,socialLinks,friendLinks}`、`error.vue` + `NotFoundView` | 1280/1024/768/375 四档无横向滚动；<1024 导航为顶栏下方面板；深浅色无闪白；底栏三列 + 版权、无统计组件；`/404.html` 预渲染成功 |
| M2 | `feat(home): 首页五区块与组件轮播` | `HomeView`、`FeatureGrid`、`ShowcaseCarousel`、`JoinDevSection`、`data/{home,showcase}`、`public/images/showcase/*` | 键盘 ←→/Home/End 生效且不劫持页面滚动；指示点与 `aria-live` 正确；切图无高度跳动；`prefers-reduced-motion` 下无自动播放；历史截图带徽章 |
| M3 | `feat(docs): 文档站与 docs 内容集合` | `content.config.ts`、`content/docs/**`（两组各 4 篇）、`layouts/docs.vue`、`pages/docs/{index,[...slug]}.vue`、`DocsMobileNav`、`build/routes.ts` 接管 `prerender:routes`、prose 主题 | `/docs` 与全部 8 篇路由都出现在 `.output/public`；侧边栏两组标题与组内顺序正确；TOC 可跳转且不被顶栏遮挡；上下篇顺序与侧边栏一致；窄屏折叠面板可开合且关闭时 `inert` |
| M4 | `feat(download): GitHub Releases 构建期取数与下载页` | `server/routes/api/releases.json.ts`、`shared/releases.ts`、`shared/data/releases.snapshot.json`、`pages/download.vue`、`ReleaseCard/AssetRow` | 联网构建 payload `source: 'github'`；断网构建自动落 `snapshot` 且 build 仍成功；页面无运行时外网请求；日期标签构建期生成、无 hydration mismatch |
| M5 | `feat(assets): 自包含字体与缓存策略` | `scripts/sync-fonts.mjs`、Cascadia 导入、`public/_headers`、logo/favicon | `.output/public/fonts/` 有三档字重 + `harmonyos.css`；产物内无 `cdn.jsdelivr.net` 等外部字体请求；`wrangler dev` 下 `_nuxt/*` 与 `fonts/*` 命中 immutable |
| M6 | `ci: Cloudflare Workers 部署与产物校验` | `wrangler.jsonc`、`scripts/verify-output.mjs`、`.github/workflows/{lint,deploy}.yml`、`README.md` | `verify-output` 对漏页 `exit 1`；`wrangler deploy --dry-run` 通过；`wrangler dev` 下 `/`、`/docs/user/install-rainmeter`、`/nope` 分别 200 / 200 / 404（返回 404.html）；CI 绿 |

---

## 9. 风险与对策

| # | 风险 | 后果 | 对策 |
| --- | --- | --- | --- |
| 1 | **CF 路由形态错配**（尾斜杠 / 404） | 全站 301、`_payload.json` 取不到、404 返回 200 | `autoSubfolderIndex:false` 与 `html_handling:auto-trailing-slash` 成对；`404-page` + `/404.html` 入枚举；`wrangler dev` 里逐条验带/不带斜杠 |
| 2 | **Releases API 构建时不可达 / 限流** | CI 红或页面空白 | 5s 超时 + 单次请求 + 可选 token + 仓库内 snapshot 兜底 + 页面标注数据时间；catch 内不抛错 |
| 3 | **文档漏枚举** | 线上 404，而 `failOnError` 抓不到 | 数字前缀剥离收敛成一个纯函数；`verify-output.mjs` 逐条断言产物存在 |
| 4 | **preflight / 层叠冲突**（Nuxt UI + Tailwind 4） | 组件样式被工具类压掉，升级即变形 | 只用官方双行入口；自有 CSS 全进 `@layer`；不引入 `@tailwindcss/typography` |
| 5 | **字体再分发与体积** | 授权问题；CJK 分片逼近 Workers 部署文件数上限 | 文档与 README 注明字体来源与许可；只取 3 档字重；构建后打印分片数与体积并设阈值告警；`font-family` 保留 `system-ui` 兜底 |
| 6 | **素材全是旧品牌** | 观感误导，甚至像在蹭旧项目 | 数据结构内置 `historical`，当前素材全部标 `true` 并打徽章；文档与 README 注明待替换 |
| 7 | **许可证口径冲突** | 社区信任问题（仓库 AGPL-3.0 vs README 徽章 GPL-3.0 vs 正文「非商业」） | **以 `LICENSE` 为准，全站统一 AGPL-3.0**；不复用 GPL 徽章；文档页加「许可证」条目解释含义；引用 PidanUI 站点代码时保留来源说明 |
| 8 | **Nitro 预设被环境变量劫持** | `wrangler deploy` 找不到入口 | `nitro.preset:'static'` 锁死；`sync-fonts.mjs` 清理 `.output/server`/`.wrangler`；部署前断言这两者不存在 |
| 9 | **TS 7 与 lint/类型工具链不兼容** | ESLint 解析报错、`vue-tsc` 崩 | 用 `typescript@npm:@typescript/typescript6`；`nuxi typecheck` 不进 CI 必过项 |
| 10 | **Windows 本地工具链差异** | 装不上 / 与 CI 不一致 | `nodeLinker: hoisted`；`sqliteConnector:'native'` 免原生编译；`.node-version` 固定 24 |

---

## 10. 待定项（需方确认，不阻塞开工）

| # | 事项 | 现状 | 影响 |
| --- | --- | --- | --- |
| 1 | **站点域名** | 目前只能先拿 `*.workers.dev` | canonical / OG / sitemap 需要真实域名；确认后补 `wrangler.jsonc` 的 `routes` 与 `shared/site.ts` 的 `mainUrl` |
| 2 | **友链清单** | 占位数据 | 底栏右栏内容 |
| 3 | **真实截图** | 只有 EggyUI 时期素材 | 展示区与文档配图 |
| 4 | **组织署名** | README 落款 `PidanEggyTeam`，Releases 在 `PidanUI-Team/OpenPidanUI` | 底栏与「关于」的团队名、GitHub 链接指向 |
| 5 | **许可证最终口径** | 三处说法不一 | 本文按 AGPL-3.0 写；若定为 GPL-3.0 需全局替换 |
| 6 | **是否需要 sitemap.xml / RSS** | 首版省略 | 影响 SEO 与「新闻」外链的取舍 |

---

## 附录：相对初版 `newwebsite.md` 的差异

| 项 | 初版 | 本版 | 原因 |
| --- | --- | --- | --- |
| 新闻页 | 「导航栏外链，本官网不实现」 | 保留外链，并明确外链项永不高亮、带 `↗` | 补交互细节 |
| 文档 | 「左侧条目 + 右侧内容，技术文档风格」 | 定为 `@nuxt/content` docs 集合 + 两级分组 + 8 篇清单 + 三栏版式 | 初版没有内容模型 |
| 下载 | 「只提供 Rainmeter 小组件下载」 | 数据源定为 **GitHub Releases API（构建期抓取 + 快照兜底）** | 用户确认；并明确限流与断网处理 |
| 底栏 | 「左同 PidanUI，中社交，右友链，底部版权」 | 保留结构，删除 FeedPulse 统计，友链单列数据源 | 用户明确不插统计组件 |
| 组件展示 | 「EasiAuto 样式，但支持 `<` `>` 切换」 | 补全键盘/触摸/自动播放/a11y/防 CLS 规格 | EasiAuto 无左右键，属新增能力 |
| 技术栈 | 「Nuxt 4 + Tailwind 4 + Nuxt UI v4 + Content v3，Cloudflare Workers」 | 补版本锚点、`nitro.preset:'static'`、assets-only 部署形态、字体灌注方案 | 选型需要落到可执行的配置 |
| 文档落点 | 「项目文件夹 `OpenPidanUI_Website`」 | 实际仓库为 `D:\TestProject\OpenPidanUI-Website`（下划线→连字符） | 以真实目录为准 |
| 许可证 | 未提 | 全文统一 AGPL-3.0（与仓库 `LICENSE` 一致） | 消除三处口径冲突 |
