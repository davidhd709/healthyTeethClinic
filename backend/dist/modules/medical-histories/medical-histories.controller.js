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
exports.MedicalHistoriesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const medical_histories_service_1 = require("./medical-histories.service");
const update_medical_history_dto_1 = require("./dto/update-medical-history.dto");
const create_evolution_dto_1 = require("./dto/create-evolution.dto");
const update_evolution_dto_1 = require("./dto/update-evolution.dto");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const parse_objectid_pipe_1 = require("../../common/pipes/parse-objectid.pipe");
let MedicalHistoriesController = class MedicalHistoriesController {
    constructor(service) {
        this.service = service;
    }
    get(patientId, user) {
        return this.service.getOrCreateByPatient(patientId, user?.userId);
    }
    update(patientId, dto, user) {
        return this.service.updateMain(patientId, dto, user?.userId);
    }
    addEvolution(patientId, dto, user) {
        return this.service.addEvolution(patientId, dto, user?.userId);
    }
    updateEvolution(patientId, evolutionId, dto, user) {
        return this.service.updateEvolution(patientId, evolutionId, dto, user?.userId);
    }
};
exports.MedicalHistoriesController = MedicalHistoriesController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin', 'specialist', 'receptionist'),
    __param(0, (0, common_1.Param)('patientId', parse_objectid_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MedicalHistoriesController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)(),
    (0, roles_decorator_1.Roles)('admin', 'specialist'),
    __param(0, (0, common_1.Param)('patientId', parse_objectid_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_medical_history_dto_1.UpdateMedicalHistoryDto, Object]),
    __metadata("design:returntype", void 0)
], MedicalHistoriesController.prototype, "update", null);
__decorate([
    (0, common_1.Post)('evolutions'),
    (0, roles_decorator_1.Roles)('admin', 'specialist'),
    __param(0, (0, common_1.Param)('patientId', parse_objectid_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_evolution_dto_1.CreateEvolutionDto, Object]),
    __metadata("design:returntype", void 0)
], MedicalHistoriesController.prototype, "addEvolution", null);
__decorate([
    (0, common_1.Patch)('evolutions/:evolutionId'),
    (0, roles_decorator_1.Roles)('admin', 'specialist'),
    __param(0, (0, common_1.Param)('patientId', parse_objectid_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, common_1.Param)('evolutionId', parse_objectid_pipe_1.ParseObjectIdPipe)),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_evolution_dto_1.UpdateEvolutionDto, Object]),
    __metadata("design:returntype", void 0)
], MedicalHistoriesController.prototype, "updateEvolution", null);
exports.MedicalHistoriesController = MedicalHistoriesController = __decorate([
    (0, swagger_1.ApiTags)('MedicalHistories'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Controller)('api/patients/:patientId/medical-history'),
    __metadata("design:paramtypes", [medical_histories_service_1.MedicalHistoriesService])
], MedicalHistoriesController);
//# sourceMappingURL=medical-histories.controller.js.map