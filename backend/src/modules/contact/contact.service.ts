import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from './schemas/contact.schema';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(Contact.name)
    private readonly contactModel: Model<ContactDocument>,
  ) {}

  async findAll() {
    return this.contactModel.find().sort({ createdAt: -1 }).exec();
  }

  async create(dto: CreateContactDto) {
    return this.contactModel.create(dto);
  }
}
