import { Model } from 'mongoose';
import { Contact, ContactDocument } from './schemas/contact.schema';
import { CreateContactDto } from './dto/create-contact.dto';
export declare class ContactService {
    private readonly contactModel;
    constructor(contactModel: Model<ContactDocument>);
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Contact, {}, import("mongoose").DefaultSchemaOptions> & Contact & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Contact, {}, import("mongoose").DefaultSchemaOptions> & Contact & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    create(dto: CreateContactDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Contact, {}, import("mongoose").DefaultSchemaOptions> & Contact & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Contact, {}, import("mongoose").DefaultSchemaOptions> & Contact & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
}
