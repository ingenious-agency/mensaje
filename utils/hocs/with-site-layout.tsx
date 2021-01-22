import React, { useState } from "react"
import { SiderContext } from "utils/contexts/sider-context"

export default function withSiteLayout(ChildComponent) {
  return (props) => {
    const [isSiderOpen, setIsSiderOpen] = useState(false)

    return (
      <SiderContext.Provider
        value={{
          isSiderOpen: isSiderOpen,
          setIsSiderOpen: setIsSiderOpen,
        }}
      >
        <ChildComponent {...props} />
      </SiderContext.Provider>
    )
  }
}
