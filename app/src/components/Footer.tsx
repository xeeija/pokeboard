import React from "react"
import { Container, Typography } from "@material-ui/core"
import { cls, useStyles } from "src/Theme"

interface Props { }

export const Footer: React.FC<Props> = () => {
  const cl = useStyles()
  return (
    <Container component="footer" className={cls(cl.padh, cl.padb)}>
      <Typography variant="subtitle2" color="textSecondary" className={cl.footer}>
        &copy; 2021 Pokeboard &bull; Made with 💜 by Xeeija
      </Typography>
    </Container>
  )
}