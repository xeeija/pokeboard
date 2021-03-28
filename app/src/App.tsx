import React from 'react';
import { BrowserRouter, Link, Route, Switch } from "react-router-dom"
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Randomon } from './pages/Randomon';
import "./style.css"
import { Counter } from './components/Counter';

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
          <Route exact path="/" >

            <p>Hello React</p>
            <Counter>
              {(count, setCount) => (
                <div>
                  <div>{count}</div>
                  <button onClick={() => setCount(count + 1)}>Click</button>
                </div>
              )}
            </Counter>

            <Randomon />
          </Route>

          <Route exact path="/login" ><Login /></Route>
          <Route exact path="/register" ><Register /></Route>

          <Route exact path="/randomon" ><Randomon /></Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}
