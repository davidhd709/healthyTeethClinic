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
exports.AvailabilityService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const specialist_schema_1 = require("../specialists/schemas/specialist.schema");
const appointment_schema_1 = require("../appointments/schemas/appointment.schema");
const date_util_1 = require("../../common/utils/date.util");
let AvailabilityService = class AvailabilityService {
    constructor(specialistModel, appointmentModel) {
        this.specialistModel = specialistModel;
        this.appointmentModel = appointmentModel;
        this.dayMap = {
            0: 'domingo',
            1: 'lunes',
            2: 'martes',
            3: 'miercoles',
            4: 'jueves',
            5: 'viernes',
            6: 'sabado',
        };
    }
    async getAvailability(specialistId, date) {
        const dateObj = (0, date_util_1.parseDateOnly)(date);
        if (!dateObj) {
            throw new common_1.BadRequestException('Formato de fecha inválido. Usar YYYY-MM-DD');
        }
        const specialist = await this.specialistModel.findById(specialistId).exec();
        if (!specialist) {
            throw new common_1.NotFoundException(`Especialista con ID "${specialistId}" no encontrado`);
        }
        const dayOfWeek = this.dayMap[dateObj.getDay()];
        const schedule = specialist.weeklySchedule?.find((s) => s.day === dayOfWeek);
        if (!schedule) {
            return {
                specialist: specialist.name,
                date,
                slots: [],
            };
        }
        const allSlots = this.generateTimeSlots(schedule.startTime, schedule.endTime, schedule.blockDuration, schedule.breaks || []);
        const startOfDay = dateObj;
        const endDate = (0, date_util_1.endOfDay)(dateObj);
        const bookedAppointments = await this.appointmentModel
            .find({
            specialistId,
            date: { $gte: startOfDay, $lte: endDate },
            status: { $ne: 'cancelada' },
        })
            .exec();
        const bookedTimes = new Set(bookedAppointments.map((a) => a.time));
        const slots = allSlots.map((time) => ({
            time,
            available: !bookedTimes.has(time),
        }));
        return {
            specialist: specialist.name,
            date,
            slots,
        };
    }
    generateTimeSlots(startTime, endTime, blockDuration, breaks) {
        const slots = [];
        let current = this.timeToMinutes(startTime);
        const end = this.timeToMinutes(endTime);
        while (current + blockDuration <= end) {
            const timeStr = this.minutesToTime(current);
            const inBreak = breaks.some((b) => {
                const breakStart = this.timeToMinutes(b.start);
                const breakEnd = this.timeToMinutes(b.end);
                return current >= breakStart && current < breakEnd;
            });
            if (!inBreak) {
                slots.push(timeStr);
            }
            current += blockDuration;
        }
        return slots;
    }
    timeToMinutes(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }
    minutesToTime(minutes) {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    }
};
exports.AvailabilityService = AvailabilityService;
exports.AvailabilityService = AvailabilityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(specialist_schema_1.Specialist.name)),
    __param(1, (0, mongoose_1.InjectModel)(appointment_schema_1.Appointment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], AvailabilityService);
//# sourceMappingURL=availability.service.js.map