"use client";

import Image from "next/image";
import { ExternalLink, X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { EventItem, SiteCopy } from "@/types/content";

export function TicketDialog({ event, onClose, copy }: { event: EventItem; onClose: () => void; copy: SiteCopy["ticketDialog"] }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const handleKey = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <div className="ticket-dialog" role="dialog" aria-modal="true" aria-label={`${event.title} 购票`}>
      <button className="ticket-dialog__backdrop" onClick={onClose} aria-label="关闭购票弹窗" />
      <div className="ticket-dialog__panel">
        <button ref={closeRef} className="ticket-dialog__close" onClick={onClose} aria-label="关闭">
          <X />
        </button>
        <div className="ticket-dialog__poster">
          <Image
            src={event.posterImage}
            alt={`${event.title} 活动海报`}
            fill
            sizes="(max-width: 760px) 90vw, 480px"
          />
        </div>
        <div className="ticket-dialog__copy">
          <span>{copy.eyebrow}</span>
          <h2>{event.title}</h2>
          <p>{event.city} · {event.venue}</p>
          <strong>{copy.scanInstruction}</strong>
          {!event.miniProgramUrl && (
            <p className="ticket-dialog__notice">{copy.placeholderNotice}</p>
          )}
          {event.miniProgramUrl && (
            <a href={event.miniProgramUrl} className="button button--dark">
              {copy.openButton} <ExternalLink size={17} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
