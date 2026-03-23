import db from "../db/knex.js";
import { RSVPInsert, RSVPStatus } from "../interfaces/rsvps.interfaces.js";


const getRsvpEvent = async (eventId: string) => {
    const rsvp = await db("rsvps").where({ event_id: eventId }).select("status").count("* as count").groupBy("status");
    return rsvp;
};

const rsvpsEvent = async ({ eventId, userId, status }: RSVPInsert) => {
    const rsvp = await db("rsvps").where({ user_id: userId, event_id: eventId }).first();
    if (rsvp) {
        const [updated] = await db("rsvps").where({ id: rsvp.id }).update({ status, updated_at: new Date() }).returning("*");
        return updated;
    }
    else {
        const [newRsvp] = await db("rsvps").insert({ user_id: userId, event_id: eventId, status }).returning("*");
        return newRsvp;
    }

};


const getUserRsvp = async (eventId: string, userId: string) => {
    return await db("rsvps")
        .where({ event_id: eventId, user_id: userId })
        .first();
};

export const rsvpsRepositories = { getRsvpEvent, rsvpsEvent, getUserRsvp };