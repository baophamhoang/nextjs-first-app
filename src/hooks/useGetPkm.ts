import { useQuery } from '@tanstack/react-query';
import { getPokemon } from '@/apis/queries';

export const useGetSearchPkmList = (searchTerm: string) => {
  return useQuery({queryKey: ['search-list', searchTerm], queryFn: () => getPokemon(searchTerm) });
};