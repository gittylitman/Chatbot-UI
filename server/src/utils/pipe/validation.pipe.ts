import * as Joi from 'joi';
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private readonly schema: Joi.Schema, private readonly paramName?: string) {
    this.schema = schema;
    this.paramName = paramName;
  }

  transform<T>(value: T, _metadata: ArgumentMetadata): T {
    const { error } = this.schema.validate(value) || {};
    if (error) {
      throw new BadRequestException(`Validation Error ${this.paramName && `in ${this.paramName}`}: ${error.message}`);
    }
    return value;
  }
}

export function JoiStringValidationPipe(paramName: string): JoiValidationPipe {
  return new JoiValidationPipe(Joi.string(), paramName);
}

const JoiArrayItemTypeMap = {
  string: Joi.string(),
};

interface JoiNotEmptyArrayValidationPipeOptions {
  itemType: keyof typeof JoiArrayItemTypeMap;
}

export function JoiNotEmptyArrayValidationPipe(
  paramName: string,
  options?: JoiNotEmptyArrayValidationPipeOptions,
): JoiValidationPipe {
  let arraySchema = Joi.array();

  if (options?.itemType) {
    arraySchema = arraySchema.items(JoiArrayItemTypeMap[options.itemType]);
  }

  return new JoiValidationPipe(arraySchema.min(1), paramName);
}
