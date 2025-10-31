export type Transaction = {
  date: string;
  value: number;
  department: string;
  class: string;
  project: string;
  account: string;
  period: string;
  entity: string;
  memo: string;
  tranid: string;
  type: string;
  invoice?: string | null;
};

export type Payload = {
  active: {
    accountName: string;
    amountForecast: number;
  };
  date: string;
  allTransactions: Transaction[];
};
