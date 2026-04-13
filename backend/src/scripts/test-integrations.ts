/* eslint-disable no-console */
/**
 * Integration smoke test
 * Run: npx ts-node -r tsconfig-paths/register src/scripts/test-integrations.ts
 */
import * as dotenv from 'dotenv';
import * as nodemailer from 'nodemailer';
import { google } from 'googleapis';

dotenv.config();

const COLORS = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
};

function ok(msg: string) {
  console.log(`${COLORS.green}✔${COLORS.reset} ${msg}`);
}
function fail(msg: string, err?: unknown) {
  console.log(`${COLORS.red}✘${COLORS.reset} ${msg}`);
  if (err) console.log(`  ${COLORS.red}${(err as Error).message || err}${COLORS.reset}`);
}
function section(title: string) {
  console.log(`\n${COLORS.cyan}▶ ${title}${COLORS.reset}`);
}

async function testEmail() {
  section('Email (Gmail SMTP)');
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;

  if (!user || !pass) {
    fail('EMAIL_USER/EMAIL_PASSWORD not set');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });

  try {
    await transporter.verify();
    ok(`Gmail SMTP connection verified for ${user}`);
  } catch (err) {
    fail('Gmail SMTP verify failed', err);
  }
}

async function testCalendar() {
  section('Google Calendar');
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  if (!clientEmail || !privateKey || !calendarId) {
    fail('Missing GOOGLE_CLIENT_EMAIL / GOOGLE_PRIVATE_KEY / GOOGLE_CALENDAR_ID');
    return;
  }

  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });
    const calendar = google.calendar({ version: 'v3', auth });
    const res = await calendar.calendars.get({ calendarId });
    ok(`Calendar accessible: "${res.data.summary}" (${res.data.timeZone})`);
  } catch (err) {
    fail('Calendar access failed', err);
    console.log(`  ${COLORS.yellow}Did you share the calendar with ${clientEmail} as editor?${COLORS.reset}`);
  }
}

async function testSheets() {
  section('Google Sheets');
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!clientEmail || !privateKey || !spreadsheetId) {
    fail('Missing GOOGLE_CLIENT_EMAIL / GOOGLE_PRIVATE_KEY / GOOGLE_SHEET_ID');
    return;
  }

  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const sheets = google.sheets({ version: 'v4', auth });
    const res = await sheets.spreadsheets.get({ spreadsheetId });
    const sheetNames = res.data.sheets?.map((s) => s.properties?.title).join(', ');
    ok(`Sheet accessible: "${res.data.properties?.title}"`);
    ok(`Tabs: ${sheetNames}`);
  } catch (err) {
    fail('Sheet access failed', err);
    console.log(`  ${COLORS.yellow}Did you share the sheet with ${clientEmail} as editor?${COLORS.reset}`);
  }
}

async function main() {
  console.log(`${COLORS.cyan}================================${COLORS.reset}`);
  console.log(`${COLORS.cyan}  Integration Smoke Test${COLORS.reset}`);
  console.log(`${COLORS.cyan}================================${COLORS.reset}`);

  await testEmail();
  await testCalendar();
  await testSheets();

  console.log('');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
