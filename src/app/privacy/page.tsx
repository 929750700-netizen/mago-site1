import type { Metadata } from "next";
import { PublicShell } from "@/components/PublicShell";
import { getSiteData } from "@/lib/content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "隐私政策" };

export default async function PrivacyPage() {
  const data = await getSiteData();
  const copy = data.copy.privacy;
  return (
    <PublicShell>
      <section className="page-hero page-hero--plain">
        <div className="page-width">
          <span>{copy.eyebrow}</span>
          <h1>{copy.title}</h1>
        </div>
      </section>
      <article className="legal-copy page-width">
        <h2>{copy.heading}</h2>
        <p>{copy.introduction}</p>
        <h3>{copy.externalHeading}</h3>
        <p>{copy.externalText}</p>
        <h3>{copy.analyticsHeading}</h3>
        <p>{copy.analyticsText}</p>
        <h3>{copy.contactHeading}</h3>
        <p>{copy.contactText}</p>
      </article>
    </PublicShell>
  );
}
