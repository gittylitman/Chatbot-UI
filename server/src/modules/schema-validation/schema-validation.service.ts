import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import _ from 'lodash';
import { ValidateDataResultError } from './schema-validation.types';

@Injectable()
export class SchemaValidationService {
  // dynamic key validations are not supported by class-validator
  // https://github.com/typestack/class-validator/issues/779
  public async validate<T extends object, S extends object>(
    schema: new () => T,
    data: S,
  ): Promise<ValidateDataResultError[]> {
    const schemaValidation = plainToInstance(schema, data);

    const errors = await validate(schemaValidation);
    const extractedErrorsProps = errors.map(({ property, value, constraints }) => ({
      property: property,
      value: value,
      constraints: constraints,
    }));

    return extractedErrorsProps;
  }
}
