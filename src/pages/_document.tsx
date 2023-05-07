import { ColorModeScript } from "@chakra-ui/color-mode";
import { Html, Head, Main, NextScript } from "next/document";
import { theme } from "./_app";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
