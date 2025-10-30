type InvoiceKind = "bill" | "receipt";

/**
 * Returns a Drive URL if found, otherwise null.
 * `invoiceKey` can be a tranid (for bills) or some memo text (for receipts).
 */
function findInvoice(invoiceKey: string, kind: InvoiceKind = "bill"): string | null {
  if (!invoiceKey) {
    return null;
  }

  // Folder IDs by kind
  const FOLDERS: Record<InvoiceKind, string> = {
    bill: "1WzXA3qPvv5puMP3c-2fJjvi5qfJNYUB1",
    receipt: "1TqNo37up_a_Z2GhlSwIvI8x7dDvdmtdz",
  };

  // Escape any embedded quotes for the Drive query
  const needle = String(invoiceKey).trim().replace(/"/g, '\\"');
  const query = `fullText contains "${needle}"`;

  const folder = DriveApp.getFolderById(FOLDERS[kind]);
  const files = folder.searchFiles(query);

  // Return the first match or null
  if (files.hasNext()) {
    const file = files.next();
    return file.getUrl();
  }
  return null;
}
