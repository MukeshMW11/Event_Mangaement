import type { EventType, filterType } from "../interfaces/EventInterfaces";
import axiosInstance from "../lib/axios";
import type { createEventSchemaType, editEventSchemaType } from "../validators/events.validators";

export const getEvents = async (filters: filterType) => {
  const res = await axiosInstance.get("/events", {
    params: filters
  });
  return res.data.data as { events: EventType[]; total_count: number };
};

export const getEventDetails = async (id: string) => {
  const res = await axiosInstance.get(`/events/${id}`);
  return res.data.data;
};

export const createEvent = async (data: createEventSchemaType) => {
  const payload = {
    ...data,
    tags: data.tags?.map(tag => tag.id) || []
  };
  const res = await axiosInstance.post("/events", payload);
  return res.data.data;
};

export const updateEvent = async (id: string, data: editEventSchemaType) => {
  const payload = {
    ...data,
    tags: data.tags?.map(tag => tag.id) || []
  };
  const res = await axiosInstance.patch(`/events/${id}`, payload);
  return res.data.data;
};

export const deleteEvent = async (id: string) => {
  await axiosInstance.delete(`/events/${id}`);
};