import { getSearchPokemonInfinityList } from '@/apis/queries';
import { useInfiniteQuery } from '@tanstack/react-query';
import _ from 'lodash';

export const useGetSearchPkmListAdvanced = (search: string) => {
  const { data, error, isLoading, isError, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status, refetch } = useInfiniteQuery(
    {
      queryKey: ['search-list-2'],
      queryFn: (page) => {
        return getSearchPokemonInfinityList(search, page.pageParam);
      },
      getNextPageParam: ({ data, nextCursor }) => {
        if (!data || _.isEmpty(data)) return undefined;
        return nextCursor;
      },
      staleTime: 60 * 1000 * 5,
    },
  );
  const isLoadingorFetching = isLoading || (isFetching && !isFetchingNextPage);
  const isDataListValid = !isLoadingorFetching && !isError && data?.pages.some((page) => page.data);

  const handleFetchNextPage = () => {
    fetchNextPage();
  };

  return {
    data,
    error,
    isError,
    isLoadingorFetching,
    isDataListValid,
    isFetchingNextPage,
    handleFetchNextPage,
    refetch,
  };
};
