"use client";

import { Card, ComboboxItem, MantineColorScheme, Select, Text } from "@mantine/core";
import useTheme from "hooks/useTheme";

const UpdateTheme = () => {
  const { themes, selectedTheme, setTheme } = useTheme();

  const data: ComboboxItem[] = themes.map((theme) => ({
    value: theme.id,
    label: theme.name
  }));

  const onChangeTheme = (value: string | null) => {
    if (value) {
      const newTheme = value as MantineColorScheme;
      setTheme(newTheme);
    }
  };

  return (
    <Card radius="md" withBorder>
      <Text fw={500} size="lg">
        Giao diện
      </Text>
      <Text mt="xs" c="dimmed" size="sm">
        Thay đổi kiểu giao diện
      </Text>

      <Select className="w-full max-w-md" mt="md" data={data} value={selectedTheme.id} onChange={onChangeTheme} />
    </Card>
  );
};

export default UpdateTheme;
