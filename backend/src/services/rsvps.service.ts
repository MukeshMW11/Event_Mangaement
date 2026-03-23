import { RSVPStatus } from "../interfaces/rsvps.interfaces.js";
import { eventRepositories } from "../repositories/events.repository.js";
import { rsvpsRepositories } from "../repositories/rsvps.repository.js";
import AppError from "../utils/AppError.js";

const getRsvpsEvent = async (eventId: string) => {

    const event = await eventRepositories.eventDetails(eventId);
    if (!event) throw new AppError("Related Event not found", 404);
    const rsvp = await rsvpsRepositories.getRsvpEvent(eventId);
    return rsvp;

};


const rsvpsEvent = async (eventId: string, userId: string, status: RSVPStatus) => {
    const event = await eventRepositories.eventDetails(eventId);
    if (!event) throw new AppError("Related Event not found", 404);
    const rsvp = await rsvpsRepositories.rsvpsEvent({eventId, userId, status});
    return rsvp;

};


export const rsvpsServices = { getRsvpsEvent, rsvpsEvent };