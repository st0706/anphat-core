"use client";

import { Burger, Button, Divider, Drawer, Group, ScrollArea, Stack, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import HeaderLinks from "./HeaderLinks";

const HeaderMenu = () => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);

  return (
    <>
      <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Điều hướng"
        hiddenFrom="sm"
        zIndex={1000000}>
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />
          <Stack px="md" gap="md">
            <HeaderLinks />
          </Stack>
          <Divider my="sm" />
          <Group justify="center" grow pb="xl" px="md">
            <Button variant="default" component="a" href="/auth/join">
              Đăng ký
            </Button>
            <Button
              variant="gradient"
              gradient={{ from: "blue", to: "cyan", deg: 90 }}
              component="a"
              href="/auth/login">
              Đăng nhập
            </Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </>
  );
};

export default HeaderMenu;
