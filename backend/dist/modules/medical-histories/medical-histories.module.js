"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalHistoriesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const medical_history_schema_1 = require("./schemas/medical-history.schema");
const medical_histories_service_1 = require("./medical-histories.service");
const medical_histories_controller_1 = require("./medical-histories.controller");
let MedicalHistoriesModule = class MedicalHistoriesModule {
};
exports.MedicalHistoriesModule = MedicalHistoriesModule;
exports.MedicalHistoriesModule = MedicalHistoriesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: medical_history_schema_1.MedicalHistory.name, schema: medical_history_schema_1.MedicalHistorySchema },
            ]),
        ],
        controllers: [medical_histories_controller_1.MedicalHistoriesController],
        providers: [medical_histories_service_1.MedicalHistoriesService],
        exports: [medical_histories_service_1.MedicalHistoriesService],
    })
], MedicalHistoriesModule);
//# sourceMappingURL=medical-histories.module.js.map