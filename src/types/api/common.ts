// src/types/api/common.ts

export type ApiSuccessResponse<TData> = {
  success: true;
  message: string;
  data: TData;
};

export type ApiFailureResponse = {
  success: false;
  message: string;
  data: null;
};

export type ApiResponse<TData> = ApiSuccessResponse<TData> | ApiFailureResponse;

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
