
import type { EventType } from "@/interfaces/EventInterfaces";
import { EventCard } from "./EventCard";
import { CalendarX } from "lucide-react";

interface EventListProps {
  events: EventType[];
  dateFilter?: "upcoming" | "past";
  search?: string;
  emptyMessage?: string;
}

export const EventList = ({
  events,
  dateFilter = "upcoming",
  search,
  emptyMessage,
}: EventListProps) => {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center px-4 w-full">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-muted">
          <CalendarX className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="space-y-1.5 max-w-xs">
          <p className="text-sm font-medium text-foreground">
            {emptyMessage ??
              (search
                ? `No results for "${search}"`
                : `No ${dateFilter} events`)}
          </p>
          {!emptyMessage && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              {search
                ? "Try a different search term or clear the filter."
                : dateFilter === "upcoming"
                ? "Check back later — new events will appear here."
                : "No past events to show yet."}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};