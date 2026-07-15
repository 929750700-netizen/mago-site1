import Link from "next/link";
import { getSiteData } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function NotFound() {
  const data = await getSiteData();
  const copy = data.copy.notFound;
  return (
    <main className="not-found">
      <span>{copy.eyebrow}</span>
      <h1>{copy.title}</h1>
      <p>{copy.description}</p>
      <Link href="/" className="button button--light">{copy.button}</Link>
    </main>
  );
}
