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
var GoogleCalendarService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleCalendarService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const googleapis_1 = require("googleapis");
let GoogleCalendarService = GoogleCalendarService_1 = class GoogleCalendarService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(GoogleCalendarService_1.name);
        this.calendar = null;
        this.calendarId = null;
        this.initCalendar();
    }
    initCalendar() {
        const clientEmail = this.config.get('GOOGLE_CLIENT_EMAIL');
        const privateKeyRaw = this.config.get('GOOGLE_PRIVATE_KEY');
        const calendarId = this.config.get('GOOGLE_CALENDAR_ID');
        if (!clientEmail || !privateKeyRaw || !calendarId) {
            this.logger.warn('Google Calendar credentials not set - calendar disabled');
            return;
        }
        const privateKey = privateKeyRaw.replace(/\\n/g, '\n');
        const auth = new googleapis_1.google.auth.JWT({
            email: clientEmail,
            key: privateKey,
            scopes: ['https://www.googleapis.com/auth/calendar'],
        });
        this.calendar = googleapis_1.google.calendar({ version: 'v3', auth });
        this.calendarId = calendarId;
    }
    async createAppointmentEvent(data) {
        if (!this.calendar || !this.calendarId) {
            this.logger.warn('Skipping calendar event creation (not configured)');
            return null;
        }
        try {
            const startIso = this.buildIsoDate(data.date, data.time);
            const endIso = this.addMinutesToIso(startIso, data.serviceDurationMinutes);
            const response = await this.calendar.events.insert({
                calendarId: this.calendarId,
                requestBody: {
                    summary: `${data.serviceName} - ${data.patientName}`,
                    description: [
                        `👤 Paciente: ${data.patientName}`,
                        `📧 Email: ${data.patientEmail}`,
                        `📞 Teléfono: ${data.patientPhone}`,
                        `🦷 Servicio: ${data.serviceName}`,
                        `👨‍⚕️ Especialista: ${data.specialistName}`,
                        `📝 Motivo: ${data.reasonForVisit}`,
                    ].join('\n'),
                    start: {
                        dateTime: startIso,
                        timeZone: 'America/Bogota',
                    },
                    end: {
                        dateTime: endIso,
                        timeZone: 'America/Bogota',
                    },
                    reminders: {
                        useDefault: false,
                        overrides: [
                            { method: 'email', minutes: 24 * 60 },
                            { method: 'popup', minutes: 60 },
                        ],
                    },
                },
            });
            const eventId = response.data.id ?? null;
            this.logger.log(`Calendar event created: ${eventId}`);
            return eventId;
        }
        catch (err) {
            this.logger.error('Failed to create calendar event', err);
            return null;
        }
    }
    buildIsoDate(date, time) {
        return `${date}T${time}:00-05:00`;
    }
    addMinutesToIso(iso, minutes) {
        const d = new Date(iso);
        d.setMinutes(d.getMinutes() + minutes);
        const pad = (n) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00-05:00`;
    }
};
exports.GoogleCalendarService = GoogleCalendarService;
exports.GoogleCalendarService = GoogleCalendarService = GoogleCalendarService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GoogleCalendarService);
//# sourceMappingURL=google-calendar.service.js.map