function refreshImport() {
  const SS = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = SS.getSheetByName("_Import");

  if (!sheet) {
    throw Error("Could not find the _Import sheet.");
  }

  const { startDate, endDate, deptIds, withProjectIds, withoutProjectIds, withClassIds, withoutClassIds } =
    getDepartmentAndProjectIds();

  try {
    const data = queryNetsuite(
      startDate,
      endDate,
      deptIds,
      withProjectIds,
      withoutProjectIds,
      withClassIds,
      withoutClassIds,
      true
    ) as NetsuiteAccount;
    // 5. Clear old data from row 10 onward, preserving headers
    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    if (lastRow >= 10) {
      sheet.getRange(10, 1, lastRow - 9, lastCol).clearContent();
    }

    // 6. Write the timestamp in B1 (including time)
    const now = new Date();
    // Example format: January 10 2024 3:12 PM
    const dateString = Utilities.formatDate(now, "America/Toronto", "MMMM dd yyyy hh:mm a");
    sheet.getRange("D1").setValue(dateString);

    // 7. Convert the data into rows
    const accountNames = Object.keys(data);
    const rows: any[] = [];

    accountNames.forEach((key) => {
      // Prepend the key, add blank column if desired, then the data array

      const rowData = [key, "", ...data[key]];
      rows.push(rowData);
    });

    // 8. Write the data starting at A10
    if (rows.length > 0) {
      const numCols = rows[0].length;
      sheet.getRange(10, 1, rows.length, numCols).setValues(rows);

      // Optional: Auto-size
      // sheet.autoResizeColumns(1, numCols);
    }
  } catch (err) {
    Logger.log("Error fetching or writing data: " + err);
  }
}
