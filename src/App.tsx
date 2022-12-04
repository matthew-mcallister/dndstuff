import './App.css';
import React, { useState } from 'react';
import {generateStats} from './encounter';

function App() {
  const [stats, setStats] = useState<{[key: string]: number}>({})
  function roll() {
    setStats(generateStats({
      Strength: {min: 8, max: 12},
      Deftness: {min: 8, max: 12},
      Speed: {min: 8, max: 12},
      Health: {min: 8, max: 12},
      Wit: {min: 8, max: 12},
      Will: {min: 8, max: 12},
    }));
  }
  return (
    <div className="App">
      <header className="App-header">
        {Object.entries(stats).map(([key, value]) => {
          return (
            <p>
              <label>{key}</label>:{' '}
              <span>{value}</span>
            </p>
          );
        })}
        <button onClick={roll}>Roll</button>
      </header>
    </div>
  );
}

export default App;
