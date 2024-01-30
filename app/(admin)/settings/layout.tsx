import { Container } from "@mantine/core";
import { PropsWithChildren } from "react";

export default async function SettingsLayout({ children }: PropsWithChildren) {
  return <Container>{children}</Container>;
}
