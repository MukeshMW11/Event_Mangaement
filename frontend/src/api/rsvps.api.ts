import axiosInstance from "../lib/axios";

export const rsvpToEvent = async (eventId: string, status: "yes" | "maybe" | "no") => {
  const res = await axiosInstance.post(`/rsvps/${eventId}`, { status });
  return res.data;
};

export const getEventRsvps = async (eventId: string) => {
  const res = await axiosInstance.get(`/rsvps/${eventId}`);
  return res.data.data;
};