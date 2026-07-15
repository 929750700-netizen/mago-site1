"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import type { EventItem, SiteCopy } from "@/types/content";
import { TicketDialog } from "./TicketDialog";

const activeStatuses = new Set(["立即购票", "余票紧张"]);

export function EventCard({ event, cardCopy, dialogCopy }: { event: EventItem; cardCopy: SiteCopy["eventCard"]; dialogCopy: SiteCopy["ticketDialog"] }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const canBuy = activeStatuses.has(event.ticketStatus);
  const isPast = event.ticketStatus === "活动结束";

  const handleOpen = () => {
    if (canBuy && window.matchMedia("(max-width: 767px)").matches && event.miniProgramUrl) {
      window.location.assign(event.miniProgramUrl);
      return;
    }
    setDialogOpen(true);
  };

  return (
    <>
      <article className="event-card">
        <button type="button" onClick={handleOpen} className="event-card__visual" aria-label={`查看 ${event.title}`}>
          <Image
            src={event.posterImage}
            alt={`${event.title} 活动海报`}
            fill
            sizes="(max-width: 760px) 92vw, (max-width: 1200px) 44vw, 31vw"
          />
          <span className={`event-status event-status--${event.ticketStatus}`}>{event.ticketStatus}</span>
          <span className="event-card__shade" />
          <span className="event-card__date">
            <b>{event.weekday}</b>
            <b>{event.month}</b>
            <strong>{event.day}</strong>
          </span>
          <span className="event-card__meta">
            <strong>{event.title}</strong>
            <span>{event.venue}</span>
          </span>
          <span className="event-card__arrow"><ArrowUpRight /></span>
        </button>
        <div className="event-card__mobile-meta">
          <span>{event.displayDate}</span>
          <strong>{event.city} · {event.venue}</strong>
          <span>{isPast ? cardCopy.pastHint : cardCopy.buyHint}</span>
        </div>
      </article>
      {dialogOpen && <TicketDialog event={event} copy={dialogCopy} onClose={() => setDialogOpen(false)} />}
    </>
  );
}
