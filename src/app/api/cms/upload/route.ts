import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { isCmsAuthenticated } from "@/lib/cms-auth";

const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["video/mp4", "mp4"],
  ["video/webm", "webm"],
]);

export async function POST(request: Request) {
  if (!(await isCmsAuthenticated())) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "请选择文件" }, { status: 400 });
  }
  const extension = allowedTypes.get(file.type);
  if (!extension) {
    return NextResponse.json({ error: "仅支持 JPG、PNG、WebP、MP4 或 WebM" }, { status: 400 });
  }
  if (file.size > 50 * 1024 * 1024) {
    return NextResponse.json({ error: "文件不能超过 50MB" }, { status: 400 });
  }

  const filename = `${Date.now()}-${randomUUID().slice(0, 8)}.${extension}`;
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`mago/${filename}`, file, { access: "public", addRandomSuffix: true });
    return NextResponse.json({ ok: true, url: blob.url });
  }
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ ok: true, url: `/uploads/${filename}` });
}
