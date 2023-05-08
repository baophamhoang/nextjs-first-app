export interface ApiResponse<T> {
  message?: string,
  data?: T
}

export interface ApiErrorResponse {
  message: string,
}