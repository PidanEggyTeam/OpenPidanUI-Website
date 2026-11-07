# OpenPidanUI 官网

[OpenPidanUI](https://github.com/PidanUI-Team/OpenPidanUI) 的官方网站：首页、下载、文档。

- 框架：Nuxt 4 + Vue 3 + TypeScript（SSG，`nuxi generate`）
- 样式：Tailwind CSS v4 + **Nuxt UI v4**（样式层全量使用，不引入 `@tailwindcss/typography`）
- 内容：`@nuxt/content` v3（文档站，Markdown 排版走 Nuxt UI 的 Prose 组件）
- 部署：Cloudflare Workers **Static Assets**（assets-only，没有 Worker 脚本）
- 字体：HarmonyOS Sans SC + Cascadia Code，**仓库不存字体文件**，构建后由脚本灌注

## 命令

```bash
pnpm install
pnpm dev        # 本地开发
pnpm build      # nuxi generate + 注入字体 + 产物校验
pnpm preview    # wrangler dev，按 Cloudflare 的规则跑静态产物
pnpm deploy     # 构建 + wrangler deploy
```

`pnpm build` 里那两步不要省：

- `scripts/sync-fonts.mjs`：把 HarmonyOS Sans SC 的分包字体复制进 `.output/public/fonts/`；
- `scripts/verify-output.mjs`：逐条校验 `build/routes.ts` 的路由都有产物（`failOnError` 抓不到漏页）。

## 目录约定

```
app/
  pages/            路由；页面文件只做「SEO + 渲染视图」
  components/       按文件名注册（pathPrefix: false），home/ docs/ download/ 分组
  layouts/          default
  composables/      useDocsGroups / useReleases / useNav / useScrollReveal
  data/             nav、社交、友链、首页文案、轮播数据、文档分类
  assets/styles/    main.css 的五条 @import 顺序固定
content/docs/       文档正文，数字前缀决定路径与排序
build/routes.ts     预渲染路由唯一入口
server/routes/      构建期接口（/api/releases.json）
shared/             站点常量、Release 数据模型、离线快照
scripts/            字体灌注、产物校验
```

## 几条硬约束

1. **站内链接一律 `<NuxtLink :to>` + `withBase()`**，不要裸 `<a href>`。
2. **新增页面必须登记 `build/routes.ts`**，否则产物里根本没有这一页。
3. **动态绑定的图标必须登记 `nuxt.config.ts` 的 `icon.clientBundle.icons`**，否则静态站运行时会去 Iconify API 取图。
4. **自有 CSS 全部写进 `@layer base/components`**，不写未分层规则（否则会压掉工具类）。
5. **移动端导航用顶栏下方面板**，不用 Drawer；断点只用 Tailwind 默认阶梯。
6. 构建必须零错误；`prerender.failOnError: true`。

## 文档的分类与排序

每篇 `.md` 的 frontmatter 带两个必填字段：

```yaml
---
title: 安装 Rainmeter
description: 一句话摘要，会出现在卡片和 SEO 里
category: user      # user | developer，对应 app/data/docsCategories.ts
order: 1            # 分类内的显示序号，侧边栏 / 分类页 / 上下篇都按它
---
```

新增分类要改两处：`app/data/docsCategories.ts` 加一条，`content/docs/` 下建对应目录；
`build/routes.ts` 会自动按 frontmatter 里出现过的 `category` 枚举 `/docs/category/<slug>`。

## 下载数据

版本信息在**构建期**从 GitHub Releases（`PidanUI-Team/OpenPidanUI`）拉取，归一化后预渲染成 `/api/releases.json`，
访问端零请求。拉取失败时回退到 `shared/data/releases.snapshot.json`，页面会显示「快照」提示。
发版后需要重新构建一次本站。

## 许可证

本站代码以 **AGPL-3.0** 授权（见 [LICENSE](LICENSE)）。项目简介、截图等品牌素材版权归 PidanEggyTeam / PidanUI 项目组所有。
本项目为《蛋仔派对》同人创作，非官方出品，与网易游戏、微软无隶属或赞助关系。

规划文档见 [docs/WEBSITE-PLAN.md](docs/WEBSITE-PLAN.md)。
