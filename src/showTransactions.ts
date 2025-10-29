function showTransactions() {
  try {
    const SS = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = SS.getActiveSheet();
    const cell = sheet.getActiveCell();

    // Extract department, class and project parameters
    const filters = getDepartmentAndProjectIds();
    const { deptIds, withProjectIds, withoutProjectIds, withClassIds, withoutClassIds } = filters;

    // Extract date range from the column header.
    const date = new Date(sheet.getRange(1, cell.getColumn()).getValue());
    const { startDate, endDate } = convertMonth(date);

    const data = getFromNetsuite(
      startDate,
      endDate,
      deptIds,
      withProjectIds,
      withoutProjectIds,
      withClassIds,
      withoutClassIds
    );

    const accountName = sheet.getRange(cell.getRow(), 1).getValue();
    const filteredList = data.filter((element) => element.account === accountName);
    const totalAmount = cell.getValue();

    // Fetch invoices if possible.
    const withInvoices = listWithInvoices(filteredList);

    showDetail(withInvoices, accountName, date, totalAmount);
  } catch (error: any) {
    Logger.log(`Error: ${error.message}`);
    SpreadsheetApp.getUi().alert("An error occurred. Please try again or contact Shawn for assistance.");
  }
}

function getFromNetsuite(
  startDate: string,
  endDate: string,
  deptIds: string,
  withProjectIds: string,
  withoutProjectIds: string,
  withClassIds: string,
  withoutClassIds: string
): NetsuiteData[] {
  // Get data from cache if it exists
  // This prevents duplicate calls on cells within the same month
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
  ) as NetsuiteData[];

  cache.put(cacheName, JSON.stringify(data), 300); // cache for 5 minutes
  return data;
}

function showDetail(data: NetsuiteData[], acctName: string, date: Date, totalAmount: number) {
  const detailedAmount = data.reduce((sum, { value }) => sum + value, 0);
  Logger.log(`Total Amount for ${acctName} : ${detailedAmount}`);

  const html = HtmlService.createTemplateFromFile("_sidebar");

  html.data = data;
  html.month = Utilities.formatDate(date, "America/Toronto", "MMMM yyyy");
  html.amount = toDollars(detailedAmount, 0);
  html.match = Math.round(totalAmount) === Math.round(detailedAmount);
  html.account = acctName;

  const output = html
    .evaluate()
    .setTitle("Account Detail")
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setWidth(420);
  SpreadsheetApp.getUi().showSidebar(output);
}

// Date created within the month ranges selected
// Match vendor name to the vendor on the line selected

function listWithInvoices(list: NetsuiteData[]): NetsuiteData[] {
  const mapped = list.map((transaction) => {
    // Decide which lookup to do
    let invoice: string | null;
    if (transaction.type === "VendBill") {
      invoice = findInvoice(transaction.tranid, "bill");
    } else if (/\binvoice\b|\breceipt\b/i.test(transaction.memo)) {
      invoice = findInvoice(transaction.memo, "receipt");
    } else {
      invoice = null;
    }

    // Appends invoice to our transaction data.
    return {
      ...transaction,
      invoice,
    };
  });

  return mapped;
}

/**
 * Renders a partial template and returns its HTML string.
 * Usage in templates: <?!= include('_newline', { amount: 123 }) ?>
 */
function include<T extends object = Record<string, unknown>>(filename: string, data?: T): string {
  const tpl: GoogleAppsScript.HTML.HtmlTemplate = HtmlService.createTemplateFromFile(filename);
  if (data) {
    Object.assign(tpl, data); // expose each key in 'data' as a top-level template variable
  }
  return tpl.evaluate().getContent(); // return HTML string for insertion with <?!= ... ?>
}

/**
 * Inlines a template without injecting data.
 * Usage in templates: <?!= require('_style') ?>
 */
function require(filename: string): string {
  return include(filename);
}

const toDollars = (num: number, digits = 2) =>
  new Intl.NumberFormat("us-EN", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: digits,
  }).format(num);
