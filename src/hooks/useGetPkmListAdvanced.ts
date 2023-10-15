import { getSearchPokemonInfinityList } from '@/apis/queries';
import { PokemonReponse } from '@/apis/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import _, { isEmpty } from 'lodash';

export const useGetSearchPkmListAdvanced = (search: string) => {
  const { data, error, isLoading, isError, hasNextPage, isFetching, isFetchingNextPage, refetch, fetchNextPage } = useInfiniteQuery({
    queryKey: ['search-list-' + search],
    queryFn: (page) => {
      return getSearchPokemonInfinityList(search, page.pageParam);
    },
    getNextPageParam: ({ data, nextCursor }) => {
      if (!data || _.isEmpty(data)) return undefined;
      return nextCursor;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const pkmList = data?.pages.reduce((acc, curr) => [...acc, ...(curr?.data || [])], [] as PokemonReponse[]);
  // get current cursor: default = undefined, first page's = 0, second page's = 1 and so on
  const currentCursor = data?.pageParams && data?.pageParams.length > 0 ? ((data?.pageParams.slice(-1)[0] || 0) as number) : undefined;
  const isSearching = isLoading || (isFetching && !isFetchingNextPage);

  const handleFetchNextPage = () => {
    fetchNextPage();
  };

  return {
    pkmList,
    error,
    isError,
    isSearching,
    isFetchingNextPage,
    currentCursor,
    hasNextPage,
    handleFetchNextPage,
    refetch,
  };
};
