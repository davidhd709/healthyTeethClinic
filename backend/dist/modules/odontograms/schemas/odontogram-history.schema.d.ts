import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { SurfaceName, ToothStatus } from '../constants/tooth-status.constant';
export type OdontogramHistoryDocument = HydratedDocument<OdontogramHistory>;
export type OdontogramHistorySource = 'manual' | 'procedure';
export declare class OdontogramHistory {
    patientId: mongoose.Types.ObjectId;
    toothNumber: string;
    surface?: SurfaceName;
    previousStatus: ToothStatus[];
    newStatus: ToothStatus[];
    diagnosis?: string;
    procedure?: string;
    notes?: string;
    source: OdontogramHistorySource;
    updatedBy?: mongoose.Types.ObjectId;
    specialistId?: mongoose.Types.ObjectId;
}
export declare const OdontogramHistorySchema: mongoose.Schema<OdontogramHistory, mongoose.Model<OdontogramHistory, any, any, any, any, any, OdontogramHistory>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, OdontogramHistory, mongoose.Document<unknown, {}, OdontogramHistory, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<OdontogramHistory & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    patientId?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId, OdontogramHistory, mongoose.Document<unknown, {}, OdontogramHistory, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<OdontogramHistory & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    toothNumber?: mongoose.SchemaDefinitionProperty<string, OdontogramHistory, mongoose.Document<unknown, {}, OdontogramHistory, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<OdontogramHistory & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    surface?: mongoose.SchemaDefinitionProperty<"vestibular" | "lingual_palatal" | "mesial" | "distal" | "occlusal_incisal" | undefined, OdontogramHistory, mongoose.Document<unknown, {}, OdontogramHistory, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<OdontogramHistory & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    previousStatus?: mongoose.SchemaDefinitionProperty<("caries" | "healthy" | "resin" | "adapted_resin" | "unadapted_resin" | "amalgam" | "adapted_amalgam" | "unadapted_amalgam" | "fracture" | "good_crown" | "defective_crown" | "endodontics_done" | "endodontics_pending" | "extraction_indicated" | "missing_tooth" | "implant" | "good_implant" | "bad_implant" | "prosthesis" | "sealant" | "orthodontics" | "treatment_pending" | "observation" | "healthy_root" | "affected_root" | "mobility" | "periodontal_issue")[], OdontogramHistory, mongoose.Document<unknown, {}, OdontogramHistory, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<OdontogramHistory & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    newStatus?: mongoose.SchemaDefinitionProperty<("caries" | "healthy" | "resin" | "adapted_resin" | "unadapted_resin" | "amalgam" | "adapted_amalgam" | "unadapted_amalgam" | "fracture" | "good_crown" | "defective_crown" | "endodontics_done" | "endodontics_pending" | "extraction_indicated" | "missing_tooth" | "implant" | "good_implant" | "bad_implant" | "prosthesis" | "sealant" | "orthodontics" | "treatment_pending" | "observation" | "healthy_root" | "affected_root" | "mobility" | "periodontal_issue")[], OdontogramHistory, mongoose.Document<unknown, {}, OdontogramHistory, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<OdontogramHistory & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    diagnosis?: mongoose.SchemaDefinitionProperty<string | undefined, OdontogramHistory, mongoose.Document<unknown, {}, OdontogramHistory, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<OdontogramHistory & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    procedure?: mongoose.SchemaDefinitionProperty<string | undefined, OdontogramHistory, mongoose.Document<unknown, {}, OdontogramHistory, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<OdontogramHistory & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    notes?: mongoose.SchemaDefinitionProperty<string | undefined, OdontogramHistory, mongoose.Document<unknown, {}, OdontogramHistory, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<OdontogramHistory & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    source?: mongoose.SchemaDefinitionProperty<OdontogramHistorySource, OdontogramHistory, mongoose.Document<unknown, {}, OdontogramHistory, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<OdontogramHistory & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    updatedBy?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId | undefined, OdontogramHistory, mongoose.Document<unknown, {}, OdontogramHistory, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<OdontogramHistory & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    specialistId?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId | undefined, OdontogramHistory, mongoose.Document<unknown, {}, OdontogramHistory, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<OdontogramHistory & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, OdontogramHistory>;
