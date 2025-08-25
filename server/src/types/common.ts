export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResponse {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface QueryFilters {
  [key: string]: any;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  type?: string;
  minimum?: number;
  maximum?: number;
  enum?: string[];
  minItems?: number;
  maxItems?: number;
}

export interface ValidationRules {
  [field: string]: ValidationRule;
}