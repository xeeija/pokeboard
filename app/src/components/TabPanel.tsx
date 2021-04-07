import React from "react"
import { useStyles } from "src/Theme"

interface Props {
  children?: React.ReactNode,
  index: any,
  activeTab: any,
}

export const TabPanel: React.FC<Props> = ({ children, activeTab, index, ...other }) => {
  const cl = useStyles()
  return (
    <div className={cl.pad}
      role="tabpanel"
      hidden={activeTab !== index}
      {...other}>
      {activeTab === index && (<>{children}</>)}
    </div>
  )
}