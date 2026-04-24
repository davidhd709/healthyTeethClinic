import { OdontogramsService } from './odontograms.service';
import { UpdateToothDto } from './dto/update-tooth.dto';
import { UpdateSurfaceDto } from './dto/update-surface.dto';
import { AuthenticatedUser } from '../../common/types/jwt-payload.type';
export declare class OdontogramsController {
    private readonly service;
    constructor(service: OdontogramsService);
    get(patientId: string, user: AuthenticatedUser): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/odontogram.schema").Odontogram, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/odontogram.schema").Odontogram & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/odontogram.schema").Odontogram, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/odontogram.schema").Odontogram & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    history(patientId: string, toothNumber?: string, surface?: string, limit?: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/odontogram-history.schema").OdontogramHistory, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/odontogram-history.schema").OdontogramHistory & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/odontogram-history.schema").OdontogramHistory, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/odontogram-history.schema").OdontogramHistory & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    updateTooth(patientId: string, toothNumber: string, dto: UpdateToothDto, user: AuthenticatedUser): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/odontogram.schema").Odontogram, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/odontogram.schema").Odontogram & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/odontogram.schema").Odontogram, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/odontogram.schema").Odontogram & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    updateSurface(patientId: string, toothNumber: string, surface: string, dto: UpdateSurfaceDto, user: AuthenticatedUser): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/odontogram.schema").Odontogram, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/odontogram.schema").Odontogram & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/odontogram.schema").Odontogram, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/odontogram.schema").Odontogram & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
}
