import { Response, NextFunction } from "express";
import { rsvpsServices } from "../services/rsvps.service.js";
import { AuthRequest } from "../interfaces/event.interfaces.js";
import { eventServices } from "../services/events.service.js";

const getRsvpsEvent = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const eventId = req.params.eventId as string;
        const rsvp = await rsvpsServices.getRsvpsEvent(eventId);
        req.log.info({ rsvp }, "Fetched rsvp for an event successfully");
        return res.status(200).json({ message: "Successfully fetch rsvp to an event", data: rsvp });
    }
    catch (error) {
        next(error);
    }

};



const rsvpsEvent = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const eventId = req.params.eventId as string;
    const userId = req.user!.userId;
    const status = req.body.status;
    try {
        const rsvp = await rsvpsServices.rsvpsEvent(eventId, userId, status);
        req.log.info({ rsvp }, "User successfully responded  to an event");
        return res.status(201).json({ message: "user successfully responded  to an event" });
    }
    catch (error) {
        next(error);
    }

};


export const rsvpsController = { getRsvpsEvent, rsvpsEvent }