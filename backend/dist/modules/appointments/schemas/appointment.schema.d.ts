import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
export type AppointmentDocument = HydratedDocument<Appointment>;
export declare class Appointment {
    patientId?: mongoose.Types.ObjectId;
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    patientDocument: string;
    serviceId: mongoose.Types.ObjectId;
    specialistId: mongoose.Types.ObjectId;
    date: Date;
    time: string;
    status: string;
    reasonForVisit: string;
    internalNotes: string;
    dataConsent: boolean;
}
export declare const AppointmentSchema: mongoose.Schema<Appointment, mongoose.Model<Appointment, any, any, any, any, any, Appointment>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Appointment, mongoose.Document<unknown, {}, Appointment, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<Appointment & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    patientId?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId | undefined, Appointment, mongoose.Document<unknown, {}, Appointment, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Appointment & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    patientName?: mongoose.SchemaDefinitionProperty<string, Appointment, mongoose.Document<unknown, {}, Appointment, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Appointment & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    patientEmail?: mongoose.SchemaDefinitionProperty<string, Appointment, mongoose.Document<unknown, {}, Appointment, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Appointment & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    patientPhone?: mongoose.SchemaDefinitionProperty<string, Appointment, mongoose.Document<unknown, {}, Appointment, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Appointment & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    patientDocument?: mongoose.SchemaDefinitionProperty<string, Appointment, mongoose.Document<unknown, {}, Appointment, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Appointment & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    serviceId?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId, Appointment, mongoose.Document<unknown, {}, Appointment, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Appointment & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    specialistId?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId, Appointment, mongoose.Document<unknown, {}, Appointment, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Appointment & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    date?: mongoose.SchemaDefinitionProperty<Date, Appointment, mongoose.Document<unknown, {}, Appointment, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Appointment & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    time?: mongoose.SchemaDefinitionProperty<string, Appointment, mongoose.Document<unknown, {}, Appointment, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Appointment & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: mongoose.SchemaDefinitionProperty<string, Appointment, mongoose.Document<unknown, {}, Appointment, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Appointment & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reasonForVisit?: mongoose.SchemaDefinitionProperty<string, Appointment, mongoose.Document<unknown, {}, Appointment, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Appointment & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    internalNotes?: mongoose.SchemaDefinitionProperty<string, Appointment, mongoose.Document<unknown, {}, Appointment, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Appointment & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    dataConsent?: mongoose.SchemaDefinitionProperty<boolean, Appointment, mongoose.Document<unknown, {}, Appointment, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Appointment & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Appointment>;
