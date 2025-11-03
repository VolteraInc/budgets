// Sample data
// {
//     date: 2024-12-23T05:00:00.000Z,
//     value: 6854.77,
//     class: '',
//     department: 'Engineering : Software',
//     account: '60000 - Gross Payroll',
//     period: 'Dec 2024',
//     entity: '',
//     memo: 'See payroll accrual sheet',
//     tranid: '2024 Dec-2'
//     type: Bill;
//   },

interface NetsuiteData {
  date: Date;
  value: number;
  class: string;
  department: string;
  account: string;
  period: string;
  entity: string;
  memo: string;
  tranid: string;
  type: string;
  invoice: string | null | undefined;
}

interface NetsuiteAccount {
  [account: string]: number[];
}

function queryNetsuite(
  startDate: string,
  endDate: string,
  deptIds: string,
  withProjectIds: string,
  withoutProjectIds: string,
  withClassIds: string,
  withoutClassIds: string,
  formatforImport: boolean
): NetsuiteData[] | NetsuiteAccount {
  const baseUrl = "https://us-central1-dashboards-18dc2.cloudfunctions.net/getCostsbyDepartment";
  // Encode the values to ensure special characters won't break the URL
  let url = baseUrl;

  // Dates are mandatory
  url += "?startDate=" + encodeURIComponent(startDate);
  url += "&endDate=" + encodeURIComponent(endDate);

  if (deptIds.length) {
    url += "&departments=" + encodeURIComponent(deptIds);
  }

  if (withProjectIds.length) {
    url += "&withProject=" + encodeURIComponent(withProjectIds);
  }

  if (withoutProjectIds.length) {
    url += "&withoutProject=" + encodeURIComponent(withoutProjectIds);
  }

  if (withClassIds.length) {
    url += "&withClass=" + encodeURIComponent(withClassIds);
  }

  if (withoutClassIds.length) {
    url += "&withoutClass=" + encodeURIComponent(withoutClassIds);
  }

  if (formatforImport) {
    url += "&sheets=true";
  }

  Logger.log(`Executing Query: ${url}`);

  // 4. Fetch the data
  const response = UrlFetchApp.fetch(url);

  const data = JSON.parse(response.getContentText());
  return data;
}
