import { promises as fs } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import type { SiteData } from "@/types/content";

const dataPath = path.join(process.cwd(), "src", "data", "site.json");
const redisKey = "mago:site:data";
const siteContentId = "main";

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

async function readLocalSiteData() {
  const file = await fs.readFile(dataPath, "utf8");
  return JSON.parse(file) as SiteData;
}

async function getSupabaseSiteData() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("site_content")
    .select("data")
    .eq("id", siteContentId)
    .maybeSingle();

  if (error) throw new Error(`Supabase content read failed: ${error.message}`);
  return (data?.data as SiteData | undefined) ?? null;
}

async function saveSupabaseSiteData(data: SiteData) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return false;

  const { error } = await supabase
    .from("site_content")
    .upsert({
      id: siteContentId,
      data,
      updated_at: new Date().toISOString(),
    });

  if (error) throw new Error(`Supabase content save failed: ${error.message}`);
  return true;
}

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
  try {
    const supabaseData = await getSupabaseSiteData();
    if (supabaseData) return supabaseData;
  } catch (error) {
    console.warn(error);
  }

  const remote = await redisCommand(["GET", redisKey]);
  if (remote?.result) return JSON.parse(remote.result) as SiteData;

  const localData = await readLocalSiteData();
  try {
    await saveSupabaseSiteData(localData);
  } catch (error) {
    console.warn(error);
  }
  return localData;
}

export async function saveSiteData(data: SiteData): Promise<void> {
  if (await saveSupabaseSiteData(data)) return;

  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    await redisCommand(["SET", redisKey, JSON.stringify(data)]);
    return;
  }
  await fs.writeFile(dataPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}
