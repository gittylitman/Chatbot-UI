import { Module } from '@nestjs/common';
import { SchemaValidationService } from './schema-validation.service';

@Module({
  imports: [],
  providers: [SchemaValidationService],
  exports: [SchemaValidationService],
})
export class SchemaValidationModule {}
