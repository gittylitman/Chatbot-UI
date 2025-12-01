import Joi from 'joi';
import { bootstrapConfigurationValidationObject } from './bootstrap-configuration.schema';

describe('Bootstrap configuration schema validation', () => {
  describe.each([undefined, false])('When DISABLE_METRICS=%p', (DISABLE_METRICS) => {
    describe('When METRICS_PORT=undefined', () => {
      const config = { DISABLE_METRICS };
      it('Should fail, metrics METRICS_PORT is required', () => {
        const { error } = Joi.object(bootstrapConfigurationValidationObject).validate(config);
        expect(error).toBeTruthy();
      });
    });
    describe.each([0, 1])('When METRICS_PORT=%p', (METRICS_PORT) => {
      const config = { DISABLE_METRICS, METRICS_PORT };
      it('Should fail, METRICS_PORT must be non-root', () => {
        const { error } = Joi.object(bootstrapConfigurationValidationObject).validate(config);
        expect(error).toBeTruthy();
      });
    });
    describe('When METRICS_PORT=1025', () => {
      const config = { DISABLE_METRICS, METRICS_PORT: 1025 };
      it('Should succeed', () => {
        const { error } = Joi.object(bootstrapConfigurationValidationObject).validate(config);
        expect(error).toBeUndefined();
      });
    });
  });
  describe('When DISABLE_METRICS=true', () => {
    describe('When METRICS_PORT=undefined', () => {
      const config = { DISABLE_METRICS: true };
      it('Should succeed', () => {
        const { error } = Joi.object(bootstrapConfigurationValidationObject).validate(config);
        expect(error).toBeUndefined();
      });
    });
    describe.each([0, 1, 1025])('When METRICS_PORT=%p', (METRICS_PORT) => {
      const config = { DISABLE_METRICS: true, METRICS_PORT };
      it('Should succeed', () => {
        const { error } = Joi.object(bootstrapConfigurationValidationObject).validate(config);
        expect(error).toBeUndefined();
      });
    });
  });
});
