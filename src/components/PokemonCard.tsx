import { PokemonReponse } from "@/apis/types";
import styles from '@/styles/Home.module.css';
import { toTitleCase } from "@/utils/toTitleCase";
import { Card, Image as CImage, Link, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function PokemonCard({data: {id, name, imgUrl}}: {data: PokemonReponse}) {
  const [ isImageLoaded, setImageLoaded ] = useState(false);
  const handleLoadImage = () => {
    setImageLoaded(true);
  }
  useEffect(() => {
    const img = new Image();
    img.src = imgUrl;
    img.onload = () => setImageLoaded(true);
  }, [imgUrl]);

  return (
    <Link>
      <Card className={styles.card} borderWidth={1}>
        <p><span>No. {id}</span></p>
        <p><h2>{toTitleCase(name)}</h2></p>
        <p>{!isImageLoaded && <Spinner />}</p>
        <p><CImage loading={'lazy'} src={imgUrl} alt={`id-${id}`} display={isImageLoaded ? "block" : "none"}></CImage></p>
      </Card>
    </Link>
  )
}