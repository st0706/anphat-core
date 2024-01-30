import app from "@/lib/app";
import { Container, Image } from "@mantine/core";
import { PropsWithChildren } from "react";

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <Container size={420} my={80}>
      <Image src={app.logoUrl} alt={app.name} width={168} height={48} w={168} h={48} mx="auto" mb="md" />
      {children}
    </Container>
  );
}
