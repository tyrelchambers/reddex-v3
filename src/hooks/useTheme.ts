import { useLocalStorage } from "@mantine/hooks";

export const useTheme = () => {
  const [colorScheme, setColorScheme] = useLocalStorage<"light" | "dark">({
    key: "color-scheme",
    defaultValue: "light",
  });

  const toggleTheme = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };

  return { colorScheme, isDark: colorScheme === "dark", toggleTheme };
};
