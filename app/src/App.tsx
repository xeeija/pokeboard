import React from 'react';
import { Counter } from './components/Counter';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';

const App: React.FC = () => {
  return (
    <div className="App">
      Hello React
      <Counter>
        {(count, setCount) => (
          <div>
            <div>{count}</div>
            <button onClick={() => setCount(count + 1)}>Click</button>
          </div>
        )}
        
      </Counter>

      <br />
      <div>Register:</div>
      <RegisterForm />
      
      <br />
      <div>Login:</div>
      <LoginForm />
    </div>
  );
}

export default App;
