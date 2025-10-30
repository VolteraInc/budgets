import { useState } from "react";
import volteraLogo from "./assets/voltera.svg";

import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <img src={volteraLogo} className='logo' alt='Vite logo' />
      </div>
      <h1>Budget Transactions!</h1>
      <div className='card'>
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
      </div>
    </>
  );
}

export default App;
