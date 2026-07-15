import type { ReactNode } from "react";
import { getSiteData } from "@/lib/content";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export async function PublicShell({
  children,
  overlayHeader = false,
}: {
  children: ReactNode;
  overlayHeader?: boolean;
}) {
  const data = await getSiteData();
  return (
    <>
      <SiteHeader settings={data.settings} cities={data.cities} copy={data.copy.navigation} overlay={overlayHeader} />
      <main>{children}</main>
      <SiteFooter settings={data.settings} wechat={data.wechat} copy={data.copy.footer} />
    </>
  );
}
