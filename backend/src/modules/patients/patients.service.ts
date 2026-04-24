import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Patient, PatientDocument } from './schemas/patient.schema';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { QueryPatientDto } from './dto/query-patient.dto';
import { MedicalHistoriesService } from '../medical-histories/medical-histories.service';

export interface ResolvePatientInput {
  documentNumber?: string;
  name: string;
  email?: string;
  phone?: string;
}

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: parts[0] };
  const firstName = parts.slice(0, Math.ceil(parts.length / 2)).join(' ');
  const lastName = parts.slice(Math.ceil(parts.length / 2)).join(' ');
  return { firstName, lastName };
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseBirthDate(value: string): Date {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new BadRequestException('Fecha de nacimiento inválida');
  }
  const today = new Date();
  if (parsed.getTime() > today.getTime()) {
    throw new BadRequestException('La fecha de nacimiento no puede ser futura');
  }
  return parsed;
}

@Injectable()
export class PatientsService {
  constructor(
    @InjectModel(Patient.name)
    private readonly patientModel: Model<PatientDocument>,
    private readonly medicalHistoriesService: MedicalHistoriesService,
  ) {}

  async findAll(query: QueryPatientDto) {
    const filter: Record<string, unknown> = {};

    if (query.active === 'inactive') {
      filter.isActive = false;
    } else if (query.active !== 'all') {
      filter.isActive = true;
    }

    if (query.search && query.search.trim().length > 0) {
      const regex = new RegExp(escapeRegex(query.search.trim()), 'i');
      filter.$or = [
        { firstName: regex },
        { lastName: regex },
        { documentNumber: regex },
        { phone: regex },
        { email: regex },
      ];
    }

    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 20));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.patientModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.patientModel.countDocuments(filter).exec(),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async findOne(id: string) {
    const patient = await this.patientModel.findById(id).exec();
    if (!patient) {
      throw new NotFoundException(`Paciente con ID "${id}" no encontrado`);
    }
    return patient;
  }

  async findByDocument(documentNumber: string) {
    return this.patientModel
      .findOne({ documentNumber: documentNumber.trim() })
      .exec();
  }

  async create(dto: CreatePatientDto, createdBy?: string) {
    const normalized = dto.documentNumber.trim();
    const exists = await this.patientModel.exists({ documentNumber: normalized });
    if (exists) {
      throw new ConflictException('Ya existe un paciente con ese número de documento');
    }

    const birthDate = parseBirthDate(dto.birthDate);

    const created = await this.patientModel.create({
      ...dto,
      documentNumber: normalized,
      email: dto.email?.toLowerCase().trim(),
      birthDate,
      isActive: dto.isActive ?? true,
      createdBy: createdBy ? new Types.ObjectId(createdBy) : undefined,
      updatedBy: createdBy ? new Types.ObjectId(createdBy) : undefined,
    });
    await this.medicalHistoriesService.ensureForPatient(String(created._id), createdBy);
    return created;
  }

  async update(id: string, dto: UpdatePatientDto, updatedBy?: string) {
    const patient = await this.patientModel.findById(id).exec();
    if (!patient) {
      throw new NotFoundException(`Paciente con ID "${id}" no encontrado`);
    }

    if (dto.documentNumber) {
      const normalized = dto.documentNumber.trim();
      if (normalized !== patient.documentNumber) {
        const clash = await this.patientModel.exists({
          documentNumber: normalized,
          _id: { $ne: id },
        });
        if (clash) {
          throw new ConflictException('Ya existe un paciente con ese número de documento');
        }
        patient.documentNumber = normalized;
      }
    }

    if (dto.birthDate) patient.birthDate = parseBirthDate(dto.birthDate);
    if (dto.email !== undefined) {
      patient.email = dto.email ? dto.email.toLowerCase().trim() : undefined;
    }

    const scalarFields: (keyof UpdatePatientDto)[] = [
      'documentType',
      'firstName',
      'lastName',
      'sex',
      'phone',
      'address',
      'city',
      'insuranceProvider',
      'observations',
    ];
    for (const field of scalarFields) {
      if (dto[field] !== undefined) {
        (patient as unknown as Record<string, unknown>)[field] = dto[field];
      }
    }

    if (dto.emergencyContact !== undefined) {
      patient.emergencyContact = dto.emergencyContact;
    }
    if (dto.medicalInfo !== undefined) {
      patient.medicalInfo = {
        allergies: dto.medicalInfo.allergies ?? patient.medicalInfo?.allergies ?? [],
        diseases: dto.medicalInfo.diseases ?? patient.medicalInfo?.diseases ?? [],
        medications: dto.medicalInfo.medications ?? patient.medicalInfo?.medications ?? [],
        medicalHistory: dto.medicalInfo.medicalHistory ?? patient.medicalInfo?.medicalHistory,
        dentalHistory: dto.medicalInfo.dentalHistory ?? patient.medicalInfo?.dentalHistory,
      };
    }

    if (dto.isActive !== undefined) {
      patient.isActive = dto.isActive;
      patient.deletedAt = dto.isActive ? undefined : new Date();
    }

    if (updatedBy) {
      patient.updatedBy = new Types.ObjectId(updatedBy);
    }

    await patient.save();
    return patient;
  }

  async remove(id: string, updatedBy?: string) {
    const patient = await this.patientModel.findById(id).exec();
    if (!patient) {
      throw new NotFoundException(`Paciente con ID "${id}" no encontrado`);
    }

    patient.isActive = false;
    patient.deletedAt = new Date();
    if (updatedBy) {
      patient.updatedBy = new Types.ObjectId(updatedBy);
    }
    await patient.save();
    return { id, isActive: patient.isActive };
  }

  async resolveOrCreateForAppointment(
    input: ResolvePatientInput,
  ): Promise<{ patient: PatientDocument | null; wasCreated: boolean }> {
    if (!input.documentNumber || !input.documentNumber.trim()) {
      return { patient: null, wasCreated: false };
    }

    const documentNumber = input.documentNumber.trim();
    const existing = await this.patientModel
      .findOne({ documentNumber })
      .exec();
    if (existing) {
      if (!existing.isActive) {
        existing.isActive = true;
        existing.deletedAt = undefined;
        await existing.save();
      }
      return { patient: existing, wasCreated: false };
    }

    const { firstName, lastName } = splitName(input.name);
    const placeholderBirth = new Date('1900-01-01T00:00:00.000Z');

    const created = await this.patientModel.create({
      documentType: 'CC',
      documentNumber,
      firstName,
      lastName,
      birthDate: placeholderBirth,
      sex: 'O',
      phone: input.phone?.trim() ?? '0000000',
      email: input.email?.toLowerCase().trim(),
      medicalInfo: { allergies: [], diseases: [], medications: [] },
      isActive: true,
      observations:
        'Paciente creado automáticamente desde una cita. Completar datos clínicos.',
    });

    return { patient: created, wasCreated: true };
  }
}
