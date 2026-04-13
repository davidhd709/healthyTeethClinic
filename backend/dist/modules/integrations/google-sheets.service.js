"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var GoogleSheetsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleSheetsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const googleapis_1 = require("googleapis");
let GoogleSheetsService = GoogleSheetsService_1 = class GoogleSheetsService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(GoogleSheetsService_1.name);
        this.sheets = null;
        this.spreadsheetId = null;
        this.sheetRange = 'Citas!A:K';
        this.initSheets();
    }
    initSheets() {
        const clientEmail = this.config.get('GOOGLE_CLIENT_EMAIL');
        const privateKeyRaw = this.config.get('GOOGLE_PRIVATE_KEY');
        const spreadsheetId = this.config.get('GOOGLE_SHEET_ID');
        if (!clientEmail || !privateKeyRaw || !spreadsheetId) {
            this.logger.warn('Google Sheets credentials not set - sheets disabled');
            return;
        }
        const privateKey = privateKeyRaw.replace(/\\n/g, '\n');
        const auth = new googleapis_1.google.auth.JWT({
            email: clientEmail,
            key: privateKey,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        this.sheets = googleapis_1.google.sheets({ version: 'v4', auth });
        this.spreadsheetId = spreadsheetId;
        const customRange = this.config.get('GOOGLE_SHEET_RANGE');
        if (customRange)
            this.sheetRange = customRange;
    }
    async appendAppointment(row) {
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
        }
        catch (err) {
            this.logger.error('Failed to append row to Google Sheet', err);
        }
    }
};
exports.GoogleSheetsService = GoogleSheetsService;
exports.GoogleSheetsService = GoogleSheetsService = GoogleSheetsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GoogleSheetsService);
//# sourceMappingURL=google-sheets.service.js.map