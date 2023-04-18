import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { MantineProvider } from "@mantine/core";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

import { Poppins } from "next/font/google";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const font = Poppins({
  weight: ["300", "500", "700"],
  subsets: ["latin"],
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <main className={font.className}>
          <Component {...pageProps} />
        </main>
      </MantineProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
