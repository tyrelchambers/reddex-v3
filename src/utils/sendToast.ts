import { toast } from "react-toastify";

type ToastType = "info" | "success" | "warning" | "error" | "default";

interface Props {
  type?: ToastType;
  message: string;
}

export const sendToast = ({ type = "info", message }: Props) => {
  return toast(message, {
    type,
  });
};
