import * as mongoose from 'mongoose';
import { ToothStatus, ProcedureStatus } from '../constants/tooth-status.constant';
export declare class ToothSurfaceRecord {
    condition?: ToothStatus;
    treatment?: string;
    status: ProcedureStatus;
    notes?: string;
    date?: Date;
    specialistId?: mongoose.Types.ObjectId;
    lastUpdated?: Date;
    updatedBy?: mongoose.Types.ObjectId;
}
export declare const ToothSurfaceRecordSchema: mongoose.Schema<ToothSurfaceRecord, mongoose.Model<ToothSurfaceRecord, any, any, any, any, any, ToothSurfaceRecord>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, ToothSurfaceRecord, mongoose.Document<unknown, {}, ToothSurfaceRecord, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<ToothSurfaceRecord & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    condition?: mongoose.SchemaDefinitionProperty<"caries" | "healthy" | "resin" | "adapted_resin" | "unadapted_resin" | "amalgam" | "adapted_amalgam" | "unadapted_amalgam" | "fracture" | "good_crown" | "defective_crown" | "endodontics_done" | "endodontics_pending" | "extraction_indicated" | "missing_tooth" | "implant" | "good_implant" | "bad_implant" | "prosthesis" | "sealant" | "orthodontics" | "treatment_pending" | "observation" | "healthy_root" | "affected_root" | "mobility" | "periodontal_issue" | undefined, ToothSurfaceRecord, mongoose.Document<unknown, {}, ToothSurfaceRecord, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ToothSurfaceRecord & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    treatment?: mongoose.SchemaDefinitionProperty<string | undefined, ToothSurfaceRecord, mongoose.Document<unknown, {}, ToothSurfaceRecord, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ToothSurfaceRecord & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: mongoose.SchemaDefinitionProperty<"completed" | "none" | "planned" | "in_progress" | "cancelled", ToothSurfaceRecord, mongoose.Document<unknown, {}, ToothSurfaceRecord, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ToothSurfaceRecord & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    notes?: mongoose.SchemaDefinitionProperty<string | undefined, ToothSurfaceRecord, mongoose.Document<unknown, {}, ToothSurfaceRecord, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ToothSurfaceRecord & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    date?: mongoose.SchemaDefinitionProperty<Date | undefined, ToothSurfaceRecord, mongoose.Document<unknown, {}, ToothSurfaceRecord, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ToothSurfaceRecord & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    specialistId?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId | undefined, ToothSurfaceRecord, mongoose.Document<unknown, {}, ToothSurfaceRecord, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ToothSurfaceRecord & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lastUpdated?: mongoose.SchemaDefinitionProperty<Date | undefined, ToothSurfaceRecord, mongoose.Document<unknown, {}, ToothSurfaceRecord, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ToothSurfaceRecord & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    updatedBy?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId | undefined, ToothSurfaceRecord, mongoose.Document<unknown, {}, ToothSurfaceRecord, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ToothSurfaceRecord & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, ToothSurfaceRecord>;
