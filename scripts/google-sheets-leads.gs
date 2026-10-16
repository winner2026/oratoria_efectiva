/**
 * Víctor Martínez Pro: registra solicitudes del lead magnet en la hoja configurada.
 * Publica este proyecto como aplicación web y configura las propiedades indicadas
 * en docs/REGISTRO_REGALOS_GOOGLE.md.
 */
function doPost(e) {
  try {
    const properties = PropertiesService.getScriptProperties();
    const expectedSecret = properties.getProperty('WEBHOOK_SECRET');
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    if (!expectedSecret || body.secret !== expectedSecret) {
      return jsonResponse({ success: false, error: 'unauthorized' });
    }

    const name = normalizeText(body.name, 120);
    const email = normalizeText(body.email, 254).toLowerCase();
    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ success: false, error: 'invalid input' });
    }

    // ID de la hoja compartida por el usuario. Puede sobrescribirse en propiedades.
    const spreadsheetId = properties.getProperty('SPREADSHEET_ID') || '12LFJWRC6inYWhmt5Sh_hsyLGN6h140irI43dcy-4NYw';
    if (!spreadsheetId) {
      throw new Error('Configure SPREADSHEET_ID in Script Properties');
    }
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);

    let sheet = spreadsheet.getSheetByName('Registros');
    if (!sheet) sheet = spreadsheet.insertSheet('Registros');
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Fecha y hora', 'Nombre', 'Correo electrónico', 'Origen']);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
    }

    sheet.appendRow([
      new Date(),
      safeCell(name),
      safeCell(email),
      safeCell(normalizeText(body.source || 'regalos', 80)),
    ]);

    return jsonResponse({ success: true });
  } catch (error) {
    const detail = error && error.message ? String(error.message) : String(error);
    console.error('Lead registration failed:', detail, error && error.stack);
    return jsonResponse({ success: false, error: 'registration failed', detail: detail });
  }
}

function normalizeText(value, maxLength) {
  return String(value == null ? '' : value).trim().replace(/\s+/g, ' ').slice(0, maxLength);
}

function safeCell(value) {
  const text = String(value == null ? '' : value);
  return /^[=+\-@\t\r]/.test(text) ? "'" + text : text;
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
