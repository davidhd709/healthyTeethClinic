import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MedicalHistoriesService } from './medical-histories.service';
import { UpdateMedicalHistoryDto } from './dto/update-medical-history.dto';
import { CreateEvolutionDto } from './dto/create-evolution.dto';
import { UpdateEvolutionDto } from './dto/update-evolution.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types/jwt-payload.type';
import { ParseObjectIdPipe } from '../../common/pipes/parse-objectid.pipe';

@ApiTags('MedicalHistories')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('api/patients/:patientId/medical-history')
export class MedicalHistoriesController {
  constructor(private readonly service: MedicalHistoriesService) {}

  @Get()
  @Roles('admin', 'specialist', 'receptionist')
  get(
    @Param('patientId', ParseObjectIdPipe) patientId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.getOrCreateByPatient(patientId, user?.userId);
  }

  @Patch()
  @Roles('admin', 'specialist')
  update(
    @Param('patientId', ParseObjectIdPipe) patientId: string,
    @Body() dto: UpdateMedicalHistoryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.updateMain(patientId, dto, user?.userId);
  }

  @Post('evolutions')
  @Roles('admin', 'specialist')
  addEvolution(
    @Param('patientId', ParseObjectIdPipe) patientId: string,
    @Body() dto: CreateEvolutionDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.addEvolution(patientId, dto, user?.userId);
  }

  @Patch('evolutions/:evolutionId')
  @Roles('admin', 'specialist')
  updateEvolution(
    @Param('patientId', ParseObjectIdPipe) patientId: string,
    @Param('evolutionId', ParseObjectIdPipe) evolutionId: string,
    @Body() dto: UpdateEvolutionDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.updateEvolution(patientId, evolutionId, dto, user?.userId);
  }
}
