import { format } from "date-fns";

export const formatStripeTime = (time: number) => {
  return format(new Date(time * 1000), "MMMM do, yyyy");
};
