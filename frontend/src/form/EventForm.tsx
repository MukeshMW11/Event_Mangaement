import { TagSelect } from "@/components/TagSelect";
import { FormField } from "./FormField";
import { FormWrapper } from "./FormWrapper";
import { SubmitButton } from "@/components/SubmitButton";
import { Label } from "@/components/ui/label";
import { createEventSchema, type createEventSchemaType, editEventSchema, type editEventSchemaType } from "@/validators/events.validators";
import { Controller, useFormContext } from "react-hook-form";

type EventFormInput = Omit<createEventSchemaType, "event_date"> & {
  event_date?: string | Date;
};

interface EventFormProps {
  defaultValues?: EventFormInput;
  onSubmit: (values: createEventSchemaType | editEventSchemaType) => void;
  isEdit?: boolean;
}



export function EventForm({ defaultValues, onSubmit, isEdit = false }: EventFormProps) {

  const normalizedValues = defaultValues
    ? {
      ...defaultValues,
      event_date: defaultValues.event_date
        ? new Date(defaultValues.event_date)
        : undefined,
    }
    : undefined;
  return (
    <FormWrapper schema={isEdit ? editEventSchema : createEventSchema} onSubmit={onSubmit} defaultValues={normalizedValues}>
      <EventFormFields />
    </FormWrapper>
  );
}

function EventFormFields() {
  const { control } = useFormContext();

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField name="title" label="Title" />
        <FormField name="location" label="Location" />
        <FormField name="event_date" label="Event Date" type="date" />
        <FormField
          name="event_type"
          label="Event Type"
          type="select"
          options={["public", "private"]}
        />
      </div>

      <FormField name="description" label="Description" type="textarea" />

      <div className="flex flex-col gap-1.5">
        <Label>Tags</Label>
      <Controller
        name="tags"
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <TagSelect
            value={field.value}
            onChange={(tags) => field.onChange(tags)}
          />
        )}
      />
      </div>

      <SubmitButton text="Save Event" />
    </>
  );
}