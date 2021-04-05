import React from "react"
import { AppBar, Button, Container, Toolbar, Typography } from "@material-ui/core"
import { Link } from "react-router-dom"

interface Props { }

export const Navbar: React.FC<Props> = () => {
  return (
    <AppBar position="static">
      <Container component={Toolbar}>
        <Typography variant="h6">Pokeboard</Typography>
        <Button color="default" component={Link} to="/randomon" >
          Randomon
          {/* <Link to="/randomon" >Randomon</Link> */}
        </Button>
      </Container>
    </AppBar>
  )
}