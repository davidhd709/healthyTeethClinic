import { Model, Types } from 'mongoose';
import { Patient, PatientDocument } from './schemas/patient.schema';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { QueryPatientDto } from './dto/query-patient.dto';
import { MedicalHistoriesService } from '../medical-histories/medical-histories.service';
export interface ResolvePatientInput {
    documentNumber?: string;
    name: string;
    email?: string;
    phone?: string;
}
export declare class PatientsService {
    private readonly patientModel;
    private readonly medicalHistoriesService;
    constructor(patientModel: Model<PatientDocument>, medicalHistoriesService: MedicalHistoriesService);
    findAll(query: QueryPatientDto): Promise<{
        items: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Patient, {}, import("mongoose").DefaultSchemaOptions> & Patient & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Patient, {}, import("mongoose").DefaultSchemaOptions> & Patient & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: Types.ObjectId;
        }>)[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Patient, {}, import("mongoose").DefaultSchemaOptions> & Patient & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Patient, {}, import("mongoose").DefaultSchemaOptions> & Patient & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    findByDocument(documentNumber: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Patient, {}, import("mongoose").DefaultSchemaOptions> & Patient & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Patient, {}, import("mongoose").DefaultSchemaOptions> & Patient & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>) | null>;
    create(dto: CreatePatientDto, createdBy?: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Patient, {}, import("mongoose").DefaultSchemaOptions> & Patient & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Patient, {}, import("mongoose").DefaultSchemaOptions> & Patient & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    update(id: string, dto: UpdatePatientDto, updatedBy?: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Patient, {}, import("mongoose").DefaultSchemaOptions> & Patient & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Patient, {}, import("mongoose").DefaultSchemaOptions> & Patient & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    remove(id: string, updatedBy?: string): Promise<{
        id: string;
        isActive: boolean;
    }>;
    resolveOrCreateForAppointment(input: ResolvePatientInput): Promise<{
        patient: PatientDocument | null;
        wasCreated: boolean;
    }>;
}
