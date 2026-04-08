import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
export type SpecialistDocument = HydratedDocument<Specialist>;
export declare class Specialist {
    name: string;
    slug: string;
    photo: string;
    specialty: string;
    subspecialty: string;
    description: string;
    experience: number;
    services: mongoose.Types.ObjectId[];
    weeklySchedule: Array<{
        day: string;
        startTime: string;
        endTime: string;
        blockDuration: number;
        breaks?: Array<{
            start: string;
            end: string;
        }>;
    }>;
    isActive: boolean;
}
export declare const SpecialistSchema: mongoose.Schema<Specialist, mongoose.Model<Specialist, any, any, any, any, any, Specialist>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Specialist, mongoose.Document<unknown, {}, Specialist, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<Specialist & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: mongoose.SchemaDefinitionProperty<string, Specialist, mongoose.Document<unknown, {}, Specialist, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Specialist & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    slug?: mongoose.SchemaDefinitionProperty<string, Specialist, mongoose.Document<unknown, {}, Specialist, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Specialist & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    photo?: mongoose.SchemaDefinitionProperty<string, Specialist, mongoose.Document<unknown, {}, Specialist, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Specialist & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    specialty?: mongoose.SchemaDefinitionProperty<string, Specialist, mongoose.Document<unknown, {}, Specialist, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Specialist & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    subspecialty?: mongoose.SchemaDefinitionProperty<string, Specialist, mongoose.Document<unknown, {}, Specialist, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Specialist & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: mongoose.SchemaDefinitionProperty<string, Specialist, mongoose.Document<unknown, {}, Specialist, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Specialist & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    experience?: mongoose.SchemaDefinitionProperty<number, Specialist, mongoose.Document<unknown, {}, Specialist, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Specialist & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    services?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId[], Specialist, mongoose.Document<unknown, {}, Specialist, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Specialist & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    weeklySchedule?: mongoose.SchemaDefinitionProperty<{
        day: string;
        startTime: string;
        endTime: string;
        blockDuration: number;
        breaks?: Array<{
            start: string;
            end: string;
        }>;
    }[], Specialist, mongoose.Document<unknown, {}, Specialist, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Specialist & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isActive?: mongoose.SchemaDefinitionProperty<boolean, Specialist, mongoose.Document<unknown, {}, Specialist, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Specialist & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Specialist>;
