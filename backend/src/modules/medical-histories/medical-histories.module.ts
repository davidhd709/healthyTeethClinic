import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MedicalHistory, MedicalHistorySchema } from './schemas/medical-history.schema';
import { MedicalHistoriesService } from './medical-histories.service';
import { MedicalHistoriesController } from './medical-histories.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MedicalHistory.name, schema: MedicalHistorySchema },
    ]),
  ],
  controllers: [MedicalHistoriesController],
  providers: [MedicalHistoriesService],
  exports: [MedicalHistoriesService],
})
export class MedicalHistoriesModule {}
