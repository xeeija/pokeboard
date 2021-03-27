import React, { useState } from 'react';
import { Counter } from './components/Counter';
import { LoginForm } from './components/LoginForm';
import { RandomWheel } from './components/RandomWheel';
import { RegisterForm } from './components/RegisterForm';
import "./style.css"

const App: React.FC = () => {

  const [names, setNames] = useState<string[]>([])

  return (
    <div className="App">
      <div>
        <p>Hello React</p>
        <Counter>
          {(count, setCount) => (
            <div>
              <div>{count}</div>
              <button onClick={() => {
                setCount(count + 1)
                const wheel = document.querySelector("#wheel-g")
                wheel?.classList.add("spinning")
                setTimeout(() => {
                  wheel?.classList.remove("spinning")
                }, 4000);
              }}>Click</button>
            </div>
          )}
        </Counter>
      </div>

      <br />
      <div>Register:</div>
      <RegisterForm />

      <br />
      <div>Login:</div>
      <LoginForm />

      <br />
      <RandomWheel diameter={600} names={names} ></RandomWheel>

      <textarea
        style={{ height: 400, width: 200, marginLeft: 20 }}
        value={names.join("\n")}
        onChange={(e) => {
          console.log(e.target.value)
          setNames(e.target.value.split("\n"))
        }}>
      </textarea>

    </div>
  );
}

export default App;
