"use client";

import app from "@/lib/app";
import { AppShell, Burger, Button, Divider, Drawer, Group, Image, ScrollArea, Stack, rem } from "@mantine/core";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { FC } from "react";
import classes from "./AppHeader.module.css";
import { NavItem } from "./AppLayout";

interface Props {
  opened: boolean;
  toggle: () => void;
  activePath: null | string;
  items?: NavItem[];
}

const AppHeader: FC<Props> = ({ opened, toggle, activePath, items }) => {
  return (
    <AppShell.Header>
      <Group h="100%" px="md" justify="space-between" align="center">
        <Group>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" />
          <Image src={app.logoUrl} alt={app.name} width={150} height={43} w={150} h={43} />
        </Group>
        <Group>
          <Button variant="default" onClick={() => signOut()}>
            Đăng xuất
          </Button>
        </Group>
        {items && (
          <Drawer opened={opened} onClose={toggle} size="100%" hiddenFrom="sm">
            <ScrollArea>
              <Stack gap="md">
                {items.map((item) => (
                  <Link
                    className={classes.link}
                    data-active={item.link === activePath || undefined}
                    href={item.link}
                    onClick={toggle}
                    key={item.label}>
                    <item.icon className={classes.linkIcon} stroke={1.5} />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </Stack>
            </ScrollArea>
          </Drawer>
        )}
      </Group>
    </AppShell.Header>
  );
};

export default AppHeader;
