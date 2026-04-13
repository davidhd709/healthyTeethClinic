import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, calendar_v3 } from 'googleapis';

export interface CalendarEventData {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  serviceName: string;
  serviceDurationMinutes: number;
  specialistName: string;
  date: string;
  time: string;
  reasonForVisit: string;
}

@Injectable()
export class GoogleCalendarService {
  private readonly logger = new Logger(GoogleCalendarService.name);
  private calendar: calendar_v3.Calendar | null = null;
  private calendarId: string | null = null;

  constructor(private config: ConfigService) {
    this.initCalendar();
  }

  private initCalendar(): void {
    const clientEmail = this.config.get<string>('GOOGLE_CLIENT_EMAIL');
    const privateKeyRaw = this.config.get<string>('GOOGLE_PRIVATE_KEY');
    const calendarId = this.config.get<string>('GOOGLE_CALENDAR_ID');

    if (!clientEmail || !privateKeyRaw || !calendarId) {
      this.logger.warn('Google Calendar credentials not set - calendar disabled');
      return;
    }

    // Private key often comes escaped from .env (with \n literal), convert to real newlines
    const privateKey = privateKeyRaw.replace(/\\n/g, '\n');

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    this.calendar = google.calendar({ version: 'v3', auth });
    this.calendarId = calendarId;
  }

  async createAppointmentEvent(data: CalendarEventData): Promise<string | null> {
    if (!this.calendar || !this.calendarId) {
      this.logger.warn('Skipping calendar event creation (not configured)');
      return null;
    }

    try {
      // date is 'YYYY-MM-DD', time is 'HH:MM'
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
          // Attendees disabled: service accounts need Domain-Wide Delegation to invite them.
          // Confirmation email to the patient is sent separately via EmailService.
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
    } catch (err) {
      this.logger.error('Failed to create calendar event', err);
      return null;
    }
  }

  private buildIsoDate(date: string, time: string): string {
    // date: YYYY-MM-DD, time: HH:MM -> YYYY-MM-DDTHH:MM:00-05:00 (Bogota)
    return `${date}T${time}:00-05:00`;
  }

  private addMinutesToIso(iso: string, minutes: number): string {
    const d = new Date(iso);
    d.setMinutes(d.getMinutes() + minutes);
    // keep Bogota offset
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00-05:00`;
  }
}
