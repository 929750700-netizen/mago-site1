import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "MAGO 活动官网｜AFRO SUNSET",
    template: "%s｜MAGO",
  },
  description: "MAGO 城市屋顶青年派对活动展示、现场图库与微信小程序购票入口。",
  openGraph: {
    title: "MAGO 活动官网｜AFRO SUNSET",
    description: "让音乐、社交与城市空间重新发生连接。",
    images: ["/media/optimized/hero-rooftop.webp"],
    locale: "zh_CN",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
