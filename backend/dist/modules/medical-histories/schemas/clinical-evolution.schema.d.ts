import * as mongoose from 'mongoose';
export declare class ClinicalEvolution {
    _id?: mongoose.Types.ObjectId;
    date: Date;
    specialistId?: mongoose.Types.ObjectId;
    description: string;
    diagnosis?: string;
    treatment?: string;
    recommendations?: string;
    nextAppointmentSuggestion?: Date;
    createdBy?: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
}
export declare const ClinicalEvolutionSchema: mongoose.Schema<ClinicalEvolution, mongoose.Model<ClinicalEvolution, any, any, any, any, any, ClinicalEvolution>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, ClinicalEvolution, mongoose.Document<unknown, {}, ClinicalEvolution, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<ClinicalEvolution & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId | undefined, ClinicalEvolution, mongoose.Document<unknown, {}, ClinicalEvolution, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ClinicalEvolution & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    date?: mongoose.SchemaDefinitionProperty<Date, ClinicalEvolution, mongoose.Document<unknown, {}, ClinicalEvolution, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ClinicalEvolution & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    specialistId?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId | undefined, ClinicalEvolution, mongoose.Document<unknown, {}, ClinicalEvolution, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ClinicalEvolution & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: mongoose.SchemaDefinitionProperty<string, ClinicalEvolution, mongoose.Document<unknown, {}, ClinicalEvolution, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ClinicalEvolution & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    diagnosis?: mongoose.SchemaDefinitionProperty<string | undefined, ClinicalEvolution, mongoose.Document<unknown, {}, ClinicalEvolution, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ClinicalEvolution & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    treatment?: mongoose.SchemaDefinitionProperty<string | undefined, ClinicalEvolution, mongoose.Document<unknown, {}, ClinicalEvolution, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ClinicalEvolution & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    recommendations?: mongoose.SchemaDefinitionProperty<string | undefined, ClinicalEvolution, mongoose.Document<unknown, {}, ClinicalEvolution, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ClinicalEvolution & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    nextAppointmentSuggestion?: mongoose.SchemaDefinitionProperty<Date | undefined, ClinicalEvolution, mongoose.Document<unknown, {}, ClinicalEvolution, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ClinicalEvolution & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    createdBy?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId | undefined, ClinicalEvolution, mongoose.Document<unknown, {}, ClinicalEvolution, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ClinicalEvolution & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    updatedBy?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId | undefined, ClinicalEvolution, mongoose.Document<unknown, {}, ClinicalEvolution, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ClinicalEvolution & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, ClinicalEvolution>;
