import { InfinityLoad } from '@/apis/queries';
import PokemonCard from '@/components/PokemonCard';
import styles from '@/styles/Home.module.css';
import { getClosureBg } from '@/utils/theme-utils';
import { Box, ScaleFade, Spinner, Wrap, WrapItem, useColorMode } from '@chakra-ui/react';
import { InfiniteData } from '@tanstack/react-query';
import { isEmpty } from 'lodash';
import { useRef } from 'react';

function SearchResult({
  data,
  fetchNextPage,
  isFetchingNextPage,
}: {
  data: InfiniteData<InfinityLoad> | undefined;
  fetchNextPage: Function;
  isFetchingNextPage: boolean;
}) {
  // hooks
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const { colorMode } = useColorMode();

  // vars
  const closureBg = getClosureBg(colorMode);
  const isDataListEmpty = isEmpty(data) || isEmpty(data.pages) || data.pages.some((page) => !page.data);

  // functions
  const handleScroll = () => {
    const listElement = searchBoxRef.current;
    if (listElement) {
      const { scrollTop, clientHeight, scrollHeight } = listElement;
      const isAtBottom = scrollTop + clientHeight === scrollHeight;
      if (isAtBottom) {
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
            <Wrap spacing={{base: 1, md: 3}} justifyContent={'center'} mt="1rem">
              {!isDataListEmpty ? (
                data?.pages.map((page, index) => {
                  return page.data.map((item: any, index2: number) => {
                    return (
                      <ScaleFade key={index + '-' + index2} initialScale={0.9} in={!!item}>
                        <WrapItem key={`item-${index}`}>
                          <PokemonCard data={item}></PokemonCard>
                        </WrapItem>
                      </ScaleFade>
                    );
                  });
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
