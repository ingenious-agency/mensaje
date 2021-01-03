import React, { PropsWithoutRef } from "react"
import { useFormContext } from "react-hook-form"

export interface LabeledSelectProps extends PropsWithoutRef<JSX.IntrinsicElements["select"]> {
  name: string
  label: string
  data: Array<any>
  displayProperty: string
  valueProperty: string
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export const LabeledSelect = React.forwardRef<HTMLInputElement, LabeledSelectProps>(
  ({ label, outerProps, data = [], valueProperty, displayProperty, ...props }, ref) => {
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
        <label>
          {label}
          <select disabled={isSubmitting} ref={register} {...props}>
            {data.map((item) => (
              <option key={item[valueProperty]} value={item[valueProperty]}>
                {item[displayProperty]}
              </option>
            ))}
          </select>
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

export default LabeledSelect
