import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
export type PatientDocument = HydratedDocument<Patient>;
export type DocumentType = 'CC' | 'TI' | 'CE' | 'PP' | 'RC' | 'otro';
export type PatientSex = 'M' | 'F' | 'O';
export declare class EmergencyContact {
    name: string;
    phone: string;
    relationship?: string;
}
export declare class MedicalInfo {
    allergies: string[];
    diseases: string[];
    medications: string[];
    medicalHistory?: string;
    dentalHistory?: string;
}
export declare class Patient {
    documentType: DocumentType;
    documentNumber: string;
    firstName: string;
    lastName: string;
    birthDate: Date;
    sex: PatientSex;
    phone: string;
    email?: string;
    address?: string;
    city?: string;
    insuranceProvider?: string;
    emergencyContact?: EmergencyContact;
    medicalInfo: MedicalInfo;
    observations?: string;
    isActive: boolean;
    deletedAt?: Date;
    createdBy?: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
}
export declare const PatientSchema: mongoose.Schema<Patient, mongoose.Model<Patient, any, any, any, any, any, Patient>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Patient, mongoose.Document<unknown, {}, Patient, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<Patient & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    documentType?: mongoose.SchemaDefinitionProperty<DocumentType, Patient, mongoose.Document<unknown, {}, Patient, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Patient & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    documentNumber?: mongoose.SchemaDefinitionProperty<string, Patient, mongoose.Document<unknown, {}, Patient, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Patient & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    firstName?: mongoose.SchemaDefinitionProperty<string, Patient, mongoose.Document<unknown, {}, Patient, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Patient & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lastName?: mongoose.SchemaDefinitionProperty<string, Patient, mongoose.Document<unknown, {}, Patient, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Patient & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    birthDate?: mongoose.SchemaDefinitionProperty<Date, Patient, mongoose.Document<unknown, {}, Patient, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Patient & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    sex?: mongoose.SchemaDefinitionProperty<PatientSex, Patient, mongoose.Document<unknown, {}, Patient, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Patient & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    phone?: mongoose.SchemaDefinitionProperty<string, Patient, mongoose.Document<unknown, {}, Patient, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Patient & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    email?: mongoose.SchemaDefinitionProperty<string | undefined, Patient, mongoose.Document<unknown, {}, Patient, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Patient & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    address?: mongoose.SchemaDefinitionProperty<string | undefined, Patient, mongoose.Document<unknown, {}, Patient, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Patient & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    city?: mongoose.SchemaDefinitionProperty<string | undefined, Patient, mongoose.Document<unknown, {}, Patient, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Patient & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    insuranceProvider?: mongoose.SchemaDefinitionProperty<string | undefined, Patient, mongoose.Document<unknown, {}, Patient, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Patient & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    emergencyContact?: mongoose.SchemaDefinitionProperty<EmergencyContact | undefined, Patient, mongoose.Document<unknown, {}, Patient, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Patient & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    medicalInfo?: mongoose.SchemaDefinitionProperty<MedicalInfo, Patient, mongoose.Document<unknown, {}, Patient, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Patient & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    observations?: mongoose.SchemaDefinitionProperty<string | undefined, Patient, mongoose.Document<unknown, {}, Patient, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Patient & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isActive?: mongoose.SchemaDefinitionProperty<boolean, Patient, mongoose.Document<unknown, {}, Patient, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Patient & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    deletedAt?: mongoose.SchemaDefinitionProperty<Date | undefined, Patient, mongoose.Document<unknown, {}, Patient, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Patient & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    createdBy?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId | undefined, Patient, mongoose.Document<unknown, {}, Patient, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Patient & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    updatedBy?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId | undefined, Patient, mongoose.Document<unknown, {}, Patient, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Patient & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Patient>;
