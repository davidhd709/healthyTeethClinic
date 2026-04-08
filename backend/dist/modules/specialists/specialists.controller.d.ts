import { SpecialistsService } from './specialists.service';
import { CreateSpecialistDto } from './dto/create-specialist.dto';
import { UpdateSpecialistDto } from './dto/update-specialist.dto';
export declare class SpecialistsController {
    private readonly specialistsService;
    constructor(specialistsService: SpecialistsService);
    findAll(active?: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/specialist.schema").Specialist, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/specialist.schema").Specialist & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/specialist.schema").Specialist, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/specialist.schema").Specialist & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/specialist.schema").Specialist, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/specialist.schema").Specialist & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/specialist.schema").Specialist, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/specialist.schema").Specialist & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    create(dto: CreateSpecialistDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/specialist.schema").Specialist, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/specialist.schema").Specialist & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/specialist.schema").Specialist, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/specialist.schema").Specialist & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    update(id: string, dto: UpdateSpecialistDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/specialist.schema").Specialist, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/specialist.schema").Specialist & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/specialist.schema").Specialist, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/specialist.schema").Specialist & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    remove(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/specialist.schema").Specialist, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/specialist.schema").Specialist & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/specialist.schema").Specialist, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/specialist.schema").Specialist & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
}
