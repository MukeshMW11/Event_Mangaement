import { useRef, useEffect } from "react";
import { debounce } from "lodash";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface EventSearchProps {
    onSearch: (value: string) => void;
}

export const EventSearch = ({ onSearch }: EventSearchProps) => {
    const debouncedSearch = useRef(
        debounce((value: string) => onSearch(value), 400)
    );

    useEffect(() => {
        return () => debouncedSearch.current.cancel();
    }, []);
    return (
        <div className="relative w-48">  
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <Input
                placeholder="Search events..."
                className="pl-9 h-9 text-sm"
                onChange={(e) => debouncedSearch.current(e.target.value)}
            />
        </div>
    );
};