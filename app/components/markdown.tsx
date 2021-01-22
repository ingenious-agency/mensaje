import MDownComponent, { MarkdownToJSX } from "markdown-to-jsx"

export default function Markdown({
  children,
  options,
  className = "",
  ...rest
}: {
  children: string
  options?: MarkdownToJSX.Options
  className?: string
} & JSX.IntrinsicElements["div"]) {
  return (
    <div className={`${className}`} {...rest}>
      <MDownComponent
        options={{
          forceWrapper: true,
          overrides: {
            a: {
              props: {
                className: "leading-relaxed text-blue-default hover:underline",
              },
            },
            p: {
              props: {
                className: "text-light mb-4",
              },
            },
            h1: {
              props: {
                className: "text-base font-medium mb-2 mt-8",
              },
            },
            li: {
              props: {
                className: "list-disc list-inside",
              },
            },
            code: {
              props: {
                className: "font-mono px-1 text-sm",
                style: {
                  color: "#FF7E32",
                },
              },
            },
          },
          ...options,
        }}
      >
        {children}
      </MDownComponent>
    </div>
  )
}
