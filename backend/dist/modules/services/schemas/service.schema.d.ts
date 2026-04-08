import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
export type ServiceDocument = HydratedDocument<Service>;
export declare class Service {
    name: string;
    slug: string;
    description: string;
    durationMinutes: number;
    basePrice: number;
    icon: string;
    image: string;
    specialists: mongoose.Types.ObjectId[];
    isActive: boolean;
}
export declare const ServiceSchema: mongoose.Schema<Service, mongoose.Model<Service, any, any, any, any, any, Service>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Service, mongoose.Document<unknown, {}, Service, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<Service & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: mongoose.SchemaDefinitionProperty<string, Service, mongoose.Document<unknown, {}, Service, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Service & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    slug?: mongoose.SchemaDefinitionProperty<string, Service, mongoose.Document<unknown, {}, Service, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Service & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: mongoose.SchemaDefinitionProperty<string, Service, mongoose.Document<unknown, {}, Service, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Service & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    durationMinutes?: mongoose.SchemaDefinitionProperty<number, Service, mongoose.Document<unknown, {}, Service, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Service & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    basePrice?: mongoose.SchemaDefinitionProperty<number, Service, mongoose.Document<unknown, {}, Service, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Service & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    icon?: mongoose.SchemaDefinitionProperty<string, Service, mongoose.Document<unknown, {}, Service, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Service & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    image?: mongoose.SchemaDefinitionProperty<string, Service, mongoose.Document<unknown, {}, Service, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Service & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    specialists?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId[], Service, mongoose.Document<unknown, {}, Service, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Service & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isActive?: mongoose.SchemaDefinitionProperty<boolean, Service, mongoose.Document<unknown, {}, Service, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Service & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Service>;
