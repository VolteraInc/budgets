import volteraLogo from "./assets/voltera-icon.svg";
import Accordion from "./components/Accordion";
import { type Payload } from "./types";

import "./App.css";

interface AppProps {
  payload: Payload;
}

const dummyData: Payload = {
  initialAccount: "63005 - Travel - Tradeshows & Conferences",
  date: "Wed Oct 01 00:00:00 GMT-04:00 2025",

  forecastedAccounts: {
    "60000 - Gross Payroll": 10,
    "60001 - Company Benefits": 99,
    "60003 - EHT": 30,
    "63005 - Travel - Tradeshows & Conferences": 123,
  },

  allTransactions: [
    {
      value: 0.0,
      account: "60000 - Gross Payroll",
      type: "Bill",
      date: "2025-10-01T00:00:00.000Z",
      project: "",
      entity: "",
      memo: "See payroll accrual sheet",
      tranid: "September 2025 PP2-EHT",
      class: "falcon",
      department: "Product",
      period: "Oct 2025",
    },
    {
      entity: "",
      value: 52.13,
      tranid: "September 2025 PP2-EHT",
      class: "nova",
      department: "Product",
      date: "2025-10-01T00:00:00.000Z",
      project: "",
      type: "Bill",
      period: "Oct 2025",
      memo: "See payroll accrual sheet",
      account: "60003 - EHT",
    },
    {
      project: "",
      memo: "Employee Benefits Added  EE deduction portion",
      account: "60001 - Company Benefits",
      tranid: "2025 October",
      class: "v-one",
      department: "Product",
      value: 440.7,
      date: "2025-10-01T00:00:00.000Z",
      type: "Bill",
      period: "Oct 2025",
      entity: "",
    },
    {
      value: 4662.51,
      memo: "See payroll accrual sheet",
      class: "alta",
      department: "Product",
      period: "Oct 2025",
      project: "Techblick",
      account: "60000 - Gross Payroll",
      tranid: "October 2025 PP1",
      entity: "",
      type: "Bill",
      date: "2025-10-16T00:00:00.000Z",
    },
    {
      tranid: "October 2025 PP1",
      date: "2025-10-16T00:00:00.000Z",
      memo: "See payroll accrual sheet",
      class: "falcon",
      department: "Product",
      type: "Bill",
      value: 195.62,
      period: "Oct 2025",
      entity: "",
      account: "60003 - EHT",
      project: "",
    },
    {
      date: "2025-10-21T00:00:00.000Z",
      tranid: "251021 Reimbursement",
      project: "Roadshow",
      entity: "",
      period: "Oct 2025",
      value: 36.0,
      type: "Bill",
      memo: "Per diem CMTS",
      class: "falcon",
      department: "Product",
      account: "63005 - Travel - Tradeshows & Conferences",
    },
    {
      account: "60000 - Gross Payroll",
      class: "falcon",
      department: "Product",
      type: "Bill",
      period: "Oct 2025",
      value: 8781.38,
      memo: "See payroll accrual sheet",
      tranid: "October 2025 PP2",
      project: "",
      date: "2025-10-30T00:00:00.000Z",
      entity: "",
    },
    {
      type: "Bill",
      project: "",
      account: "60003 - EHT",
      period: "Oct 2025",
      value: 164.25,
      date: "2025-10-30T00:00:00.000Z",
      memo: "See payroll accrual sheet",
      class: "falcon",
      department: "Product",
      entity: "",
      tranid: "October 2025 PP2",
    },
    {
      period: "Oct 2025",
      memo: "See payroll accrual sheet",
      value: 4390.69,
      account: "60000 - Gross Payroll",
      tranid: "October 2025 PP3 - Accrual",
      invoice: "invoice",
      date: "2025-10-31T00:00:00.000Z",
      project: "",
      class: "falcon",
      department: "Product",
      type: "Bill",
      entity: "",
    },
    {
      project: "Berlin",
      memo: "See payroll accrual sheet",
      class: "falcon",
      department: "Product",
      entity: "Datadog",
      tranid: "October 2025 PP3 - Accrual",
      invoice: "invoice",
      date: "2025-10-31T00:00:00.000Z",
      period: "Oct 2025",
      value: 0.0,
      type: "Bill",
      account: "60003 - EHT",
    },
  ],
};

function App(props: AppProps) {
  const payload = props.payload ?? dummyData;

  const month = new Date(payload.date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <div>
      <div className='header'>
        <img src={volteraLogo} alt='Voltera logo' />
        <h3>Transactions - {month}</h3>
      </div>
      <Accordion payload={payload} />
    </div>
  );
}

export default App;
