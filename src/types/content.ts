export type TicketStatus =
  | "即将开售"
  | "立即购票"
  | "余票紧张"
  | "已售罄"
  | "活动取消"
  | "活动结束";

export type EventItem = {
  id: string;
  title: string;
  slug: string;
  posterImage: string;
  date: string;
  displayDate: string;
  weekday: string;
  month: string;
  day: string;
  startTime: string;
  endTime: string;
  city: string;
  venue: string;
  miniProgramUrl: string;
  ticketStatus: TicketStatus;
  featured: boolean;
  visible: boolean;
  sortOrder: number;
  galleryId: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  image: string;
  video: string;
  event: string;
  city: string;
  year: string;
  description: string;
  sortOrder: number;
  visible: boolean;
};

export type CityItem = {
  id: string;
  name: string;
  slug: string;
  coverImage: string;
  description: string;
  active: boolean;
};

export type GuideItem = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  visible: boolean;
};

export type WechatContact = {
  name: string;
  wechatId: string;
  qrCode: string;
  city: string;
  description: string;
  serviceTime: string;
  visible: boolean;
};

export type SiteSettings = {
  siteName: string;
  logo: string;
  monogram: string;
  heroVideo: string;
  heroPoster: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  douyinUrl: string;
  xiaohongshuUrl: string;
  icp: string;
};

export type SiteCopy = {
  navigation: {
    cities: string;
    events: string;
    gallery: string;
    guide: string;
    wechat: string;
  };
  home: {
    heroEventsButton: string;
    heroTicketButton: string;
    eventsEyebrow: string;
    eventsTitle: string;
    eventsDescription: string;
    eventsLink: string;
    galleryEyebrow: string;
    galleryTitle: string;
    galleryDescription: string;
    galleryLink: string;
    contactEyebrow: string;
    contactTitleLine1: string;
    contactTitleLine2: string;
    contactDescription: string;
    copyWechatButton: string;
    copiedWechatButton: string;
    qrHint: string;
  };
  eventsPage: {
    eyebrow: string;
    title: string;
    description: string;
    sectionEyebrow: string;
    sectionTitle: string;
    filterAll: string;
    filterUpcoming: string;
    filterSoldOut: string;
    filterPast: string;
    allCities: string;
    cityLabel: string;
    emptyEyebrow: string;
    emptyTitle: string;
    emptyDescription: string;
  };
  galleryPage: {
    eyebrow: string;
    title: string;
    description: string;
    sectionEyebrow: string;
    sectionTitle: string;
    sectionDescription: string;
  };
  guidePage: {
    eyebrow: string;
    title: string;
    description: string;
    sectionEyebrow: string;
    sectionTitle: string;
  };
  cityPage: {
    eyebrowPrefix: string;
    eventsEyebrow: string;
    eventsSuffix: string;
    galleryEyebrow: string;
    gallerySuffix: string;
  };
  eventCard: {
    buyHint: string;
    pastHint: string;
  };
  ticketDialog: {
    eyebrow: string;
    scanInstruction: string;
    placeholderNotice: string;
    openButton: string;
  };
  footer: {
    tagline: string;
    events: string;
    gallery: string;
    guide: string;
    privacy: string;
    contact: string;
  };
  privacy: {
    eyebrow: string;
    title: string;
    heading: string;
    introduction: string;
    externalHeading: string;
    externalText: string;
    analyticsHeading: string;
    analyticsText: string;
    contactHeading: string;
    contactText: string;
  };
  notFound: {
    eyebrow: string;
    title: string;
    description: string;
    button: string;
  };
};

export type SiteData = {
  settings: SiteSettings;
  copy: SiteCopy;
  events: EventItem[];
  gallery: GalleryItem[];
  cities: CityItem[];
  guides: GuideItem[];
  wechat: WechatContact;
};
