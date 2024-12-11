import "@mantine/core/styles.css";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { theme, variablesResolver } from "../theme/theme";

export default function App({ Component, pageProps }: any) {
  return (
    <MantineProvider theme={theme} cssVariablesResolver={variablesResolver}>
      <Head>
        <title>Zauberstack / Full stack starter + design system</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>
      <Component {...pageProps} />
    </MantineProvider>
  );
}
