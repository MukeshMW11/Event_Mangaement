import { useState } from "react";
import {
    SidebarProvider,
    SidebarTrigger,
    SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTags, useCreateTag, useDeleteTag } from "@/hooks/useTags";
import { Trash2, Plus, Search } from "lucide-react";
import toast from "react-hot-toast";
import { ConfirmAlert } from "@/components/ConfirmAlert";

const TagsPage = () => {
    const [newTagName, setNewTagName] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const { data: tags, isLoading, error } = useTags(search, true, 8);
    const createTagMutation = useCreateTag();
    const deleteTagMutation = useDeleteTag();

    const handleCreateTag = async () => {
        if (!newTagName.trim()) return;

        try {
            await createTagMutation.mutateAsync({ name: newTagName.trim() });
            toast.success("Tag created successfully!");
            setNewTagName("");
            setIsCreateOpen(false);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to create tag");
        }
    };

    const handleDeleteTag = async (tagId: string, tagName: string) => {
        try {
            await deleteTagMutation.mutateAsync(tagId);
            toast.success(`Deleted "${tagName}"`);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to delete tag");
        }
    };

    const handleSearch = () => {
        setSearch(searchInput);
    };

    return (
        <SidebarProvider>
            <AppSidebar activeItem="my-tags" />

            <SidebarInset>
                <header className="sticky top-0 z-10 h-14 border-b border-border flex items-center justify-between px-4 md:px-6 shrink-0 bg-background gap-3">
                    <div className="flex items-center gap-3 shrink-0">
                        <SidebarTrigger className="-ml-1" />
                        <h1 className="text-sm font-semibold hidden sm:block">My Tags</h1>
                        {tags && (
                            <Badge variant="secondary" className="text-xs tabular-nums">
                                {tags.length}
                            </Badge>
                        )}
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    <div className="mx-auto w-full max-w-4xl space-y-4">
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create tag</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        Enter a short tag name (e.g. conference, meetup).
                                    </p>
                                    <Input
                                        placeholder="Tag name"
                                        value={newTagName}
                                        onChange={(e) => setNewTagName(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleCreateTag()}
                                        autoFocus
                                    />
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsCreateOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={handleCreateTag}
                                        disabled={!newTagName.trim() || createTagMutation.isPending}
                                    >
                                        {createTagMutation.isPending ? "Creating..." : "Create"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Card>
                            <CardHeader className="space-y-2 items-start text-left">
                                <CardTitle className="text-base">Tags</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Manage tags you created. You can search, create, and delete tags.
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Toolbar */}
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex w-full items-center gap-2 sm:max-w-md">
                                        <Input
                                            placeholder="Search tags..."
                                            value={searchInput}
                                            onChange={(e) => setSearchInput(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleSearch}
                                            className="gap-2"
                                        >
                                            <Search className="h-4 w-4" />
                                            Search
                                        </Button>
                                    </div>

                                    <Button
                                        type="button"
                                        onClick={() => setIsCreateOpen(true)}
                                        className="gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Tag
                                    </Button>
                                </div>

                                {/* Table */}
                                <div className="overflow-hidden border border-border bg-background">
                                    <table className="w-full text-sm text-foreground">
                                        <thead className="bg-muted/40">
                                            <tr className="text-left">
                                                <th className="px-4 py-3 font-medium">Tag</th>
                                                <th className="px-4 py-3 font-medium w-0 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {isLoading ? (
                                                <tr>
                                                    <td className="px-4 py-6 text-muted-foreground" colSpan={2}>
                                                        Loading tags...
                                                    </td>
                                                </tr>
                                            ) : error ? (
                                                <tr>
                                                    <td className="px-4 py-6 text-red-400" colSpan={2}>
                                                        Failed to load tags.
                                                    </td>
                                                </tr>
                                            ) : tags && tags.length > 0 ? (
                                                tags.map((tag) => (
                                                    <tr key={tag.id} className="border-t border-border">
                                                        <td className="px-4 py-3 text-left">
                                                            <span className="font-medium">{tag.name}</span>
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            <ConfirmAlert
                                                                title="Delete tag?"
                                                                description={`This will permanently delete "${tag.name}".`}
                                                                confirmText="Delete"
                                                                cancelText="Cancel"
                                                                confirmVariant="destructive"
                                                                disabled={deleteTagMutation.isPending}
                                                                onConfirm={() => handleDeleteTag(tag.id, tag.name)}
                                                                trigger={
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td className="px-4 py-6 text-muted-foreground" colSpan={2}>
                                                        {search
                                                            ? "No tags found matching your search."
                                                            : "You haven't created any tags yet."}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default TagsPage;
