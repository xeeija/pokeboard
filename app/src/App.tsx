import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { Randomon } from './pages/Randomon';
import { RandomonHome } from './pages/RandomonHome';
import { RandomonPopout } from './pages/RandomonPopout';
import { Navbar } from './components/Navbar';
import { Container } from '@material-ui/core';
import { useStyles } from './Theme';
// import "./style.css"

export const App: React.FC = () => {
  const cl = useStyles()
  return (
    <BrowserRouter>
      <Switch>

        {/* Popout should not have a navbar */}
        <Route exact path="/randomon/:id/popout" >
          <RandomonPopout />
        </Route>

        <Route><Navbar /></Route>

      </Switch>
      <Container className={cl.container}>
        <Switch>

          <Route exact path="/" >
            {/* <Redirect to="/randomon" /> */}
          </Route>

          <Route exact path="/randomon" >
            <RandomonHome />
          </Route>

          <Route exact path="/randomon/:id" >
            <Randomon />
          </Route>

        </Switch>
      </Container>
    </BrowserRouter>
  );
}
