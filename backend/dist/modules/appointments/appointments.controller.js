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
exports.AppointmentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const appointments_service_1 = require("./appointments.service");
const create_appointment_dto_1 = require("./dto/create-appointment.dto");
const update_appointment_dto_1 = require("./dto/update-appointment.dto");
const admin_guard_1 = require("../../common/guards/admin.guard");
const parse_objectid_pipe_1 = require("../../common/pipes/parse-objectid.pipe");
let AppointmentsController = class AppointmentsController {
    constructor(appointmentsService) {
        this.appointmentsService = appointmentsService;
    }
    findAll(status, specialistId, serviceId, dateFrom, dateTo) {
        return this.appointmentsService.findAll({
            status,
            specialistId,
            serviceId,
            dateFrom,
            dateTo,
        });
    }
    findOne(id) {
        return this.appointmentsService.findOne(id);
    }
    create(dto) {
        return this.appointmentsService.create(dto);
    }
    update(id, dto) {
        return this.appointmentsService.update(id, dto);
    }
    updateStatus(id, dto) {
        return this.appointmentsService.update(id, dto);
    }
    remove(id) {
        return this.appointmentsService.remove(id);
    }
};
exports.AppointmentsController = AppointmentsController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'specialistId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'serviceId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false }),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('specialistId')),
    __param(2, (0, common_1.Query)('serviceId')),
    __param(3, (0, common_1.Query)('dateFrom')),
    __param(4, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id', parse_objectid_pipe_1.ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_appointment_dto_1.CreateAppointmentDto]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id', parse_objectid_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_appointment_dto_1.UpdateAppointmentDto]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id', parse_objectid_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_appointment_dto_1.UpdateStatusDto]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id', parse_objectid_pipe_1.ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "remove", null);
exports.AppointmentsController = AppointmentsController = __decorate([
    (0, swagger_1.ApiTags)('Appointments'),
    (0, common_1.Controller)('api/appointments'),
    __metadata("design:paramtypes", [appointments_service_1.AppointmentsService])
], AppointmentsController);
//# sourceMappingURL=appointments.controller.js.map