import React, { PropsWithoutRef, useState } from "react"
import { useFormContext } from "react-hook-form"
import Markdown from "app/components/markdown"

export interface LabeledMarkdownProps extends PropsWithoutRef<JSX.IntrinsicElements["textarea"]> {
  name: string
  label: string
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export const LabeledMarkDownField = React.forwardRef<HTMLTextAreaElement, LabeledMarkdownProps>(
  ({ label, outerProps, ...props }, ref) => {
    const [preview, setPreview] = useState(false)
    const togglePreview = () => setPreview(!preview)

    const {
      register,
      formState: { isSubmitting },
      errors,
      watch,
    } = useFormContext()

    const watchField = watch(props.name)

    const error = Array.isArray(errors[props.name])
      ? errors[props.name].join(", ")
      : errors[props.name]?.message || errors[props.name]

    return (
      <div className="mt-8 relative" {...outerProps}>
        <label>
          <div className={`text-base ${preview && "invisible"}`}>{label}</div>

          <div className="flex">
            <textarea
              className={`border-gray-default border rounded outline-none pl-4 pt-2 pb-2 pr-4 mt-1 w-full h-80 ${
                error && "border-red-500"
              } ${preview ? "hidden" : "block"}`}
              disabled={isSubmitting}
              {...props}
              ref={register}
            />
            <Markdown
              onDoubleClick={togglePreview}
              className={`border-transparent border rounded p-2 ${!preview ? "hidden" : "block"}`}
            >
              {watchField}
            </Markdown>
          </div>

          <div className="absolute -top-0 right-2 mr-1">
            <button
              className="flex justify-center items-center rounded-full h-8 w-8 border-none outline-none focus:outline-none text-blue-default opacity-30 hover:opacity-100 transition-all text-xs"
              type="button"
              onClick={togglePreview}
            >
              {preview ? "Edit" : "Preview"}
            </button>
          </div>
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

export default LabeledMarkDownField
