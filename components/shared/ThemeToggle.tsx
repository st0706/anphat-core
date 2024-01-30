"use client";

import useCSR from "@/hooks/useCSR";
import useTheme from "@/hooks/useTheme";
import { ActionIcon, Group } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";

export function ThemeToggle() {
  const { computedColorScheme, toggleTheme } = useTheme();
  const [isCSR] = useCSR();

  if (!isCSR) return null;

  return (
    <Group justify="center">
      <ActionIcon onClick={toggleTheme} variant="default" size="lg" radius="xl" aria-label="Thay đổi kiểu giao diện">
        {computedColorScheme === "dark" ? <IconSun size={22} stroke={1.5} /> : <IconMoon size={22} stroke={1.5} />}
      </ActionIcon>
    </Group>
  );
}
