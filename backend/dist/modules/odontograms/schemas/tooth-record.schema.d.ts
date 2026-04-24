import * as mongoose from 'mongoose';
import { ToothStatus } from '../constants/tooth-status.constant';
import type { ToothType, Arch } from '../constants/fdi-teeth.constant';
import { ToothSurfaceRecord } from './tooth-surface-record.schema';
export declare class ToothSurfacesMap {
    vestibular: ToothSurfaceRecord;
    lingual_palatal: ToothSurfaceRecord;
    mesial: ToothSurfaceRecord;
    distal: ToothSurfaceRecord;
    occlusal_incisal: ToothSurfaceRecord;
}
export declare const ToothSurfacesMapSchema: mongoose.Schema<ToothSurfacesMap, mongoose.Model<ToothSurfacesMap, any, any, any, any, any, ToothSurfacesMap>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, ToothSurfacesMap, mongoose.Document<unknown, {}, ToothSurfacesMap, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<ToothSurfacesMap & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    vestibular?: mongoose.SchemaDefinitionProperty<ToothSurfaceRecord, ToothSurfacesMap, mongoose.Document<unknown, {}, ToothSurfacesMap, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ToothSurfacesMap & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lingual_palatal?: mongoose.SchemaDefinitionProperty<ToothSurfaceRecord, ToothSurfacesMap, mongoose.Document<unknown, {}, ToothSurfacesMap, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ToothSurfacesMap & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    mesial?: mongoose.SchemaDefinitionProperty<ToothSurfaceRecord, ToothSurfacesMap, mongoose.Document<unknown, {}, ToothSurfacesMap, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ToothSurfacesMap & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    distal?: mongoose.SchemaDefinitionProperty<ToothSurfaceRecord, ToothSurfacesMap, mongoose.Document<unknown, {}, ToothSurfacesMap, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ToothSurfacesMap & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    occlusal_incisal?: mongoose.SchemaDefinitionProperty<ToothSurfaceRecord, ToothSurfacesMap, mongoose.Document<unknown, {}, ToothSurfacesMap, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ToothSurfacesMap & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, ToothSurfacesMap>;
export declare class ToothRecord {
    toothNumber: string;
    toothType: ToothType;
    quadrant: 1 | 2 | 3 | 4;
    arch: Arch;
    status: ToothStatus[];
    surfaces: ToothSurfacesMap;
    diagnosis: string[];
    notes?: string;
    lastUpdated?: Date;
    updatedBy?: mongoose.Types.ObjectId;
}
export declare const ToothRecordSchema: mongoose.Schema<ToothRecord, mongoose.Model<ToothRecord, any, any, any, any, any, ToothRecord>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, ToothRecord, mongoose.Document<unknown, {}, ToothRecord, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<ToothRecord & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    toothNumber?: mongoose.SchemaDefinitionProperty<string, ToothRecord, mongoose.Document<unknown, {}, ToothRecord, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ToothRecord & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    toothType?: mongoose.SchemaDefinitionProperty<ToothType, ToothRecord, mongoose.Document<unknown, {}, ToothRecord, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ToothRecord & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    quadrant?: mongoose.SchemaDefinitionProperty<3 | 2 | 1 | 4, ToothRecord, mongoose.Document<unknown, {}, ToothRecord, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ToothRecord & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    arch?: mongoose.SchemaDefinitionProperty<Arch, ToothRecord, mongoose.Document<unknown, {}, ToothRecord, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ToothRecord & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: mongoose.SchemaDefinitionProperty<("caries" | "healthy" | "resin" | "adapted_resin" | "unadapted_resin" | "amalgam" | "adapted_amalgam" | "unadapted_amalgam" | "fracture" | "good_crown" | "defective_crown" | "endodontics_done" | "endodontics_pending" | "extraction_indicated" | "missing_tooth" | "implant" | "good_implant" | "bad_implant" | "prosthesis" | "sealant" | "orthodontics" | "treatment_pending" | "observation" | "healthy_root" | "affected_root" | "mobility" | "periodontal_issue")[], ToothRecord, mongoose.Document<unknown, {}, ToothRecord, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ToothRecord & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    surfaces?: mongoose.SchemaDefinitionProperty<ToothSurfacesMap, ToothRecord, mongoose.Document<unknown, {}, ToothRecord, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ToothRecord & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    diagnosis?: mongoose.SchemaDefinitionProperty<string[], ToothRecord, mongoose.Document<unknown, {}, ToothRecord, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ToothRecord & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    notes?: mongoose.SchemaDefinitionProperty<string | undefined, ToothRecord, mongoose.Document<unknown, {}, ToothRecord, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ToothRecord & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lastUpdated?: mongoose.SchemaDefinitionProperty<Date | undefined, ToothRecord, mongoose.Document<unknown, {}, ToothRecord, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ToothRecord & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    updatedBy?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId | undefined, ToothRecord, mongoose.Document<unknown, {}, ToothRecord, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ToothRecord & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, ToothRecord>;
