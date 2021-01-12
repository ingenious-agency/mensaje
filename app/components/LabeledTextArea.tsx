import React, { PropsWithoutRef } from "react"
import { useFormContext } from "react-hook-form"

export interface LabeledTextAreaProps extends PropsWithoutRef<JSX.IntrinsicElements["textarea"]> {
  name: string
  label: string
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export const LabeledTextField = React.forwardRef<HTMLTextAreaElement, LabeledTextAreaProps>(
  ({ label, outerProps, ...props }, ref) => {
    const {
      register,
      formState: { isSubmitting },
      errors,
    } = useFormContext()
    const error = Array.isArray(errors[props.name])
      ? errors[props.name].join(", ")
      : errors[props.name]?.message || errors[props.name]

    return (
      <div className="mt-8" {...outerProps}>
        <label>
          <div className="text-base">{label}</div>
          <textarea
            className={`border-gray-default border rounded outline-none pl-4 pt-2 pb-2 pr-4 mt-1 w-full h-80 ${
              error && "border-red-500"
            }`}
            disabled={isSubmitting}
            {...props}
            ref={register}
          />
        </label>

        {error && (
          <div role="alert" style={{ color: "red" }}>
            {error}
          </div>
        )}
      </div>
    )
  }
)

export default LabeledTextField
