import { useState } from "react";
import axios from "axios";
import { type Transaction } from "../types";
import { convertTypeToPrefix } from "../constants";

interface EntryProps {
  transaction: Transaction;
}

const enum STEP {
  TAGS = "Tags",
  LINKS = "Links",
  DISPUTING = "Disputing",
  DISPUTED = "Disputed",
}

export default function Entry(props: EntryProps) {
  const {
    type,
    amount,
    project,
    class: product,
    memo,
    date,
    entity,
    internalid,
    float,
    vendor,
    // department,
  } = props.transaction;

  const [disputeText, setDisputeText] = useState<string>("");
  const [step, setStep] = useState<STEP>(STEP.TAGS);

  const month = new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  function renderOptions() {
    switch (step) {
      case STEP.TAGS:
        return renderTags();
      case STEP.LINKS:
        return renderLinks();
      case STEP.DISPUTING:
        return renderDisputing();
      case STEP.DISPUTED:
        return renderDisputed();
    }
  }

  function renderTags() {
    return (
      <div className='line subtitle'>
        <div></div>
        <div>
          {project ? <span className='pill project'>{project}</span> : null}
          {product ? <span className='pill product'>{product}</span> : <span className='pill none'>No Class!</span>}
        </div>
      </div>
    );
  }

  function renderLinks() {
    const prefix = convertTypeToPrefix(type);
    const link = `https://5097856.app.netsuite.com/app/accounting/transactions/${prefix}.nl?id=${internalid}`;

    return (
      <div className='line subtitle'>
        <span
          className='dispute-link'
          onClick={(e) => {
            e.stopPropagation();
            setStep(STEP.DISPUTING);
          }}
        >
          Dispute
        </span>
        <p>
          <a target='_blank' href={link}>
            {type}
          </a>
          {"  "}
          {float ? (
            <a target='_blank' href={float}>
              Float
            </a>
          ) : null}
        </p>
      </div>
    );
  }

  function renderDisputing() {
    return (
      <div className='dispute'>
        <p>
          <i>Change to: {disputeText}</i>
        </p>
        <div>
          <input
            type='text'
            onChange={(e) => setDisputeText(e.currentTarget.value)}
            value={disputeText}
            placeholder='i.e - marketing and tag as alta'
          />

          <button onClick={() => sendDispute()}>Send</button>
        </div>
      </div>
    );
  }

  function renderDisputed() {
    return (
      <div className='line subtitle'>
        <div></div>
        <p className='disputed'>Transaction disputed</p>
      </div>
    );
  }

  async function sendDispute() {
    const prefix = convertTypeToPrefix(type);
    const link = `https://5097856.app.netsuite.com/app/accounting/transactions/${prefix}.nl?id=${internalid}`;

    const formatted = amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

    const text =
      `_New budget dispute for this <${link}|${type}> entry. (<@U074JB6LQSY>)_` +
      // `\n*Department:* ${department}` +
      `\n*Vendor:* ${entity || vendor}` +
      `\n*Amount:* ${formatted}` +
      `\n*Req. Change:* ${disputeText}`;

    const params = new URLSearchParams({
      text: text,
    });

    const url = `https://us-central1-dashboards-18dc2.cloudfunctions.net/disputeReceipt?${params.toString()}`;
    await axios.get(url);
    console.log("Notfying slack for disputed transaction");
    setStep(STEP.DISPUTED);
  }

  return (
    <div
      className='entry'
      onClick={() => {
        if (step === STEP.TAGS) {
          setStep(STEP.LINKS);
        }
        if (step === STEP.LINKS) {
          setStep(STEP.TAGS);
        }
      }}
    >
      <div className='line title'>
        <p>{entity || vendor}</p>
        <p>
          {amount.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </p>
      </div>

      <div className='line subtitle'>
        <p>{memo}</p>
        <p className='month'>{month}</p>
      </div>
      {renderOptions()}
    </div>
  );
}
