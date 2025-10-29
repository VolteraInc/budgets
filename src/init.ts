function init() {
  SpreadsheetApp.getUi()
    .createMenu("Review")
    .addItem("Transactions", "showTransactions")
    .addItem("Refresh Import", "refreshImport")
    .addToUi();
}
