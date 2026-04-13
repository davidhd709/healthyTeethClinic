"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const nodemailer = __importStar(require("nodemailer"));
const googleapis_1 = require("googleapis");
dotenv.config();
const COLORS = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m',
};
function ok(msg) {
    console.log(`${COLORS.green}✔${COLORS.reset} ${msg}`);
}
function fail(msg, err) {
    console.log(`${COLORS.red}✘${COLORS.reset} ${msg}`);
    if (err)
        console.log(`  ${COLORS.red}${err.message || err}${COLORS.reset}`);
}
function section(title) {
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
    }
    catch (err) {
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
        const auth = new googleapis_1.google.auth.JWT({
            email: clientEmail,
            key: privateKey,
            scopes: ['https://www.googleapis.com/auth/calendar'],
        });
        const calendar = googleapis_1.google.calendar({ version: 'v3', auth });
        const res = await calendar.calendars.get({ calendarId });
        ok(`Calendar accessible: "${res.data.summary}" (${res.data.timeZone})`);
    }
    catch (err) {
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
        const auth = new googleapis_1.google.auth.JWT({
            email: clientEmail,
            key: privateKey,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        const sheets = googleapis_1.google.sheets({ version: 'v4', auth });
        const res = await sheets.spreadsheets.get({ spreadsheetId });
        const sheetNames = res.data.sheets?.map((s) => s.properties?.title).join(', ');
        ok(`Sheet accessible: "${res.data.properties?.title}"`);
        ok(`Tabs: ${sheetNames}`);
    }
    catch (err) {
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
//# sourceMappingURL=test-integrations.js.map