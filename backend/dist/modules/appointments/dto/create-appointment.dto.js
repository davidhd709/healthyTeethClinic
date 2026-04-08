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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAppointmentDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateAppointmentDto {
}
exports.CreateAppointmentDto = CreateAppointmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Juan Pérez' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "patientName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'juan@email.com' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "patientEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '3001234567' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(7),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "patientPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1234567890' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "patientDocument", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del servicio' }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "serviceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del especialista' }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "specialistId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de la cita (YYYY-MM-DD)', example: '2026-04-15' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'La fecha debe tener formato YYYY-MM-DD',
    }),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Hora de la cita (HH:mm)', example: '09:00' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: 'La hora debe tener formato HH:mm',
    }),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "time", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Motivo de la consulta' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "reasonForVisit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Consentimiento de tratamiento de datos' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAppointmentDto.prototype, "dataConsent", void 0);
//# sourceMappingURL=create-appointment.dto.js.map