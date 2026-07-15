"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { GalleryItem } from "@/types/content";

export function GalleryGrid({ items, limit }: { items: GalleryItem[]; limit?: number }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const visible = useMemo(
    () => items.filter((item) => item.visible).sort((a, b) => a.sortOrder - b.sortOrder).slice(0, limit),
    [items, limit],
  );

  const close = useCallback(() => setActiveIndex(null), []);
  const move = useCallback((direction: number) => {
    setActiveIndex((current) => {
      if (current === null) return null;
      return (current + direction + visible.length) % visible.length;
    });
  }, [visible.length]);

  useEffect(() => {
    if (activeIndex === null) return;
    document.body.style.overflow = "hidden";
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") move(1);
      if (event.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [activeIndex, close, move]);

  return (
    <>
      <div className="gallery-grid">
        {visible.map((item, index) => (
          <motion.button
            key={item.id}
            type="button"
            className={`gallery-card gallery-card--${(index % 6) + 1}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.25) }}
            onClick={() => setActiveIndex(index)}
            aria-label={`放大查看 ${item.title}`}
          >
            <Image src={item.image} alt={item.title} fill sizes="(max-width: 760px) 92vw, 40vw" />
            <span className="gallery-card__overlay">
              <span>{item.event}</span>
              <strong>{item.title}</strong>
              <ZoomIn size={20} />
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {activeIndex !== null && visible[activeIndex] && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={visible[activeIndex].title}
          >
            <button className="lightbox__backdrop" onClick={close} aria-label="关闭图片" />
            <button className="lightbox__close" onClick={close} aria-label="关闭"><X /></button>
            <button className="lightbox__previous" onClick={() => move(-1)} aria-label="上一张"><ChevronLeft /></button>
            <div className="lightbox__image">
              <Image
                src={visible[activeIndex].image}
                alt={visible[activeIndex].title}
                fill
                sizes="92vw"
              />
            </div>
            <div className="lightbox__caption">
              <span>{String(activeIndex + 1).padStart(2, "0")} / {String(visible.length).padStart(2, "0")}</span>
              <strong>{visible[activeIndex].title}</strong>
            </div>
            <button className="lightbox__next" onClick={() => move(1)} aria-label="下一张"><ChevronRight /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
