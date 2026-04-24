import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  MedicalHistory,
  MedicalHistoryDocument,
} from './schemas/medical-history.schema';
import { UpdateMedicalHistoryDto } from './dto/update-medical-history.dto';
import { CreateEvolutionDto } from './dto/create-evolution.dto';
import { UpdateEvolutionDto } from './dto/update-evolution.dto';

function toObjectId(value?: string): Types.ObjectId | undefined {
  if (!value) return undefined;
  if (!Types.ObjectId.isValid(value)) return undefined;
  return new Types.ObjectId(value);
}

function parseOptionalDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new BadRequestException('Fecha inválida');
  }
  return date;
}

@Injectable()
export class MedicalHistoriesService {
  constructor(
    @InjectModel(MedicalHistory.name)
    private readonly historyModel: Model<MedicalHistoryDocument>,
  ) {}

  async getOrCreateByPatient(patientId: string, createdBy?: string) {
    if (!Types.ObjectId.isValid(patientId)) {
      throw new BadRequestException('ID de paciente inválido');
    }
    const oid = new Types.ObjectId(patientId);
    const existing = await this.historyModel
      .findOne({ patientId: oid })
      .populate('evolutions.specialistId', 'name slug specialty')
      .exec();
    if (existing) return existing;

    const created = await this.historyModel.create({
      patientId: oid,
      evolutions: [],
      isActive: true,
      createdBy: toObjectId(createdBy),
      updatedBy: toObjectId(createdBy),
    });
    return this.historyModel
      .findById(created._id)
      .populate('evolutions.specialistId', 'name slug specialty')
      .exec();
  }

  async ensureForPatient(patientId: string, createdBy?: string) {
    const oid = new Types.ObjectId(patientId);
    await this.historyModel
      .updateOne(
        { patientId: oid },
        {
          $setOnInsert: {
            patientId: oid,
            evolutions: [],
            isActive: true,
            createdBy: toObjectId(createdBy),
            updatedBy: toObjectId(createdBy),
          },
        },
        { upsert: true },
      )
      .exec();
  }

  async updateMain(
    patientId: string,
    dto: UpdateMedicalHistoryDto,
    updatedBy?: string,
  ) {
    const history = await this.getOrCreateByPatient(patientId, updatedBy);
    if (!history) {
      throw new NotFoundException('Historia clínica no encontrada');
    }

    const fields: (keyof UpdateMedicalHistoryDto)[] = [
      'chiefComplaint',
      'initialDiagnosis',
      'treatmentPlan',
      'generalObservations',
    ];
    for (const field of fields) {
      if (dto[field] !== undefined) {
        (history as unknown as Record<string, unknown>)[field] = dto[field];
      }
    }
    if (updatedBy) {
      history.updatedBy = toObjectId(updatedBy);
    }
    await history.save();
    return this.historyModel
      .findById(history._id)
      .populate('evolutions.specialistId', 'name slug specialty')
      .exec();
  }

  async addEvolution(
    patientId: string,
    dto: CreateEvolutionDto,
    createdBy?: string,
  ) {
    const history = await this.getOrCreateByPatient(patientId, createdBy);
    if (!history) {
      throw new NotFoundException('Historia clínica no encontrada');
    }

    const evolution = {
      _id: new Types.ObjectId(),
      date: parseOptionalDate(dto.date) ?? new Date(),
      specialistId: toObjectId(dto.specialistId),
      description: dto.description,
      diagnosis: dto.diagnosis,
      treatment: dto.treatment,
      recommendations: dto.recommendations,
      nextAppointmentSuggestion: parseOptionalDate(dto.nextAppointmentSuggestion),
      createdBy: toObjectId(createdBy),
      updatedBy: toObjectId(createdBy),
    };

    history.evolutions.push(evolution as never);
    if (createdBy) {
      history.updatedBy = toObjectId(createdBy);
    }
    await history.save();

    return this.historyModel
      .findById(history._id)
      .populate('evolutions.specialistId', 'name slug specialty')
      .exec();
  }

  async updateEvolution(
    patientId: string,
    evolutionId: string,
    dto: UpdateEvolutionDto,
    updatedBy?: string,
  ) {
    if (!Types.ObjectId.isValid(evolutionId)) {
      throw new BadRequestException('ID de evolución inválido');
    }
    const history = await this.getOrCreateByPatient(patientId, updatedBy);
    if (!history) {
      throw new NotFoundException('Historia clínica no encontrada');
    }

    const evolution = history.evolutions.find(
      (ev) => String((ev as unknown as { _id: Types.ObjectId })._id) === evolutionId,
    );
    if (!evolution) {
      throw new NotFoundException('Evolución no encontrada');
    }

    if (dto.date !== undefined) {
      const parsed = parseOptionalDate(dto.date);
      if (parsed) evolution.date = parsed;
    }
    if (dto.specialistId !== undefined) {
      evolution.specialistId = toObjectId(dto.specialistId);
    }
    if (dto.description !== undefined) evolution.description = dto.description;
    if (dto.diagnosis !== undefined) evolution.diagnosis = dto.diagnosis;
    if (dto.treatment !== undefined) evolution.treatment = dto.treatment;
    if (dto.recommendations !== undefined) evolution.recommendations = dto.recommendations;
    if (dto.nextAppointmentSuggestion !== undefined) {
      evolution.nextAppointmentSuggestion = parseOptionalDate(dto.nextAppointmentSuggestion);
    }
    (evolution as unknown as { updatedBy?: Types.ObjectId }).updatedBy = toObjectId(updatedBy);

    if (updatedBy) {
      history.updatedBy = toObjectId(updatedBy);
    }
    await history.save();

    return this.historyModel
      .findById(history._id)
      .populate('evolutions.specialistId', 'name slug specialty')
      .exec();
  }
}
