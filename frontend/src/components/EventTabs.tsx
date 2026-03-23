interface EventTabsProps {
    active: "upcoming" | "past";
    onChange: (tab: "upcoming" | "past") => void;
}

const tabs: { value: "upcoming" | "past"; label: string }[] = [
    { value: "upcoming", label: "Upcoming" },
    { value: "past", label: "Past" },
];

export const EventTabs = ({ active, onChange }: EventTabsProps) => {
    return (
        <div className="flex gap-0 border-b border-border">
            {tabs.map(({ value, label }) => (
                <button
                    key={value}
                    onClick={() => onChange(value)}
                    className={`px-5 py-2.5 text-sm font-medium transition-all duration-150 border-b-2 -mb-px focus:outline-none
                        ${active === value
                            ? "border-foreground text-foreground"
                            : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                        }`}
                >
                    {label}
                </button>
            ))}
        </div>
    );
};