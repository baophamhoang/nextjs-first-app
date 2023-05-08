import { NamedAPIResource, NamedAPIResourceList } from "@/types/pokemon";
import { AxiosError } from "axios";
import { API_URLS } from "./api-url";
import client from "./client";
import { ApiErrorResponse, PokemonReponse } from "./types";

export const getPokemonList = async () => {
  let res;
  try {
    res = await client.get<NamedAPIResourceList>(API_URLS.POKEMON);
  } catch (error) {
    const { message } = handlePokemonListError(error);
    throw new Error(message);
  }
  return res.data;
}

export const getPokemon = async (searchTerm: string) => {
  let res;
  if (!searchTerm) return {} as PokemonReponse[];
  try {
    res = await client.get<PokemonReponse[]>(API_URLS.POKEMON + `/${searchTerm}`);
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