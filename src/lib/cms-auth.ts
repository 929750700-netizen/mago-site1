import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const CMS_COOKIE = "mago_cms_session";

function secret() {
  return process.env.SESSION_SECRET || "change-this-local-session-secret";
}

export function createSessionToken() {
  return createHmac("sha256", secret()).update("mago-cms-admin").digest("hex");
}

export function verifyPassword(password: string) {
  const expected = Buffer.from(process.env.CMS_ADMIN_PASSWORD || "mago-admin");
  const received = Buffer.from(password);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export async function isCmsAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(CMS_COOKIE)?.value === createSessionToken();
}
