import Joi from 'joi';
import { ApplicationMode } from '../application-mode.enum';
import { forApplicationModes } from '../util';

export type AcmeConfigurationSchema = {
  ACME_ENV: string;
};

export const acmeConfigurationValidationObject: Record<keyof AcmeConfigurationSchema, Joi.Schema> = {
  ACME_ENV: forApplicationModes([ApplicationMode.API, ApplicationMode.WORKER], Joi.string().required()),
};
