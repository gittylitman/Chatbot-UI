import Joi from 'joi';
import { DatabaseConfigurationSchema, databaseConfigurationValidationObject } from './db-configuration.schema';

export type InfrastructureConfigurationSchema = DatabaseConfigurationSchema

export const infrastructureConfigurationValidationObject: Record<keyof InfrastructureConfigurationSchema, Joi.Schema> =
{
  ...databaseConfigurationValidationObject,
};
