import React, { useContext } from "react"

export type SiderContextType = {
  isSiderOpen: Boolean
  setIsSiderOpen: React.Dispatch<React.SetStateAction<boolean>> | (() => void)
}

export const SiderContext = React.createContext<SiderContextType>({
  isSiderOpen: false,
  setIsSiderOpen: () => console.warn("no SiderContext provider"),
})
export const useSiderContext = () => useContext(SiderContext)
