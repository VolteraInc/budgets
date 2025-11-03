import volteraLogo from "./assets/voltera-icon.svg";
import Accordion from "./components/Accordion";
import { type Payload } from "./types";
import { dummyData  } from "./constants";

import "./App.css";

interface AppProps {
  payload: Payload;
}



function App(props: AppProps) {
  const payload = props.payload ?? dummyData;

  const month = new Date(payload.date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <div>
      <div className="header">
        <img src={volteraLogo} alt="Voltera logo" />
        <h3>Transactions - {month}</h3>
      </div>
      <Accordion payload={payload} />
    </div>
  );
}

export default App;
