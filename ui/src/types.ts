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
  initialAccount: string;
  date: string;
  forecastedAccounts: {
    [account: string]: number;
  };
  allTransactions: Transaction[];
};
