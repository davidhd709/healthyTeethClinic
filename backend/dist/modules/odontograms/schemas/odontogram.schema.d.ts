import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { ToothRecord } from './tooth-record.schema';
export type OdontogramDocument = HydratedDocument<Odontogram>;
export type DentitionType = 'permanent' | 'temporary' | 'mixed';
export declare class Odontogram {
    patientId: mongoose.Types.ObjectId;
    dentitionType: DentitionType;
    teeth: ToothRecord[];
    isActive: boolean;
    deletedAt?: Date;
    createdBy?: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
}
export declare const OdontogramSchema: mongoose.Schema<Odontogram, mongoose.Model<Odontogram, any, any, any, any, any, Odontogram>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Odontogram, mongoose.Document<unknown, {}, Odontogram, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<Odontogram & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    patientId?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId, Odontogram, mongoose.Document<unknown, {}, Odontogram, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Odontogram & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    dentitionType?: mongoose.SchemaDefinitionProperty<DentitionType, Odontogram, mongoose.Document<unknown, {}, Odontogram, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Odontogram & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    teeth?: mongoose.SchemaDefinitionProperty<ToothRecord[], Odontogram, mongoose.Document<unknown, {}, Odontogram, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Odontogram & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isActive?: mongoose.SchemaDefinitionProperty<boolean, Odontogram, mongoose.Document<unknown, {}, Odontogram, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Odontogram & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    deletedAt?: mongoose.SchemaDefinitionProperty<Date | undefined, Odontogram, mongoose.Document<unknown, {}, Odontogram, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Odontogram & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    createdBy?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId | undefined, Odontogram, mongoose.Document<unknown, {}, Odontogram, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Odontogram & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    updatedBy?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId | undefined, Odontogram, mongoose.Document<unknown, {}, Odontogram, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Odontogram & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Odontogram>;
