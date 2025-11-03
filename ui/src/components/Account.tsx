import { useEffect, useState } from "react";
import Entry from "./Entry";
import { type Transaction } from "../types";

type HistoryProps = {
  transactions: Transaction[];
  expanded: boolean;
  forecasted: number;
  onClick: (newAccount: string) => void;
};
export default function Account(props: HistoryProps) {
  const { transactions, expanded, forecasted, onClick } = props;

  const [accountName] = useState<string>(transactions[0].account);
  const [accountTotal, setAccountTotal] = useState<number>(0);
  const [showPercentage, setShowPercentage] = useState<boolean>(true);

  useEffect(() => {
    const total = transactions.reduce((sum, t) => sum + t.value, 0);
    setAccountTotal(total);
  }, [transactions]);

  function renderComparison() {
    if (forecasted === 0) {
      return null;
    }

    const formatted = forecasted.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

    const percentage = Math.round(((accountTotal - forecasted) / forecasted) * 100);
    const isOver = percentage > 0;
    const value = showPercentage ? ` (${isOver ? "+" : ""}${percentage}%)` : ` (${formatted})`;
    const className = `forecast ${isOver ? "over" : "under"}`;

    return (
      <span
        onClick={(e) => {
          e.stopPropagation(); // ⛔ prevents triggering the parent click
          setShowPercentage(!showPercentage);
        }}
        className={className}
      >
        {value}
      </span>
    );
  }

  const formatted = accountTotal.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  function renderEntries() {
    if (!expanded) {
      return null;
    }

    return (
      <div className='entries'>
        {transactions.map((trans, index) => (
          <Entry key={`${index}-accountName`} transaction={trans} />
        ))}
      </div>
    );
  }

  return (
    <div className='account'>
      <div className={`title-overview ${expanded ? "expanded" : ""}`} onClick={() => onClick(accountName)}>
        <p>{accountName.slice(0, 25)}</p>
        <p>
          {formatted}
          {renderComparison()}
        </p>
      </div>

      {renderEntries()}
    </div>
  );
}
