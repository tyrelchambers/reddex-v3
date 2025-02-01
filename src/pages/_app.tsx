import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { MantineProvider } from "@mantine/core";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { useEffect } from "react";
import { useTheme } from "~/hooks/useTheme";
import mixpanel from "mixpanel-browser";
import { env } from "~/env";
import "@mantine/core/styles.css";
import { isActiveSubscription } from "~/utils";
import { Poppins } from "next/font/google";
import { Toaster } from "~/components/ui/sonner";
import { toast } from "sonner";
import { createRoot } from "react-dom/client";

const font = Poppins({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

type MyAppProps = {
  session: Session | null;
};

mixpanel.init(env.NEXT_PUBLIC_MIXPANEL_TOKEN, {
  debug: true,
  track_pageview: true,
  persistence: "localStorage",
});

const MyApp: AppType<MyAppProps> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const { colorScheme } = useTheme();
  const userQuery = api.user.me.useQuery(undefined, {
    retry: false,
  });

  useEffect(() => {
    if (userQuery.data) {
      const activeSub = userQuery.data.subscription
        ? isActiveSubscription(userQuery.data.subscription)
        : false;

      if (!activeSub) {
        toast.warning(
          "Your subscription is inactive. Please go to your account and update your details.",
        );
      }
    }
  }, [userQuery.data]);

  useEffect(() => {
    const document = window.document.querySelector("html");

    if (document) {
      document.className = colorScheme;
    }
  }, [colorScheme]);

  return (
    <SessionProvider session={session}>
      <MantineProvider
        withGlobalClasses
        theme={{
          fontFamily: font.style.fontFamily,
        }}
        withCssVariables
        withStaticClasses
      >
        <main className={font.className}>
          <Component {...pageProps} />
          <div id="portal-body"></div>
        </main>
      </MantineProvider>
      <Toaster richColors />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
