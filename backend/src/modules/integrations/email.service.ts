import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export interface AppointmentEmailData {
  patientName: string;
  patientEmail: string;
  serviceName: string;
  specialistName: string;
  date: string;
  time: string;
  clinicAddress?: string;
  clinicPhone?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private config: ConfigService) {
    this.initTransporter();
  }

  private initTransporter(): void {
    const user = this.config.get<string>('EMAIL_USER');
    const pass = this.config.get<string>('EMAIL_PASSWORD');

    if (!user || !pass) {
      this.logger.warn('EMAIL_USER/EMAIL_PASSWORD not set - emails disabled');
      return;
    }

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
  }

  async sendAppointmentConfirmation(data: AppointmentEmailData): Promise<void> {
    if (!this.transporter) {
      this.logger.warn(`Skipping confirmation email for ${data.patientEmail} (no transporter)`);
      return;
    }

    const from = this.config.get<string>('EMAIL_FROM') || this.config.get<string>('EMAIL_USER');
    const clinicName = 'Healthy Teeth Clinic';

    try {
      await this.transporter.sendMail({
        from: `"${clinicName}" <${from}>`,
        to: data.patientEmail,
        subject: `Confirmación de cita - ${clinicName}`,
        html: this.buildConfirmationHtml(data, clinicName),
      });
      this.logger.log(`Confirmation email sent to ${data.patientEmail}`);
    } catch (err) {
      this.logger.error(`Failed to send email to ${data.patientEmail}`, err);
    }
  }

  private buildConfirmationHtml(data: AppointmentEmailData, clinicName: string): string {
    return `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background: #f5f7fa; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
    <div style="background: linear-gradient(135deg, #0d9488, #0891b2); padding: 32px; text-align: center;">
      <h1 style="color: #fff; margin: 0; font-size: 24px;">🦷 ${clinicName}</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">Confirmación de tu cita</p>
    </div>
    <div style="padding: 32px;">
      <h2 style="color: #0f172a; margin: 0 0 16px; font-size: 20px;">Hola ${data.patientName},</h2>
      <p style="color: #475569; line-height: 1.6;">
        Tu cita ha sido agendada exitosamente. A continuación los detalles:
      </p>
      <div style="background: #f8fafc; border-left: 4px solid #0d9488; padding: 20px; border-radius: 8px; margin: 24px 0;">
        <p style="margin: 8px 0;"><strong style="color: #0f172a;">Servicio:</strong> <span style="color: #475569;">${data.serviceName}</span></p>
        <p style="margin: 8px 0;"><strong style="color: #0f172a;">Especialista:</strong> <span style="color: #475569;">${data.specialistName}</span></p>
        <p style="margin: 8px 0;"><strong style="color: #0f172a;">Fecha:</strong> <span style="color: #475569;">${data.date}</span></p>
        <p style="margin: 8px 0;"><strong style="color: #0f172a;">Hora:</strong> <span style="color: #475569;">${data.time}</span></p>
      </div>
      ${
        data.clinicAddress
          ? `<p style="color: #475569; margin: 16px 0;"><strong>📍 Dirección:</strong> ${data.clinicAddress}</p>`
          : ''
      }
      ${
        data.clinicPhone
          ? `<p style="color: #475569; margin: 16px 0;"><strong>📞 Teléfono:</strong> ${data.clinicPhone}</p>`
          : ''
      }
      <p style="color: #475569; line-height: 1.6; margin-top: 24px;">
        Si necesitas cancelar o reagendar, contáctanos con al menos 24 horas de anticipación.
      </p>
      <p style="color: #475569; line-height: 1.6; margin-top: 24px;">
        ¡Te esperamos!<br>
        <strong style="color: #0f172a;">Equipo ${clinicName}</strong>
      </p>
    </div>
    <div style="background: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #94a3b8;">
      Este es un correo automático, por favor no respondas a este mensaje.
    </div>
  </div>
</body>
</html>`;
  }
}
