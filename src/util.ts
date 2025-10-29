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

function convertMonth(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed (0 = January)

  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0); // day 0 of next month = last day of current month

  return { startDate: formatDateMMDDYYYY(startDate), endDate: formatDateMMDDYYYY(endDate) };
}

function formatDateMMDDYYYY(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}
