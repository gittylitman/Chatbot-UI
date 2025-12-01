import { BadRequestException } from '@nestjs/common';

export enum BadRequestErrorCode {
  QualificationNotInPending = 'QUALIFICATION_NOT_IN_PENDING',
  InvalidQualificationProvider = 'INVALID_QUALIFICATION_PROVIDER',
  NoQualificationInPendingStatus = 'NO_QUALIFICATION_IN_PENDING_STATUS',
}

export class CustomBadRequestException extends BadRequestException {
  constructor(readonly code: BadRequestErrorCode, message: string) {
    super({ code, message });
  }
}
