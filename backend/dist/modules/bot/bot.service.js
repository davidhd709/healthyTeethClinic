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
exports.BotService = void 0;
const common_1 = require("@nestjs/common");
const services_service_1 = require("../services/services.service");
const specialists_service_1 = require("../specialists/specialists.service");
const availability_service_1 = require("../availability/availability.service");
const appointments_service_1 = require("../appointments/appointments.service");
let BotService = class BotService {
    constructor(servicesService, specialistsService, availabilityService, appointmentsService) {
        this.servicesService = servicesService;
        this.specialistsService = specialistsService;
        this.availabilityService = availabilityService;
        this.appointmentsService = appointmentsService;
    }
    async listServices() {
        const services = await this.servicesService.findAll();
        return services.map((s) => ({
            id: s._id.toString(),
            name: s.name,
            slug: s.slug,
            description: s.description,
            durationMinutes: s.durationMinutes,
            basePrice: s.basePrice,
        }));
    }
    async listSpecialists(serviceId) {
        const specialists = await this.specialistsService.findAll();
        const extractId = (svc) => {
            if (typeof svc === 'string')
                return svc;
            if (svc && typeof svc === 'object') {
                const obj = svc;
                if (obj._id)
                    return String(obj._id);
            }
            return String(svc);
        };
        const filtered = serviceId
            ? specialists.filter((sp) => sp.services.some((svc) => extractId(svc) === serviceId))
            : specialists;
        return filtered.map((sp) => ({
            id: sp._id.toString(),
            name: sp.name,
            slug: sp.slug,
            specialty: sp.specialty,
            subspecialty: sp.subspecialty,
            experience: sp.experience,
            serviceIds: sp.services.map((s) => extractId(s)),
        }));
    }
    async getAvailability(specialistId, date) {
        return this.availabilityService.getAvailability(specialistId, date);
    }
    async createAppointment(dto) {
        const appointment = await this.appointmentsService.create(dto);
        return {
            success: true,
            appointmentId: appointment._id.toString(),
            message: 'Cita agendada exitosamente. Recibirás un correo de confirmación.',
            date: dto.date,
            time: dto.time,
        };
    }
    async formatServicesText() {
        const services = await this.listServices();
        if (services.length === 0)
            return 'No hay servicios disponibles.';
        return services
            .map((s) => `🦷 ${s.name} - ${s.durationMinutes} min${s.basePrice ? ` - desde $${s.basePrice.toLocaleString('es-CO')} COP` : ''}`)
            .join('\n');
    }
    async formatSpecialistsText(serviceId) {
        const specialists = await this.listSpecialists(serviceId);
        if (specialists.length === 0)
            return 'No hay especialistas disponibles para este servicio.';
        return specialists
            .map((sp) => `👨‍⚕️ ${sp.name} - ${sp.specialty}${sp.subspecialty ? ` (${sp.subspecialty})` : ''} - ${sp.experience} años`)
            .join('\n');
    }
};
exports.BotService = BotService;
exports.BotService = BotService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [services_service_1.ServicesService,
        specialists_service_1.SpecialistsService,
        availability_service_1.AvailabilityService,
        appointments_service_1.AppointmentsService])
], BotService);
//# sourceMappingURL=bot.service.js.map