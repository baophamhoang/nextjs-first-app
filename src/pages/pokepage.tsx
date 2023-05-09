import PokemonCard from "@/components/PokemonCard";
import { useGetSearchPkmList } from "@/hooks/useGetPkm";
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
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import styles from "@/styles/Home.module.css";
import { useGetSearchPkmListAdvanced } from "@/hooks/useGetPkmListAdvanced";

export default function PokePage({
  test,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  // const { isLoading, isError, data, error } = useGetPkmList();
  const { colorMode } = useColorMode();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { isLoading, isError, data, error } = useGetSearchPkmList(searchTerm);
  // const {
  //   data,
  //   error,
  //   fetchNextPage,
  //   hasNextPage,
  //   isFetching,
  //   isFetchingNextPage,
  //   status,
  // } = useGetSearchPkmListAdvanced({
   
  // })

  const closureBg =
    colorMode === "light" ? "closure.lightGreen" : "closure.gray";
  const isDataListValid = !isLoading && !isError && Array.isArray(data);
  const isDataListEmpty = isEmpty(data);

  // TOODO: investigate this approach
  // const debouncedSearchTerm: string = useDebounce<string>(searchTerm, 300);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const debouncedSearchChangeHandler = useMemo(
    () => debounce(handleSearchChange, 300),
    []
  );

  useEffect(() => {
    console.log("isError :>> ", isError);
    console.log("data :>> ", data);
  });

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
          {isLoading && (
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
              position={'relative'}
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
                  borderRadius: "0 0 12px 12px"
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
                      data.map((item, index) => {
                        return (
                          <ScaleFade key={index} initialScale={0.9} in={!!item}>
                            <WrapItem key={`item-${index}`}>
                              <PokemonCard data={item}></PokemonCard>
                            </WrapItem>
                          </ScaleFade>
                        );
                      })
                    ) : (
                      <p>No items matched</p>
                    )}
                  </Wrap>
                </Box>
              </Box>
            </Box>
          )}
        </Center>
      </Box>
    </>
  );
}

export async function getStaticProps() {
  const getName = await fetch("http://localhost:3000/api/test");
  const test: { name: string } = await getName.json();
  return {
    props: {
      test,
    },
  };
}
