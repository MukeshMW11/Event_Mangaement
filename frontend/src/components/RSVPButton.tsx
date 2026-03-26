import { Button } from "@/components/ui/button";
import type { EventType } from "@/interfaces/EventInterfaces";
import { useRsvpEvent } from "@/hooks/useEvent";
import toast from "react-hot-toast";

interface RSVPButtonProps {
    eventId: string;
    currentRsvp: EventType["user_rsvp"];
}

type RSVPOption = "yes" | "maybe" | "no";

const rsvpOptions: { value: RSVPOption; label: string; color: string }[] = [
    { value: "yes", label: "✓ Going", color: "bg-green-500 hover:bg-green-600" },
    { value: "maybe", label: "? Maybe", color: "bg-yellow-500 hover:bg-yellow-600" },
    { value: "no", label: "✗ Not Going", color: "bg-red-500 hover:bg-red-600" },
];

export const RSVPButton = ({ eventId, currentRsvp }: RSVPButtonProps) => {
    const rsvpMutation = useRsvpEvent(eventId);

    const handleRsvp = async (status: RSVPOption) => {
        try {
            await rsvpMutation.mutateAsync(status);
            toast.success(`You have RSVP'd as ${status === "yes" ? "Going" : status === "maybe" ? "Maybe" : "Not Going"}`);
        } catch (error: any) {
            // toast.error(error?.response?.data?.message || "Failed to RSVP");
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                {rsvpOptions.map(({ value, label, color }) => (
                    <Button
                        key={value}
                        variant={currentRsvp === value ? "default" : "outline"}
                        onClick={() => handleRsvp(value)}
                        className={`flex-1 transition-colors ${
                            currentRsvp === value
                                ? `${color} text-white border-transparent`
                                : ""
                        }`}
                        disabled={rsvpMutation.isPending}
                    >
                        {rsvpMutation.isPending ? "..." : label}
                    </Button>
                ))}
            </div>
            {currentRsvp && (
                <p className="text-sm text-center text-green-600 font-medium">
                    ✓ You have selected: {currentRsvp === "yes" ? "Going" : currentRsvp === "maybe" ? "Maybe" : "Not Going"}
                </p>
            )}
        </div>
    );
};