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
exports.PatientSchema = exports.Patient = exports.MedicalInfo = exports.EmergencyContact = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose = __importStar(require("mongoose"));
let EmergencyContact = class EmergencyContact {
};
exports.EmergencyContact = EmergencyContact;
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], EmergencyContact.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], EmergencyContact.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], EmergencyContact.prototype, "relationship", void 0);
exports.EmergencyContact = EmergencyContact = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], EmergencyContact);
const EmergencyContactSchema = mongoose_1.SchemaFactory.createForClass(EmergencyContact);
let MedicalInfo = class MedicalInfo {
};
exports.MedicalInfo = MedicalInfo;
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], MedicalInfo.prototype, "allergies", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], MedicalInfo.prototype, "diseases", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], MedicalInfo.prototype, "medications", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], MedicalInfo.prototype, "medicalHistory", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], MedicalInfo.prototype, "dentalHistory", void 0);
exports.MedicalInfo = MedicalInfo = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], MedicalInfo);
const MedicalInfoSchema = mongoose_1.SchemaFactory.createForClass(MedicalInfo);
let Patient = class Patient {
};
exports.Patient = Patient;
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['CC', 'TI', 'CE', 'PP', 'RC', 'otro'],
        default: 'CC',
    }),
    __metadata("design:type", String)
], Patient.prototype, "documentType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true, unique: true, index: true }),
    __metadata("design:type", String)
], Patient.prototype, "documentNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Patient.prototype, "firstName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Patient.prototype, "lastName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Date }),
    __metadata("design:type", Date)
], Patient.prototype, "birthDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['M', 'F', 'O'] }),
    __metadata("design:type", String)
], Patient.prototype, "sex", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Patient.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true, lowercase: true }),
    __metadata("design:type", String)
], Patient.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Patient.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Patient.prototype, "city", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Patient.prototype, "insuranceProvider", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: EmergencyContactSchema }),
    __metadata("design:type", EmergencyContact)
], Patient.prototype, "emergencyContact", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: MedicalInfoSchema, default: () => ({}) }),
    __metadata("design:type", MedicalInfo)
], Patient.prototype, "medicalInfo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Patient.prototype, "observations", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true, index: true }),
    __metadata("design:type", Boolean)
], Patient.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Patient.prototype, "deletedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose.Types.ObjectId)
], Patient.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose.Types.ObjectId)
], Patient.prototype, "updatedBy", void 0);
exports.Patient = Patient = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'patients' })
], Patient);
exports.PatientSchema = mongoose_1.SchemaFactory.createForClass(Patient);
exports.PatientSchema.index({ firstName: 1, lastName: 1 });
exports.PatientSchema.index({ phone: 1 });
exports.PatientSchema.index({ email: 1 });
//# sourceMappingURL=patient.schema.js.map