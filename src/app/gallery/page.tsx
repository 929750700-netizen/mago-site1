import type { Metadata } from "next";
import { GalleryGrid } from "@/components/GalleryGrid";
import { PublicShell } from "@/components/PublicShell";
import { SectionHeading } from "@/components/SectionHeading";
import { getSiteData } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "活动图库",
  description: "浏览 MAGO AFRO SUNSET 屋顶派对现场照片。",
};

export default async function GalleryPage() {
  const data = await getSiteData();
  return (
    <PublicShell>
      <section className="page-hero page-hero--gallery">
        <div className="page-width">
          <span>{data.copy.galleryPage.eyebrow}</span>
          <h1>{data.copy.galleryPage.title}</h1>
          <p>{data.copy.galleryPage.description}</p>
        </div>
      </section>
      <section className="section page-width">
        <SectionHeading eyebrow={data.copy.galleryPage.sectionEyebrow} title={data.copy.galleryPage.sectionTitle} description={data.copy.galleryPage.sectionDescription} />
        <GalleryGrid items={data.gallery} />
      </section>
    </PublicShell>
  );
}
