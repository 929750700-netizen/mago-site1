import { z } from "zod";

const optionalUrl = z.union([z.literal(""), z.string().url()]);

const eventSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  slug: z.string().min(1),
  posterImage: z.string().min(1),
  date: z.string(),
  displayDate: z.string(),
  weekday: z.string(),
  month: z.string(),
  day: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  city: z.string().min(1),
  venue: z.string().min(1),
  miniProgramUrl: optionalUrl,
  ticketStatus: z.enum([
    "即将开售",
    "立即购票",
    "余票紧张",
    "已售罄",
    "活动取消",
    "活动结束",
  ]),
  featured: z.boolean(),
  visible: z.boolean(),
  sortOrder: z.number(),
  galleryId: z.string(),
});

export const siteDataSchema = z.object({
  settings: z.object({
    siteName: z.string().min(1),
    logo: z.string().min(1),
    monogram: z.string().min(1),
    heroVideo: z.string(),
    heroPoster: z.string().min(1),
    heroEyebrow: z.string(),
    heroTitle: z.string().min(1),
    heroSubtitle: z.string(),
    heroDescription: z.string(),
    douyinUrl: z.string(),
    xiaohongshuUrl: z.string(),
    icp: z.string(),
  }),
  copy: z.object({
    navigation: z.object({ cities: z.string(), events: z.string(), gallery: z.string(), guide: z.string(), wechat: z.string() }),
    home: z.object({
      heroEventsButton: z.string(), heroTicketButton: z.string(), eventsEyebrow: z.string(), eventsTitle: z.string(), eventsDescription: z.string(), eventsLink: z.string(),
      galleryEyebrow: z.string(), galleryTitle: z.string(), galleryDescription: z.string(), galleryLink: z.string(), contactEyebrow: z.string(), contactTitleLine1: z.string(),
      contactTitleLine2: z.string(), contactDescription: z.string(), copyWechatButton: z.string(), copiedWechatButton: z.string(), qrHint: z.string(),
    }),
    eventsPage: z.object({
      eyebrow: z.string(), title: z.string(), description: z.string(), sectionEyebrow: z.string(), sectionTitle: z.string(), filterAll: z.string(), filterUpcoming: z.string(),
      filterSoldOut: z.string(), filterPast: z.string(), allCities: z.string(), cityLabel: z.string(), emptyEyebrow: z.string(), emptyTitle: z.string(), emptyDescription: z.string(),
    }),
    galleryPage: z.object({ eyebrow: z.string(), title: z.string(), description: z.string(), sectionEyebrow: z.string(), sectionTitle: z.string(), sectionDescription: z.string() }),
    guidePage: z.object({ eyebrow: z.string(), title: z.string(), description: z.string(), sectionEyebrow: z.string(), sectionTitle: z.string() }),
    cityPage: z.object({ eyebrowPrefix: z.string(), eventsEyebrow: z.string(), eventsSuffix: z.string(), galleryEyebrow: z.string(), gallerySuffix: z.string() }),
    eventCard: z.object({ buyHint: z.string(), pastHint: z.string() }),
    ticketDialog: z.object({ eyebrow: z.string(), scanInstruction: z.string(), placeholderNotice: z.string(), openButton: z.string() }),
    footer: z.object({ tagline: z.string(), events: z.string(), gallery: z.string(), guide: z.string(), privacy: z.string(), contact: z.string() }),
    privacy: z.object({
      eyebrow: z.string(), title: z.string(), heading: z.string(), introduction: z.string(), externalHeading: z.string(), externalText: z.string(), analyticsHeading: z.string(),
      analyticsText: z.string(), contactHeading: z.string(), contactText: z.string(),
    }),
    notFound: z.object({ eyebrow: z.string(), title: z.string(), description: z.string(), button: z.string() }),
  }),
  events: z.array(eventSchema),
  gallery: z.array(
    z.object({
      id: z.string().min(1),
      title: z.string().min(1),
      image: z.string().min(1),
      video: z.string(),
      event: z.string(),
      city: z.string(),
      year: z.string(),
      description: z.string(),
      sortOrder: z.number(),
      visible: z.boolean(),
    }),
  ),
  cities: z.array(
    z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      slug: z.string().min(1),
      coverImage: z.string().min(1),
      description: z.string(),
      active: z.boolean(),
    }),
  ),
  guides: z.array(
    z.object({
      id: z.string().min(1),
      question: z.string().min(1),
      answer: z.string().min(1),
      sortOrder: z.number(),
      visible: z.boolean(),
    }),
  ),
  wechat: z.object({
    name: z.string().min(1),
    wechatId: z.string().min(1),
    qrCode: z.string().min(1),
    city: z.string(),
    description: z.string(),
    serviceTime: z.string(),
    visible: z.boolean(),
  }),
});

export function isAllowedMiniProgramUrl(value: string): boolean {
  if (!value) return true;
  try {
    const hostname = new URL(value).hostname.toLowerCase();
    const configured = (process.env.WECHAT_URL_ALLOWLIST ?? "")
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);
    const defaults = ["wxaurl.cn", "weixin.qq.com", "weixin110.qq.com"];
    return [...defaults, ...configured].some(
      (allowed) => hostname === allowed || hostname.endsWith(`.${allowed}`),
    );
  } catch {
    return false;
  }
}
