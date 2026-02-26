export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  page_size: number
  has_more: boolean
}

export interface ApiError {
  message: string
  code?: string
  details?: string
}

export interface SelectOption {
  value: string
  label: string
}

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'
