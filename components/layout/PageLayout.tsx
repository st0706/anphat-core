"use client";

import { Paper, Title } from "@mantine/core";
import { FC, PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  title?: string;
  padding?: boolean;
}

const PageLayout: FC<Props> = ({ title, padding, children }) => {
  return (
    <Paper withBorder radius="md" p={padding ? "md" : undefined}>
      {title && (
        <Title
          order={3}
          mb={padding ? "md" : undefined}
          mt={padding ? undefined : "md"}
          px={padding ? undefined : "md"}>
          {title}
        </Title>
      )}
      {children}
    </Paper>
  );
};

export default PageLayout;
