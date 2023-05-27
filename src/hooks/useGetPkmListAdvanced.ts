import { QueryFunctionContext, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getSearchPokemonInfinityList, getSearchPokemonList } from '@/apis/queries';
import { PokemonReponse } from '@/apis/types';

export const useGetSearchPkmListAdvanced = (search: string) => {
  return useInfiniteQuery({
    queryKey: ['search-list-2'],
    queryFn: (page) => {
      return getSearchPokemonInfinityList(search, page.pageParam )
    },
    getNextPageParam: (lastPage) => {

      return lastPage.nextCursor
    },
    staleTime: 60 * 1000 * 5  ,
  })
};