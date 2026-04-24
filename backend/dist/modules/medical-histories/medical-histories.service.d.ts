import { Model, Types } from 'mongoose';
import { MedicalHistory, MedicalHistoryDocument } from './schemas/medical-history.schema';
import { UpdateMedicalHistoryDto } from './dto/update-medical-history.dto';
import { CreateEvolutionDto } from './dto/create-evolution.dto';
import { UpdateEvolutionDto } from './dto/update-evolution.dto';
export declare class MedicalHistoriesService {
    private readonly historyModel;
    constructor(historyModel: Model<MedicalHistoryDocument>);
    getOrCreateByPatient(patientId: string, createdBy?: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, MedicalHistory, {}, import("mongoose").DefaultSchemaOptions> & MedicalHistory & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, MedicalHistory, {}, import("mongoose").DefaultSchemaOptions> & MedicalHistory & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>) | null>;
    ensureForPatient(patientId: string, createdBy?: string): Promise<void>;
    updateMain(patientId: string, dto: UpdateMedicalHistoryDto, updatedBy?: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, MedicalHistory, {}, import("mongoose").DefaultSchemaOptions> & MedicalHistory & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, MedicalHistory, {}, import("mongoose").DefaultSchemaOptions> & MedicalHistory & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>) | null>;
    addEvolution(patientId: string, dto: CreateEvolutionDto, createdBy?: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, MedicalHistory, {}, import("mongoose").DefaultSchemaOptions> & MedicalHistory & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, MedicalHistory, {}, import("mongoose").DefaultSchemaOptions> & MedicalHistory & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>) | null>;
    updateEvolution(patientId: string, evolutionId: string, dto: UpdateEvolutionDto, updatedBy?: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, MedicalHistory, {}, import("mongoose").DefaultSchemaOptions> & MedicalHistory & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, MedicalHistory, {}, import("mongoose").DefaultSchemaOptions> & MedicalHistory & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>) | null>;
}
