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
} from "@chakra-ui/react";
import { debounce, isEmpty } from "lodash";
import { InferGetStaticPropsType } from "next";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

export default function PokePage({
  test,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  // const { isLoading, isError, data, error } = useGetPkmList();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { isLoading, isError, data, error } = useGetSearchPkmList(searchTerm);
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
    console.log(data);
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
      <Box h="10"></Box>
      <Box>
        <Center>
        {isLoading && <><Spinner mr={2}/>Loading...</>}
        {isError && <>{error}</>}
        {isDataListValid && (
          <Box w={{ base: "90%", md: "60%", lg: "40%" }}>
            <Wrap>
              {!isDataListEmpty ? (
                data.map((item, index) => {
                  return (
                    <ScaleFade initialScale={0.9} in={!!item}>
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
