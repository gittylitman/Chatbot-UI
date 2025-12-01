export enum PrismaErrorCode {
  UNIQUE_CONSTRAINT_FAILED = 'P2002',
}

export const MapPrismaErrorCodeToMessage: Record<PrismaErrorCode, string> = {
  [PrismaErrorCode.UNIQUE_CONSTRAINT_FAILED]: 'unique constraint $constraints$ failed',
};
