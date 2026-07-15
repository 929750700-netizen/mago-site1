"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import type { GuideItem } from "@/types/content";

export function GuideAccordion({ guides }: { guides: GuideItem[] }) {
  const [openId, setOpenId] = useState<string | null>(guides[0]?.id ?? null);
  const visible = guides.filter((guide) => guide.visible).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="guide-accordion">
      {visible.map((guide, index) => {
        const open = openId === guide.id;
        return (
          <article key={guide.id} className={`guide-item ${open ? "is-open" : ""}`}>
            <button type="button" onClick={() => setOpenId(open ? null : guide.id)} aria-expanded={open}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{guide.question}</strong>
              {open ? <Minus /> : <Plus />}
            </button>
            {open && <p>{guide.answer}</p>}
          </article>
        );
      })}
    </div>
  );
}
