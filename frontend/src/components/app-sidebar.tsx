import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import { CalendarDays, Home, LayoutDashboard, LogOut, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ConfirmAlert } from "@/components/ConfirmAlert";

interface AppSidebarProps {
    activeItem: "browse-events" | "my-events" | "my-tags";
}

export function AppSidebar({ activeItem }: AppSidebarProps) {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="border-b border-sidebar-border">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            className="cursor-default hover:bg-transparent"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                <CalendarDays className="size-4" />
                            </div>
                            <div className="flex flex-col gap-0.5 leading-none">
                                <span className="font-semibold">EventApp</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="py-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={() => navigate("/")}
                            isActive={activeItem === "browse-events"}
                        >
                            <Home className="size-4" />
                            <span>Browse Events</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <SidebarMenuButton
                            isActive={activeItem === "my-events"}
                            onClick={() => navigate("/dashboard")}
                        >
                            <LayoutDashboard className="size-4" />
                            <span>My Events</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <SidebarMenuButton
                            isActive={activeItem === "my-tags"}
                            onClick={() => navigate("/dashboard/tags")}
                        >
                            <Tag className="size-4" />
                            <span>My Tags</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <ConfirmAlert
                            title="Sign out?"
                            description="You will be logged out of your account."
                            confirmText="Sign out"
                            cancelText="Cancel"
                            onConfirm={logout}
                            trigger={
                                <SidebarMenuButton size="lg">
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-accent">
                                        <LogOut className="size-4" />
                                    </div>
                                    <div className="flex flex-col gap-0.5 leading-none text-left min-w-0">
                                        <span className="truncate text-xs font-medium">
                                            {user?.email || "My account"}
                                        </span>
                                        <span className="truncate text-xs text-sidebar-foreground/60">
                                            Sign out
                                        </span>
                                    </div>
                                </SidebarMenuButton>
                            }
                        />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}