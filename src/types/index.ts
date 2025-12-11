export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E }

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export type DateRange = {
  start: Date
  end: Date
}

export type SortOrder = 'asc' | 'desc'

export interface FilterParams {
  search?: string
  sortBy?: string
  sortOrder?: SortOrder
  dateRange?: DateRange
}
