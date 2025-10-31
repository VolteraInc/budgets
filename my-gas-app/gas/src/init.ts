function onOpen() {
  const ui = SpreadsheetApp.getUi();
  Logger.log("Created sidebar menu");
  ui.createMenu("Voltera")
    .addItem("Show Transactions", "showTransactions")
    .addItem("Refresh Import", "refreshImport")
    .addToUi();
}
