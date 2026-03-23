import {
  useFormContext,
  Controller,
  type FieldValues,
  type Path
} from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type?: "text" | "email" | "password" | "textarea" | "date" | "select";
  options?: string[];
}

export const FormField = <T extends FieldValues>({
  name,
  label,
  type = "text",
  options = [],
}: FormFieldProps<T>) => {
  const openNativeDatePicker = (input: HTMLInputElement) => {
    if (typeof input.showPicker === "function") {
      input.showPicker();
    }
  };

  const {
    control
  } = useFormContext<T>();

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name}>{label}</Label>

      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => {
          const errorMessage = fieldState.error?.message;
          const isInvalid = Boolean(errorMessage);

          if (type === "textarea") return <Textarea {...field} id={name} aria-invalid={isInvalid} />;
          if (type === "select") {
            return (
              <>
                <select
                  {...field}
                  id={name}
                  aria-invalid={isInvalid}
                  className={cn(
                    "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
                  )}
                >
                  <option value="">Select...</option>
                  {options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                {errorMessage && (
                  <p className="text-destructive text-xs mt-0.5 leading-tight">{errorMessage}</p>
                )}
              </>
            );
          }
          if (type === "date") {
            return (
              <>
                <Input
                  type="date"
                  id={name}
                  value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                  aria-invalid={isInvalid}
                  onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                  onClick={(e) => openNativeDatePicker(e.currentTarget)}
                  onFocus={(e) => openNativeDatePicker(e.currentTarget)}
                />
                {errorMessage && (
                  <p className="text-destructive text-xs mt-0.5 leading-tight">{errorMessage}</p>
                )}
              </>
            );
          }
          return (
            <>
              <Input {...field} type={type} id={name} aria-invalid={isInvalid} />
              {errorMessage && (
                <p className="text-destructive text-xs mt-0.5 leading-tight">{errorMessage}</p>
              )}
            </>
          );
        }}
      />
    </div>
  );
};