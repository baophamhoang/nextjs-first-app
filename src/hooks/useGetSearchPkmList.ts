import { useQuery } from '@tanstack/react-query';
import { getSearchPokemonList } from '@/apis/queries';

export const useGetSearchPkmList = (searchTerm: string) => {
  return useQuery({queryKey: ['search-list', searchTerm], queryFn: () => getSearchPokemonList(searchTerm) });
};