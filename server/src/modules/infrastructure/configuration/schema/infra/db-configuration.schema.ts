import Joi from 'joi';
import { nonRootPort, optionalWhenExists } from '../util';

export type DatabaseConfigurationSchema = {
  DB_NAME?: string;
  DB_USER?: string;
  DB_PASSWORD?: string;
  DB_HOST?: string;
  DB_PORT?: number;
  DB_URL?: string;
};

export const databaseConfigurationValidationObject: Record<keyof DatabaseConfigurationSchema, Joi.Schema> = {
  DB_NAME: optionalWhenExists('DB_URL', Joi.string().required()),
  DB_USER: optionalWhenExists('DB_URL', Joi.string().required()),
  DB_PASSWORD: optionalWhenExists('DB_URL', Joi.string().required()),
  DB_HOST: optionalWhenExists('DB_URL', Joi.string().required()),
  DB_PORT: optionalWhenExists('DB_URL', nonRootPort().required()),
  DB_URL: Joi.string(),
};
