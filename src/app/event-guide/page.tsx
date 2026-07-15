import type { Metadata } from "next";
import { GuideAccordion } from "@/components/GuideAccordion";
import { PublicShell } from "@/components/PublicShell";
import { SectionHeading } from "@/components/SectionHeading";
import { WechatSection } from "@/components/WechatSection";
import { getSiteData } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "活动须知",
  description: "MAGO 活动购票、入场、天气与联系信息。",
};

export default async function EventGuidePage() {
  const data = await getSiteData();
  return (
    <PublicShell>
      <section className="page-hero page-hero--guide">
        <div className="page-width">
          <span>{data.copy.guidePage.eyebrow}</span>
          <h1>{data.copy.guidePage.title}</h1>
          <p>{data.copy.guidePage.description}</p>
        </div>
      </section>
      <section className="section page-width guide-page">
        <SectionHeading eyebrow={data.copy.guidePage.sectionEyebrow} title={data.copy.guidePage.sectionTitle} />
        <GuideAccordion guides={data.guides} />
      </section>
      <WechatSection contact={data.wechat} copy={data.copy.home} />
    </PublicShell>
  );
}
