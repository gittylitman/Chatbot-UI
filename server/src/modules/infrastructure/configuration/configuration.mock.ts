import { ConfigurationService } from './configuration.service';
import { ConfigurationSchema } from './schema/configuration.schema';

/*
usage:
import { ConfigurationService } from './configuration.service';
import { mockConfig } from './configuration.mock';

describe('ConfigurationService', () => {
  let configurationService: ConfigurationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigurationService,
        {
          provide: ConfigurationService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    configurationService = module.get<ConfigurationService>(ConfigurationService);
  });

  it('should be defined', () => {
    expect(configurationService).toBeDefined();
  });

  it('should return the correct value', () => {
    mockConfig(configurationService, {
      ALLOY_PAYOUT_EVALUATION_WORKFLOW_TOKEN: 'alloy-mock-token',
      ALLOY_PAYOUT_EVALUATION_WORKFLOW_SECRET: 'alloy-mock-secret',
    });
    expect(configurationService.get('ALLOY_PAYOUT_EVALUATION_WORKFLOW_TOKEN')).toEqual('alloy-mock-token');
    expect(configurationService.get('ALLOY_PAYOUT_EVALUATION_WORKFLOW_SECRET')).toEqual('alloy-mock-secret');
  });
});
*/
export function mockConfig(
  configService: jest.Mocked<ConfigurationService>,
  record: Partial<Record<keyof ConfigurationSchema, string | number | boolean>>,
): void {
  configService.get.mockImplementation((propertyPath: keyof ConfigurationSchema) => {
    if (Object.prototype.hasOwnProperty.call(record, propertyPath)) {
      return record[propertyPath];
    }
    return undefined;
  });
}
