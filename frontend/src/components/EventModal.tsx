import type { FC } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EventForm } from "@/form/EventForm";
import type { EventType } from "@/interfaces/EventInterfaces";
import type { createEventSchemaType } from "@/validators/events.validators";

interface EventModalProps {
  triggerButtonText?: string;
  defaultValues?: EventType;
  onSubmit: (values: createEventSchemaType) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const EventModal: FC<EventModalProps> = ({ triggerButtonText, defaultValues, onSubmit, isOpen, onOpenChange }) => {
  const content = (
    <DialogContent
      showCloseButton={false}
      className="flex flex-col gap-0 p-0 sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[calc(100vh-2rem)] overflow-hidden"
    >
      <DialogHeader className="px-4 sm:px-6 pt-4 pb-2">
        <DialogTitle>{defaultValues ? "Edit Event" : "Create Event"}</DialogTitle>
      </DialogHeader>

      <div className="px-4 sm:px-6 pb-4 overflow-y-auto min-h-0">
        <EventForm defaultValues={defaultValues} onSubmit={onSubmit} isEdit={!!defaultValues} />
      </div>

      <div className="border-t bg-muted/30 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-end">
          <DialogClose asChild>
            <Button variant="ghost" className="w-full sm:w-auto">
              Cancel
            </Button>
          </DialogClose>
        </div>
      </div>
    </DialogContent>
  );

  if (isOpen !== undefined) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        {content}
      </Dialog>
    );
  }

  return (
    <Dialog>
      {triggerButtonText && (
        <DialogTrigger asChild>
          <Button>{triggerButtonText}</Button>
        </DialogTrigger>
      )}
      {content}
    </Dialog>
  );
};