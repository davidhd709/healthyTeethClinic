import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { hashPassword } from '../../common/utils/password.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async findAll(query: QueryUserDto) {
    const filter: Record<string, unknown> = {};
    if (query.active !== 'all') filter.isActive = true;
    if (query.role) filter.role = query.role;
    if (query.search && query.search.trim().length > 0) {
      const regex = new RegExp(this.escapeRegex(query.search.trim()), 'i');
      filter.$or = [{ name: regex }, { email: regex }];
    }

    return this.userModel
      .find(filter)
      .populate('specialistId', 'name slug specialty')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string) {
    const user = await this.userModel
      .findById(id)
      .populate('specialistId', 'name slug specialty')
      .exec();
    if (!user) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado`);
    }
    return user;
  }

  async findByEmailWithPassword(email: string) {
    return this.userModel
      .findOne({ email: email.toLowerCase().trim(), isActive: true })
      .select('+passwordHash')
      .exec();
  }

  async create(dto: CreateUserDto) {
    const normalizedEmail = dto.email.toLowerCase().trim();
    const exists = await this.userModel.exists({ email: normalizedEmail });
    if (exists) {
      throw new ConflictException('Ya existe un usuario con ese correo');
    }

    const passwordHash = await hashPassword(dto.password);
    const created = await this.userModel.create({
      email: normalizedEmail,
      passwordHash,
      name: dto.name.trim(),
      role: dto.role,
      specialistId: dto.specialistId,
      isActive: dto.isActive ?? true,
    });
    return created;
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado`);
    }

    if (dto.email) {
      const normalized = dto.email.toLowerCase().trim();
      if (normalized !== user.email) {
        const clash = await this.userModel.exists({ email: normalized, _id: { $ne: id } });
        if (clash) {
          throw new ConflictException('Ya existe un usuario con ese correo');
        }
        user.email = normalized;
      }
    }

    if (dto.name !== undefined) user.name = dto.name.trim();
    if (dto.role !== undefined) user.role = dto.role;
    if (dto.specialistId !== undefined) {
      user.specialistId = dto.specialistId
        ? (dto.specialistId as unknown as typeof user.specialistId)
        : undefined;
    }
    if (dto.isActive !== undefined) {
      if (!dto.isActive && user.role === 'admin') {
        const otherAdmins = await this.userModel.countDocuments({
          role: 'admin',
          isActive: true,
          _id: { $ne: id },
        });
        if (otherAdmins === 0) {
          throw new BadRequestException(
            'No se puede desactivar al último administrador activo',
          );
        }
      }
      user.isActive = dto.isActive;
    }
    if (dto.password) {
      user.passwordHash = await hashPassword(dto.password);
    }

    await user.save();
    const fresh = await this.userModel
      .findById(id)
      .populate('specialistId', 'name slug specialty')
      .exec();
    return fresh;
  }

  async remove(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado`);
    }

    if (user.role === 'admin' && user.isActive) {
      const otherAdmins = await this.userModel.countDocuments({
        role: 'admin',
        isActive: true,
        _id: { $ne: id },
      });
      if (otherAdmins === 0) {
        throw new BadRequestException(
          'No se puede eliminar al último administrador activo',
        );
      }
    }

    user.isActive = false;
    await user.save();
    return { id, isActive: user.isActive };
  }

  async touchLastLogin(id: string) {
    await this.userModel.updateOne({ _id: id }, { $set: { lastLoginAt: new Date() } }).exec();
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
