"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToothRecordSchema = exports.ToothRecord = exports.ToothSurfacesMapSchema = exports.ToothSurfacesMap = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose = __importStar(require("mongoose"));
const tooth_status_constant_1 = require("../constants/tooth-status.constant");
const tooth_surface_record_schema_1 = require("./tooth-surface-record.schema");
let ToothSurfacesMap = class ToothSurfacesMap {
};
exports.ToothSurfacesMap = ToothSurfacesMap;
__decorate([
    (0, mongoose_1.Prop)({ type: tooth_surface_record_schema_1.ToothSurfaceRecordSchema, default: () => ({}) }),
    __metadata("design:type", tooth_surface_record_schema_1.ToothSurfaceRecord)
], ToothSurfacesMap.prototype, "vestibular", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: tooth_surface_record_schema_1.ToothSurfaceRecordSchema, default: () => ({}) }),
    __metadata("design:type", tooth_surface_record_schema_1.ToothSurfaceRecord)
], ToothSurfacesMap.prototype, "lingual_palatal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: tooth_surface_record_schema_1.ToothSurfaceRecordSchema, default: () => ({}) }),
    __metadata("design:type", tooth_surface_record_schema_1.ToothSurfaceRecord)
], ToothSurfacesMap.prototype, "mesial", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: tooth_surface_record_schema_1.ToothSurfaceRecordSchema, default: () => ({}) }),
    __metadata("design:type", tooth_surface_record_schema_1.ToothSurfaceRecord)
], ToothSurfacesMap.prototype, "distal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: tooth_surface_record_schema_1.ToothSurfaceRecordSchema, default: () => ({}) }),
    __metadata("design:type", tooth_surface_record_schema_1.ToothSurfaceRecord)
], ToothSurfacesMap.prototype, "occlusal_incisal", void 0);
exports.ToothSurfacesMap = ToothSurfacesMap = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ToothSurfacesMap);
exports.ToothSurfacesMapSchema = mongoose_1.SchemaFactory.createForClass(ToothSurfacesMap);
let ToothRecord = class ToothRecord {
};
exports.ToothRecord = ToothRecord;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ToothRecord.prototype, "toothNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['incisor', 'canine', 'premolar', 'molar'] }),
    __metadata("design:type", String)
], ToothRecord.prototype, "toothType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: [1, 2, 3, 4] }),
    __metadata("design:type", Number)
], ToothRecord.prototype, "quadrant", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['upper', 'lower'] }),
    __metadata("design:type", String)
], ToothRecord.prototype, "arch", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [String],
        enum: tooth_status_constant_1.TOOTH_STATUSES,
        default: ['healthy'],
    }),
    __metadata("design:type", Array)
], ToothRecord.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: exports.ToothSurfacesMapSchema, default: () => ({}) }),
    __metadata("design:type", ToothSurfacesMap)
], ToothRecord.prototype, "surfaces", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], ToothRecord.prototype, "diagnosis", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], ToothRecord.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], ToothRecord.prototype, "lastUpdated", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose.Types.ObjectId)
], ToothRecord.prototype, "updatedBy", void 0);
exports.ToothRecord = ToothRecord = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ToothRecord);
exports.ToothRecordSchema = mongoose_1.SchemaFactory.createForClass(ToothRecord);
//# sourceMappingURL=tooth-record.schema.js.map