export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  prev: string | null;
  next: string | null;
};

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiSuccessWithMeta<T, M = PaginationMeta> = {
  success: true;
  data: T;
  meta: M;
};

export type ApiErrorDetails = {
  field: string;
  message: string;
};

export type ApiError = {
  success: false;
  error: {
    message: string;
    code: string;
    details?: ApiErrorDetails[];
  };
};

export type ApiResponse<T, M = PaginationMeta> =
  | ApiSuccess<T>
  | ApiSuccessWithMeta<T, M>
  | ApiError;
