import { MedicalHistoriesService } from './medical-histories.service';
import { UpdateMedicalHistoryDto } from './dto/update-medical-history.dto';
import { CreateEvolutionDto } from './dto/create-evolution.dto';
import { UpdateEvolutionDto } from './dto/update-evolution.dto';
import { AuthenticatedUser } from '../../common/types/jwt-payload.type';
export declare class MedicalHistoriesController {
    private readonly service;
    constructor(service: MedicalHistoriesService);
    get(patientId: string, user: AuthenticatedUser): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/medical-history.schema").MedicalHistory, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/medical-history.schema").MedicalHistory & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/medical-history.schema").MedicalHistory, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/medical-history.schema").MedicalHistory & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>) | null>;
    update(patientId: string, dto: UpdateMedicalHistoryDto, user: AuthenticatedUser): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/medical-history.schema").MedicalHistory, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/medical-history.schema").MedicalHistory & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/medical-history.schema").MedicalHistory, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/medical-history.schema").MedicalHistory & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>) | null>;
    addEvolution(patientId: string, dto: CreateEvolutionDto, user: AuthenticatedUser): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/medical-history.schema").MedicalHistory, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/medical-history.schema").MedicalHistory & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/medical-history.schema").MedicalHistory, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/medical-history.schema").MedicalHistory & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>) | null>;
    updateEvolution(patientId: string, evolutionId: string, dto: UpdateEvolutionDto, user: AuthenticatedUser): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/medical-history.schema").MedicalHistory, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/medical-history.schema").MedicalHistory & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/medical-history.schema").MedicalHistory, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/medical-history.schema").MedicalHistory & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>) | null>;
}
