import { useState, useEffect } from "react";
import Account from "./Account";
import { type Payload, type Transaction } from "../types";
import { BLACKLIST } from "../constants";

type AccordionProps = {
  payload: Payload;
};

type AccountStr = string;

export default function Accordion(props: AccordionProps) {
  const { payload } = props;
  const [expandedAccount, setExpandedAccount] = useState<AccountStr | null>(payload.initialAccount);
  const [sortedTransactions, setSortedTransactions] = useState<Record<AccountStr, Transaction[]>>({});

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

    const sorted = Object.fromEntries(Object.entries(processed).sort(([keyA], [keyB]) => keyA.localeCompare(keyB)));

    setSortedTransactions(sorted);
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

    for (const account in sortedTransactions) {
      if (!BLACKLIST.includes(account)) {
        const forecastedValue = payload.forecastedAccounts[account];

        elementCollection.push(
          <Account
            key={account}
            transactions={sortedTransactions[account]}
            expanded={account === expandedAccount}
            onClick={onClick}
            forecasted={forecastedValue}
          />
        );
      }
    }

    return elementCollection;
  }

  return <div className='accordion'>{renderTransactions()}</div>;
}
