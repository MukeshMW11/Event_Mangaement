export type RSVPStatus = "yes" | "no" | "maybe";

interface RSVPInsert {
    eventId: string;
    userId: string;
    status: RSVPStatus;
}

export type { RSVPInsert };