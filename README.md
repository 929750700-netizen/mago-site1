# MAGO 活动官网

以活动展示、现场图库、城市切换、微信联系和微信小程序购票为核心的 Next.js 网站。

视觉结构参考 `azuredayparty.com` 的活动站体验：全屏现场影像、简洁固定导航、白底活动海报网格、图库和联系模块。PPT 仅作为 MAGO Logo、活动海报和现场照片的素材来源，没有沿用 PPT 的版式或视觉风格。

## 已实现

- 首页活动首屏与现场图片轮播
- 可选 MP4/WebM 首屏视频
- 全部活动与状态/城市筛选
- 手机点击海报打开小程序 URL
- 电脑点击海报打开高清扫码弹窗
- 活动 Gallery 与全屏 Lightbox
- 城市活动页面
- 活动须知
- 微信二维码联系与复制微信号
- `/studio` 中文内容后台
- 活动、城市、图库、活动须知、微信信息管理
- 页面全部文案后台管理；固定保留 `MAGO` 与 `SUNSET`
- 图片和视频上传
- 微信 URL 域名白名单校验
- SEO、sitemap、robots、404、隐私政策
- 响应式和键盘无障碍支持

## 本地运行

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

打开：

- 网站：`http://localhost:3000`
- 后台：`http://localhost:3000/studio`

未设置环境变量时，本地演示后台密码为 `mago-admin`。上线前必须设置 `CMS_ADMIN_PASSWORD` 和 `SESSION_SECRET`。

## 质量检查

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## 内容存储

本地开发时，后台保存到：

```text
src/data/site.json
```

部署到 Vercel 时，建议配置 Upstash Redis：

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

配置后，后台内容会写入远程存储，避免 Serverless 文件系统重启后丢失。

## 素材上传

本地开发时，素材保存到 `public/uploads`。

Vercel 部署时配置 `BLOB_READ_WRITE_TOKEN`，后台上传的海报、图片和视频会自动保存到 Vercel Blob。

## 微信小程序购票

1. 登录 `/studio`。
2. 进入“活动管理”。
3. 上传带小程序码的高清活动海报。
4. 粘贴该场活动对应的微信小程序官方 URL Link。
5. 选择购票状态并保存。

手机端在 URL 已配置时会直接跳转；电脑端显示高清海报供微信扫码。

默认可信域名包括：

- `wxaurl.cn`
- `weixin.qq.com`
- `weixin110.qq.com`

其他官方域名可通过 `WECHAT_URL_ALLOWLIST` 添加。

## 文档

- [后台使用说明](docs/后台使用说明.md)
- [部署说明](docs/部署说明.md)
- [上线检查清单](docs/上线检查清单.md)
