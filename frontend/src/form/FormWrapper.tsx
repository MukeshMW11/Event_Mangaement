import { useEffect, type ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { UseFormProps, FieldValues, SubmitHandler, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface FormWrapperProps<T extends FieldValues> extends UseFormProps<T> {
  schema: any; 
  children: ReactNode;
  onSubmit: SubmitHandler<T>;
}

export function FormWrapper<T extends FieldValues>({
  schema,
  children,
  onSubmit,
  ...formProps
}: FormWrapperProps<T>) {
  const methods = useForm<T>({
    resolver: zodResolver(schema) as Resolver<T>,
    mode: "onChange",
    reValidateMode: "onChange",
    ...formProps,
  });

 
  useEffect(() => {
    const { submitCount, errors } = methods.formState;
    if (submitCount < 1) return;

    const firstErrorKey = Object.keys(errors)[0];
    if (!firstErrorKey) return;

    const el =
      (document.querySelector(`[name="${firstErrorKey}"]`) as HTMLElement | null) ??
      document.getElementById(firstErrorKey);

    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [methods.formState.submitCount]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        {children}
      </form>
    </FormProvider>
  );
}