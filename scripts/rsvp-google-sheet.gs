/**
 * RSVP -> Google Sheets receiver.
 *
 * Paste this into the Google Sheet's Extensions → Apps Script editor, set the
 * SECRET below to the same value as RSVP_SHEET_SECRET in the website's env,
 * then Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone).
 * Put the resulting /exec URL in RSVP_SHEET_URL.
 */

const SECRET = "GANTI_DENGAN_KODE_RAHASIA";
const SHEET_NAME = "RSVP";
const MAX_WISHES = 300;
const HEADERS = ["Waktu", "Nama", "Kehadiran", "Jumlah Tamu", "Ucapan & Doa", "Link Tamu (?to=)"];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.secret !== SECRET) return json({ ok: false, error: "unauthorized" });

    const sheet = getSheet();
    // Serialise concurrent submissions so rows never overwrite each other.
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      sheet.appendRow([
        new Date(),
        safe(data.name),
        safe(data.attendance),
        Number(data.guests) || 0,
        safe(data.message),
        safe(data.invitee),
      ]);
    } finally {
      lock.releaseLock();
    }
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

// ?action=wishes&secret=... returns the latest wishes (rows with a message)
// for the guest book. Without it, opening the /exec URL in a browser just
// checks the deployment is live.
function doGet(e) {
  const params = (e && e.parameter) || {};
  if (params.action !== "wishes") return json({ ok: true, service: "rsvp" });
  if (params.secret !== SECRET) return json({ ok: false, error: "unauthorized" });

  const sheet = getSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return json({ ok: true, wishes: [] });

  const rows = sheet.getRange(2, 1, lastRow - 1, 5).getValues();
  const wishes = [];
  for (let i = rows.length - 1; i >= 0 && wishes.length < MAX_WISHES; i--) {
    const [time, name, attendance, , message] = rows[i];
    const text = String(message || "").replace(/^'/, "").trim();
    if (!text) continue;
    wishes.push({
      name: String(name || "").replace(/^'/, ""),
      attendance: String(attendance || ""),
      message: text,
      time: time instanceof Date ? time.toISOString() : "",
    });
  }
  return json({ ok: true, wishes: wishes });
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold").setBackground("#f3e6c8");
    sheet.setFrozenRows(1);
    sheet.getRange("A:A").setNumberFormat("dd/MM/yyyy HH:mm");
    sheet.setColumnWidth(2, 180);
    sheet.setColumnWidth(5, 360);
  }
  return sheet;
}

// Text starting with = + - @ would be run as a formula by Sheets/Excel; prefix it.
function safe(value) {
  const text = String(value == null ? "" : value).slice(0, 500);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
