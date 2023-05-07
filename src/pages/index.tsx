import { useReduxStore } from "@/stores/store";
import styles from "@/styles/Home.module.css";
import { Button } from "@chakra-ui/button";
import { useColorMode } from "@chakra-ui/color-mode";
import { Box } from "@chakra-ui/layout";
import Image from "next/image";
import { useRouter } from "next/router";
import { Button as CButton } from '@chakra-ui/react'

export default function Home() {
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();
  const dispatch = useReduxStore((state) => state.dispatch);
  const counts = useReduxStore((state) => state.counts);

  const onNextPage = () => {
    router.push("/next-page");
  };

  const gotoPokePage = () => {
    router.push("/pokepage");
  };

  const onIncreaseCount = () => {
    dispatch({ type: "INCREASE" });
  };
  const onDecreaseCount = () => {
    dispatch({ type: "DECREASE" });
  };

  return (
    <>
      <div className={styles.description}>
        <p>
          Get started by editing&nbsp;
          <code className={styles.code}>src/pages/index.tsx</code>
        </p>
        <div>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className={styles.vercelLogo}
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>
      <Box className={styles.center}>Counts: {counts}</Box>
      <Box className={styles.center}>
        <Button onClick={toggleColorMode}>
          Toggle {colorMode === "light" ? "Dark" : "Light"}
        </Button>
        <Button onClick={onNextPage}>Next Page</Button>
        <Button onClick={onIncreaseCount}>Increase Counts</Button>
        <Button onClick={onDecreaseCount}>Decrease Counts</Button>
      </Box>
      <Box className={styles.center}>
        <CButton
          colorScheme='red'
          variant='outline'
          onClick={gotoPokePage}
        >Go to PokePage</CButton>
      </Box>
      <div className={styles.grid}>
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Docs <span>-&gt;</span>
          </h2>
          <p>Find in-depth information about Next.js features and&nbsp;API.</p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Learn <span>-&gt;</span>
          </h2>
          <p>Learn about Next.js in an interactive course with&nbsp;quizzes!</p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Templates <span>-&gt;</span>
          </h2>
          <p>Discover and deploy boilerplate example Next.js&nbsp;projects.</p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Deploy <span>-&gt;</span>
          </h2>
          <p>
            Instantly deploy your Next.js site to a shareable URL
            with&nbsp;Vercel.
          </p>
        </a>
      </div>
    </>
  );
}
