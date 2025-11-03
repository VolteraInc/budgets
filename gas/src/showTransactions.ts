type Transaction = {
  account: string;
  amount: number;
  project: string;
  class: string;
  invoice: string;
  memo: string;
  // Plus others...
};

type Payload = {
  initialAccount: string;
  date: Date;
  forecastedAccounts: {
    [account: string]: number;
  };
  allTransactions: Transaction[];
};

function showTransactions() {
  try {
    // Extract the active cell & forecasted amounts. .
    const initialAccount = getActiveCellValue();
    const forecastedAccounts = getForecastedValuesForActiveMonth();
    const { startDate, endDate } = getActiveCellMonths();

    // Extract department, class and project parameters
    const filters = getDepartmentAndProjectIds();
    const { deptIds, withProjectIds, withoutProjectIds, withClassIds, withoutClassIds } = filters;

    // Fetch from netsuite.
    const data = getFromNetsuite(
      startDate,
      endDate,
      deptIds,
      withProjectIds,
      withoutProjectIds,
      withClassIds,
      withoutClassIds
    );

    // Fetch invoices if possible.
    // const withInvoices = listWithInvoices(filteredList);

    const payload: Payload = {
      initialAccount,
      date: new Date(startDate),
      forecastedAccounts,
      allTransactions: data,
    };

    showSidebar(payload);
  } catch (error: any) {
    Logger.log(`Error: ${JSON.stringify(error)}`);
    SpreadsheetApp.getUi().alert(error.message);
  }
}

function showSidebar(payload: Payload) {
  const propsJson = JSON.stringify(payload);

  // During development - add a version parameter so it pulls the freshest
  // Assets from Github pages.

  const version = new Date().getTime(); // or pull from PropertiesService
  const html = HtmlService.createHtmlOutput(`
        <!doctype html>
        <html>
        <head>
        <meta charset="UTF-8" />
        <title>Transactions</title>
        <link rel="stylesheet" href="https://VolteraInc.github.io/budgets/assets/index.css?v=${version}">
        <script>
        // Make data available to React
        window.__APP_PROPS__ = ${propsJson};
        </script>
        </head>
        <body>
        <div id="root"></div>
        <script type="module" src="https://VolteraInc.github.io/budgets/assets/main.js?v=${version}"></script>
        </body>
        </html>
        `);

  html.setTitle("Transactions").setWidth(320); // Set width doesn't do anything I think
  SpreadsheetApp.getUi().showSidebar(html);
}

function getFromNetsuite(
  startDate: string,
  endDate: string,
  deptIds: string,
  withProjectIds: string,
  withoutProjectIds: string,
  withClassIds: string,
  withoutClassIds: string
) {
  // Get data from cache if it exists (prevents duplicate calls)
  const cache = CacheService.getScriptCache();
  const cacheName = `${deptIds}-${startDate}-actuals`;
  const cached = cache.get(cacheName);
  if (cached != null) {
    Logger.log(`Retrieved ${cacheName} from cache`);
    return JSON.parse(cached);
  }
  const data = queryNetsuite(
    startDate,
    endDate,
    deptIds,
    withProjectIds,
    withoutProjectIds,
    withClassIds,
    withoutClassIds,
    false
  );
  cache.put(cacheName, JSON.stringify(data), 300); // cache for 5 minutes
  return data;
}
