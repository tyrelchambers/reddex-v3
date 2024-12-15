import mixpanel, { Dict } from "mixpanel-browser";
import { env } from "~/env";

export const trackUiEvent = <T extends Dict>(
  name: string,
  props?: Record<string, number | string> | T,
) => {
  if (env.NEXT_PUBLIC_NODE_ENV === "production") {
    mixpanel.track(name, { ...props });
  }
};
