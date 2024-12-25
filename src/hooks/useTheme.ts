import { useEffect, useState } from "react";

export const useTheme = () => {
  const [colorScheme, setColorScheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      const color = window.localStorage.getItem("color-schema");

      if (color) {
        return color === "dark" ? "dark" : "light";
      }
    }
    return "light";
  });

  useEffect(() => {
    const html = document.querySelector("html");

    if (html) {
      html.className = colorScheme;
    }
  }, [colorScheme]);

  const toggleTheme = () => {
    setColorScheme(colorScheme === "light" ? "dark" : "light");
  };

  return { colorScheme, isDark: colorScheme === "dark", toggleTheme };
};
