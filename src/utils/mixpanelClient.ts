import mixpanel, { Dict } from "mixpanel-browser";

export const trackUiEvent = <T extends Dict>(
  name: string,
  props?: Record<string, number | string> | T
) => {
  mixpanel.track(name, { ...props });
};
