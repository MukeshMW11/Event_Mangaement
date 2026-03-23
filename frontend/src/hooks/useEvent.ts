import { useMutation, useQueryClient, useQuery, keepPreviousData  } from "@tanstack/react-query";
import { createEvent, deleteEvent, updateEvent } from "../api/event.api";
import type { editEventSchemaType } from "../validators/events.validators";
import { queryKeys } from "../lib/queryKeys";
import { getEventDetails, getEvents } from "../api/event.api";
import type { EventType, filterType } from "../interfaces/EventInterfaces";
import { rsvpToEvent } from "../api/rsvps.api";

export const useEvents = (filters: filterType) => {
  return useQuery<{ events: EventType[]; total_count: number }, Error>({
    queryKey: queryKeys.events(filters),
    queryFn: () => getEvents(filters),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2
  });
};



export const useEventDetails = (id: string) => {
  return useQuery({
    queryKey: queryKeys.event(id),
    queryFn: () => getEventDetails(id),
    enabled: !!id
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.eventsAll() });
    },
    onError: (error) => {
      console.error("Create event error:", error);
    }
  });
};

export const useUpdateEvent = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: editEventSchemaType) => updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.eventsAll() });
      queryClient.invalidateQueries({ queryKey: queryKeys.event(id) });
    }
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.eventsAll() });
      queryClient.removeQueries({ queryKey: queryKeys.event(id) });
    }
  });
};

export const useRsvpEvent = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: "yes" | "maybe" | "no") => rsvpToEvent(eventId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.event(eventId) });
    }
  });
};

