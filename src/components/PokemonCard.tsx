import { PokemonReponse } from '@/apis/types';
import styles from '@/styles/Home.module.css';
import { toTitleCase } from '@/utils/toTitleCase';
import { Box, Card, Image as CImage, Flex, Link, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export default function PokemonCard({ data: { id, name, imgUrl } }: { data: PokemonReponse }) {
  const [isImageLoaded, setImageLoaded] = useState(false);
  const handleLoadImage = () => {
    setImageLoaded(true);
  };
  useEffect(() => {
    const img = new Image();
    img.src = imgUrl;
    img.onload = () => setImageLoaded(true);
  }, [imgUrl]);

  return (
    <Link>
      <Card className={styles.card} borderWidth={1} w={{ base: '9rem', md: '10rem' }}>
        <p>
          <span>No. {id}</span>
        </p>
        <h2>
          <p>{toTitleCase(name)}</p>
        </h2>
        <div>{!isImageLoaded && <Spinner />}</div>
        <Flex justifyContent="center">
          <CImage loading={'lazy'} src={imgUrl} alt={`id-${id}`} display={isImageLoaded ? 'block' : 'none'}></CImage>
        </Flex>
      </Card>
    </Link>
  );
}
