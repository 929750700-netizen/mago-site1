"use client";

import Image from "next/image";
import { CheckCircle2, ExternalLink, ImagePlus, LogOut, Plus, Save, Trash2, UploadCloud } from "lucide-react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import type { CityItem, EventItem, GalleryItem, GuideItem, SiteCopy, SiteData, TicketStatus } from "@/types/content";

type Tab = "events" | "cities" | "gallery" | "guide" | "wechat" | "copy" | "settings";

const statuses: TicketStatus[] = ["即将开售", "立即购票", "余票紧张", "已售罄", "活动取消", "活动结束"];

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function StudioDashboard() {
  const [data, setData] = useState<SiteData | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<Tab>("events");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const loadData = useCallback(async () => {
    const response = await fetch("/api/cms", { cache: "no-store" });
    if (response.status === 401) {
      setAuthenticated(false);
      return;
    }
    if (!response.ok) {
      setMessage("后台数据加载失败");
      setAuthenticated(false);
      return;
    }
    setData(await response.json());
    setAuthenticated(true);
  }, []);

  useEffect(() => {
    // The dashboard intentionally hydrates from the authenticated CMS endpoint on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  const login = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const response = await fetch("/api/cms/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (!response.ok) {
      setMessage("密码错误，请重新输入");
      return;
    }
    setPassword("");
    await loadData();
  };

  const logout = async () => {
    await fetch("/api/cms/logout", { method: "POST" });
    setData(null);
    setAuthenticated(false);
  };

  const save = async () => {
    if (!data) return;
    setBusy(true);
    setMessage("");
    const response = await fetch("/api/cms", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json().catch(() => ({}));
    setBusy(false);
    setMessage(response.ok ? "内容已保存，前台刷新后即可看到更新" : result.error || "保存失败");
  };

  const upload = async (file: File) => {
    const body = new FormData();
    body.append("file", file);
    setBusy(true);
    const response = await fetch("/api/cms/upload", { method: "POST", body });
    const result = await response.json().catch(() => ({}));
    setBusy(false);
    if (!response.ok) {
      setMessage(result.error || "上传失败");
      return "";
    }
    setMessage("素材上传成功，请点击保存内容");
    return result.url as string;
  };

  if (authenticated === null) {
    return <main className="studio-loading">正在连接 MAGO Studio…</main>;
  }

  if (!authenticated) {
    return (
      <main className="studio-login">
        <form onSubmit={login}>
          <span>MAGO / CONTENT STUDIO</span>
          <h1>活动内容管理</h1>
          <p>登录后可以更新活动海报、小程序 URL、图库和微信联系方式。</p>
          <label>
            <span>管理员密码</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {message && <p className="studio-message studio-message--error">{message}</p>}
          <button className="studio-primary" disabled={busy}>{busy ? "登录中…" : "登录后台"}</button>
          <small>首次本地运行的默认密码为 mago-admin；上线前必须通过环境变量修改。</small>
        </form>
      </main>
    );
  }

  if (!data) return null;

  const updateEvent = (id: string, patch: Partial<EventItem>) => {
    setData({ ...data, events: data.events.map((event) => event.id === id ? { ...event, ...patch } : event) });
  };
  const updateGallery = (id: string, patch: Partial<GalleryItem>) => {
    setData({ ...data, gallery: data.gallery.map((item) => item.id === id ? { ...item, ...patch } : item) });
  };
  const updateCity = (id: string, patch: Partial<CityItem>) => {
    setData({ ...data, cities: data.cities.map((item) => item.id === id ? { ...item, ...patch } : item) });
  };
  const updateGuide = (id: string, patch: Partial<GuideItem>) => {
    setData({ ...data, guides: data.guides.map((item) => item.id === id ? { ...item, ...patch } : item) });
  };

  const addEvent = () => {
    const id = uid("event");
    setData({
      ...data,
      events: [{
        id,
        title: "新活动",
        slug: id,
        posterImage: "/media/optimized/afro-sunset-poster.webp",
        date: "",
        displayDate: "日期待公布",
        weekday: "SUN",
        month: "TBA",
        day: "--",
        startTime: "16:00",
        endTime: "22:00",
        city: "沈阳",
        venue: "场地待公布",
        miniProgramUrl: "",
        ticketStatus: "即将开售",
        featured: false,
        visible: true,
        sortOrder: data.events.length + 1,
        galleryId: "",
      }, ...data.events],
    });
  };

  return (
    <main className="studio-shell">
      <aside className="studio-sidebar">
        <div>
          <Image src={data.settings.logo} alt="MAGO" width={154} height={68} />
          <span>CONTENT STUDIO</span>
        </div>
        <nav>
          {([
            ["events", "活动管理"],
            ["cities", "城市管理"],
            ["gallery", "图库管理"],
            ["guide", "活动须知"],
            ["wechat", "微信联系"],
            ["copy", "页面文案"],
            ["settings", "网站设置"],
          ] as [Tab, string][]).map(([value, label]) => (
            <button key={value} className={tab === value ? "is-active" : ""} onClick={() => setTab(value)}>{label}</button>
          ))}
        </nav>
        <button className="studio-logout" onClick={logout}><LogOut size={17} /> 退出登录</button>
      </aside>

      <section className="studio-main">
        <header className="studio-toolbar">
          <div>
            <span>MAGO ADMIN</span>
            <h1>{tab === "events" ? "活动管理" : tab === "cities" ? "城市管理" : tab === "gallery" ? "图库管理" : tab === "guide" ? "活动须知" : tab === "wechat" ? "微信联系" : tab === "copy" ? "页面文案" : "网站设置"}</h1>
          </div>
          <div className="studio-toolbar__actions">
            <a href="/" target="_blank" rel="noreferrer"><ExternalLink size={17} /> 预览网站</a>
            <button className="studio-primary" onClick={save} disabled={busy}><Save size={17} /> {busy ? "处理中…" : "保存内容"}</button>
          </div>
        </header>

        {message && <div className="studio-message"><CheckCircle2 size={18} /> {message}</div>}

        {tab === "events" && (
          <div className="studio-stack">
            <div className="studio-section-title">
              <p>上传活动海报并绑定小程序官方 URL。手机点击海报直接跳转，电脑端打开海报扫码。</p>
              <button className="studio-secondary" onClick={addEvent}><Plus size={17} /> 新增活动</button>
            </div>
            {data.events.map((event) => (
              <article className="studio-card studio-event" key={event.id}>
                <div className="studio-event__poster">
                  <Image src={event.posterImage} alt={event.title} fill sizes="220px" />
                  <label className="studio-upload">
                    <UploadCloud size={17} /> 更换海报
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={async (input) => {
                      const file = input.target.files?.[0];
                      if (!file) return;
                      const url = await upload(file);
                      if (url) updateEvent(event.id, { posterImage: url });
                    }} />
                  </label>
                </div>
                <div className="studio-form-grid">
                  <Field label="活动名称"><input value={event.title} onChange={(e) => updateEvent(event.id, { title: e.target.value })} /></Field>
                  <Field label="URL 标识"><input value={event.slug} onChange={(e) => updateEvent(event.id, { slug: e.target.value })} /></Field>
                  <Field label="活动日期"><input type="date" value={event.date} onChange={(e) => updateEvent(event.id, { date: e.target.value })} /></Field>
                  <Field label="页面显示日期"><input value={event.displayDate} onChange={(e) => updateEvent(event.id, { displayDate: e.target.value })} /></Field>
                  <Field label="星期缩写"><input value={event.weekday} onChange={(e) => updateEvent(event.id, { weekday: e.target.value })} /></Field>
                  <Field label="月份缩写"><input value={event.month} onChange={(e) => updateEvent(event.id, { month: e.target.value })} /></Field>
                  <Field label="日期数字"><input value={event.day} onChange={(e) => updateEvent(event.id, { day: e.target.value })} /></Field>
                  <Field label="活动状态">
                    <select value={event.ticketStatus} onChange={(e) => updateEvent(event.id, { ticketStatus: e.target.value as TicketStatus })}>
                      {statuses.map((status) => <option key={status}>{status}</option>)}
                    </select>
                  </Field>
                  <Field label="城市"><input value={event.city} onChange={(e) => updateEvent(event.id, { city: e.target.value })} /></Field>
                  <Field label="场地"><input value={event.venue} onChange={(e) => updateEvent(event.id, { venue: e.target.value })} /></Field>
                  <Field label="开始时间"><input type="time" value={event.startTime} onChange={(e) => updateEvent(event.id, { startTime: e.target.value })} /></Field>
                  <Field label="结束时间"><input type="time" value={event.endTime} onChange={(e) => updateEvent(event.id, { endTime: e.target.value })} /></Field>
                  <Field label="微信小程序 URL" wide>
                    <input type="url" placeholder="https://wxaurl.cn/..." value={event.miniProgramUrl} onChange={(e) => updateEvent(event.id, { miniProgramUrl: e.target.value })} />
                  </Field>
                  <label className="studio-check"><input type="checkbox" checked={event.featured} onChange={(e) => updateEvent(event.id, { featured: e.target.checked })} /> 首页推荐</label>
                  <label className="studio-check"><input type="checkbox" checked={event.visible} onChange={(e) => updateEvent(event.id, { visible: e.target.checked })} /> 前台显示</label>
                </div>
                <button className="studio-danger" onClick={() => setData({ ...data, events: data.events.filter((item) => item.id !== event.id) })}><Trash2 size={16} /> 删除活动</button>
              </article>
            ))}
          </div>
        )}

        {tab === "gallery" && (
          <div className="studio-stack">
            <div className="studio-section-title">
              <p>管理活动现场照片。建议上传横版高清图片，前台会自动生成响应式展示。</p>
              <button className="studio-secondary" onClick={() => {
                const id = uid("gallery");
                setData({ ...data, gallery: [{ id, title: "新图片", image: "/media/optimized/hero-rooftop.webp", video: "", event: "AFRO SUNSET", city: "沈阳", year: "2026", description: "", sortOrder: data.gallery.length + 1, visible: true }, ...data.gallery] });
              }}><ImagePlus size={17} /> 新增图片</button>
            </div>
            <div className="studio-gallery-list">
              {data.gallery.map((item) => (
                <article className="studio-card studio-gallery-item" key={item.id}>
                  <div className="studio-gallery-item__image"><Image src={item.image} alt={item.title} fill sizes="240px" /></div>
                  <div className="studio-form-grid">
                    <Field label="图片标题"><input value={item.title} onChange={(e) => updateGallery(item.id, { title: e.target.value })} /></Field>
                    <Field label="所属活动"><input value={item.event} onChange={(e) => updateGallery(item.id, { event: e.target.value })} /></Field>
                    <Field label="城市"><input value={item.city} onChange={(e) => updateGallery(item.id, { city: e.target.value })} /></Field>
                    <Field label="年份"><input value={item.year} onChange={(e) => updateGallery(item.id, { year: e.target.value })} /></Field>
                    <Field label="图片说明" wide><textarea rows={3} value={item.description} onChange={(e) => updateGallery(item.id, { description: e.target.value })} /></Field>
                    <Field label="图片地址" wide><input value={item.image} onChange={(e) => updateGallery(item.id, { image: e.target.value })} /></Field>
                    <label className="studio-upload studio-upload--inline">
                      <UploadCloud size={17} /> 上传新图片
                      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={async (input) => {
                        const file = input.target.files?.[0];
                        if (!file) return;
                        const url = await upload(file);
                        if (url) updateGallery(item.id, { image: url });
                      }} />
                    </label>
                    <label className="studio-check"><input type="checkbox" checked={item.visible} onChange={(e) => updateGallery(item.id, { visible: e.target.checked })} /> 前台显示</label>
                  </div>
                  <button className="studio-danger" onClick={() => setData({ ...data, gallery: data.gallery.filter((value) => value.id !== item.id) })}><Trash2 size={16} /></button>
                </article>
              ))}
            </div>
          </div>
        )}

        {tab === "cities" && (
          <div className="studio-stack">
            <div className="studio-section-title">
              <p>管理城市名称、页面说明和封面图片；城市文字会同步出现在导航与城市活动页。</p>
              <button className="studio-secondary" onClick={() => {
                const id = uid("city");
                setData({ ...data, cities: [...data.cities, { id, name: "新城市", slug: id, coverImage: "/media/optimized/hero-rooftop.webp", description: "请输入城市活动说明", active: true }] });
              }}><Plus size={17} /> 新增城市</button>
            </div>
            {data.cities.map((city) => (
              <article className="studio-card studio-city-editor" key={city.id}>
                <div className="studio-city-editor__cover"><Image src={city.coverImage} alt={city.name} fill sizes="300px" /></div>
                <div className="studio-form-grid">
                  <Field label="城市名称"><input value={city.name} onChange={(event) => updateCity(city.id, { name: event.target.value })} /></Field>
                  <Field label="URL 标识"><input value={city.slug} onChange={(event) => updateCity(city.id, { slug: event.target.value })} /></Field>
                  <Field label="城市封面" wide><input value={city.coverImage} onChange={(event) => updateCity(city.id, { coverImage: event.target.value })} /></Field>
                  <Field label="城市页面说明" wide><textarea rows={4} value={city.description} onChange={(event) => updateCity(city.id, { description: event.target.value })} /></Field>
                  <label className="studio-upload studio-upload--inline">
                    <UploadCloud size={17} /> 上传城市封面
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={async (input) => {
                      const file = input.target.files?.[0];
                      if (!file) return;
                      const url = await upload(file);
                      if (url) updateCity(city.id, { coverImage: url });
                    }} />
                  </label>
                  <label className="studio-check"><input type="checkbox" checked={city.active} onChange={(event) => updateCity(city.id, { active: event.target.checked })} /> 前台显示</label>
                </div>
                <button className="studio-danger" onClick={() => setData({ ...data, cities: data.cities.filter((item) => item.id !== city.id) })}><Trash2 size={16} /> 删除城市</button>
              </article>
            ))}
          </div>
        )}

        {tab === "guide" && (
          <div className="studio-stack">
            <div className="studio-section-title">
              <p>编辑购票、入场、天气及联系说明。</p>
              <button className="studio-secondary" onClick={() => {
                const id = uid("guide");
                setData({ ...data, guides: [...data.guides, { id, question: "新问题", answer: "请输入回答", sortOrder: data.guides.length + 1, visible: true }] });
              }}><Plus size={17} /> 新增问题</button>
            </div>
            {data.guides.map((guide) => (
              <article className="studio-card studio-guide-editor" key={guide.id}>
                <input value={guide.question} onChange={(e) => updateGuide(guide.id, { question: e.target.value })} />
                <textarea rows={4} value={guide.answer} onChange={(e) => updateGuide(guide.id, { answer: e.target.value })} />
                <label className="studio-check"><input type="checkbox" checked={guide.visible} onChange={(e) => updateGuide(guide.id, { visible: e.target.checked })} /> 前台显示</label>
                <button className="studio-danger" onClick={() => setData({ ...data, guides: data.guides.filter((item) => item.id !== guide.id) })}><Trash2 size={16} /> 删除</button>
              </article>
            ))}
          </div>
        )}

        {tab === "wechat" && (
          <article className="studio-card studio-wechat-editor">
            <div className="studio-wechat-editor__qr"><Image src={data.wechat.qrCode} alt="微信二维码" fill sizes="260px" /></div>
            <div className="studio-form-grid">
              <Field label="联系人名称"><input value={data.wechat.name} onChange={(e) => setData({ ...data, wechat: { ...data.wechat, name: e.target.value } })} /></Field>
              <Field label="微信号"><input value={data.wechat.wechatId} onChange={(e) => setData({ ...data, wechat: { ...data.wechat, wechatId: e.target.value } })} /></Field>
              <Field label="城市"><input value={data.wechat.city} onChange={(e) => setData({ ...data, wechat: { ...data.wechat, city: e.target.value } })} /></Field>
              <Field label="服务时间"><input value={data.wechat.serviceTime} onChange={(e) => setData({ ...data, wechat: { ...data.wechat, serviceTime: e.target.value } })} /></Field>
              <Field label="联系说明" wide><textarea rows={3} value={data.wechat.description} onChange={(e) => setData({ ...data, wechat: { ...data.wechat, description: e.target.value } })} /></Field>
              <Field label="二维码地址" wide><input value={data.wechat.qrCode} onChange={(e) => setData({ ...data, wechat: { ...data.wechat, qrCode: e.target.value } })} /></Field>
              <label className="studio-upload studio-upload--inline">
                <UploadCloud size={17} /> 上传微信二维码
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={async (input) => {
                  const file = input.target.files?.[0];
                  if (!file) return;
                  const url = await upload(file);
                  if (url) setData({ ...data, wechat: { ...data.wechat, qrCode: url } });
                }} />
              </label>
            </div>
          </article>
        )}

        {tab === "settings" && (
          <article className="studio-card studio-settings-editor">
            <div className="studio-form-grid">
              <Field label="首屏主标题（SUNSET 前的文字）"><input value={data.settings.heroTitle} onChange={(e) => setData({ ...data, settings: { ...data.settings, heroTitle: e.target.value } })} /></Field>
              <Field label="首屏英文小标题"><input value={data.settings.heroEyebrow} onChange={(e) => setData({ ...data, settings: { ...data.settings, heroEyebrow: e.target.value } })} /></Field>
              <Field label="首屏中文副标题"><input value={data.settings.heroSubtitle} onChange={(e) => setData({ ...data, settings: { ...data.settings, heroSubtitle: e.target.value } })} /></Field>
              <Field label="首屏主题文案" wide><input value={data.settings.heroDescription} onChange={(e) => setData({ ...data, settings: { ...data.settings, heroDescription: e.target.value } })} /></Field>
              <Field label="首屏封面图片" wide><input value={data.settings.heroPoster} onChange={(e) => setData({ ...data, settings: { ...data.settings, heroPoster: e.target.value } })} /></Field>
              <Field label="首屏视频地址" wide><input placeholder="上传 MP4 后填写地址；留空时自动轮播现场照片" value={data.settings.heroVideo} onChange={(e) => setData({ ...data, settings: { ...data.settings, heroVideo: e.target.value } })} /></Field>
              <label className="studio-upload studio-upload--inline">
                <UploadCloud size={17} /> 上传首屏视频
                <input type="file" accept="video/mp4,video/webm" onChange={async (input) => {
                  const file = input.target.files?.[0];
                  if (!file) return;
                  const url = await upload(file);
                  if (url) setData({ ...data, settings: { ...data.settings, heroVideo: url } });
                }} />
              </label>
              <Field label="抖音链接" wide><input value={data.settings.douyinUrl} onChange={(e) => setData({ ...data, settings: { ...data.settings, douyinUrl: e.target.value } })} /></Field>
              <Field label="小红书链接" wide><input value={data.settings.xiaohongshuUrl} onChange={(e) => setData({ ...data, settings: { ...data.settings, xiaohongshuUrl: e.target.value } })} /></Field>
              <Field label="备案信息" wide><input value={data.settings.icp} onChange={(e) => setData({ ...data, settings: { ...data.settings, icp: e.target.value } })} /></Field>
            </div>
          </article>
        )}

        {tab === "copy" && (
          <CopyEditor value={data.copy} onChange={(copy) => setData({ ...data, copy })} />
        )}
      </section>
    </main>
  );
}

function Field({ label, children, wide = false }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return <label className={`studio-field ${wide ? "studio-field--wide" : ""}`}><span>{label}</span>{children}</label>;
}

const copyGroupLabels: Record<string, string> = {
  navigation: "导航栏",
  home: "首页",
  eventsPage: "活动列表页",
  galleryPage: "图库页",
  guidePage: "活动须知页",
  cityPage: "城市页",
  eventCard: "活动卡片",
  ticketDialog: "购票弹窗",
  footer: "页脚",
  privacy: "隐私政策页",
  notFound: "404 页面",
};

const copyLabels: Record<string, string> = {
  cities: "城市菜单",
  events: "活动菜单",
  gallery: "图库菜单",
  guide: "活动须知菜单",
  wechat: "微信菜单",
  heroEventsButton: "首屏查看活动按钮",
  heroTicketButton: "首屏购票按钮",
  eventsEyebrow: "活动区英文小标题",
  eventsTitle: "活动区标题",
  eventsDescription: "活动区说明",
  eventsLink: "查看全部活动链接",
  galleryEyebrow: "图库区英文小标题",
  galleryTitle: "图库区标题",
  galleryDescription: "图库区说明",
  galleryLink: "查看全部图库链接",
  contactEyebrow: "联系区英文小标题",
  contactTitleLine1: "联系标题第一行",
  contactTitleLine2: "联系标题第二行",
  contactDescription: "联系说明",
  copyWechatButton: "复制微信号按钮",
  copiedWechatButton: "复制成功按钮",
  qrHint: "二维码提示",
  eyebrow: "英文小标题",
  title: "主标题",
  description: "说明文字",
  sectionEyebrow: "内容区英文小标题",
  sectionTitle: "内容区标题",
  sectionDescription: "内容区说明",
  filterAll: "全部筛选",
  filterUpcoming: "即将举行筛选",
  filterSoldOut: "已售罄筛选",
  filterPast: "历史活动筛选",
  allCities: "全部城市选项",
  cityLabel: "城市筛选标签",
  emptyEyebrow: "空状态英文标题",
  emptyTitle: "空状态标题",
  emptyDescription: "空状态说明",
  eventsSuffix: "城市活动标题后缀",
  eyebrowPrefix: "城市页英文前缀",
  gallerySuffix: "城市图库标题后缀",
  buyHint: "可购票活动提示",
  pastHint: "历史活动提示",
  scanInstruction: "扫码说明",
  placeholderNotice: "未配置链接提示",
  openButton: "打开小程序按钮",
  tagline: "页脚短句",
  privacy: "隐私政策链接",
  contact: "联系标签",
  heading: "正文标题",
  introduction: "隐私政策介绍",
  externalHeading: "外部链接标题",
  externalText: "外部链接说明",
  analyticsHeading: "访问统计标题",
  analyticsText: "访问统计说明",
  contactHeading: "联系标题",
  contactText: "联系说明",
  button: "按钮文字",
};

function CopyEditor({ value, onChange }: { value: SiteCopy; onChange: (value: SiteCopy) => void }) {
  const groups = Object.entries(value) as [keyof SiteCopy, Record<string, string>][];
  const update = (group: keyof SiteCopy, key: string, nextValue: string) => {
    onChange({
      ...value,
      [group]: { ...(value[group] as Record<string, string>), [key]: nextValue },
    } as SiteCopy);
  };

  return (
    <div className="studio-copy-editor">
      <div className="studio-section-title">
        <p>除固定的 MAGO 和 SUNSET 外，以下前台可见文案均可修改。修改后点击右上角“保存内容”。</p>
      </div>
      {groups.map(([group, fields]) => (
        <section className="studio-card studio-copy-group" key={group}>
          <h2>{copyGroupLabels[group] || group}</h2>
          <div className="studio-form-grid">
            {Object.entries(fields).map(([key, fieldValue]) => (
              <Field key={key} label={copyLabels[key] || key} wide={fieldValue.length > 34}>
                {fieldValue.length > 70 ? (
                  <textarea rows={4} value={fieldValue} onChange={(event) => update(group, key, event.target.value)} />
                ) : (
                  <input value={fieldValue} onChange={(event) => update(group, key, event.target.value)} />
                )}
              </Field>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
