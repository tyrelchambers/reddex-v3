import { useEffect, useState } from "react";

export const useTheme = () => {
  const [colorScheme, setColorScheme] = useState<"dark" | "light">("light");

  useEffect(() => {
    const html = document.querySelector("html");

    if (html) {
      html.className = colorScheme;
    }
  }, [colorScheme]);
  useEffect(() => {
    const color = window.localStorage.getItem("color-scheme");

    if (color) {
      setColorScheme(color as "dark" | "light");
    }
  }, []);

  const toggleTheme = () => {
    const s = colorScheme === "light" ? "dark" : "light";
    window.localStorage.setItem("color-scheme", s);
    setColorScheme(s);
  };

  return { colorScheme, isDark: colorScheme === "dark", toggleTheme };
};
