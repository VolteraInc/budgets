import { type Transaction } from "../types";

interface EntryProps {
  transaction: Transaction;
}

export default function Entry(props: EntryProps) {
  const { value, project, class: product, memo, date, invoice, entity } = props.transaction;

  const month = new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="entry">
      <div className="line title">
        <p>{entity}</p>
        <p>
          {value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </p>
      </div>

      <div className="line subtitle">
        <p>{memo}</p>
        <p>{month}</p>
      </div>
      <div className="line tags">
        <a href="https://www.google.com">{invoice}</a>
        <div>
          {project ? <span className="pill project">{project}</span> : null}
          {product ? <span className="pill product">{product}</span> : null}
        </div>
      </div>
    </div>
  );
}
