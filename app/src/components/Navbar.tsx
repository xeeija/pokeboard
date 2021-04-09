import React from "react"
import { AppBar, Button, Container, Toolbar, Typography } from "@material-ui/core"
import { Link } from "react-router-dom"
import { useStyles } from "src/Theme"

interface Props { }

export const Navbar: React.FC<Props> = () => {
  const cl = useStyles()
  return (
    <AppBar position="static">
      <Container component={Toolbar} className={cl.padh}>
        <Typography variant="h6" className={cl.padr}>
          Pokeboard
        </Typography>
        <Button color="inherit" component={Link} to="/randomon" >
          Randomon
          {/* <Link to="/randomon" >Randomon</Link> */}
        </Button>
      </Container>
    </AppBar>
  )
}