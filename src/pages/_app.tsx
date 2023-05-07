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
import { useEffect, useState } from "react";

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
  const [subdomain, setSubdomain] = useState<string | undefined>(undefined);

  useEffect(() => {
    const hostname = "www.domain.reddex.app";

    if (process.env.NODE_ENV === "development") {
      const subdomainRegex = new RegExp(
        /^(?!www\.)([a-zA-Z0-9][a-zA-Z0-9-]*)?\.(localhost|[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,})$|^(www\.)?([a-zA-Z0-9][a-zA-Z0-9-]*)?\.(localhost|[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,})$/
      );
      const subdomain = hostname.match(subdomainRegex)?.[4] || undefined;

      setSubdomain(subdomain);
    } else {
      const subdomainRegexProd = new RegExp(
        /^(?!www\.)([a-zA-Z0-9][a-zA-Z0-9-]*)?\.[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}$|^(www\.)?([a-zA-Z0-9][a-zA-Z0-9-]*)?\.[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}$/
      );
      const subdomain = hostname.match(subdomainRegexProd)?.[3] || undefined;
      setSubdomain(subdomain);
    }
  }, []);

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
