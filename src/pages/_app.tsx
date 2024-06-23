import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { MantineProvider } from "@mantine/core";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

import { Poppins } from "next/font/google";
import { ToastContainer, toast } from "react-toastify";
import { api } from "~/utils/api";

import "~/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { useTheme } from "~/hooks/useTheme";
import mixpanel from "mixpanel-browser";
import { env } from "~/env.mjs";

const font = Poppins({
  weight: ["300", "500", "700"],
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
      const activeSub = userQuery.data.hasActiveSubscription;

      if (!activeSub) {
        toast.warn(
          <p>
            Your subscription is inactive. Please go to your account and update
            your details.
          </p>,
          {
            autoClose: false,
            toastId: "no-subscription",
            position: "bottom-right",
            className: "!rounded-xl",
          },
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
      >
        <main className={font.className}>
          <Component {...pageProps} />
        </main>
      </MantineProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        toastStyle={{
          width: "400px",
          right: "100px",
        }}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={3}
        theme={colorScheme}
      />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
