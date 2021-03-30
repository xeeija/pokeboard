import React from 'react';
import "./style.css"
import { BrowserRouter, Link, Route, Switch } from "react-router-dom"
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Randomon } from './pages/Randomon';

export const App: React.FC = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/randomon" >Randomon</Link></li>
          </ul>
        </nav>
        <Switch>
          <Route exact path="/" ><Home /></Route>
          <Route exact path="/login" ><Login /></Route>
          <Route exact path="/register" ><Register /></Route>

          {/* /random bzw /random/:id */}
          <Route exact path="/randomon" ><Randomon /></Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}
