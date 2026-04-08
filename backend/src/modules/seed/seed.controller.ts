import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SeedService } from './seed.service';
import { AdminGuard } from '../../common/guards/admin.guard';

@ApiTags('Seed')
@Controller('api/seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  seed() {
    return this.seedService.seed();
  }
}
