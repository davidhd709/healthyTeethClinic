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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
let EmailService = EmailService_1 = class EmailService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(EmailService_1.name);
        this.transporter = null;
        this.initTransporter();
    }
    initTransporter() {
        const user = this.config.get('EMAIL_USER');
        const pass = this.config.get('EMAIL_PASSWORD');
        if (!user || !pass) {
            this.logger.warn('EMAIL_USER/EMAIL_PASSWORD not set - emails disabled');
            return;
        }
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user, pass },
        });
    }
    async sendAppointmentConfirmation(data) {
        if (!this.transporter) {
            this.logger.warn(`Skipping confirmation email for ${data.patientEmail} (no transporter)`);
            return;
        }
        const from = this.config.get('EMAIL_FROM') || this.config.get('EMAIL_USER');
        const clinicName = 'Healthy Teeth Clinic';
        try {
            await this.transporter.sendMail({
                from: `"${clinicName}" <${from}>`,
                to: data.patientEmail,
                subject: `Confirmación de cita - ${clinicName}`,
                html: this.buildConfirmationHtml(data, clinicName),
            });
            this.logger.log(`Confirmation email sent to ${data.patientEmail}`);
        }
        catch (err) {
            this.logger.error(`Failed to send email to ${data.patientEmail}`, err);
        }
    }
    buildConfirmationHtml(data, clinicName) {
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
      ${data.clinicAddress
            ? `<p style="color: #475569; margin: 16px 0;"><strong>📍 Dirección:</strong> ${data.clinicAddress}</p>`
            : ''}
      ${data.clinicPhone
            ? `<p style="color: #475569; margin: 16px 0;"><strong>📞 Teléfono:</strong> ${data.clinicPhone}</p>`
            : ''}
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
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map