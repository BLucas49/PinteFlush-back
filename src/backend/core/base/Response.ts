export interface SuccessResponse<T extends IResponse> {
  success: true;
  data: T;
  message?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IResponse {}

export function getResponse<DataResponse extends IResponse>(
  data: DataResponse,
  message = "",
): SuccessResponse<DataResponse> {
  return {
    success: true,
    data,
    message,
  };
}

export function getErrorResponse(error: string): ErrorResponse {
  return {
    success: false,
    error,
  };
}
