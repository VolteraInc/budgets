export type Transaction = {
  // From query
  date: string;
  department: string;
  class: string;
  project: string;
  account: string;
  period: string;
  entity: string;
  memo: string;
  tranid: string;
  type: string;

  internalid: string;
  amount: number;
  float: string;
  vendor: string;

  // Generated
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
