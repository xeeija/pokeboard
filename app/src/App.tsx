import React from 'react';
import { Counter } from './components/Counter';

const App: React.FC = () => {
  return (
    <div className="App">
      Hello React
      <Counter>
        {(count, setCount) => (
          <div>
            <p>{count}</p>
            <button onClick={() => setCount(count + 1)}>Click</button>
          </div>
        )}
      </Counter>
    </div>
  );
}

export default App;
