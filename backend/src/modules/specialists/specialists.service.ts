import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Specialist, SpecialistDocument } from './schemas/specialist.schema';
import { CreateSpecialistDto } from './dto/create-specialist.dto';
import { UpdateSpecialistDto } from './dto/update-specialist.dto';

@Injectable()
export class SpecialistsService {
  constructor(
    @InjectModel(Specialist.name)
    private readonly specialistModel: Model<SpecialistDocument>,
  ) {}

  async findAll(onlyActive = true) {
    const filter = onlyActive ? { isActive: true } : {};
    return this.specialistModel
      .find(filter)
      .populate('services', 'name slug icon durationMinutes')
      .sort({ name: 1 })
      .exec();
  }

  async findOne(id: string) {
    const specialist = await this.specialistModel
      .findById(id)
      .populate('services', 'name slug icon durationMinutes')
      .exec();
    if (!specialist) {
      throw new NotFoundException(`Especialista con ID "${id}" no encontrado`);
    }
    return specialist;
  }

  async findBySlug(slug: string) {
    const specialist = await this.specialistModel
      .findOne({ slug })
      .populate('services', 'name slug icon durationMinutes')
      .exec();
    if (!specialist) {
      throw new NotFoundException(`Especialista con slug "${slug}" no encontrado`);
    }
    return specialist;
  }

  async create(dto: CreateSpecialistDto) {
    if (!dto.slug) {
      dto.slug = this.generateSlug(dto.name);
    }
    return this.specialistModel.create(dto);
  }

  async update(id: string, dto: UpdateSpecialistDto) {
    const specialist = await this.specialistModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .exec();
    if (!specialist) {
      throw new NotFoundException(`Especialista con ID "${id}" no encontrado`);
    }
    return specialist;
  }

  async remove(id: string) {
    const specialist = await this.specialistModel.findByIdAndDelete(id).exec();
    if (!specialist) {
      throw new NotFoundException(`Especialista con ID "${id}" no encontrado`);
    }
    return specialist;
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
