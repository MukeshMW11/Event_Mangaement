import { useState } from "react";
import {
    SidebarProvider,
    SidebarTrigger,
    SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { EventModal } from "@/components/EventModal";
import { EventList } from "@/components/EventList";
import { EventPagination } from "@/components/Pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCreateEvent, useEvents } from "@/hooks/useEvent";
import { useAuth } from "@/hooks/useAuth";
import type { filterType } from "@/interfaces/EventInterfaces";
import type { createEventSchemaType } from "@/validators/events.validators";
import { EventFilterBar } from "@/components/EventFilterBar";
import toast from "react-hot-toast";

const LIMIT = 12;

const DashboardPage = () => {
    const { user } = useAuth();

    const [filters, setFilters] = useState<filterType>({
        limit: LIMIT,
        offset: 0,
        createdBy: user?.id,
    });

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data, isLoading, error } = useEvents(filters);
    const events = data?.events ?? [];
    const totalCount = data?.total_count ?? 0;
    const totalPages = Math.ceil(totalCount / LIMIT);
    const currentPage = Math.floor((filters.offset ?? 0) / LIMIT) + 1;

    const { mutate: createEvent } = useCreateEvent();

    const handleCreate = (values: createEventSchemaType) => {
        createEvent(values, {
            onSuccess: () => {
                toast.success("Event created successfully!");
                setIsCreateModalOpen(false);
            },
            onError: (error: any) => {
                toast.error(error?.response?.data?.message || "Failed to create event");
            }
        });
    };;

    const handleFiltersChange = (next: { tags?: string[]; eventType?: "public" | "private" }) => {
        setFilters((prev) => ({
            ...prev,
            tags: next.tags,
            eventType: next.eventType,
            offset: 0,
        }));
    };

    const handlePageChange = (page: number) => {
        setFilters((prev) => ({ ...prev, offset: (page - 1) * LIMIT }));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <SidebarProvider>
            <AppSidebar activeItem="my-events" />

            <SidebarInset>
                <header className="sticky top-0 z-10 border-b border-border bg-background px-4 md:px-6 py-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <SidebarTrigger className="-ml-1" />
                            <h1 className="text-sm font-semibold">My Events</h1>
                            {totalCount > 0 && (
                                <Badge variant="secondary" className="text-xs tabular-nums">
                                    {totalCount}
                                </Badge>
                            )}
                        </div>

                        <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center">
                            <div className="w-full sm:w-auto">
                                <EventFilterBar onChange={handleFiltersChange} userOnlyTags />
                            </div>
                            <Button className="w-full sm:w-auto" onClick={() => setIsCreateModalOpen(true)}>
                                Create Event
                            </Button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-4 md:p-6">
                    {isLoading ? (
                        <div className="min-h-[60vh] flex items-center justify-start">
                            <p className="text-sm text-muted-foreground animate-pulse">
                                Loading your events...
                            </p>
                        </div>
                    ) : error ? (
                        <div className="min-h-[60vh] flex items-center justify-center">
                            <p className="text-sm text-destructive">
                                Failed to load events.
                            </p>
                        </div>
                    ) : (
                        <>
                            <EventList
                                events={events}
                                emptyMessage="You haven't created any events yet."
                            />
                            <EventPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </>
                    )}
                </main>

                <EventModal
                    onSubmit={handleCreate}
                    isOpen={isCreateModalOpen}
                    onOpenChange={setIsCreateModalOpen}
                />
            </SidebarInset>
        </SidebarProvider>
    );
};

export default DashboardPage;