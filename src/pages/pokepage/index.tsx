import { useGetSearchPkmListAdvanced } from '@/hooks/useGetPkmListAdvanced';
import { getClosureBg } from '@/utils/theme-utils';
import { Box, Center, Heading, Input, Spinner, useColorMode } from '@chakra-ui/react';
import { debounce } from 'lodash';
import { InferGetStaticPropsType } from 'next';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import SearchResult from './SearchResult';

export default function PokePage({ test }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { colorMode } = useColorMode();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { data, error, isError, isLoadingorFetching, isDataListValid, isFetchingNextPage, handleFetchNextPage, refetch } =
    useGetSearchPkmListAdvanced(searchTerm);

  const closureBg = getClosureBg(colorMode);

  // TOODO: investigate this approach
  // const debouncedSearchTerm: string = useDebounce<string>(searchTerm, 300);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const debouncedSearchChangeHandler = useMemo(() => debounce(handleSearchChange, 300), []);

  useEffect(() => {
    refetch();
  }, [searchTerm, refetch]);

  return (
    <>
      <Box>
        <Heading as="h2" size="3xl" lineHeight="inherit" noOfLines={1}>
          Dex
        </Heading>
      </Box>
      <Box textAlign="center">
        <Input
          size="lg"
          variant="outline"
          placeholder="Type anything..."
          w={{ base: '90%', md: '60%', lg: '40%' }}
          borderWidth="medium"
          focusBorderColor="#FFA07A"
          onChange={debouncedSearchChangeHandler}
        />
      </Box>
      <Box>
        <Center>
          {isLoadingorFetching && (
            <Box bg={closureBg} w={{ base: '90%', md: '60%', lg: '40%' }} p={'1rem 1rem 1rem 1rem'}>
              <Spinner mr={2} />
              Loading...
            </Box>
          )}
          {isError && <>{error}</>}
          {isDataListValid && <SearchResult data={data} fetchNextPage={handleFetchNextPage} isFetchingNextPage={isFetchingNextPage} />}
        </Center>
      </Box>
    </>
  );
}

// TODO: remove later or config into a static ones
export async function getStaticProps() {
  // const getName = await fetch("http://localhost:3000/api/test");
  // const test: { name: string } = await getName.json();
  const test: { name: string } = {
    name: 'Bao',
  };
  return {
    props: {
      test,
    },
  };
}
