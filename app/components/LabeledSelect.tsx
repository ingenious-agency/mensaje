import React, { PropsWithoutRef } from "react"
import { useFormContext } from "react-hook-form"

export interface LabeledSelectProps extends PropsWithoutRef<JSX.IntrinsicElements["select"]> {
  name: string
  label: string
  data: Array<any>
  displayProperty: string
  valueProperty: string
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  showErrorMessage?: boolean
}

export const LabeledSelect = React.forwardRef<HTMLInputElement, LabeledSelectProps>(
  (
    {
      label,
      outerProps,
      data = [],
      valueProperty,
      displayProperty,
      showErrorMessage = true,
      ...props
    },
    ref
  ) => {
    const {
      register,
      formState: { isSubmitting },
      errors,
    } = useFormContext()
    const error = Array.isArray(errors[props.name])
      ? errors[props.name].join(", ")
      : errors[props.name]?.message || errors[props.name]

    return (
      <div {...outerProps}>
        <select
          aria-label={label}
          disabled={isSubmitting}
          ref={register}
          className={`select appearance-none bg-transparent border border-gray-default outline-none px-4 py-1 cursor-pointer text-gray-700 ${
            error && "border-red-500"
          }`}
          {...props}
        >
          <option value={label}>{label}</option>
          {data.map((item) => (
            <option key={item[valueProperty]} value={item[valueProperty]}>
              # {item[displayProperty]}
            </option>
          ))}
        </select>

        {error && showErrorMessage && (
          <div role="alert" className="ml-2 text-red-500">
            {error}
          </div>
        )}
        <style jsx>{`
          .select {
            background: url("/caret-down.svg") no-repeat calc(100% - 1rem) 50%;
          }
        `}</style>
      </div>
    )
  }
)

export default LabeledSelect
