import { Model } from 'mongoose';
import { Service, ServiceDocument } from './schemas/service.schema';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
export declare class ServicesService {
    private readonly serviceModel;
    constructor(serviceModel: Model<ServiceDocument>);
    findAll(onlyActive?: boolean): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Service, {}, import("mongoose").DefaultSchemaOptions> & Service & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Service, {}, import("mongoose").DefaultSchemaOptions> & Service & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Service, {}, import("mongoose").DefaultSchemaOptions> & Service & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Service, {}, import("mongoose").DefaultSchemaOptions> & Service & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findBySlug(slug: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Service, {}, import("mongoose").DefaultSchemaOptions> & Service & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Service, {}, import("mongoose").DefaultSchemaOptions> & Service & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    create(dto: CreateServiceDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Service, {}, import("mongoose").DefaultSchemaOptions> & Service & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Service, {}, import("mongoose").DefaultSchemaOptions> & Service & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    update(id: string, dto: UpdateServiceDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Service, {}, import("mongoose").DefaultSchemaOptions> & Service & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Service, {}, import("mongoose").DefaultSchemaOptions> & Service & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    remove(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Service, {}, import("mongoose").DefaultSchemaOptions> & Service & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Service, {}, import("mongoose").DefaultSchemaOptions> & Service & {
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
