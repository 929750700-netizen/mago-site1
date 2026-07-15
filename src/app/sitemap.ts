import type { MetadataRoute } from "next";
import { getSiteData } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const data = await getSiteData();
  const routes = ["", "/events", "/gallery", "/event-guide", "/privacy"];
  return [
    ...routes.map((route) => ({ url: `${base}${route}`, lastModified: new Date() })),
    ...data.cities.filter((city) => city.active).map((city) => ({
      url: `${base}/cities/${city.slug}`,
      lastModified: new Date(),
    })),
  ];
}
