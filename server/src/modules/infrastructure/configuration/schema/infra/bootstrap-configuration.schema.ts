import Joi from 'joi';
import { nonRootPort } from '../util';

export type BootstrapConfigurationSchema = {
  METRICS_PORT?: number;
  DISABLE_METRICS?: boolean;
};

export const bootstrapConfigurationValidationObject: Record<keyof BootstrapConfigurationSchema, Joi.Schema> = {
  METRICS_PORT: Joi.any().when('DISABLE_METRICS', {
    is: true,
    then: Joi.any(),
    otherwise: nonRootPort().required(),
  }),
  DISABLE_METRICS: Joi.bool().default(false),
};
