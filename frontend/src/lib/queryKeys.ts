import type { filterType } from "../interfaces/EventInterfaces";

export const queryKeys = {
  tagsAll: () => ["tags"] as const,
  eventsAll: () => ["events"] as const,
  tags: (search?: string, userOnly?: boolean, limit?: number) => ["tags", search, userOnly, limit] as const,
  events: (filters: filterType) => ["events", filters] as const,
  event: (id: string) => ["event", id] as const,
};