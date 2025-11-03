import { useState } from "react";
import { type Transaction } from "../types";

interface EntryProps {
  transaction: Transaction;
}

export default function Entry(props: EntryProps) {
  const { value, project, class: product, memo, date, invoice, entity, tranid } = props.transaction;

  const [showTags, setShowTags] = useState<boolean>(true);

  const month = new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  function renderTagsOrInvoice() {
    if (showTags) {
      return (
        <div className='line tags'>
          <div></div>
          <div>
            {project ? <span className='pill project'>{project}</span> : null}
            {product ? <span className='pill product'>{product}</span> : null}
          </div>
        </div>
      );
    }

    if (invoice) {
      return (
        <div className='line subtitle'>
          <a href={invoice}>Invoice</a>
          <p>{tranid}</p>
        </div>
      );
    }

    return (
      <div className='line subtitle'>
        <p>{tranid}</p>
      </div>
    );
  }

  return (
    <div className='entry' onClick={() => setShowTags(!showTags)}>
      <div className='line title'>
        <p>{entity}</p>
        <p>
          {value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </p>
      </div>

      <div className='line subtitle'>
        <p>{memo}</p>
        <p>{month}</p>
      </div>
      {renderTagsOrInvoice()}
    </div>
  );
}
