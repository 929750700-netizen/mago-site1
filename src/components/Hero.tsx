"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, Ticket } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import type { SiteCopy, SiteSettings } from "@/types/content";

const slides = [
  "/media/optimized/hero-rooftop.webp",
  "/media/optimized/dj-sunset.webp",
  "/media/optimized/rooftop-dance.webp",
];

export function Hero({ settings, copy }: { settings: SiteSettings; copy: SiteCopy["home"] }) {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (settings.heroVideo || reduceMotion) return;
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % slides.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [reduceMotion, settings.heroVideo]);

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__media" aria-hidden="true">
        {settings.heroVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={settings.heroPoster}
            className="hero__video"
          >
            <source src={settings.heroVideo} />
          </video>
        ) : (
          <AnimatePresence mode="sync">
            <motion.div
              key={slides[active]}
              initial={{ opacity: 0, scale: 1.035 }}
              animate={{ opacity: 1, scale: reduceMotion ? 1 : 1.09 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 1 }, scale: { duration: 6, ease: "linear" } }}
              className="hero__image"
            >
              <Image src={slides[active]} alt="" fill priority={active === 0} sizes="100vw" />
            </motion.div>
          </AnimatePresence>
        )}
      </div>
      <div className="hero__veil" />
      <div className="hero__content page-width">
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="hero__eyebrow"
        >
          {settings.heroEyebrow}
        </motion.p>
        <motion.h1
          id="hero-title"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.75 }}
        >
          <span>{settings.heroTitle}</span>
          <span>SUNSET</span>
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.65 }}
          className="hero__copy"
        >
          <p>{settings.heroSubtitle}</p>
          <strong>{settings.heroDescription}</strong>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="hero__actions"
        >
          <Link href="#events" className="button button--light">
            {copy.heroEventsButton} <ArrowDownRight size={18} />
          </Link>
          <Link href="#events" className="button button--outline-light">
            {copy.heroTicketButton} <Ticket size={18} />
          </Link>
        </motion.div>
      </div>
      <div className="hero__index" aria-hidden="true">
        <span>01</span>
        <i />
        <span>03</span>
      </div>
    </section>
  );
}
