/**
 * Google Sheets API через `googleapis`.
 *
 * Авторизация (один из вариантов):
 * - `GOOGLE_SERVICE_ACCOUNT_JSON` — строка с JSON ключом service account (удобно на Vercel).
 * - Локально: `GOOGLE_APPLICATION_CREDENTIALS` — путь к JSON-файлу ключа (ADC).
 *
 * Опционально: `GOOGLE_SHEETS_SPREADSHEET_ID` — дефолтная таблица для `getDefaultSpreadsheetId()`.
 */
import { google } from 'googleapis';

const SHEETS_SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

function parseServiceAccountJson() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw || typeof raw !== 'string' || !raw.trim()) return null;
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON must be valid JSON');
  }
}

export async function getSheetsAuthClient() {
  const credentials = parseServiceAccountJson();
  if (credentials) {
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: SHEETS_SCOPES,
    });
    return auth.getClient();
  }
  const auth = new google.auth.GoogleAuth({
    scopes: SHEETS_SCOPES,
  });
  return auth.getClient();
}

export async function getSheetsClient() {
  const auth = await getSheetsAuthClient();
  return google.sheets({ version: 'v4', auth });
}

export function getDefaultSpreadsheetId() {
  const id = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!id || typeof id !== 'string' || !id.trim()) return null;
  return id.trim();
}

/**
 * @param {string} spreadsheetId
 * @param {string} a1Range например "Arkusz1!A1:Z" или "Лист1!A2:E"
 * @returns {Promise<string[][]>}
 */
export async function readSheetRange(spreadsheetId, a1Range) {
  const sheets = await getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: a1Range,
  });
  return res.data.values ?? [];
}

/**
 * Добавляет строки в конец диапазона (как «Append» в UI).
 * @param {string} spreadsheetId
 * @param {string} a1Range например "Arkusz1!A1"
 * @param {string[][]} rows
 * @param {'RAW' | 'USER_ENTERED'} [valueInputOption]
 */
export async function appendSheetRows(
  spreadsheetId,
  a1Range,
  rows,
  valueInputOption = 'USER_ENTERED',
) {
  if (!rows?.length) {
    return { updatedRange: null, updatedRows: 0 };
  }
  const sheets = await getSheetsClient();
  const res = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: a1Range,
    valueInputOption,
    requestBody: { values: rows },
  });
  return {
    updatedRange: res.data.updates?.updatedRange ?? null,
    updatedRows: res.data.updates?.updatedRows ?? rows.length,
  };
}
