export type BottomBarProps = Omit<JSX.IntrinsicElements["div"], "style">
export default function BottomBar({ children, className = "", ...rest }: BottomBarProps) {
  return (
    <div
      className={`bottom bottom-0 fixed h-14 w-full left-0 flex bg-white ${className}`}
      style={{ boxShadow: "0px -1px 8px rgba(0, 0, 0, 0.15)" }}
      {...rest}
    >
      <div className="flex justify-between lg:max-w-3xl lg:m-auto flex-1 items-center mx-6 my-5">
        {children}
      </div>
      <style jsx global>{`
        body {
          margin-bottom: 5rem;
        }
      `}</style>
    </div>
  )
}
