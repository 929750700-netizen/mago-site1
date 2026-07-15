"use client";

import { useMemo, useState } from "react";
import type { EventItem, SiteCopy } from "@/types/content";
import { EventCard } from "./EventCard";

export function EventExplorer({ events, copy, cardCopy, dialogCopy, compact = false }: { events: EventItem[]; copy: SiteCopy["eventsPage"]; cardCopy: SiteCopy["eventCard"]; dialogCopy: SiteCopy["ticketDialog"]; compact?: boolean }) {
  const filters = [copy.filterAll, copy.filterUpcoming, copy.filterSoldOut, copy.filterPast];
  const [filter, setFilter] = useState(copy.filterAll);
  const [city, setCity] = useState(copy.allCities);

  const cities = [copy.allCities, ...Array.from(new Set(events.map((event) => event.city)))];
  const visibleEvents = useMemo(() => {
    return events
      .filter((event) => event.visible)
      .filter((event) => city === copy.allCities || event.city === city)
      .filter((event) => {
        if (filter === copy.filterUpcoming) return ["即将开售", "立即购票", "余票紧张"].includes(event.ticketStatus);
        if (filter === copy.filterSoldOut) return event.ticketStatus === "已售罄";
        if (filter === copy.filterPast) return event.ticketStatus === "活动结束";
        return true;
      })
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [city, copy, events, filter]);

  return (
    <div className="event-explorer">
      {!compact && (
        <div className="event-filters">
          <div className="filter-pills" aria-label="活动状态筛选">
            {filters.map((item) => (
              <button key={item} className={filter === item ? "is-active" : ""} onClick={() => setFilter(item)}>
                {item}
              </button>
            ))}
          </div>
          <label className="city-select">
            <span>{copy.cityLabel}</span>
            <select value={city} onChange={(event) => setCity(event.target.value)}>
              {cities.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        </div>
      )}
      {visibleEvents.length ? (
        <div className={`event-grid ${visibleEvents.length === 1 ? "event-grid--single" : ""}`}>
          {visibleEvents.map((event) => <EventCard key={event.id} event={event} cardCopy={cardCopy} dialogCopy={dialogCopy} />)}
        </div>
      ) : (
        <div className="empty-state">
          <span>{copy.emptyEyebrow}</span>
          <h3>{copy.emptyTitle}</h3>
          <p>{copy.emptyDescription}</p>
        </div>
      )}
    </div>
  );
}
