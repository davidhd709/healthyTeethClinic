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
exports.AvailabilityController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const availability_service_1 = require("./availability.service");
const parse_objectid_pipe_1 = require("../../common/pipes/parse-objectid.pipe");
let AvailabilityController = class AvailabilityController {
    constructor(availabilityService) {
        this.availabilityService = availabilityService;
    }
    getAvailability(specialistId, date) {
        if (!specialistId || !date) {
            throw new common_1.BadRequestException('Los parámetros specialistId y date son requeridos');
        }
        return this.availabilityService.getAvailability(specialistId, date);
    }
};
exports.AvailabilityController = AvailabilityController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiQuery)({ name: 'specialistId', required: true, description: 'ID del especialista' }),
    (0, swagger_1.ApiQuery)({ name: 'date', required: true, description: 'Fecha (YYYY-MM-DD)' }),
    __param(0, (0, common_1.Query)('specialistId', parse_objectid_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AvailabilityController.prototype, "getAvailability", null);
exports.AvailabilityController = AvailabilityController = __decorate([
    (0, swagger_1.ApiTags)('Availability'),
    (0, common_1.Controller)('api/availability'),
    __metadata("design:paramtypes", [availability_service_1.AvailabilityService])
], AvailabilityController);
//# sourceMappingURL=availability.controller.js.map