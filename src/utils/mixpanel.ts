import Mixpanel, { PropertyDict } from "mixpanel";
import { env } from "~/env.mjs";

const memo: { mixpanel?: Mixpanel.Mixpanel } = {};
const getMixpanel = () => {
  if (memo.mixpanel != null) return memo.mixpanel;

  const token = env.MIXPANEL_TOKEN;
  if (!token) {
    console.warn("Mixpanel is not configured, app will not track metrics.");
    return;
  }
  memo.mixpanel = Mixpanel.init(token);
  return memo.mixpanel;
};

/**
 * Tries to store event in Mixpanel
 *
 * This is a fire and forget function, it fails silently.
 *
 * @param name  - name of the event, should be all caps snake_case (e.g., CHANGE_SETTING)
 * @param props - object containing scalar additional data for this event
 */
export const trackEvent = <T extends PropertyDict>(
  name: string,
  props?: Record<string, number | string> | T
) => {
  getMixpanel()?.track(name, { ...props });
};
