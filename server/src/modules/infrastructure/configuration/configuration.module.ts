import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigurationService } from './configuration.service';
import { configurationSchema } from './schema/configuration.schema';

const envFilePath = '.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      validationSchema: configurationSchema,
    }),
  ],
  providers: [ConfigurationService],
  exports: [ConfigurationService],
})
export class ConfigurationModule {}
