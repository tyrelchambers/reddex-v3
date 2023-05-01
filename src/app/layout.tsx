"use client";
import { SessionProvider, getSession, useSession } from "next-auth/react";
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

// const getInitialProps = createGetInitialProps();

async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

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
        <html lang="en">
          <body>
            <main className={font.className}>{children}</main>
          </body>
        </html>
      </MantineProvider>
    </SessionProvider>
  );
}

export default api.withTRPC(RootLayout);
