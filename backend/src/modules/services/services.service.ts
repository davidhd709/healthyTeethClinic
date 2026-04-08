import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service, ServiceDocument } from './schemas/service.schema';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service.name)
    private readonly serviceModel: Model<ServiceDocument>,
  ) {}

  async findAll(onlyActive = true) {
    const filter = onlyActive ? { isActive: true } : {};
    return this.serviceModel
      .find(filter)
      .populate('specialists', 'name slug photo specialty')
      .sort({ name: 1 })
      .exec();
  }

  async findOne(id: string) {
    const service = await this.serviceModel
      .findById(id)
      .populate('specialists', 'name slug photo specialty')
      .exec();
    if (!service) {
      throw new NotFoundException(`Servicio con ID "${id}" no encontrado`);
    }
    return service;
  }

  async findBySlug(slug: string) {
    const service = await this.serviceModel
      .findOne({ slug })
      .populate('specialists', 'name slug photo specialty')
      .exec();
    if (!service) {
      throw new NotFoundException(`Servicio con slug "${slug}" no encontrado`);
    }
    return service;
  }

  async create(dto: CreateServiceDto) {
    if (!dto.slug) {
      dto.slug = this.generateSlug(dto.name);
    }
    return this.serviceModel.create(dto);
  }

  async update(id: string, dto: UpdateServiceDto) {
    const service = await this.serviceModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .exec();
    if (!service) {
      throw new NotFoundException(`Servicio con ID "${id}" no encontrado`);
    }
    return service;
  }

  async remove(id: string) {
    const service = await this.serviceModel.findByIdAndDelete(id).exec();
    if (!service) {
      throw new NotFoundException(`Servicio con ID "${id}" no encontrado`);
    }
    return service;
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
