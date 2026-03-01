/**
 * MY STUDIES — Google Apps Script
 * ─────────────────────────────────────────────────────────────
 * HOW TO SET UP
 * 1. Go to https://script.google.com → New project.
 * 2. Paste this entire file into the editor (replace the default code).
 * 3. Replace SPREADSHEET_ID below with your Google Sheet's ID.
 *    (Open the sheet → the URL looks like:
 *     docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit)
 * 4. Click Deploy → New deployment → Web app.
 *    • Execute as : Me
 *    • Who has access : Anyone
 * 5. Authorise when prompted, then copy the Web App URL.
 * 6. Paste that URL into js/main.js where it says
 *    'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL'.
 */

const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME     = 'Enquiries';   // change if your sheet tab has a different name

function doPost(e) {
  try {
    const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
    let   sheet = ss.getSheetByName(SHEET_NAME);

    // Auto-create the sheet + header row on first run
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['Timestamp', 'Name', 'Phone', 'Email', 'Course Interest', 'Budget', 'Message']);
      sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
    }

    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.timestamp || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      data.name    || '',
      data.phone   || '',
      data.email   || '',
      data.course  || '',
      data.budget  || '',
      data.message || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: test by running doGet in the editor
function doGet() {
  return ContentService
    .createTextOutput('MY STUDIES — Sheets endpoint is live.')
    .setMimeType(ContentService.MimeType.TEXT);
}
