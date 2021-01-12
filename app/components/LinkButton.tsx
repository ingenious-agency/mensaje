import { forwardRef, RefObject } from "react"
type ButtonProps = JSX.IntrinsicElements["a"]

const LinkButton = forwardRef(({ className = "", children, ...rest }: ButtonProps, ref) => {
  return (
    <a
      ref={ref as RefObject<HTMLAnchorElement> | null | undefined}
      className={`px-4 py-2 flex items-center border rounded bg-black text-white text-xs hover:bg-gray-600 cursor-pointer ${className}`}
      {...rest}
    >
      {children}
    </a>
  )
})

export default LinkButton
