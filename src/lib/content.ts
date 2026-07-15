import { promises as fs } from "node:fs";
import path from "node:path";
import type { SiteData } from "@/types/content";

const dataPath = path.join(process.cwd(), "src", "data", "site.json");
const redisKey = "mago:site:data";

async function redisCommand(command: unknown[]) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Remote content storage failed: ${response.status}`);
  return (await response.json()) as { result: string | null };
}

export async function getSiteData(): Promise<SiteData> {
  const remote = await redisCommand(["GET", redisKey]);
  if (remote?.result) return JSON.parse(remote.result) as SiteData;
  const file = await fs.readFile(dataPath, "utf8");
  return JSON.parse(file) as SiteData;
}

export async function saveSiteData(data: SiteData): Promise<void> {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    await redisCommand(["SET", redisKey, JSON.stringify(data)]);
    return;
  }
  await fs.writeFile(dataPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}
