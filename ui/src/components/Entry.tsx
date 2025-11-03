import { useState } from "react";
import { type Transaction } from "../types";

interface EntryProps {
  transaction: Transaction;
}

export default function Entry(props: EntryProps) {
  const { type, amount, project, class: product, memo, date, entity, internalid, float, vendor } = props.transaction;

  const [showTags, setShowTags] = useState<boolean>(true);

  const month = new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  function renderTagsOrInvoice() {
    if (showTags) {
      return (
        <div className="line subtitle">
          <div></div>
          <div>
            {project ? <span className="pill project">{project}</span> : null}
            {product ? <span className="pill product">{product}</span> : null}
          </div>
        </div>
      );
    }

    let prefix = "";
    if (type === "Bill") {
      prefix = "vendbill";
    } else if (type === "Journal") {
      prefix = "journal";
    }

    const link = `https://5097856.app.netsuite.com/app/accounting/transactions/${prefix}.nl?id=${internalid}`;

    return (
      <div className="line subtitle">
        <div></div>
        <p>
          <a target="_blank" href={link}>
            {type}
          </a>
          {"  "}
          {float ? (
            <a target="_blank" href={float}>
              Float
            </a>
          ) : null}
        </p>
      </div>
    );
  }

  return (
    <div className="entry" onClick={() => setShowTags(!showTags)}>
      <div className="line title">
        <p>{entity || vendor}</p>
        <p>
          {amount.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </p>
      </div>

      <div className="line subtitle">
        <p>{memo}</p>
        <p className="month">{month}</p>
      </div>
      {renderTagsOrInvoice()}
    </div>
  );
}
