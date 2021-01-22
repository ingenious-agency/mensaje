export type BottomBarProps = { isSiderOpen?: Boolean } & Omit<JSX.IntrinsicElements["div"], "style">
export default function BottomBar({
  isSiderOpen = false,
  children,
  className = "",
  ...rest
}: BottomBarProps) {
  return (
    <div
      className={`bottom bottom-0 fixed h-14 ${
        isSiderOpen ? "lg:w-3/4 md:w-2/3 w-full" : "w-full"
      } left-0 flex bg-white ${className}`}
      style={{ boxShadow: "0px -1px 8px rgba(0, 0, 0, 0.15)" }}
      {...rest}
    >
      <div
        className={`flex justify-between ${
          isSiderOpen ? "lg:max-w-2xl" : "lg:max-w-3xl"
        } lg:m-auto flex-1 items-center mx-6 my-5`}
      >
        {children}
      </div>
    </div>
  )
}
