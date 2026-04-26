import { Response, NextFunction } from "express"
import { eventServices } from "../services/events.service.js";
import { AuthRequest, filterType } from "../interfaces/event.interfaces.js";
import AppError from "../utils/AppError.js";
const createEvent = async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) throw new AppError("Unauthorized", 401);

    try {
        const userId = req.user!.userId;
        const event = await eventServices.createEvent(req.body, userId);
        req.log.info({ event: event.id }, "Event created successfully");
        return res.status(201).json({ message: "Event created successfully", data: event });
    } catch (error) {
        next(error);
    }
}

const getEvents = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const filter = req.query as unknown as filterType & { "tags[]": unknown };
    const rawTags =
        (req.query as any).tags ??
        (req.query as any)["tags[]"];

    if (rawTags) {
        const tagsArray = Array.isArray(rawTags) ? rawTags : [rawTags];
        filter.tags = tagsArray
            .map((tag) => String(tag))
            .filter((tag) => tag.length > 0);
    }

    if (filter.limit) filter.limit = Number(filter.limit);
    if (filter.offset) filter.offset = Number(filter.offset);
    const userId = req.user?.userId;
    try {
        const events = await eventServices.getEvents(filter, userId);
        req.log.info({ events: events.total_count }, "Events fetched successfully");
        return res.status(200).json({ message: "Events fetched successfully", data: events });

    } catch (error) {
        next(error);
    }
}




const eventDetails = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user!.userId;
    try {
        const eventId = req.params.eventId as string;
        const event = await eventServices.eventDetails(eventId, userId);
        req.log.info({ event: event.id }, "Event fetched successfully");
        return res.status(200).json({ message: "Event fetched successfully", data: event });
    } catch (error) {
        next(error);
    }

}

const updateEvent = async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const userId = req.user!.userId;
    try {
        const eventId = req.params.eventId as string;
        const event = await eventServices.updateEvent(eventId, req.body, userId);
        req.log.info({ event: event.id }, "Event updated successfully");
        return res.status(200).json({ message: "Event updated successfully", data: event });

    } catch (error) {
        next(error);
    }

}

const deleteEvent = async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const userId = req.user!.userId;

    try {
        const eventId = req.params.eventId as string;
        const event = await eventServices.deleteEvent(eventId, userId);
        req.log.info({ event: event.id }, "Event deleted successfully");
        return res.status(204).send();

    } catch (error) {
        next(error);
    }

}

export const eventsConrtollers = { getEvents, createEvent, eventDetails, updateEvent, deleteEvent };