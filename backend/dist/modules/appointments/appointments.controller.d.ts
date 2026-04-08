import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto, UpdateStatusDto } from './dto/update-appointment.dto';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    findAll(status?: string, specialistId?: string, serviceId?: string, dateFrom?: string, dateTo?: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/appointment.schema").Appointment, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/appointment.schema").Appointment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/appointment.schema").Appointment, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/appointment.schema").Appointment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/appointment.schema").Appointment, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/appointment.schema").Appointment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/appointment.schema").Appointment, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/appointment.schema").Appointment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    create(dto: CreateAppointmentDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/appointment.schema").Appointment, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/appointment.schema").Appointment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/appointment.schema").Appointment, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/appointment.schema").Appointment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    update(id: string, dto: UpdateAppointmentDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/appointment.schema").Appointment, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/appointment.schema").Appointment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/appointment.schema").Appointment, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/appointment.schema").Appointment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    updateStatus(id: string, dto: UpdateStatusDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/appointment.schema").Appointment, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/appointment.schema").Appointment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/appointment.schema").Appointment, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/appointment.schema").Appointment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    remove(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/appointment.schema").Appointment, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/appointment.schema").Appointment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/appointment.schema").Appointment, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/appointment.schema").Appointment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
}
