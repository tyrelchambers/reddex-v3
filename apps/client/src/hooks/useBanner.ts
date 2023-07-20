import { useLocalStorage } from "@mantine/hooks";

export const useBanner = () => {
  const [value, setValue] = useLocalStorage<string[]>({
    key: "banners",
    defaultValue: [],
  });

  const hideBanner = (banner: string) => {
    setValue([...value, banner]);
  };

  const isBannerHidden = (banner: string) => {
    return value.includes(banner);
  };

  return {
    banners: value,
    hideBanner,
    isBannerHidden,
  };
};
