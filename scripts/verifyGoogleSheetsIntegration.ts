import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

// Load .env and .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true });

import { sendLeadToGoogleSheets } from '../src/services/googleSheetsLeadService';

async function main() {
  console.log('=== VERIFICANDO CONEXIÓN GOOGLE SHEETS LEADS ===');

  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const webhookSecret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;

  console.log('Webhook URL configurada:', webhookUrl ? `${webhookUrl.slice(0, 45)}...` : 'NO');
  console.log('Webhook Secret configurado:', webhookSecret ? 'SÍ (oculto)' : 'NO');

  if (!webhookUrl || !webhookSecret) {
    throw new Error('Variables de entorno GOOGLE_SHEETS_WEBHOOK_URL o GOOGLE_SHEETS_WEBHOOK_SECRET ausentes');
  }

  const testStamp = Date.now();
  const leadRegalos = {
    name: `Víctor Regalos Test ${testStamp}`,
    email: `regalos_${testStamp}@oratoriaefectiva.in`,
    source: 'regalos',
  };

  const leadWaitlist = {
    name: `Víctor Waitlist Test ${testStamp}`,
    email: `waitlist_${testStamp}@oratoriaefectiva.in`,
    source: 'waitlist',
  };

  console.log('\n1. Enviando lead de prueba desde /regalos...');
  const res1 = await sendLeadToGoogleSheets(leadRegalos);
  console.log('Resultado lead regalos:', res1);
  if (!res1.success) {
    throw new Error(`Fallo al enviar lead de regalos: ${res1.error} ${res1.detail || ''}`);
  }

  console.log('\n2. Enviando lead de prueba desde /waitlist...');
  const res2 = await sendLeadToGoogleSheets(leadWaitlist);
  console.log('Resultado lead waitlist:', res2);
  if (!res2.success) {
    throw new Error(`Fallo al enviar lead de waitlist: ${res2.error} ${res2.detail || ''}`);
  }

  console.log('\n3. Comprobando persistencia real en Google Sheets vía CSV público...');
  const spreadsheetId = '12LFJWRC6inYWhmt5Sh_hsyLGN6h140irI43dcy-4NYw';
  const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`;

  const csvResponse = await fetch(csvUrl);
  if (!csvResponse.ok) {
    throw new Error(`Error al leer CSV público de Google Sheets: HTTP ${csvResponse.status}`);
  }

  const csvText = await csvResponse.text();
  console.log('\nÚltimas líneas obtenidas de Google Sheets:');
  const lines = csvText.trim().split('\n');
  const recentLines = lines.slice(-4);
  recentLines.forEach(l => console.log('  ->', l.trim()));

  const foundRegalos = csvText.includes(leadRegalos.email);
  const foundWaitlist = csvText.includes(leadWaitlist.email);

  console.log(`\nVerificación en hoja:`);
  console.log(`- Lead Regalos (${leadRegalos.email}) encontrado: ${foundRegalos ? '✓ SÍ' : '✗ NO'}`);
  console.log(`- Lead Waitlist (${leadWaitlist.email}) encontrado: ${foundWaitlist ? '✓ SÍ' : '✗ NO'}`);

  if (!foundRegalos || !foundWaitlist) {
    throw new Error('Uno o más leads enviados no se encontraron en la hoja de cálculo');
  }

  const report = {
    timestamp: new Date().toISOString(),
    spreadsheetId,
    webhookUrl,
    leadRegalosVerified: foundRegalos,
    leadWaitlistVerified: foundWaitlist,
    totalRowsInSheet: lines.length,
    recentRows: recentLines,
  };

  const reportPath = path.resolve(process.cwd(), 'scratch', 'google-sheets-verification-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nReporte de evidencia guardado en ${reportPath}`);
  console.log('=== VERIFICACIÓN EXITOSA: 100% OPERATIVO ===');
}

main().catch(err => {
  console.error('\nERROR EN VERIFICACIÓN:', err);
  process.exit(1);
});
