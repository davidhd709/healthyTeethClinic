import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OdontogramsService } from './odontograms.service';
import { UpdateToothDto } from './dto/update-tooth.dto';
import { UpdateSurfaceDto } from './dto/update-surface.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types/jwt-payload.type';
import { ParseObjectIdPipe } from '../../common/pipes/parse-objectid.pipe';

@ApiTags('Odontograms')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('api/patients/:patientId/odontogram')
export class OdontogramsController {
  constructor(private readonly service: OdontogramsService) {}

  @Get()
  @Roles('admin', 'specialist', 'receptionist')
  get(
    @Param('patientId', ParseObjectIdPipe) patientId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.getOrCreateByPatient(patientId, user?.userId);
  }

  @Get('history')
  @Roles('admin', 'specialist', 'receptionist')
  history(
    @Param('patientId', ParseObjectIdPipe) patientId: string,
    @Query('toothNumber') toothNumber?: string,
    @Query('surface') surface?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.getHistory(patientId, {
      toothNumber,
      surface,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Patch('teeth/:toothNumber')
  @Roles('admin', 'specialist')
  updateTooth(
    @Param('patientId', ParseObjectIdPipe) patientId: string,
    @Param('toothNumber') toothNumber: string,
    @Body() dto: UpdateToothDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.updateTooth(patientId, toothNumber, dto, user?.userId);
  }

  @Patch('teeth/:toothNumber/surfaces/:surface')
  @Roles('admin', 'specialist')
  updateSurface(
    @Param('patientId', ParseObjectIdPipe) patientId: string,
    @Param('toothNumber') toothNumber: string,
    @Param('surface') surface: string,
    @Body() dto: UpdateSurfaceDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.updateSurface(patientId, toothNumber, surface, dto, user?.userId);
  }
}
