import React from 'react';
import "./style.css"
import { BrowserRouter, Link, Redirect, Route, Switch } from "react-router-dom"
// import { Home } from './pages/Home';
// import { Login } from './pages/Login';
// import { Register } from './pages/Register';
import { Randomon } from './pages/Randomon';
import { RandomonHome } from './pages/RandomonHome';
import { RandomonPopout } from './pages/RandomonPopout';
import dotenv from "dotenv"

dotenv.config()

export const App: React.FC = () => {
  return (
    <div className="App">
      <BrowserRouter basename="/pokeboard" >
        {/* Popout Randomon should not have any nav links etc. */}
        <Switch>
          <Route exact path="/randomon/:id/popout" ><RandomonPopout /></Route>
          <Route>
            <nav>
              <ul>
                {/*
                <li><Link to="/">Home</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
                */}
                <li><Link to="/randomon" >Randomon</Link></li>
              </ul>
            </nav>
          </Route>
        </Switch>
        <Switch>
          <Route exact path="/" ><Redirect to="/randomon" /></Route>
          {/*
          <Route exact path="/" ><Home /></Route>
          <Route exact path="/login" ><Login /></Route>
          <Route exact path="/register" ><Register /></Route>
          */}

          {/* /random bzw /random/:id */}
          <Route exact path="/randomon" ><RandomonHome /></Route>
          <Route exact path="/randomon/:id" ><Randomon /></Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}
