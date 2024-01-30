"use client";

import { ThemesProps } from "@/lib/theme";
import { MantineColorScheme, useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { useEffect } from "react";

const useTheme = () => {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme as MantineColorScheme);
    }
  }, []);

  const setTheme = (theme: MantineColorScheme) => {
    setColorScheme(theme);
    if (theme === "dark" || computedColorScheme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  const themes: ThemesProps[] = [
    {
      id: "auto",
      name: "Hệ thống"
    },
    {
      id: "dark",
      name: "Giao diện tối"
    },
    {
      id: "light",
      name: "Giao diện sáng"
    }
  ];

  const selectedTheme = themes.find((t) => t.id === colorScheme) || themes[0];

  const toggleTheme = () => {
    const newTheme = computedColorScheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  return {
    computedColorScheme,
    selectedTheme,
    themes,
    toggleTheme,
    setTheme
  };
};

export default useTheme;
