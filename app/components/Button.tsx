type ButtonProps = JSX.IntrinsicElements["button"]

export default function Button({ className = "", ...rest }: ButtonProps) {
  return (
    <button
      className={`${className} px-4 py-2 flex items-center border rounded bg-black text-white text-xs hover:bg-gray-600`}
      {...rest}
    />
  )
}
