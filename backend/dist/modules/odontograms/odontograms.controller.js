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
exports.OdontogramsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const odontograms_service_1 = require("./odontograms.service");
const update_tooth_dto_1 = require("./dto/update-tooth.dto");
const update_surface_dto_1 = require("./dto/update-surface.dto");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const parse_objectid_pipe_1 = require("../../common/pipes/parse-objectid.pipe");
let OdontogramsController = class OdontogramsController {
    constructor(service) {
        this.service = service;
    }
    get(patientId, user) {
        return this.service.getOrCreateByPatient(patientId, user?.userId);
    }
    history(patientId, toothNumber, surface, limit) {
        return this.service.getHistory(patientId, {
            toothNumber,
            surface,
            limit: limit ? Number(limit) : undefined,
        });
    }
    updateTooth(patientId, toothNumber, dto, user) {
        return this.service.updateTooth(patientId, toothNumber, dto, user?.userId);
    }
    updateSurface(patientId, toothNumber, surface, dto, user) {
        return this.service.updateSurface(patientId, toothNumber, surface, dto, user?.userId);
    }
};
exports.OdontogramsController = OdontogramsController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin', 'specialist', 'receptionist'),
    __param(0, (0, common_1.Param)('patientId', parse_objectid_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OdontogramsController.prototype, "get", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, roles_decorator_1.Roles)('admin', 'specialist', 'receptionist'),
    __param(0, (0, common_1.Param)('patientId', parse_objectid_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, common_1.Query)('toothNumber')),
    __param(2, (0, common_1.Query)('surface')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], OdontogramsController.prototype, "history", null);
__decorate([
    (0, common_1.Patch)('teeth/:toothNumber'),
    (0, roles_decorator_1.Roles)('admin', 'specialist'),
    __param(0, (0, common_1.Param)('patientId', parse_objectid_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, common_1.Param)('toothNumber')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_tooth_dto_1.UpdateToothDto, Object]),
    __metadata("design:returntype", void 0)
], OdontogramsController.prototype, "updateTooth", null);
__decorate([
    (0, common_1.Patch)('teeth/:toothNumber/surfaces/:surface'),
    (0, roles_decorator_1.Roles)('admin', 'specialist'),
    __param(0, (0, common_1.Param)('patientId', parse_objectid_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, common_1.Param)('toothNumber')),
    __param(2, (0, common_1.Param)('surface')),
    __param(3, (0, common_1.Body)()),
    __param(4, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, update_surface_dto_1.UpdateSurfaceDto, Object]),
    __metadata("design:returntype", void 0)
], OdontogramsController.prototype, "updateSurface", null);
exports.OdontogramsController = OdontogramsController = __decorate([
    (0, swagger_1.ApiTags)('Odontograms'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Controller)('api/patients/:patientId/odontogram'),
    __metadata("design:paramtypes", [odontograms_service_1.OdontogramsService])
], OdontogramsController);
//# sourceMappingURL=odontograms.controller.js.map