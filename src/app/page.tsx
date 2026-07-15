import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { EventExplorer } from "@/components/EventExplorer";
import { GalleryGrid } from "@/components/GalleryGrid";
import { Hero } from "@/components/Hero";
import { PublicShell } from "@/components/PublicShell";
import { SectionHeading } from "@/components/SectionHeading";
import { WechatSection } from "@/components/WechatSection";
import { getSiteData } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getSiteData();
  const featured = data.events.filter((event) => event.featured && event.visible);

  return (
    <PublicShell overlayHeader>
      <Hero settings={data.settings} copy={data.copy.home} />

      <section id="events" className="section page-width events-section">
        <div className="section-row">
          <SectionHeading
            eyebrow={data.copy.home.eventsEyebrow}
            title={data.copy.home.eventsTitle}
            description={data.copy.home.eventsDescription}
          />
          <Link href="/events" className="text-link">{data.copy.home.eventsLink} <ArrowUpRight size={18} /></Link>
        </div>
        <EventExplorer events={featured} copy={data.copy.eventsPage} cardCopy={data.copy.eventCard} dialogCopy={data.copy.ticketDialog} compact />
      </section>

      <section className="section page-width gallery-preview">
        <div className="section-row">
          <SectionHeading
            eyebrow={data.copy.home.galleryEyebrow}
            title={data.copy.home.galleryTitle}
            description={data.copy.home.galleryDescription}
          />
          <Link href="/gallery" className="text-link">{data.copy.home.galleryLink} <ArrowUpRight size={18} /></Link>
        </div>
        <GalleryGrid items={data.gallery} limit={6} />
      </section>

      <WechatSection contact={data.wechat} copy={data.copy.home} />
    </PublicShell>
  );
}
