import { NextResponse } from "next/server";
import { isCmsAuthenticated } from "@/lib/cms-auth";
import { getSiteData, saveSiteData } from "@/lib/content";
import { isAllowedMiniProgramUrl, siteDataSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isCmsAuthenticated())) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  return NextResponse.json(await getSiteData());
}

export async function PUT(request: Request) {
  if (!(await isCmsAuthenticated())) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = siteDataSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "内容格式不正确", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const invalidEvent = parsed.data.events.find(
    (event) => event.miniProgramUrl && !isAllowedMiniProgramUrl(event.miniProgramUrl),
  );
  if (invalidEvent) {
    return NextResponse.json(
      { error: `${invalidEvent.title} 的小程序 URL 不在可信域名白名单中` },
      { status: 400 },
    );
  }

  await saveSiteData(parsed.data);
  return NextResponse.json({ ok: true, savedAt: new Date().toISOString() });
}
