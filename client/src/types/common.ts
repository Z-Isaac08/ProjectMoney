export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResponse {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface StoreState extends LoadingState {
  [key: string]: any;
}