import { Model } from 'mongoose';
import { Specialist, SpecialistDocument } from './schemas/specialist.schema';
import { CreateSpecialistDto } from './dto/create-specialist.dto';
import { UpdateSpecialistDto } from './dto/update-specialist.dto';
export declare class SpecialistsService {
    private readonly specialistModel;
    constructor(specialistModel: Model<SpecialistDocument>);
    findAll(onlyActive?: boolean): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Specialist, {}, import("mongoose").DefaultSchemaOptions> & Specialist & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Specialist, {}, import("mongoose").DefaultSchemaOptions> & Specialist & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Specialist, {}, import("mongoose").DefaultSchemaOptions> & Specialist & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Specialist, {}, import("mongoose").DefaultSchemaOptions> & Specialist & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findBySlug(slug: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Specialist, {}, import("mongoose").DefaultSchemaOptions> & Specialist & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Specialist, {}, import("mongoose").DefaultSchemaOptions> & Specialist & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    create(dto: CreateSpecialistDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Specialist, {}, import("mongoose").DefaultSchemaOptions> & Specialist & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Specialist, {}, import("mongoose").DefaultSchemaOptions> & Specialist & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    update(id: string, dto: UpdateSpecialistDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Specialist, {}, import("mongoose").DefaultSchemaOptions> & Specialist & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Specialist, {}, import("mongoose").DefaultSchemaOptions> & Specialist & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    remove(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Specialist, {}, import("mongoose").DefaultSchemaOptions> & Specialist & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Specialist, {}, import("mongoose").DefaultSchemaOptions> & Specialist & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    private generateSlug;
}
