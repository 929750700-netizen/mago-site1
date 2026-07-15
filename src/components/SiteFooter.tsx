import Image from "next/image";
import Link from "next/link";
import type { SiteCopy, SiteSettings, WechatContact } from "@/types/content";

export function SiteFooter({ settings, wechat, copy }: { settings: SiteSettings; wechat: WechatContact; copy: SiteCopy["footer"] }) {
  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <div>
          <Image
            src={settings.logo}
            alt="MAGO Party Studio"
            width={224}
            height={98}
            className="footer-logo"
          />
          <p>{copy.tagline}</p>
        </div>
        <div className="site-footer__links">
          <Link href="/events">{copy.events}</Link>
          <Link href="/gallery">{copy.gallery}</Link>
          <Link href="/event-guide">{copy.guide}</Link>
          <Link href="/privacy">{copy.privacy}</Link>
        </div>
        <div className="site-footer__contact">
          <span>{copy.contact}</span>
          <strong>{wechat.wechatId}</strong>
          <span>{wechat.serviceTime}</span>
        </div>
      </div>
      <div className="site-footer__bottom">
        <span>© {new Date().getFullYear()} MAGO</span>
        {settings.icp && <span>{settings.icp}</span>}
      </div>
    </footer>
  );
}
