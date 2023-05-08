import { PokemonReponse } from "@/apis/types";
import { Card, Image, Link } from "@chakra-ui/react";
import styles from '@/styles/Home.module.css';
import { toTitleCase } from "@/utils/toTitleCase";

export default function PokemonCard({data: {id, name, imgUrl}}: {data: PokemonReponse}) {
  return (
    <Link>
      <Card className={styles.card} borderWidth={1}>
        <p><span>No. {id}</span></p>
        <p><h2>{toTitleCase(name)}</h2></p>
        <p><Image src={imgUrl}></Image></p>
      </Card>
    </Link>
  )
}