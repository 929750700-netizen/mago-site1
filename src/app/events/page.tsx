import type { Metadata } from "next";
import { EventExplorer } from "@/components/EventExplorer";
import { PublicShell } from "@/components/PublicShell";
import { SectionHeading } from "@/components/SectionHeading";
import { getSiteData } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "全部活动",
  description: "查看 MAGO 即将举行及历史活动，点击活动海报进入微信小程序购票。",
};

export default async function EventsPage() {
  const data = await getSiteData();
  return (
    <PublicShell>
      <section className="page-hero page-hero--events">
        <div className="page-width">
          <span>{data.copy.eventsPage.eyebrow} / MAGO</span>
          <h1>{data.copy.eventsPage.title}</h1>
          <p>{data.copy.eventsPage.description}</p>
        </div>
      </section>
      <section className="section page-width">
        <SectionHeading eyebrow={data.copy.eventsPage.sectionEyebrow} title={data.copy.eventsPage.sectionTitle} />
        <EventExplorer events={data.events} copy={data.copy.eventsPage} cardCopy={data.copy.eventCard} dialogCopy={data.copy.ticketDialog} />
      </section>
    </PublicShell>
  );
}
