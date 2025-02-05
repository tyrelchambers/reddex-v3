import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { useEffect } from "react";
import { useTheme } from "~/hooks/useTheme";
import mixpanel from "mixpanel-browser";
import { env } from "~/env";
import { isActiveSubscription } from "~/utils";
import { Toaster } from "~/components/ui/sonner";
import { toast } from "sonner";
import { font, fontMono } from "~/utils/font";
import clsx from "clsx";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import { registerPlugin } from "filepond";

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize,
  FilePondPluginImageResize,
);

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
  useTheme();
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

  return (
    <SessionProvider session={session}>
      <main className={clsx(font.variable, fontMono.variable, "font-sans")}>
        <Component {...pageProps} />
      </main>
      <Toaster richColors />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
