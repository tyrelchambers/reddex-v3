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
import { GetServerSidePropsContext } from "next";

const font = Poppins({
  weight: ["300", "500", "700"],
  subsets: ["latin"],
});

type MyAppProps = {
  session: Session | null;
};

const MyApp: AppType<MyAppProps> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          fontFamily: font.style.fontFamily,
          components: {
            TextInput: {
              classNames: {
                label: "label",
                input: "text-gray-800",
              },
            },
            NativeSelect: {
              classNames: {
                label: "label",
                input: "text-gray-800",
              },
            },
            Textarea: {
              classNames: {
                label: "label",
                input: "text-gray-800",
              },
            },
            Checkbox: {
              classNames: {
                label: "label",
              },
            },
          },
        }}
      >
        <main className={font.className}>
          <Component {...pageProps} />
        </main>
      </MantineProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
