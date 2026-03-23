import { EventList } from "@/components/EventList";
import { EventTabs } from "@/components/EventTabs";
import { EventPagination } from "@/components/Pagination";
import { useEvents } from "@/hooks/useEvent";
import { useAuth } from "@/hooks/useAuth";
import type { filterType } from "@/interfaces/EventInterfaces";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogIn } from "lucide-react";
import { EventFilterBar } from "@/components/EventFilterBar";

const LIMIT = 12;

const EventsPage = () => {
    const [filters, setFilters] = useState<filterType>({
        dateFilter: "upcoming",
        limit: LIMIT,
        offset: 0,
    });

    const { data, isLoading, error } = useEvents(filters);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const events = data?.events ?? [];
    const totalCount = data?.total_count ?? 0;
    const totalPages = Math.ceil(totalCount / LIMIT);
    const currentPage = Math.floor((filters.offset ?? 0) / LIMIT) + 1;

    const handleTabChange = (tab: "upcoming" | "past") => {
        setFilters((prev) => ({ ...prev, dateFilter: tab, offset: 0 }));
    };

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

    if (error) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-muted-foreground text-sm">Failed to load events. Please try again.</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
    <h1 className="text-3xl font-bold tracking-tight shrink-0">Events</h1>

        <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center">
        <div className="w-full sm:w-auto">
          <EventFilterBar onChange={handleFiltersChange} allowPrivate={false} showTags={isAuthenticated} />
        </div>
        <Button
            variant={isAuthenticated ? "outline" : "default"}
            className="h-9 w-full sm:w-auto justify-center shrink-0 gap-1.5 whitespace-nowrap"
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/login")}
        >
            {isAuthenticated
                ? <><LayoutDashboard className="w-4 h-4" /> Dashboard</>
                : <><LogIn className="w-4 h-4" /> Sign in</>
            }
        </Button>
    </div>
</div>

                <div className="flex items-center justify-between">
                    <EventTabs
                        active={filters.dateFilter ?? "upcoming"}
                        onChange={handleTabChange}
                    />
                    {!isLoading && totalCount > 0 && (
                        <p className="text-xs text-muted-foreground hidden sm:block">
                            {totalCount} event{totalCount !== 1 ? "s" : ""} found
                        </p>
                    )}
                </div>

                <div className="min-h-[60vh] flex flex-col mt-6">
                    {isLoading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <p className="text-muted-foreground text-sm animate-pulse">
                                Loading events...
                            </p>
                        </div>
                    ) : (
                        <>
                            <EventList
                                events={events}
                                dateFilter={filters.dateFilter}
                            />
                            <EventPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </>
                    )}
                </div>

            </div>
        </div>
    );
};

export default EventsPage;