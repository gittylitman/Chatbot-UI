import Joi from 'joi';
import { EnvironmentName } from '../../../../utils/consts';
import { ApplicationMode } from './application-mode.enum';

export const nonRootPort = (): Joi.Schema => Joi.number().integer().greater(1024);

export const forEnvironments = (envs: Array<EnvironmentName>, schema: Joi.SchemaLike): Joi.Schema =>
  Joi.any().when('NODE_ENV', {
    switch: envs.map((env, i) => ({
      is: env,
      then: schema,
      ...(i === envs.length - 1 && { otherwise: Joi.any() }),
    })),
  });

export const cloudEnvironment = (schema: Joi.SchemaLike): Joi.Schema =>
  forEnvironments([EnvironmentName.PRODUCTION, EnvironmentName.SANDBOX, EnvironmentName.STAGING], schema);

export const notE2eTest = (schema: Joi.SchemaLike): Joi.Schema =>
  Joi.any().when('IS_E2E_TEST', {
    is: true,
    then: Joi.any(),
    otherwise: schema,
  });

export const optionalWhenExists = (key: string, schema: Joi.SchemaLike): Joi.Schema =>
  Joi.any().when(key, {
    is: Joi.exist(),
    then: Joi.any(),
    otherwise: schema,
  });

export const notTest = (schema: Joi.SchemaLike): Joi.Schema =>
  Joi.any().when('NODE_ENV', {
    is: EnvironmentName.TEST,
    then: Joi.any(),
    otherwise: schema,
  });

export const forApplicationModes = (confs: Array<ApplicationMode>, schema: Joi.SchemaLike): Joi.Schema =>
  Joi.any().when('APPLICATION_MODE', {
    switch: confs.map((conf, i) => ({
      is: conf,
      then: schema,
      ...(i === confs.length - 1 && { otherwise: Joi.any() }),
    })),
  });
