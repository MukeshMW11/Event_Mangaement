import { filterType } from "../interfaces/event.interfaces.js";
import { eventRepositories } from "../repositories/events.repository.js";
import AppError from "../utils/AppError.js";
import { createEventSchemaType, editEventSchemaType } from "../validators/events.validators.js";


const createEvent = async (eventData: createEventSchemaType, userId: string) => {
    const event = await eventRepositories.createEvent(eventData, userId);
    if (!event) throw new AppError("Couldn't create an event", 500);
    return event;
};

const getEvents = async (filter: filterType, userId?: string) => {
    const events = await eventRepositories.getEvents(filter, userId);
    return events;
};

const eventDetails = async (eventId: string, userId?: string) => {
    const event = await eventRepositories.eventDetails(eventId, userId);
    if (!event) throw new AppError("Event not found", 404);
    if (event.event_type === "private" && event.created_by !== userId) {
        throw new AppError("You are not authorized to view this event", 403);
    }
    return event;
};


const updateEvent = async (eventId: string, eventData: editEventSchemaType, userId: string) => {
    const eventCheck = await eventRepositories.eventDetails(eventId);
    if (!eventCheck) throw new AppError("Event not found", 404);

    if (eventCheck.created_by !== userId) {
        throw new AppError("You are not authorized to update this event", 403);
    }

    
    const eventDate = eventCheck.event_date;
    const currentDateTime = Date.now();
    if (currentDateTime > eventDate) throw new AppError("Cannot edit the past event", 400);

    
    const event = await eventRepositories.updateEvent(eventId, eventData);
    if (!event) throw new AppError("Event cannot be updated", 404);
    return event;
};


const deleteEvent = async (eventId: string, userId: string) => {
    const checkEvent = await eventRepositories.eventDetails(eventId);
    if (!checkEvent) throw new AppError("Event not found", 404);

    if (checkEvent.created_by !== userId) {
        throw new AppError("You are not authorized to delete this event", 403);
    }

    const event = await eventRepositories.deleteEvent(eventId);
    if (!event) throw new AppError("Event cannnot be deleted", 404);
    return event;
};

export const eventServices = { createEvent, getEvents, eventDetails, updateEvent, deleteEvent }