import { InfinityLoad } from '@/apis/queries';
import { PokemonReponse } from '@/apis/types';
import PokemonCard from '@/components/PokemonCard';
import styles from '@/styles/Home.module.css';
import { getClosureBg } from '@/utils/theme-utils';
import { Box, ScaleFade, Spinner, Wrap, WrapItem, useColorMode } from '@chakra-ui/react';
import { InfiniteData } from '@tanstack/react-query';
import { isEmpty } from 'lodash';
import { useRef } from 'react';

function SearchResult({
  pkmList,
  fetchNextPage,
  isFetchingNextPage,
  curentCursor,
  hasNextPage,
}: {
  pkmList?: PokemonReponse[];
  fetchNextPage: Function;
  isFetchingNextPage: boolean;
  curentCursor?: number;
  hasNextPage?: boolean;
}) {
  // hooks
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const { colorMode } = useColorMode();

  // vars
  const closureBg = getClosureBg(colorMode);
  const isPkmListValid = pkmList && !isEmpty(pkmList);

  // functions
  const getFetchNextPagePoint = (clientHeight: number, scrollHeight: number, currentCursor: number) => {
    const totalRange = scrollHeight - clientHeight;
    // next page point is at 3/5 range of current page
    const fetchNextPagePointRatio = (currentCursor + 3 / 5) / (currentCursor + 1);
    return Math.floor(totalRange * fetchNextPagePointRatio);
  };

  const handleScroll = () => {
    const listElement = searchBoxRef.current;
    if (listElement && curentCursor !== undefined) {
      const { scrollTop, clientHeight, scrollHeight } = listElement;
      // when scrolling out of nextPagePoint, fetch next page
      const nextPagePoint = getFetchNextPagePoint(clientHeight, scrollHeight, curentCursor);
      const isAtFetchNextPagePoint = scrollTop + clientHeight >= nextPagePoint;
      if (isAtFetchNextPagePoint && !isFetchingNextPage && hasNextPage) {
        fetchNextPage();
      }
    }
  };

  return (
    <>
      <Box
        position={'relative'}
        borderRadius={'0 0 12px 12px'}
        w={{ base: '90%', md: '60%', lg: '40%' }}
        sx={{
          '&::after': {
            position: 'absolute',
            content: "''",
            width: '100%',
            height: '32px',
            background: 'var(--closure-glow)',
            bottom: 0,
            borderRadius: '0 0 12px 12px',
          },
        }}
      >
        <Box bg={closureBg} p={'0 0 1rem 2rem'} borderRadius={'0 0 12px 12px'}>
          <Box
            className={styles.closure}
            ref={searchBoxRef}
            onScroll={handleScroll}
            sx={{
              '&::-webkit-scrollbar': {
                width: '10px',
                backgroundColor: `rgba(0, 0, 0, 0.05)`,
              },
              '&::-webkit-scrollbar-thumb': {
                borderRadius: '8px',
                backgroundColor: `rgba(0, 0, 0, 0.4)`,
              },
            }}
          >
            <Wrap spacing={{ base: 1, md: 3 }} justifyContent={'center'} mt="1rem">
              {isPkmListValid ? (
                pkmList.map((item) => {
                  return (
                    <ScaleFade key={'scaleFade-' + item.id} initialScale={0.9} in={!!item}>
                      <WrapItem key={`item-${item.id}`}>
                        <PokemonCard data={item}></PokemonCard>
                      </WrapItem>
                    </ScaleFade>
                  );
                })
              ) : (
                <p>No items matched</p>
              )}
            </Wrap>
            {isFetchingNextPage && (
              <Box>
                <Spinner mr={2} />
                Loading...
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default SearchResult;
