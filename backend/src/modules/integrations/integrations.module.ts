import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { GoogleCalendarService } from './google-calendar.service';
import { GoogleSheetsService } from './google-sheets.service';

@Module({
  providers: [EmailService, GoogleCalendarService, GoogleSheetsService],
  exports: [EmailService, GoogleCalendarService, GoogleSheetsService],
})
export class IntegrationsModule {}
