import { useParams, useNavigate } from "react-router-dom";
import { useEventDetails, useUpdateEvent, useDeleteEvent } from "@/hooks/useEvent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, MapPin, Tag, ArrowLeft, Edit, Trash2, Clock3 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { RSVPButton } from "@/components/RSVPButton";
import { EventModal } from "@/components/EventModal";
import { ConfirmAlert } from "@/components/ConfirmAlert";
import { useState } from "react";
import toast from "react-hot-toast";
import type { createEventSchemaType } from "@/validators/events.validators";

const EventDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const { data: event, isLoading, error } = useEventDetails(id!);
    const updateEventMutation = useUpdateEvent(id!);
    const deleteEventMutation = useDeleteEvent();

    const isOwner = event && user && event.created_by === user.id;

    const handleEdit = async (values: createEventSchemaType) => {
        try {
            await updateEventMutation.mutateAsync(values);
            toast.success("Event updated successfully!");
            setIsEditModalOpen(false);
        } catch (error) {
            toast.error("Failed to update event");
        }
    };

    const handleDelete = async () => {
        try {
            await deleteEventMutation.mutateAsync(id!);
            toast.success("Event deleted successfully!");
            navigate("/");
        } catch (error) {
            toast.error("Failed to delete event");
        }
    };

    if (isLoading) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-10">
                <Card className="w-full">
                    <CardContent className="py-16 text-center text-muted-foreground">
                        Loading event details...
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-10">
                <Card className="w-full">
                    <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
                        <p className="text-base text-muted-foreground">Event not found.</p>
                        <Button variant="outline" onClick={() => navigate(-1)}>
                            Go Back
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const formattedDate = new Date(event.event_date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    const formattedTime = new Date(event.event_date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
    });

    const formattedCreatedAt = event.created_at
        ? new Date(event.created_at).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        })
        : "—";

    const formattedUpdatedAt = event.updated_at
        ? new Date(event.updated_at).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        })
        : "—";

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-8 space-y-5">
            <div className="flex items-center justify-between gap-4">
                <Button variant="ghost" onClick={() => navigate(-1)} className="-ml-2 gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>
                <div className="flex items-center gap-2">
                    <Badge
                        variant={event.event_type === "public" ? "default" : "secondary"}
                        className="capitalize"
                    >
                        {event.event_type}
                    </Badge>
                    {isOwner && (
                        <div className=" items-center gap-2 flex justify-center">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsEditModalOpen(true)}
                                className="gap-1.5 flex "
                            >
                                <Edit className="w-3.5 h-3.5" />
                                Edit
                            </Button>
                            <ConfirmAlert
                                title="Delete event?"
                                description="This action cannot be undone. This will permanently delete the event."
                                confirmText="Delete"
                                cancelText="Cancel"
                                confirmVariant="destructive"
                                onConfirm={handleDelete}
                                disabled={deleteEventMutation.isPending}
                                trigger={
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1.5 text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Delete
                                    </Button>
                                }
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="grid w-full gap-3 sm:grid-cols-3">
                <Card className="w-full">
                    <CardContent className="p-4">
                        <p className="text-xs font-medium text-muted-foreground">Going</p>
                        <p className="mt-1 text-2xl font-semibold text-green-600">
                            {event.rsvps?.yes ?? 0}
                        </p>
                    </CardContent>
                </Card>
                <Card className="w-full">
                    <CardContent className="p-4">
                        <p className="text-xs font-medium text-muted-foreground">Maybe</p>
                        <p className="mt-1 text-2xl font-semibold text-amber-600">
                            {event.rsvps?.maybe ?? 0}
                        </p>
                    </CardContent>
                </Card>
                <Card className="w-full">
                    <CardContent className="p-4">
                        <p className="text-xs font-medium text-muted-foreground">Not Going</p>
                        <p className="mt-1 text-2xl font-semibold text-red-600">
                            {event.rsvps?.no ?? 0}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card className="w-full shadow-sm">
                <CardHeader className="space-y-2">
                    <CardTitle className="text-lg">Event Details</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Key information about this event.
                    </p>
                </CardHeader>
                <CardContent className="space-y-5">
                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-md border bg-muted/20 p-3">
                            <p className="text-xs font-medium text-muted-foreground">Title</p>
                            <p className="mt-1 font-medium">{event.title}</p>
                        </div>
                        <div className="rounded-md border bg-muted/20 p-3">
                            <p className="text-xs font-medium text-muted-foreground">Event Type</p>
                            <p className="mt-1 font-medium capitalize">{event.event_type}</p>
                        </div>

                        <div className="rounded-md border bg-muted/20 p-3">
                            <p className="text-xs font-medium text-muted-foreground">Date</p>
                            <div className="mt-1 flex items-center gap-2 text-sm">
                                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{formattedDate}</span>
                            </div>
                        </div>
                        <div className="rounded-md border bg-muted/20 p-3">
                            <p className="text-xs font-medium text-muted-foreground">Time</p>
                            <div className="mt-1 flex items-center gap-2 text-sm">
                                <Clock3 className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{formattedTime}</span>
                            </div>
                        </div>

                        <div className="rounded-md border bg-muted/20 p-3 md:col-span-2">
                            <p className="text-xs font-medium text-muted-foreground">Location</p>
                            <div className="mt-1 flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{event.location}</span>
                            </div>
                        </div>

                        <div className="rounded-md border bg-muted/20 p-3">
                            <p className="text-xs font-medium text-muted-foreground">Created By</p>
                            <p className="mt-1 font-medium">{event.created_by}</p>
                        </div>
                        <div className="rounded-md border bg-muted/20 p-3">
                            <p className="text-xs font-medium text-muted-foreground">Created At</p>
                            <p className="mt-1 font-medium">{formattedCreatedAt}</p>
                        </div>

                        <div className="rounded-md border bg-muted/20 p-3 md:col-span-2">
                            <p className="text-xs font-medium text-muted-foreground">Updated At</p>
                            <p className="mt-1 font-medium">{formattedUpdatedAt}</p>
                        </div>
                    </div>

                    {(event.tags?.length ?? 0) > 0 && (
                        <>
                            <Separator />
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                    <Tag className="h-4 w-4" />
                                    <span>Tags</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {event.tags.map((tag: { id: string; name: string }) => (
                                        <Badge key={tag.id} variant="outline" className="rounded-md">
                                            {tag.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    <Separator />

                    <div className="space-y-2">
                        <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                            Description
                        </h2>
                        <p className="text-[15px] leading-7 text-foreground/95 whitespace-pre-wrap">
                            {event.description}
                        </p>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
                    {isAuthenticated ? (
                        <RSVPButton eventId={id!} currentRsvp={event.user_rsvp ?? null} />
                    ) : (
                        <Button onClick={() => navigate("/login")} className="w-full sm:w-auto">
                            Login to RSVP
                        </Button>
                    )}
                </CardFooter>
            </Card>

            {isEditModalOpen && (
                <EventModal
                    defaultValues={event}
                    onSubmit={handleEdit}
                    isOpen={isEditModalOpen}
                    onOpenChange={setIsEditModalOpen}
                />
            )}
        </div>
    );
};

export default EventDetailsPage;