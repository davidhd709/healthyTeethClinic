import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, sheets_v4 } from 'googleapis';

export interface SheetAppointmentRow {
  createdAt: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientDocument?: string;
  serviceName: string;
  specialistName: string;
  date: string;
  time: string;
  status: string;
  reasonForVisit: string;
}

@Injectable()
export class GoogleSheetsService {
  private readonly logger = new Logger(GoogleSheetsService.name);
  private sheets: sheets_v4.Sheets | null = null;
  private spreadsheetId: string | null = null;
  private sheetRange: string = 'Citas!A:K';

  constructor(private config: ConfigService) {
    this.initSheets();
  }

  private initSheets(): void {
    const clientEmail = this.config.get<string>('GOOGLE_CLIENT_EMAIL');
    const privateKeyRaw = this.config.get<string>('GOOGLE_PRIVATE_KEY');
    const spreadsheetId = this.config.get<string>('GOOGLE_SHEET_ID');

    if (!clientEmail || !privateKeyRaw || !spreadsheetId) {
      this.logger.warn('Google Sheets credentials not set - sheets disabled');
      return;
    }

    const privateKey = privateKeyRaw.replace(/\\n/g, '\n');

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({ version: 'v4', auth });
    this.spreadsheetId = spreadsheetId;

    const customRange = this.config.get<string>('GOOGLE_SHEET_RANGE');
    if (customRange) this.sheetRange = customRange;
  }

  async appendAppointment(row: SheetAppointmentRow): Promise<void> {
    if (!this.sheets || !this.spreadsheetId) {
      this.logger.warn('Skipping sheet append (not configured)');
      return;
    }

    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: this.sheetRange,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: [
            [
              row.createdAt,
              row.patientName,
              row.patientEmail,
              row.patientPhone,
              row.patientDocument ?? '',
              row.serviceName,
              row.specialistName,
              row.date,
              row.time,
              row.status,
              row.reasonForVisit,
            ],
          ],
        },
      });
      this.logger.log(`Appointment row appended to sheet for ${row.patientName}`);
    } catch (err) {
      this.logger.error('Failed to append row to Google Sheet', err);
    }
  }
}
