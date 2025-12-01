import Joi from 'joi';
import { AcmeConfigurationSchema, acmeConfigurationValidationObject } from './acme-configuration.schema';

export type AcmeConfigurationValidationSSchema = AcmeConfigurationSchema;

export const acmeConfigurationValidationSchema: Record<keyof AcmeConfigurationValidationSSchema, Joi.Schema> = {
  ...acmeConfigurationValidationObject,
};
