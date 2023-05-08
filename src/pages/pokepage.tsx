import { useGetSearchPkmList } from "@/hooks/useGetPkm";
import { Box, Heading, Input, Link } from "@chakra-ui/react";
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
    console.log(data)
  });

  return (
    <>
      <Box>
        <Heading as="h2" size="3xl" lineHeight="inherit" noOfLines={1}>
          Index
        </Heading>
      </Box>
      <Box textAlign="center">
        <Input
          size="lg"
          variant="outline"
          placeholder="Type anything..."
          width="40%"
          borderWidth="medium"
          focusBorderColor="#FFA07A"
          onChange={debouncedSearchChangeHandler}
        />
      </Box>
      <Box>
        {isLoading && <>Loading...</>}
        {isError && <>{error}</>}
        {isDataListValid &&  (
          <>
            {!isDataListEmpty? data.map((item, index) => {
              return (
                <p key={`item-${index}`}>
                  Name:{item.name}/ Url:<Link href={item.url}>{item.url}</Link>
                </p>
              );
            }) : <p>No items matched</p>}
          </>
        )}
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
