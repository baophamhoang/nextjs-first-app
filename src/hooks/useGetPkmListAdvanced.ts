import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getPokemonList } from '@/apis/queries';

export const useGetSearchPkmListAdvanced = () => {
  return useInfiniteQuery({
    queryKey: ['list'],
    queryFn: getPokemonList,
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  })
};