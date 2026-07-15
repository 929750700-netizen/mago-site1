import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventExplorer } from "@/components/EventExplorer";
import { GalleryGrid } from "@/components/GalleryGrid";
import { PublicShell } from "@/components/PublicShell";
import { SectionHeading } from "@/components/SectionHeading";
import { WechatSection } from "@/components/WechatSection";
import { getSiteData } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getSiteData();
  const city = data.cities.find((item) => item.slug === slug);
  return { title: city ? `${city.name}活动` : "城市活动" };
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getSiteData();
  const city = data.cities.find((item) => item.slug === slug && item.active);
  if (!city) notFound();
  const events = data.events.filter((event) => event.city === city.name);
  const gallery = data.gallery.filter((item) => item.city === city.name);

  return (
    <PublicShell>
      <section className="city-hero" style={{ backgroundImage: `url(${city.coverImage})` }}>
        <div className="city-hero__veil" />
        <div className="page-width city-hero__content">
          <span>{data.copy.cityPage.eyebrowPrefix} / {city.slug.toUpperCase()}</span>
          <h1>{city.name}</h1>
          <p>{city.description}</p>
        </div>
      </section>
      <section className="section page-width">
        <SectionHeading eyebrow={data.copy.cityPage.eventsEyebrow} title={`${city.name}${data.copy.cityPage.eventsSuffix}`} />
        <EventExplorer events={events} copy={data.copy.eventsPage} cardCopy={data.copy.eventCard} dialogCopy={data.copy.ticketDialog} />
      </section>
      <section className="section page-width city-gallery">
        <SectionHeading eyebrow={data.copy.cityPage.galleryEyebrow} title={`${city.name}${data.copy.cityPage.gallerySuffix}`} />
        <GalleryGrid items={gallery} limit={6} />
      </section>
      <WechatSection contact={{ ...data.wechat, city: city.name }} copy={data.copy.home} />
    </PublicShell>
  );
}
