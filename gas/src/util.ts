// Returns a deptId and Project Ids as a string.
function getDepartmentAndProjectIds() {
  const SS = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = SS.getSheetByName("_Import");

  if (!sheet) {
    throw Error("Could not find the '_Import' sheet.");
  }

  // 1. Read all filter values in a single batch call (D2:D7)
  const values = sheet.getRange("D2:D7").getValues().flat() as [any, any, any, any, any, any];

  const [deptIds, fiscalYear, withProjectIds, withoutProjectIds, withClassIds, withoutClassIds] = values;

  // 2. If either is empty, wipe the sheet and post message and stop.
  if (!fiscalYear) {
    sheet.getRange("D1").setValue("No fiscal year set");
    throw Error("Set your fiscal year in D2");
  }

  const { startDate, endDate } = convertYear(parseInt(fiscalYear));

  return {
    startDate,
    endDate,
    deptIds: deptIds.toString() as string,
    withProjectIds: withProjectIds.toString() as string,
    withoutProjectIds: withoutProjectIds.toString() as string,
    withClassIds: withClassIds.toString() as string,
    withoutClassIds: withoutClassIds.toString() as string,
  };
}

function convertYear(fiscalYear: number): { startDate: string; endDate: string } {
  let startDate = "";
  let endDate = "";

  switch (fiscalYear) {
    case 2024:
      startDate = "10/01/2023";
      endDate = "09/30/2024";
      break;
    case 2025:
      startDate = "10/01/2024";
      endDate = "09/30/2025";
      break;
    case 2026:
      startDate = "10/01/2025";
      endDate = "09/30/2026";
      break;
    case 2027:
      startDate = "10/01/2026";
      endDate = "09/30/2027";
      break;
    case 2028:
      startDate = "10/01/2027";
      endDate = "09/30/2028";
      break;
    default:
      throw new Error("Invalid fiscal year");
  }

  return { startDate, endDate };
}

function getActiveCellValue() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();

  if (!sheet) {
    throw new Error("No active sheet found.");
  }

  const cell = sheet.getActiveCell();
  if (!cell) {
    throw new Error("No active cell selected.");
  }

  const row = cell.getRow();
  const value = sheet.getRange(row, 1).getValue();
  return value;
}

function getActiveCellMonths() {
  const SS = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = SS.getActiveSheet();
  const cell = sheet.getActiveCell();

  // Extract date range from the column header.
  const date = new Date(sheet.getRange(1, cell.getColumn()).getValue());
  const { startDate, endDate } = _convertMonth(date);
  return { startDate, endDate };
}

function _convertMonth(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed (0 = January)

  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0); // day 0 of next month = last day of current month

  return { startDate: _formatDateMMDDYYYY(startDate), endDate: _formatDateMMDDYYYY(endDate) };
}

function _formatDateMMDDYYYY(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

function getForecastedValuesForActiveMonth() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  const cell = sheet.getActiveCell();

  const activeRow = cell.getRow();
  const activeCol = cell.getColumn();
  const lastRow = sheet.getLastRow();

  // Read column A so we can find where the Forecasted section starts
  const colA = sheet.getRange(1, 1, lastRow, 1).getValues().flat();
  const forecastLabelIndex = colA.findIndex((v) => String(v).toLowerCase() === "forecasted");

  if (forecastLabelIndex === -1) {
    throw new Error("Could not find a row labeled 'Forecasted' in column A");
  }

  const forecastLabelRow = forecastLabelIndex + 1; // convert index to row number

  // Only allow selecting from the Actuals section (above Forecasted)
  if (activeRow >= forecastLabelRow) {
    throw new Error("Select a cell from the Actuals section (above 'Forecasted').");
  }

  // Optional: this is the month header for the chosen column
  const monthHeaderRow = 2; // adjust if your month headers are on a different row
  const month = sheet.getRange(monthHeaderRow, activeCol).getDisplayValue();
  Logger.log("Getting forecasted values for: " + month);

  // Start scanning a bit below the "Forecasted" label
  const forecastStartRow = forecastLabelRow + 1;
  const height = lastRow - forecastStartRow + 1;

  // Get all account names and the values for the chosen month column in one shot
  const accountNames = sheet.getRange(forecastStartRow, 1, height, 1).getDisplayValues().flat();
  const monthValues = sheet.getRange(forecastStartRow, activeCol, height, 1).getValues().flat();

  const result: { [key: string]: number } = {};

  for (let i = 0; i < height; i++) {
    const name = accountNames[i];

    // Skip blank rows and section headers
    if (!name) {
      continue;
    }
    // Only take rows that start with a 5-digit account code like "59001 - ..."
    if (!/^\d{5}/.test(name)) {
      continue;
    }

    result[name] = monthValues[i] || 0;
  }

  // Logger.log(JSON.stringify(result, null, 2));
  return result;
}
