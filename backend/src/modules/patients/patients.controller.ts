import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { QueryPatientDto } from './dto/query-patient.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types/jwt-payload.type';
import { ParseObjectIdPipe } from '../../common/pipes/parse-objectid.pipe';
import { AppointmentsService } from '../appointments/appointments.service';

@ApiTags('Patients')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('api/patients')
export class PatientsController {
  constructor(
    private readonly patientsService: PatientsService,
    private readonly appointmentsService: AppointmentsService,
  ) {}

  @Get()
  @Roles('admin', 'specialist', 'receptionist')
  findAll(@Query() query: QueryPatientDto) {
    return this.patientsService.findAll(query);
  }

  @Get(':id')
  @Roles('admin', 'specialist', 'receptionist')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.patientsService.findOne(id);
  }

  @Get(':id/appointments')
  @Roles('admin', 'specialist', 'receptionist')
  findAppointments(@Param('id', ParseObjectIdPipe) id: string) {
    return this.appointmentsService.findByPatient(id);
  }

  @Post()
  @Roles('admin', 'receptionist')
  create(@Body() dto: CreatePatientDto, @CurrentUser() user: AuthenticatedUser) {
    return this.patientsService.create(dto, user?.userId);
  }

  @Patch(':id')
  @Roles('admin', 'receptionist')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdatePatientDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.patientsService.update(id, dto, user?.userId);
  }

  @Delete(':id')
  @Roles('admin', 'receptionist')
  remove(@Param('id', ParseObjectIdPipe) id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.patientsService.remove(id, user?.userId);
  }
}
