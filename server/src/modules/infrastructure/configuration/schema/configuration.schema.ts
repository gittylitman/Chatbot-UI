import Joi from 'joi';
import { EnvironmentName } from '../../../../utils/consts';
import { ApplicationMode } from './application-mode.enum';
import { InfrastructureConfigurationSchema, infrastructureConfigurationValidationObject } from './infra';
import {
  BootstrapConfigurationSchema,
  bootstrapConfigurationValidationObject,
} from './infra/bootstrap-configuration.schema';
import { notTest } from './util';
import { AcmeConfigurationValidationSSchema, acmeConfigurationValidationSchema } from './acme';

export type ConfigurationSchema = InfrastructureConfigurationSchema &
  AcmeConfigurationValidationSSchema &
  BootstrapConfigurationSchema & {
    APPLICATION_MODE: ApplicationMode;
    NODE_ENV: string;
    IS_E2E_TEST?: boolean;
  };

export const validationObject: Record<keyof ConfigurationSchema, Joi.Schema> = {
  ...infrastructureConfigurationValidationObject,
  ...acmeConfigurationValidationSchema,
  ...bootstrapConfigurationValidationObject,
  APPLICATION_MODE: notTest(Joi.string().valid(...Object.values(ApplicationMode))),
  NODE_ENV: Joi.string()
    .valid(...Object.values(EnvironmentName))
    .default(EnvironmentName.DEVELOPMENT),
  IS_E2E_TEST: Joi.bool(),
};

export const configurationSchema = Joi.object<ConfigurationSchema>(validationObject);
