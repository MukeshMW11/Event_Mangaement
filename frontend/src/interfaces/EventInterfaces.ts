import type { Tag } from "./tagInterfaces";

export interface filterType {
  tags?: string[];
  eventType?: "public" | "private";
  dateFilter?: "upcoming" | "past";
  limit?: number;
  offset?: number;
  search?: string;
  createdBy?: string;
}




export interface EventType {
  id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  event_type: "public" | "private";
  created_by: string;
  tags: Tag[];
  rsvps?: { yes: number; maybe: number; no: number };
  user_rsvp?: "yes" | "maybe" | "no" | null;
  created_at?: string;
  updated_at?: string;
}