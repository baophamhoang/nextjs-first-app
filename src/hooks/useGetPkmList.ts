import { useQuery } from '@tanstack/react-query';
import { getPokemonList } from '@/apis/queries';

export const useGetPkmList = () => {
  return useQuery({queryKey: ['list'], queryFn: getPokemonList});
};