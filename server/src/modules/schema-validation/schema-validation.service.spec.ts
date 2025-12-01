import { TestBed } from '@automock/jest';
import { SchemaValidationService } from './schema-validation.service';
import { IsBoolean, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

describe('SchemaValiationService', () => {
  let service: SchemaValidationService;

  beforeEach(async () => {
    const { unit } = TestBed.create(SchemaValidationService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  class TestingSchemaObject {
    @IsString()
    testString!: string;

    @IsBoolean()
    testBoolean!: boolean;
  }

  class TestingSchema {
    @IsString()
    name!: string;

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => TestingSchemaObject)
    testObject!: TestingSchemaObject;
  }

  describe('when schema validation is successful', () => {
    const baseDataObject = { name: 'John' };

    it.each([
      [{ ...baseDataObject }],
      [{ ...baseDataObject, testObject: { testString: 'somestring', testBoolean: true } }],
    ])('should return an empty array for object %s', async (data) => {
      const result = await service.validate(TestingSchema, data);
      expect(result).toEqual([]);
    });
  });

  describe('when schema validation is unsuccessful', () => {
    const baseDataObject = { name: 'John' };

    it.each([
      [{ ...baseDataObject, testObject: { testString: 'somestring', testBoolean: 'true' } }],
      [{ ...baseDataObject, testObject: { testString: 'somestring' } }],
      [{ ...baseDataObject, testObject: { testBoolean: true } }],
      [{ ...baseDataObject, testObject: { testString: 123, testBoolean: true } }],
    ])(`should return an error for object %j`, async (data) => {
      const result = await service.validate(TestingSchema, data);
      expect(result.length).toEqual(1);
    });
  });
});
