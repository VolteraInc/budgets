import { useEffect, useState } from "react";
import Entry from "./Entry";
import { type Transaction } from "../types";

type HistoryProps = {
  transactions: Transaction[];
  expanded: boolean;
  forecasted: number | null;
  onClick: (newAccount: string) => void;
};
export default function Account(props: HistoryProps) {
  const { transactions, expanded, forecasted, onClick } = props;

  const [accountName] = useState<string>(transactions[0].account);
  const [accountTotal, setAccountTotal] = useState<number>(0);

  useEffect(() => {
    const total = transactions.reduce((sum, t) => sum + t.value, 0);
    setAccountTotal(total);
  }, [transactions]);

  function renderComparison() {
    if (!forecasted) {
      return null;
    }

    const percentage = Math.round(((accountTotal - forecasted) / forecasted) * 100);

    if (percentage > 0) {
      return <span className="forecast-over"> (+{percentage}%)</span>;
    } else {
      return <span className="forecast-under"> ({percentage}%)</span>;
    }
  }

  const formatted = accountTotal.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div className={`account ${expanded ? "is-open" : ""}`} onClick={() => onClick(accountName)}>
      <div className={`title-overview ${expanded ? "expanded" : ""}`}>
        <p>{accountName.slice(0, 25)}</p>
        <p>
          {formatted}
          {renderComparison()}
        </p>
      </div>

      <div className="entries">
        {transactions.map((trans, index) => (
          <Entry key={`${index}-accountName`} transaction={trans} />
        ))}
      </div>
    </div>
  );
}
