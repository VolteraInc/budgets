import { useState, useEffect } from "react";
import Account from "./Account";
import { type Payload, type Transaction } from "../types";
import { BLACKLIST } from "../constants";

type AccordionProps = {
  payload: Payload;
};

export default function Accordion(props: AccordionProps) {
  const { payload } = props;
  const [expandedAccount, setExpandedAccount] = useState<string | null>(payload.active.accountName);
  const [sortedTransactions, setSortedTransactions] = useState<Record<string, Transaction[]>>({});

  useEffect(() => {
    const processed: Record<string, Transaction[]> = {};

    // Sort our account transactions.
    payload.allTransactions.forEach((transaction) => {
      if (processed[transaction.account]) {
        processed[transaction.account].push(transaction);
      } else {
        processed[transaction.account] = [transaction];
      }
    });

    setSortedTransactions(processed);
  }, []);

  // Extract our possible accounts.

  function onClick(newAccount: string) {
    // Clear it if it matches.
    if (expandedAccount === newAccount) {
      setExpandedAccount(null);
    } else {
      setExpandedAccount(newAccount);
    }
  }

  function renderTransactions() {
    const elementCollection = [];

    for (const currentAccount in sortedTransactions) {
      if (!BLACKLIST.includes(currentAccount)) {
        elementCollection.push(
          <Account
            key={currentAccount}
            transactions={sortedTransactions[currentAccount]}
            expanded={currentAccount === expandedAccount}
            onClick={onClick}
            forecasted={currentAccount === payload.active.accountName ? payload.active.amountForecast : null}
          />
        );
      }
    }

    return elementCollection;
  }

  return <div className="accordion">{renderTransactions()}</div>;
}
