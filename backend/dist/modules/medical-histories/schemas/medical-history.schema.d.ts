import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { ClinicalEvolution } from './clinical-evolution.schema';
export type MedicalHistoryDocument = HydratedDocument<MedicalHistory>;
export declare class MedicalHistory {
    patientId: mongoose.Types.ObjectId;
    chiefComplaint?: string;
    initialDiagnosis?: string;
    treatmentPlan?: string;
    generalObservations?: string;
    evolutions: ClinicalEvolution[];
    isActive: boolean;
    deletedAt?: Date;
    createdBy?: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
}
export declare const MedicalHistorySchema: mongoose.Schema<MedicalHistory, mongoose.Model<MedicalHistory, any, any, any, any, any, MedicalHistory>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, MedicalHistory, mongoose.Document<unknown, {}, MedicalHistory, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<MedicalHistory & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    patientId?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId, MedicalHistory, mongoose.Document<unknown, {}, MedicalHistory, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<MedicalHistory & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    chiefComplaint?: mongoose.SchemaDefinitionProperty<string | undefined, MedicalHistory, mongoose.Document<unknown, {}, MedicalHistory, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<MedicalHistory & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    initialDiagnosis?: mongoose.SchemaDefinitionProperty<string | undefined, MedicalHistory, mongoose.Document<unknown, {}, MedicalHistory, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<MedicalHistory & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    treatmentPlan?: mongoose.SchemaDefinitionProperty<string | undefined, MedicalHistory, mongoose.Document<unknown, {}, MedicalHistory, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<MedicalHistory & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    generalObservations?: mongoose.SchemaDefinitionProperty<string | undefined, MedicalHistory, mongoose.Document<unknown, {}, MedicalHistory, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<MedicalHistory & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    evolutions?: mongoose.SchemaDefinitionProperty<ClinicalEvolution[], MedicalHistory, mongoose.Document<unknown, {}, MedicalHistory, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<MedicalHistory & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isActive?: mongoose.SchemaDefinitionProperty<boolean, MedicalHistory, mongoose.Document<unknown, {}, MedicalHistory, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<MedicalHistory & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    deletedAt?: mongoose.SchemaDefinitionProperty<Date | undefined, MedicalHistory, mongoose.Document<unknown, {}, MedicalHistory, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<MedicalHistory & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    createdBy?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId | undefined, MedicalHistory, mongoose.Document<unknown, {}, MedicalHistory, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<MedicalHistory & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    updatedBy?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId | undefined, MedicalHistory, mongoose.Document<unknown, {}, MedicalHistory, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<MedicalHistory & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, MedicalHistory>;
