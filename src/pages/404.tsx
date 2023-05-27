import { GetStaticPropsResult } from "next";
import Error from "next/error";
import { ErrorProps } from "next/error";

// TODO: On testing
export async function getStaticProps(): Promise<
  GetStaticPropsResult<ErrorProps>
> {
  return {
    props: {
      statusCode: 404,
    },
  };
}

export default function Page({ statusCode }: ErrorProps) {
  return <Error statusCode={statusCode} />;
}
