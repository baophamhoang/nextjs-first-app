import { InferGetStaticPropsType } from "next";

export default function PokePage({ data }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>Poke Page {data.name}</>
  )
}

export async function getStaticProps() {
  const getName = await fetch('http://localhost:3000/api/test');
  const data: {name: string} = await getName.json();
  return {
    props: {
      data
    }
  }
}