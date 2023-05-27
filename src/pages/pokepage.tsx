import PokemonCard from "@/components/PokemonCard";
import { useGetSearchPkmList } from "@/hooks/useGetSearchPkmList";
import {
  Box,
  Center,
  Heading,
  Input,
  Link,
  ScaleFade,
  Spinner,
  Stack,
  Wrap,
  WrapItem,
  useColorMode,
} from "@chakra-ui/react";
import { debounce, isEmpty } from "lodash";
import { InferGetStaticPropsType } from "next";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import styles from "@/styles/Home.module.css";
import { useGetSearchPkmListAdvanced } from "@/hooks/useGetPkmListAdvanced";
import { PokemonReponse } from "@/apis/types";

export default function PokePage({
  test,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const { colorMode } = useColorMode();
  const [searchTerm, setSearchTerm] = useState<string>("");
  // const { isLoading, isError, data, error } = useGetSearchPkmList(searchTerm);
  const {
    data,
    error,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    refetch,
  } = useGetSearchPkmListAdvanced(searchTerm);

  const closureBg =
    colorMode === "light" ? "closure.lightGreen" : "closure.gray";
  const isLoadingorFetching = isLoading || (isFetching && !isFetchingNextPage);
  const isDataListValid =
    !isLoadingorFetching && !isError && data?.pages.some((page) => page.data);
  const isDataListEmpty =
    isEmpty(data) ||
    isEmpty(data.pages) ||
    data.pages.some((page) => !page.data);

  // TOODO: investigate this approach
  // const debouncedSearchTerm: string = useDebounce<string>(searchTerm, 300);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setSearchTerm(e.target.value);
  };

  const debouncedSearchChangeHandler = useMemo(
    () => debounce(handleSearchChange, 300),
    []
  );

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

  useEffect(() => {
    refetch();
  }, [searchTerm]);

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
          w={{ base: "90%", md: "60%", lg: "40%" }}
          borderWidth="medium"
          focusBorderColor="#FFA07A"
          onChange={debouncedSearchChangeHandler}
        />
      </Box>
      <Box>
        <Center>
          {isLoadingorFetching && (
            <Box
              bg={closureBg}
              w={{ base: "90%", md: "60%", lg: "40%" }}
              p={"1rem 1rem 1rem 1rem"}
            >
              <Spinner mr={2} />
              Loading...
            </Box>
          )}
          {isError && <>{error}</>}
          {isDataListValid && (
            <Box
              position={"relative"}
              borderRadius={"0 0 12px 12px"}
              w={{ base: "90%", md: "60%", lg: "40%" }}
              sx={{
                "&::after": {
                  position: "absolute",
                  content: "''",
                  width: "100%",
                  height: "32px",
                  background: "var(--closure-glow)",
                  bottom: 0,
                  borderRadius: "0 0 12px 12px",
                },
              }}
            >
              <Box
                bg={closureBg}
                p={"1rem 0rem 1rem 2rem"}
                borderRadius={"0 0 12px 12px"}
              >
                <Box
                  className={styles.closure}
                  ref={searchBoxRef}
                  onScroll={handleScroll}
                  sx={{
                    "&::-webkit-scrollbar": {
                      width: "10px",
                      backgroundColor: `rgba(0, 0, 0, 0.05)`,
                    },
                    "&::-webkit-scrollbar-thumb": {
                      borderRadius: "8px",
                      backgroundColor: `rgba(0, 0, 0, 0.4)`,
                    },
                  }}
                >
                  <Wrap justifyContent={"center"}>
                    {!isDataListEmpty ? (
                      data?.pages.map((page, index) => {
                        return page.data.map((item: any, index2: number) => {
                          return (
                            <ScaleFade
                              key={index + "-" + index2}
                              initialScale={0.9}
                              in={!!item}
                            >
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
          )}
        </Center>
        <Center>
          <Box>
            <button onClick={() => fetchNextPage()}>Fetch</button>
          </Box>
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
    name: 'Bao'
  };
  return {
    props: {
      test,
    },
  };
}
