"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OdontogramsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const odontogram_schema_1 = require("./schemas/odontogram.schema");
const odontogram_history_schema_1 = require("./schemas/odontogram-history.schema");
const odontograms_service_1 = require("./odontograms.service");
const odontograms_controller_1 = require("./odontograms.controller");
let OdontogramsModule = class OdontogramsModule {
};
exports.OdontogramsModule = OdontogramsModule;
exports.OdontogramsModule = OdontogramsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: odontogram_schema_1.Odontogram.name, schema: odontogram_schema_1.OdontogramSchema },
                { name: odontogram_history_schema_1.OdontogramHistory.name, schema: odontogram_history_schema_1.OdontogramHistorySchema },
            ]),
        ],
        controllers: [odontograms_controller_1.OdontogramsController],
        providers: [odontograms_service_1.OdontogramsService],
        exports: [odontograms_service_1.OdontogramsService],
    })
], OdontogramsModule);
//# sourceMappingURL=odontograms.module.js.map