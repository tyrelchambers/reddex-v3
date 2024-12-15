import mixpanel, { Dict } from "mixpanel-browser";

export const trackUiEvent = <T extends Dict>(
  name: string,
  props?: Record<string, number | string> | T,
) => {
  if (process.env.NODE_ENV === "production") {
    mixpanel.track(name, { ...props });
  }
};
