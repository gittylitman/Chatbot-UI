import type { Config } from '@jest/types';
import base from './jest.base.config';

export default async (): Promise<Config.InitialOptions> => {
  const baseConfig = (await base(process.env.COVERAGE_REPORT_BASE_FILE_NAME as string)) as Config.InitialOptions;

  return {
    ...baseConfig,
    projects: [
      {
        ...baseConfig,
        displayName: 'unit-tests',
        testRegex: '.spec.ts$',
      },
      {
        ...baseConfig,
        displayName: 'integration-tests',
        testRegex: '.integration.test.ts$',
      },
    ],
  };
};
