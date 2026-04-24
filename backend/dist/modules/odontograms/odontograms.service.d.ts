import { Model, Types } from 'mongoose';
import { Odontogram, OdontogramDocument } from './schemas/odontogram.schema';
import { OdontogramHistory, OdontogramHistoryDocument } from './schemas/odontogram-history.schema';
import { UpdateToothDto } from './dto/update-tooth.dto';
import { UpdateSurfaceDto } from './dto/update-surface.dto';
export declare class OdontogramsService {
    private readonly odontogramModel;
    private readonly historyModel;
    constructor(odontogramModel: Model<OdontogramDocument>, historyModel: Model<OdontogramHistoryDocument>);
    getOrCreateByPatient(patientId: string, createdBy?: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Odontogram, {}, import("mongoose").DefaultSchemaOptions> & Odontogram & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Odontogram, {}, import("mongoose").DefaultSchemaOptions> & Odontogram & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    updateTooth(patientId: string, toothNumber: string, dto: UpdateToothDto, updatedBy?: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Odontogram, {}, import("mongoose").DefaultSchemaOptions> & Odontogram & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Odontogram, {}, import("mongoose").DefaultSchemaOptions> & Odontogram & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    updateSurface(patientId: string, toothNumber: string, surface: string, dto: UpdateSurfaceDto, updatedBy?: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Odontogram, {}, import("mongoose").DefaultSchemaOptions> & Odontogram & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Odontogram, {}, import("mongoose").DefaultSchemaOptions> & Odontogram & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    getHistory(patientId: string, options?: {
        toothNumber?: string;
        surface?: string;
        limit?: number;
    }): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, OdontogramHistory, {}, import("mongoose").DefaultSchemaOptions> & OdontogramHistory & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, OdontogramHistory, {}, import("mongoose").DefaultSchemaOptions> & OdontogramHistory & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    private recordHistory;
}
