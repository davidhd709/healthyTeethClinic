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
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const appointment_schema_1 = require("./schemas/appointment.schema");
const date_util_1 = require("../../common/utils/date.util");
let AppointmentsService = class AppointmentsService {
    constructor(appointmentModel) {
        this.appointmentModel = appointmentModel;
    }
    async findAll(filters = {}) {
        const query = {};
        if (filters.status) {
            query.status = filters.status;
        }
        if (filters.specialistId) {
            query.specialistId = filters.specialistId;
        }
        if (filters.serviceId) {
            query.serviceId = filters.serviceId;
        }
        if (filters.dateFrom || filters.dateTo) {
            const dateRange = {};
            if (filters.dateFrom) {
                const parsedFrom = (0, date_util_1.parseDateOnly)(filters.dateFrom);
                if (!parsedFrom) {
                    throw new common_1.BadRequestException('Formato de dateFrom inválido. Usar YYYY-MM-DD');
                }
                dateRange.$gte = parsedFrom;
            }
            if (filters.dateTo) {
                const parsedTo = (0, date_util_1.parseDateOnly)(filters.dateTo);
                if (!parsedTo) {
                    throw new common_1.BadRequestException('Formato de dateTo inválido. Usar YYYY-MM-DD');
                }
                dateRange.$lte = (0, date_util_1.endOfDay)(parsedTo);
            }
            query.date = dateRange;
        }
        return this.appointmentModel
            .find(query)
            .populate('serviceId', 'name slug icon durationMinutes')
            .populate('specialistId', 'name slug photo specialty')
            .sort({ date: -1, time: -1 })
            .exec();
    }
    async findOne(id) {
        const appointment = await this.appointmentModel
            .findById(id)
            .populate('serviceId', 'name slug icon durationMinutes')
            .populate('specialistId', 'name slug photo specialty')
            .exec();
        if (!appointment) {
            throw new common_1.NotFoundException(`Cita con ID "${id}" no encontrada`);
        }
        return appointment;
    }
    async create(dto) {
        const appointmentDate = (0, date_util_1.parseDateOnly)(dto.date);
        if (!appointmentDate) {
            throw new common_1.BadRequestException('Formato de fecha inválido. Usar YYYY-MM-DD');
        }
        const conflict = await this.appointmentModel
            .findOne({
            specialistId: dto.specialistId,
            date: appointmentDate,
            time: dto.time,
            status: { $ne: 'cancelada' },
        })
            .exec();
        if (conflict) {
            throw new common_1.ConflictException('Ya existe una cita para este especialista en la fecha y hora seleccionada');
        }
        await this.appointmentModel.deleteMany({
            specialistId: dto.specialistId,
            date: appointmentDate,
            time: dto.time,
            status: 'cancelada',
        });
        try {
            return await this.appointmentModel.create({
                ...dto,
                date: appointmentDate,
            });
        }
        catch (error) {
            if (error &&
                typeof error === 'object' &&
                'code' in error &&
                error.code === 11000) {
                throw new common_1.ConflictException('Ya existe una cita para este especialista en la fecha y hora seleccionada');
            }
            throw error;
        }
    }
    async update(id, dto) {
        const updateData = { ...dto };
        if (dto.date) {
            const parsedDate = (0, date_util_1.parseDateOnly)(dto.date);
            if (!parsedDate) {
                throw new common_1.BadRequestException('Formato de fecha inválido. Usar YYYY-MM-DD');
            }
            updateData.date = parsedDate;
        }
        const appointment = await this.appointmentModel
            .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
            .exec();
        if (!appointment) {
            throw new common_1.NotFoundException(`Cita con ID "${id}" no encontrada`);
        }
        return appointment;
    }
    async remove(id) {
        const appointment = await this.appointmentModel
            .findByIdAndDelete(id)
            .exec();
        if (!appointment) {
            throw new common_1.NotFoundException(`Cita con ID "${id}" no encontrada`);
        }
        return appointment;
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(appointment_schema_1.Appointment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map