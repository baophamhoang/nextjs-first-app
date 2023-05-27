export interface ApiResponse<T> {
  message?: string,
  data?: T
}

export interface ApiErrorResponse {
  message: string,
}

export interface PokemonReponse {
  id: number;
  name: string;
  imgUrl: string;
}