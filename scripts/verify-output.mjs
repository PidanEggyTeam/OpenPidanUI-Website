/**
 * 产物级路由断言。
 *
 * `prerender.failOnError: true` 只能抓「枚举了但渲染报错」，抓不到「该枚举却漏了」——
 * 漏页在线上就是 404，而构建会显示成功。所以在 nuxi generate 之后逐条对账。
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildRoutes, buildSitemapRoutes } from '../build/routes.ts';
import { SITE } from '../shared/site.ts';

const PUBLIC_DIR = fileURLToPath(new URL('../.output/public', import.meta.url));

/** autoSubfolderIndex: false → /about 落成 about.html；中文分类名在 URL 里是百分号编码，落盘是原文 */
function toFile(route) {
  const decoded = decodeURIComponent(route);
  if (decoded === '/') return 'index.html';
  if (/\.(html|json|xml|txt|ico|svg)$/.test(decoded)) return decoded.slice(1);
  if (decoded.endsWith('/')) return `${decoded.slice(1)}index.html`;
  return `${decoded.slice(1)}.html`;
}

if (!existsSync(PUBLIC_DIR)) {
  console.error('[verify] 找不到 .output/public，先跑 nuxi generate');
  process.exit(1);
}

const failures = [];
const routes = buildRoutes();
const missing = routes.filter((route) => !existsSync(join(PUBLIC_DIR, toFile(route))));

if (missing.length) {
  console.error(`[verify] ${missing.length} 条路由没有产物：`);
  for (const route of missing) console.error(`  - ${route}  (期望 ${toFile(route)})`);
  process.exit(1);
}

const sitemapFile = join(PUBLIC_DIR, 'sitemap.xml');
if (!existsSync(sitemapFile)) {
  failures.push('缺少 sitemap.xml：构建期网站地图没有生成');
} else {
  const sitemap = readFileSync(sitemapFile, 'utf8');
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, url]) => url);
  const expectedUrls = buildSitemapRoutes().map((route) => new URL(route, `${SITE.mainUrl}/`).href);
  if (!sitemap.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')) {
    failures.push('sitemap.xml 缺少 sitemap.org 标准 urlset 根节点');
  }
  if (
    urls.length !== expectedUrls.length ||
    urls.some((url, index) => url !== expectedUrls[index])
  ) {
    failures.push('sitemap.xml 中的页面地址与可收录路由不一致');
  }
}

// 顺手断言不该存在的东西：cloudflare-module 预设会带来 Worker 入口
for (const stale of ['server', '_worker.js']) {
  if (existsSync(join(PUBLIC_DIR, stale))) {
    console.error(
      `[verify] 产物里出现了 ${stale}：说明 Nitro 没用 static 预设，wrangler deploy 会失败`,
    );
    process.exit(1);
  }
}

console.log(
  `[verify] ${routes.length} 条路由全部有产物 ✓ sitemap ${buildSitemapRoutes().length} 页 ✓ 字体自包含 / 静态预设`,
);
