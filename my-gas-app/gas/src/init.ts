function onOpen() {
  const ui = SpreadsheetApp.getUi();
  Logger.log("Created sidebar menu");
  ui.createMenu("Budget")
    .addItem("Show Transactions", "showTransactions")
    .addItem("Refresh Import", "refreshImport")
    .addToUi();
}

function showTransactions() {
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
      </head>
      <body>
        <div id="root"></div>
        <script type="module" src="https://VolteraInc.github.io/budgets/assets/main.js?v=${version}"></script>
      </body>
    </html>
  `);
  html.setTitle("Transactions").setWidth(400);
  SpreadsheetApp.getUi().showSidebar(html);
}
