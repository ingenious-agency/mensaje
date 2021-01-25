import React, { useContext, useState } from "react"

export type SiderContextType = {
  isSiderOpen: Boolean
  setIsSiderOpen: React.Dispatch<React.SetStateAction<boolean>> | (() => void)
  toggleSider: () => void
}

export const SiderContext = React.createContext<SiderContextType>({
  isSiderOpen: false,
  setIsSiderOpen: () => console.warn("no SiderContext provider"),
  toggleSider: () => console.warn("no SiderContext provider"),
})
export const useSiderContext = () => useContext(SiderContext)

export function SiderProvider({ children, ...rest }) {
  const [isSiderOpen, setIsSiderOpen] = useState(false)

  return (
    <SiderContext.Provider
      {...rest}
      value={{
        isSiderOpen: isSiderOpen,
        setIsSiderOpen: setIsSiderOpen,
        toggleSider: () => setIsSiderOpen(!isSiderOpen),
      }}
    >
      {children}
    </SiderContext.Provider>
  )
}
