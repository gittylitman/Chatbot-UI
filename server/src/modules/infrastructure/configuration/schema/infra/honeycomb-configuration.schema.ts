import Joi from 'joi';
import { cloudEnvironment, notE2eTest } from '../util';

export type HoneycombConfigurationSchema = {
  HONEYCOMB_API_KEY?: string;
  HONEYCOMB_DATASET?: string;
};

export const honeycombConfigurationValidationObject: Record<keyof HoneycombConfigurationSchema, Joi.Schema> = {
  HONEYCOMB_API_KEY: notE2eTest(cloudEnvironment(Joi.string().required())),
  HONEYCOMB_DATASET: notE2eTest(cloudEnvironment(Joi.string().required())),
};
