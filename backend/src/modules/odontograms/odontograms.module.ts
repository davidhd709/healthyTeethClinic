import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Odontogram, OdontogramSchema } from './schemas/odontogram.schema';
import {
  OdontogramHistory,
  OdontogramHistorySchema,
} from './schemas/odontogram-history.schema';
import { OdontogramsService } from './odontograms.service';
import { OdontogramsController } from './odontograms.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Odontogram.name, schema: OdontogramSchema },
      { name: OdontogramHistory.name, schema: OdontogramHistorySchema },
    ]),
  ],
  controllers: [OdontogramsController],
  providers: [OdontogramsService],
  exports: [OdontogramsService],
})
export class OdontogramsModule {}
