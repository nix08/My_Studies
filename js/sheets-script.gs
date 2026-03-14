/**
 * MY STUDIES — Google Apps Script
 * ─────────────────────────────────────────────────────────────────────────
 * HOW TO SET UP
 *
 * 1. Create a Google Sheet. Note the Spreadsheet ID from its URL:
 *      docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
 *
 * 2. Create a Google Drive folder for uploaded certificates.
 *    Note the Folder ID from its URL:
 *      drive.google.com/drive/folders/FOLDER_ID
 *
 * 3. Go to https://script.google.com → New project.
 *    Paste this entire file into the editor (replace the default code).
 *
 * 4. Replace SPREADSHEET_ID and DRIVE_FOLDER_ID below with your values.
 *
 * 5. Click Deploy → New deployment → Web app.
 *      Execute as  : Me
 *      Who has access : Anyone
 *    Authorise when prompted, then copy the Web App URL.
 *
 * 6. Paste that URL into js/main.js where it says
 *    'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL'.
 * ─────────────────────────────────────────────────────────────────────────
 */

const SPREADSHEET_ID  = 'YOUR_SPREADSHEET_ID_HERE';
const DRIVE_FOLDER_ID = 'YOUR_DRIVE_FOLDER_ID_HERE'; // folder for certificate uploads

const ENQUIRIES_SHEET   = 'Enquiries';    // "Start Your Journey" form
const SCHOLARSHIP_SHEET = 'Scholarships'; // Scholarship application form

// ── ROUTER ───────────────────────────────────────────────────────────────
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    return data.type === 'scholarship'
      ? handleScholarship(data)
      : handleEnquiry(data);
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.message });
  }
}

// ── ENQUIRY (Start Your Journey Today) ───────────────────────────────────
function handleEnquiry(data) {
  const headers = [
    'Timestamp', 'Name', 'Phone', 'Email', 'Date of Birth',
    'Education Level', 'Marks / CGPA', 'Course', 'Preferred Location',
    'Budget', 'Hostel Required', 'Message'
  ];
  const sheet = getOrCreateSheet(ENQUIRIES_SHEET, headers);

  sheet.appendRow([
    data.timestamp || now(),
    data.name      || '',
    data.phone     || '',
    data.email     || '',
    data.dob       || '',
    data.education || '',
    data.marks     || '',
    data.course    || '',
    data.location  || '',
    data.budget    || '',
    data.hostel    || '',
    data.message   || ''
  ]);

  return jsonResponse({ status: 'success' });
}

// ── SCHOLARSHIP APPLICATION ───────────────────────────────────────────────
function handleScholarship(data) {
  const headers = [
    'Timestamp', 'Name', 'Phone', 'Email', 'Date of Birth',
    'Education Level', 'Marks / CGPA', 'Course', 'State', 'Address',
    'Why Deserve Scholarship', 'SSLC Certificate', 'Plus Two Certificate'
  ];
  const sheet = getOrCreateSheet(SCHOLARSHIP_SHEET, headers);

  const sslcLink    = uploadFile(data.sslcFile,    data.sslcName,    'SSLC');
  const plusTwoLink = uploadFile(data.plusTwoFile, data.plusTwoName, 'PlusTwo');

  sheet.appendRow([
    data.timestamp || now(),
    data.name      || '',
    data.phone     || '',
    data.email     || '',
    data.dob       || '',
    data.education || '',
    data.marks     || '',
    data.course    || '',
    data.state     || '',
    data.address   || '',
    data.message   || '',
    sslcLink,
    plusTwoLink
  ]);

  return jsonResponse({ status: 'success' });
}

// ── FILE UPLOAD TO GOOGLE DRIVE ───────────────────────────────────────────
function uploadFile(base64Data, fileName, prefix) {
  if (!base64Data || !fileName) return '—';
  try {
    const folder   = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    const decoded  = Utilities.base64Decode(base64Data);
    const mimeType = detectMime(fileName);
    const blob     = Utilities.newBlob(decoded, mimeType, prefix + '_' + fileName);
    const file     = folder.createFile(blob);
    // Make viewable by anyone with the link
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return file.getUrl();
  } catch (err) {
    return 'Upload error: ' + err.message;
  }
}

function detectMime(fileName) {
  const ext = fileName.split('.').pop().toLowerCase();
  const map = {
    pdf:  'application/pdf',
    jpg:  'image/jpeg',
    jpeg: 'image/jpeg',
    png:  'image/png'
  };
  return map[ext] || 'application/octet-stream';
}

// ── HELPERS ───────────────────────────────────────────────────────────────
function getOrCreateSheet(name, headers) {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  let   sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
  return sheet;
}

function now() {
  return new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Optional: smoke-test by opening the Web App URL in a browser
function doGet() {
  return ContentService
    .createTextOutput('MY STUDIES — Sheets endpoint is live.')
    .setMimeType(ContentService.MimeType.TEXT);
}
