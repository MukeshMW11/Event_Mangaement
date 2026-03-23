import { useEffect, useState } from "react";
import { TagSelect } from "./TagSelect";
import type { Tag } from "@/interfaces/tagInterfaces";

type EventTypeFilter = "public" | "private";

export function EventFilterBar({
  onChange,
  userOnlyTags = false,
  allowPrivate = true,
  showTags = true,
}: {
  onChange: (next: { tags?: string[]; eventType?: EventTypeFilter }) => void;
  userOnlyTags?: boolean;
  allowPrivate?: boolean;
  showTags?: boolean;
}) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [eventType, setEventType] = useState<"all" | EventTypeFilter>("all");

  useEffect(() => {
    onChange({
      tags: selectedTags.length ? selectedTags.map((t) => t.id) : undefined,
      eventType: eventType === "all" ? undefined : eventType,
    });
  }, [eventType, onChange, selectedTags]);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      {showTags && (
        <div className="w-full sm:w-64">
          <TagSelect value={selectedTags} onChange={setSelectedTags} userOnly={userOnlyTags} />
        </div>
      )}

      <select
        className="h-9 px-3 rounded-md border border-border bg-background text-sm w-full sm:w-auto"
        value={eventType}
        onChange={(e) => setEventType(e.target.value as any)}
      >
        <option value="all">All types</option>
        <option value="public">Public</option>
        {allowPrivate && <option value="private">Private</option>}
      </select>
    </div>
  );
}

