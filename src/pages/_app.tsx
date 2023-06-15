import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { MantineProvider } from "@mantine/core";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

import { Poppins } from "next/font/google";
import { ToastContainer } from "react-toastify";
import { api } from "~/utils/api";

import "~/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { useTheme } from "~/hooks/useTheme";

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
  const { colorScheme } = useTheme();

  useEffect(() => {
    const document = window.document.querySelector("html");

    if (document) {
      document.className = colorScheme;
    }
  }, [colorScheme]);

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
                input: "text-gray-500 ",
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
                input: "text-gray-500 ",
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
        theme="light"
      />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
