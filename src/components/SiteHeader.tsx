"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Music2, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { CityItem, SiteCopy, SiteSettings } from "@/types/content";

type Props = {
  settings: SiteSettings;
  cities: CityItem[];
  copy: SiteCopy["navigation"];
  overlay?: boolean;
};

export function SiteHeader({ settings, cities, copy, overlay = false }: Props) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [citiesOpen, setCitiesOpen] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 36);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const solid = !overlay || scrolled || menuOpen;
  const links = [
    { href: "/events", label: copy.events },
    { href: "/gallery", label: copy.gallery },
    { href: "/event-guide", label: copy.guide },
  ];

  return (
    <header className={`site-header ${solid ? "site-header--solid" : "site-header--overlay"}`}>
      <div className="site-header__inner">
        <Link href="/" className="site-logo" aria-label="MAGO 首页">
          <Image
            src={settings.logo}
            alt="MAGO Party Studio"
            width={181}
            height={80}
            priority
            className={solid ? "" : "site-logo--light"}
          />
        </Link>

        <nav className="desktop-nav" aria-label="主导航">
          <div className="nav-dropdown">
            <button
              type="button"
              className="nav-link"
              onClick={() => setCitiesOpen((value) => !value)}
              aria-expanded={citiesOpen}
            >
              {copy.cities} <ChevronDown size={14} strokeWidth={1.5} />
            </button>
            {citiesOpen && (
              <div className="nav-dropdown__panel">
                {cities.filter((city) => city.active).map((city) => (
                  <Link key={city.id} href={`/cities/${city.slug}`} onClick={() => setCitiesOpen(false)}>
                    {city.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`nav-link ${pathname === link.href ? "is-active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/#wechat" className="nav-link" onClick={() => setMenuOpen(false)}>
            {copy.wechat}
          </Link>
        </nav>

        <div className="header-socials" aria-label="社交媒体">
          {settings.douyinUrl ? (
            <a href={settings.douyinUrl} target="_blank" rel="noreferrer" aria-label="抖音">
              <Music2 size={18} />
            </a>
          ) : (
            <Music2 size={18} aria-hidden="true" />
          )}
        </div>

        <button
          type="button"
          className="menu-button"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label={menuOpen ? "关闭菜单" : "打开菜单"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {menuOpen && (
        <nav className="mobile-nav" aria-label="移动端导航">
          <p className="mobile-nav__label">{copy.cities}</p>
          {cities.filter((city) => city.active).map((city) => (
            <Link key={city.id} href={`/cities/${city.slug}`} onClick={() => setMenuOpen(false)}>
              {city.name}
            </Link>
          ))}
          <div className="mobile-nav__rule" />
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link href="/#wechat" onClick={() => setMenuOpen(false)}>{copy.wechat}</Link>
        </nav>
      )}
    </header>
  );
}
