import { AxiosError } from "axios";
import { API_URLS } from "./api-url";
import client from "./client";
import { ApiErrorResponse, PokemonReponse } from "./types";

export type InfinityLoad = {data: PokemonReponse[], nextCursor: string}

export const getSearchPokemonInfinityList = async (searchTerm: string, page: number = 0, pageLimit?: number) => {
  let res;
  if (!searchTerm) return {} as InfinityLoad;
  try {
    let queryParams = '?search=' + searchTerm;
    if (page) { queryParams += '&page=' + page }
    if (pageLimit) { queryParams += '&pageLimit=' + pageLimit }
    res = await client.get<InfinityLoad>(
      API_URLS.POKEMON + queryParams
    );
  } catch (error) {
    const { message } = handlePokemonListError(error);
    throw new Error(message);
  }
  return res.data;
}

export const getSearchPokemonList = async (searchTerm: string, page: number = 0, pageLimit?: number) => {
  let res;
  if (!searchTerm) return {} as PokemonReponse[];
  try {
    let queryParams = '?search=' + searchTerm;
    if (page) { queryParams += '&page=' + page }
    if (pageLimit) { queryParams += '&pageLimit=' + pageLimit }
    res = await client.get<PokemonReponse[]>(
      API_URLS.POKEMON + queryParams
    );
  } catch (error) {
    const { message } = handlePokemonListError(error);
    throw new Error(message);
  }
  return res.data;
}


const handlePokemonListError = (error: any): { message: string } => {
  if (isAxiosError(error)) {
    return { message: error.response?.data.message ?? 'An error occurred' };
  } else {
    return { message: error.message ?? 'An error occurred' };
  }
};

const isAxiosError = (error: AxiosError<ApiErrorResponse> | any) => {
  return error.isAxiosError === true;
};