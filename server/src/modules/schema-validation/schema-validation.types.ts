type ValidateDataResultValue = string | number | object;
export type ValidateDataResultError = {
  property: string;
  value: ValidateDataResultValue;
  constraints?: {
    [type: string]: string;
  };
};
