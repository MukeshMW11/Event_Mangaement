import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { EventType } from "@/interfaces/EventInterfaces";
import { useNavigate } from "react-router-dom";
import { CalendarDays, MapPin, Globe, Lock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: EventType;
}

export const EventCard = ({ event }: EventCardProps) => {
  const navigate = useNavigate();

  const formattedDate = new Date(event.event_date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const isPublic = event.event_type === "public";

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-xl overflow-hidden",
        "bg-zinc-950 border border-zinc-800",
        "transition-all duration-200 hover:border-zinc-600 hover:shadow-lg hover:shadow-black/30"
      )}
    >
      <div
        className={cn(
          "h-1 w-full shrink-0",
          isPublic ? "bg-emerald-500" : "bg-amber-500"
        )}
      />

      <div className="flex flex-col flex-1 p-5 gap-3.5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold leading-snug tracking-tight line-clamp-2 text-zinc-50 flex-1 text-left">
            {event.title}
          </h3>
          <Badge
            variant="outline"
            className={cn(
              "shrink-0 gap-1.5 text-xs px-2.5 py-0.5 font-medium capitalize rounded-full",
              isPublic
                ? "border-emerald-700 bg-emerald-950 text-emerald-400"
                : "border-amber-700 bg-amber-950 text-amber-400"
            )}
          >
            {isPublic ? (
              <Globe className="h-3 w-3" />
            ) : (
              <Lock className="h-3 w-3" />
            )}
            {event.event_type}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <CalendarDays className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
          <span className="font-medium">{formattedDate}</span>
        </div>

        {event.description && (
          <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 text-left">
            {event.description}
          </p>
        )}

        {event.location && (
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
            <span className="truncate">{event.location}</span>
          </div>
        )}

        {event.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {event.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-0.5 text-xs text-zinc-300 font-medium"
              >
                {tag.name}
              </span>
            ))}
            {event.tags.length > 3 && (
              <span className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-0.5 text-xs text-zinc-300 font-medium">
                +{event.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      <div className="h-px bg-zinc-800 mx-5" />

      <div className="px-5 py-4">
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "w-full h-9 text-xs font-medium gap-1.5",
            "bg-transparent border-zinc-700 text-zinc-200",
            "hover:bg-zinc-800 hover:text-white hover:border-zinc-600",
            "transition-all duration-200"
          )}
          onClick={() => navigate(`/events/${event.id}`)}
        >
          View Details
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Button>
      </div>
    </div>
  );
};