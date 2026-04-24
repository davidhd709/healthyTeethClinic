import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Odontogram,
  OdontogramDocument,
} from './schemas/odontogram.schema';
import {
  OdontogramHistory,
  OdontogramHistoryDocument,
  OdontogramHistorySource,
} from './schemas/odontogram-history.schema';
import { ToothRecord } from './schemas/tooth-record.schema';
import { ToothSurfaceRecord } from './schemas/tooth-surface-record.schema';
import { FDI_TEETH } from './constants/fdi-teeth.constant';
import {
  SURFACE_NAMES,
  SurfaceName,
  ToothStatus,
} from './constants/tooth-status.constant';
import { UpdateToothDto } from './dto/update-tooth.dto';
import { UpdateSurfaceDto } from './dto/update-surface.dto';

function toObjectId(value?: string): Types.ObjectId | undefined {
  if (!value || !Types.ObjectId.isValid(value)) return undefined;
  return new Types.ObjectId(value);
}

function buildInitialTeeth(): ToothRecord[] {
  return FDI_TEETH.map((t) => ({
    toothNumber: t.toothNumber,
    toothType: t.toothType,
    quadrant: t.quadrant,
    arch: t.arch,
    status: ['healthy'],
    surfaces: {
      vestibular: { status: 'none' } as ToothSurfaceRecord,
      lingual_palatal: { status: 'none' } as ToothSurfaceRecord,
      mesial: { status: 'none' } as ToothSurfaceRecord,
      distal: { status: 'none' } as ToothSurfaceRecord,
      occlusal_incisal: { status: 'none' } as ToothSurfaceRecord,
    },
    diagnosis: [],
  })) as ToothRecord[];
}

function assertSurface(surface: string): asserts surface is SurfaceName {
  if (!(SURFACE_NAMES as readonly string[]).includes(surface)) {
    throw new BadRequestException(`Superficie inválida: ${surface}`);
  }
}

@Injectable()
export class OdontogramsService {
  constructor(
    @InjectModel(Odontogram.name)
    private readonly odontogramModel: Model<OdontogramDocument>,
    @InjectModel(OdontogramHistory.name)
    private readonly historyModel: Model<OdontogramHistoryDocument>,
  ) {}

  async getOrCreateByPatient(patientId: string, createdBy?: string) {
    if (!Types.ObjectId.isValid(patientId)) {
      throw new BadRequestException('ID de paciente inválido');
    }
    const oid = new Types.ObjectId(patientId);
    const existing = await this.odontogramModel.findOne({ patientId: oid }).exec();
    if (existing) {
      if (!existing.teeth || existing.teeth.length === 0) {
        existing.teeth = buildInitialTeeth();
        await existing.save();
      }
      return existing;
    }

    const created = await this.odontogramModel.create({
      patientId: oid,
      dentitionType: 'permanent',
      teeth: buildInitialTeeth(),
      isActive: true,
      createdBy: toObjectId(createdBy),
      updatedBy: toObjectId(createdBy),
    });
    return created;
  }

  async updateTooth(
    patientId: string,
    toothNumber: string,
    dto: UpdateToothDto,
    updatedBy?: string,
  ) {
    const odontogram = await this.getOrCreateByPatient(patientId, updatedBy);
    const tooth = odontogram.teeth.find((t) => t.toothNumber === toothNumber);
    if (!tooth) {
      throw new NotFoundException(`Diente ${toothNumber} no encontrado`);
    }

    const previousStatus = [...(tooth.status ?? [])];
    let changed = false;

    if (dto.status) {
      tooth.status = dto.status as ToothStatus[];
      changed = true;
    }
    if (dto.diagnosis !== undefined) {
      tooth.diagnosis = dto.diagnosis;
      changed = true;
    }
    if (dto.notes !== undefined) {
      tooth.notes = dto.notes;
      changed = true;
    }
    if (changed) {
      tooth.lastUpdated = new Date();
      tooth.updatedBy = toObjectId(updatedBy);
      odontogram.updatedBy = toObjectId(updatedBy);
      await odontogram.save();

      if (dto.status) {
        await this.recordHistory({
          patientId: odontogram.patientId,
          toothNumber,
          previousStatus,
          newStatus: tooth.status,
          notes: dto.notes,
          specialistId: toObjectId(dto.specialistId),
          updatedBy: toObjectId(updatedBy),
          source: 'manual',
        });
      }
    }

    return odontogram;
  }

  async updateSurface(
    patientId: string,
    toothNumber: string,
    surface: string,
    dto: UpdateSurfaceDto,
    updatedBy?: string,
  ) {
    assertSurface(surface);
    const odontogram = await this.getOrCreateByPatient(patientId, updatedBy);
    const tooth = odontogram.teeth.find((t) => t.toothNumber === toothNumber);
    if (!tooth) {
      throw new NotFoundException(`Diente ${toothNumber} no encontrado`);
    }

    const surfaceRecord = tooth.surfaces[surface] as ToothSurfaceRecord;
    const previousCondition = surfaceRecord?.condition;

    if (dto.condition !== undefined) surfaceRecord.condition = dto.condition;
    if (dto.treatment !== undefined) surfaceRecord.treatment = dto.treatment;
    if (dto.status !== undefined) surfaceRecord.status = dto.status;
    if (dto.notes !== undefined) surfaceRecord.notes = dto.notes;
    if (dto.date !== undefined) {
      const parsed = new Date(dto.date);
      if (Number.isNaN(parsed.getTime())) {
        throw new BadRequestException('Fecha inválida');
      }
      surfaceRecord.date = parsed;
    }
    if (dto.specialistId !== undefined) {
      surfaceRecord.specialistId = toObjectId(dto.specialistId);
    }

    surfaceRecord.lastUpdated = new Date();
    surfaceRecord.updatedBy = toObjectId(updatedBy);
    tooth.lastUpdated = surfaceRecord.lastUpdated;
    tooth.updatedBy = surfaceRecord.updatedBy;
    odontogram.updatedBy = toObjectId(updatedBy);

    odontogram.markModified('teeth');
    await odontogram.save();

    if (dto.condition !== undefined && dto.condition !== previousCondition) {
      await this.recordHistory({
        patientId: odontogram.patientId,
        toothNumber,
        surface,
        previousStatus: previousCondition ? [previousCondition] : [],
        newStatus: dto.condition ? [dto.condition] : [],
        diagnosis: dto.condition,
        procedure: dto.treatment,
        notes: dto.notes,
        specialistId: toObjectId(dto.specialistId),
        updatedBy: toObjectId(updatedBy),
        source: 'manual',
      });
    }

    return odontogram;
  }

  async getHistory(
    patientId: string,
    options: { toothNumber?: string; surface?: string; limit?: number } = {},
  ) {
    if (!Types.ObjectId.isValid(patientId)) {
      throw new BadRequestException('ID de paciente inválido');
    }
    const filter: Record<string, unknown> = {
      patientId: new Types.ObjectId(patientId),
    };
    if (options.toothNumber) filter.toothNumber = options.toothNumber;
    if (options.surface) {
      assertSurface(options.surface);
      filter.surface = options.surface;
    }

    const limit = Math.min(Math.max(1, options.limit ?? 200), 1000);

    return this.historyModel
      .find(filter)
      .populate('specialistId', 'name slug specialty')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  private async recordHistory(input: {
    patientId: Types.ObjectId;
    toothNumber: string;
    surface?: string;
    previousStatus: ToothStatus[];
    newStatus: ToothStatus[];
    diagnosis?: string;
    procedure?: string;
    notes?: string;
    specialistId?: Types.ObjectId;
    updatedBy?: Types.ObjectId;
    source: OdontogramHistorySource;
  }) {
    await this.historyModel.create({
      patientId: input.patientId,
      toothNumber: input.toothNumber,
      surface: input.surface,
      previousStatus: input.previousStatus,
      newStatus: input.newStatus,
      diagnosis: input.diagnosis,
      procedure: input.procedure,
      notes: input.notes,
      specialistId: input.specialistId,
      updatedBy: input.updatedBy,
      source: input.source,
    });
  }
}
