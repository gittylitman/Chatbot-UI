// https://docs.nestjs.com/techniques/configuration
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { ConfigurationSchema } from './schema/configuration.schema';

@Injectable()
export class ConfigurationService extends ConfigService<Record<keyof ConfigurationSchema, unknown>, true> {}
