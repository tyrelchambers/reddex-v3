import { toast } from "sonner";

export const copyToClipboard = (text: string | null | undefined) => {
  if (text) {
    navigator.clipboard.writeText(text);
    toast.info("Copied to clipboard");
  }
};
