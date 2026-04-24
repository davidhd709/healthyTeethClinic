import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { QueryPatientDto } from './dto/query-patient.dto';
import { AuthenticatedUser } from '../../common/types/jwt-payload.type';
import { AppointmentsService } from '../appointments/appointments.service';
export declare class PatientsController {
    private readonly patientsService;
    private readonly appointmentsService;
    constructor(patientsService: PatientsService, appointmentsService: AppointmentsService);
    findAll(query: QueryPatientDto): Promise<{
        items: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/patient.schema").Patient, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/patient.schema").Patient & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/patient.schema").Patient, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/patient.schema").Patient & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/patient.schema").Patient, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/patient.schema").Patient & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/patient.schema").Patient, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/patient.schema").Patient & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findAppointments(id: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../appointments/schemas/appointment.schema").Appointment, {}, import("mongoose").DefaultSchemaOptions> & import("../appointments/schemas/appointment.schema").Appointment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../appointments/schemas/appointment.schema").Appointment, {}, import("mongoose").DefaultSchemaOptions> & import("../appointments/schemas/appointment.schema").Appointment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    create(dto: CreatePatientDto, user: AuthenticatedUser): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/patient.schema").Patient, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/patient.schema").Patient & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/patient.schema").Patient, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/patient.schema").Patient & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    update(id: string, dto: UpdatePatientDto, user: AuthenticatedUser): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/patient.schema").Patient, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/patient.schema").Patient & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/patient.schema").Patient, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/patient.schema").Patient & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    remove(id: string, user: AuthenticatedUser): Promise<{
        id: string;
        isActive: boolean;
    }>;
}
