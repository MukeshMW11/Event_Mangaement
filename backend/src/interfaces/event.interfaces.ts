import { Request } from "express";

interface filterType{
    tags?: string[],
    eventType?:"public"  | "private",
    createdBy?: string,
    dateFilter?:"upcoming" | "past",
    limit?:number,
    offset?:number
};


 interface AuthRequest extends Request {
    user?: { userId: string };
}

export type {filterType,AuthRequest};