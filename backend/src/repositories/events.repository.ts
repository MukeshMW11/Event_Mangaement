import db from "../db/knex.js";
import { filterType } from "../interfaces/event.interfaces.js";
import { RSVPStatus } from "../interfaces/rsvps.interfaces.js";
import { createEventSchemaType, editEventSchemaType } from "../validators/events.validators.js";
import { rsvpsRepositories } from "./rsvps.repository.js";
import AppError from "../utils/AppError.js";
type RSVPCountRow = {
    status: RSVPStatus;
    count: string;
};
const createEvent = async (eventData: createEventSchemaType, userId: string) => {
    const { tags, ...eventPayload } = eventData;
    const eventFieldData = { created_by: userId, ...eventPayload };

    // Check for duplicate event
    const existingEvent = await db("events").where({
        title: eventPayload.title,
        description: eventPayload.description,
        event_date: eventPayload.event_date,
        location: eventPayload.location,
        created_by: userId
    }).first();

    if (existingEvent) {
        throw new AppError("An event with the same details already exists", 409);
    }

    return await db.transaction(async (table) => {
        const [event] = await table("events").insert(eventFieldData).returning("*");

        if (tags && tags.length > 0) {
            const eventTags = tags.map((tagId) => ({
                tag_id: tagId,
                event_id: event.id
            }));

            await table("event_tags").insert(eventTags);
        }
        return event;
    })
};

const getEvents = async (filter?: filterType, userId?: string) => {
    const query = db("events").leftJoin("event_tags", "events.id", "event_tags.event_id").leftJoin("tags", "event_tags.tag_id", "tags.id");

    if (filter?.createdBy) {
        query.where("events.created_by", filter.createdBy);
    } else if (userId) {
        query.where((qb) => {
            qb.where("events.event_type", "public").orWhere("events.created_by", userId);
        })
    } else {
        query.where("events.event_type", "public");
    }

    if (filter?.tags && filter.tags.length > 0) {
        query.whereIn("event_tags.tag_id", filter.tags);
    }

    
    const canFilterByType = Boolean(filter?.createdBy || userId);
    if (filter?.eventType && canFilterByType) {
        query.where("events.event_type", filter.eventType);
    }

    if (filter?.dateFilter === "upcoming") {
        query.where("event_date", ">", new Date());
    }

    if (filter?.dateFilter === "past") {
        query.where("event_date", "<", new Date());
    }
    const totalResult = await query.clone().countDistinct("events.id as total");
    const total_count = Number(totalResult[0].total);
    if (filter?.limit) {
        query.limit(Number(filter.limit));
    }

    if (filter?.offset) {
        query.offset(Number(filter.offset));
    }

    if (filter?.dateFilter === "past") query.orderBy("event_date", "desc");
    else query.orderBy("created_at", "desc");

    const events = await query.select("events.*", db.raw(`COALESCE(json_agg(tags.*) FILTER (WHERE tags.id IS NOT NULL), '[]')as tags`)).groupBy("events.id");
    return { events, total_count };
};

const eventDetails = async (eventId: string, userId?: string) => {
    const event = await db("events")
        .leftJoin("event_tags", "events.id", "event_tags.event_id")
        .leftJoin("tags", "event_tags.tag_id", "tags.id")
        .where({ "events.id": eventId })
        .select(
            "events.*",
            db.raw(`
                COALESCE(
                    json_agg(tags.*) FILTER (WHERE tags.id IS NOT NULL),
                    '[]'
                ) as tags
            `)
        )
        .groupBy("events.id")
        .first();

    if (!event) return null;

    const rsvpsCounts = await rsvpsRepositories.getRsvpEvent(eventId) as RSVPCountRow[];

    const rsvps = { yes: 0, maybe: 0, no: 0 };

    rsvpsCounts.forEach((r: RSVPCountRow) => {
        rsvps[r.status] = Number(r.count);
    });

    let user_rsvp = null;

    if (userId) {
        const userRsvp = await rsvpsRepositories.getUserRsvp(eventId, userId);
        if (userRsvp) user_rsvp = userRsvp.status;
    }

    return {
        ...event,
        rsvps,
        user_rsvp
    };
};

const updateEvent = async (eventId: string, eventData: editEventSchemaType) => {
    const { tags, ...eventPayload } = eventData;
    return await db.transaction(async (table) => {
        const [event] = await table("events").where({ id: eventId }).update({ ...eventPayload, updated_at: new Date() }).returning("*");
        if (!event) return;
        if (tags) {
            await table("event_tags").where({ event_id: eventId }).del();
            if (tags.length > 0) {
                const eventTags = tags.map((tagId) => ({
                    tag_id: tagId,
                    event_id: eventId
                }));


                await table("event_tags").insert(eventTags);
            }

        }
        return event;
    });
};



const deleteEvent = async (eventId: string) => {
    const [event] = await db("events").where({ id: eventId }).del().returning("*");
    return event;
};

export const eventRepositories = { createEvent, getEvents, eventDetails, updateEvent, deleteEvent };