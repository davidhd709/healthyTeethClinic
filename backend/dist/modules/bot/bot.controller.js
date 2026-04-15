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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const bot_service_1 = require("./bot.service");
const create_appointment_dto_1 = require("../appointments/dto/create-appointment.dto");
let BotController = class BotController {
    constructor(botService) {
        this.botService = botService;
    }
    async getServices(format) {
        if (format === 'text') {
            const text = await this.botService.formatServicesText();
            return { text };
        }
        const services = await this.botService.listServices();
        return { services };
    }
    async getSpecialists(serviceId, format) {
        if (format === 'text') {
            const text = await this.botService.formatSpecialistsText(serviceId);
            return { text };
        }
        const specialists = await this.botService.listSpecialists(serviceId);
        return { specialists };
    }
    async getAvailability(specialistId, date) {
        return this.botService.getAvailability(specialistId, date);
    }
    async createAppointment(dto) {
        return this.botService.createAppointment(dto);
    }
    async bookingTurn(body) {
        return this.botService.processBookingTurn(body?.message ?? '', body?.state);
    }
};
exports.BotController = BotController;
__decorate([
    (0, common_1.Get)('services'),
    __param(0, (0, common_1.Query)('format')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BotController.prototype, "getServices", null);
__decorate([
    (0, common_1.Get)('specialists'),
    __param(0, (0, common_1.Query)('serviceId')),
    __param(1, (0, common_1.Query)('format')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BotController.prototype, "getSpecialists", null);
__decorate([
    (0, common_1.Get)('availability'),
    __param(0, (0, common_1.Query)('specialistId')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BotController.prototype, "getAvailability", null);
__decorate([
    (0, common_1.Post)('appointments'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_appointment_dto_1.CreateAppointmentDto]),
    __metadata("design:returntype", Promise)
], BotController.prototype, "createAppointment", null);
__decorate([
    (0, common_1.Post)('booking/turn'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BotController.prototype, "bookingTurn", null);
exports.BotController = BotController = __decorate([
    (0, swagger_1.ApiTags)('Bot'),
    (0, common_1.Controller)('api/bot'),
    __metadata("design:paramtypes", [bot_service_1.BotService])
], BotController);
//# sourceMappingURL=bot.controller.js.map