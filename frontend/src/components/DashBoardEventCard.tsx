import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CalendarDays, MapPin, Pencil, Trash2 } from "lucide-react";
import type { EventType } from "@/interfaces/EventInterfaces";
import { Badge } from "./ui/badge";


interface DashboardEventCardProps {
    event: EventType;
    onEdit: () => void;
    onDelete: () => void;
}

const DashboardEventCard = ({ event, onEdit, onDelete }: DashboardEventCardProps) => {
    const navigate = useNavigate();

    const formattedDate = new Date(event.event_date).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric"
    });

    return (
        <Card className="flex flex-col justify-between border border-border bg-background hover:shadow-sm transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm font-semibold leading-snug line-clamp-2">
                        {event.title}
                    </CardTitle>
                    <Badge
                        variant={event.event_type === "public" ? "default" : "secondary"}
                        className="shrink-0 capitalize text-xs"
                    >
                        {event.event_type}
                    </Badge>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                    <CalendarDays className="w-3 h-3 shrink-0" />
                    <span>{formattedDate}</span>
                </div>
            </CardHeader>

            <CardContent className="pb-3 space-y-2">
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {event.description}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{event.location}</span>
                </div>
                {event.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-0.5">
                        {event.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag.id} variant="outline" className="text-xs px-1.5 py-0 h-5 font-normal">
                                {tag.name}
                            </Badge>
                        ))}
                        {event.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs px-1.5 py-0 h-5 font-normal">
                                +{event.tags.length - 3}
                            </Badge>
                        )}
                    </div>
                )}
            </CardContent>

            <CardFooter className="pt-0 gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs h-8"
                    onClick={() => navigate(`/events/${event.id}`)}
                >
                    View
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={onEdit}
                >
                    <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                    onClick={onDelete}
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </Button>
            </CardFooter>
        </Card>
    );
};

export default DashboardEventCard;