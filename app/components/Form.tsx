import React, { useState, ReactNode, PropsWithoutRef } from "react"
import { FormProvider, useForm, UseFormMethods, UseFormOptions } from "react-hook-form"
import * as z from "zod"
import BottomBar from "./bottom-bar"
import Button from "./Button"

type FormProps<S extends z.ZodType<any, any>> = {
  isLoading?: boolean
  children: ReactNode
  submitText: string
  bottomContent?: (ctx: UseFormMethods<z.TypeOf<S>>) => ReactNode
  schema?: S
  onSubmit: (values: z.infer<S>) => Promise<void | OnSubmitResult>
  initialValues?: UseFormOptions<z.infer<S>>["defaultValues"]
} & Omit<PropsWithoutRef<JSX.IntrinsicElements["form"]>, "onSubmit">

type OnSubmitResult = {
  FORM_ERROR?: string
  [prop: string]: any
}

export const FORM_ERROR = "FORM_ERROR"

export function Form<S extends z.ZodType<any, any>>({
  isLoading = false,
  children,
  submitText,
  bottomContent,
  schema,
  initialValues,
  onSubmit,
  ...props
}: FormProps<S>) {
  const ctx = useForm<z.infer<S>>({
    mode: "onBlur",
    resolver: async (values) => {
      try {
        if (schema) {
          schema.parse(values)
        }
        return { values, errors: {} }
      } catch (error) {
        console.log(error)
        return { values: {}, errors: error.formErrors?.fieldErrors }
      }
    },
    defaultValues: initialValues,
  })
  const [formError, setFormError] = useState<string | null>(null)

  return (
    <FormProvider {...ctx}>
      <div className="relative">
        {isLoading && (
          <img className="loader absolute w-44 h-44 z-10" src="/loader.svg" alt="Loading..." />
        )}
        <div className={`${isLoading && "opacity-60"}`}>
          <form
            onSubmit={ctx.handleSubmit(async (values) => {
              const result = (await onSubmit(values)) || {}
              for (const [key, value] of Object.entries(result)) {
                if (key === FORM_ERROR) {
                  setFormError(value)
                } else {
                  ctx.setError(key as any, {
                    type: "submit",
                    message: value,
                  })
                }
              }
            })}
            className="form"
            {...props}
          >
            {/* Form fields supplied as children are rendered here */}
            {children}

            {formError && (
              <div role="alert" style={{ color: "red" }}>
                {formError}
              </div>
            )}
            <BottomBar>
              <div>{bottomContent && bottomContent(ctx)}</div>
              <Button type="submit" disabled={ctx.formState.isSubmitting}>
                {submitText}
              </Button>
            </BottomBar>
          </form>
          <style jsx global>{`
            .loader {
              left: calc(50% - 88px);
              top: calc(50% - 88px);
            }
          `}</style>
        </div>
      </div>
    </FormProvider>
  )
}

export default Form
