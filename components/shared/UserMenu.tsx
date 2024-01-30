"use client";

import { Group, Menu, UnstyledButton, rem } from "@mantine/core";
import { User } from "@prisma/client";
import { IconChevronDown, IconLayoutDashboard, IconLogout, IconSettings } from "@tabler/icons-react";
import cx from "clsx";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { FC, useState } from "react";
import LetterAvatar from "./LetterAvatar";
import classes from "./UserMenu.module.css";

interface Props {
  user: User;
}

const UserMenu: FC<Props> = ({ user }) => {
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  return (
    <Menu
      width={260}
      position="bottom-end"
      transitionProps={{ transition: "pop-top-right" }}
      onClose={() => setUserMenuOpened(false)}
      onOpen={() => setUserMenuOpened(true)}
      withinPortal>
      <Menu.Target>
        <UnstyledButton className={cx(classes.user, { [classes.userActive]: userMenuOpened })}>
          <Group gap={7}>
            <LetterAvatar url={user.image} name={user.name} size="md" />
            <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Link href="/dashboard">
          <Menu.Item leftSection={<IconLayoutDashboard style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}>
            Ứng dụng
          </Menu.Item>
        </Link>

        {/* <Menu.Label>Thiết lập</Menu.Label> */}
        <Link href="/settings/account">
          <Menu.Item leftSection={<IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}>
            Tài khoản
          </Menu.Item>
        </Link>
        {/* <Menu.Item
          leftSection={
            <IconSwitchHorizontal style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          }
        >
          Chuyển bệnh viện
        </Menu.Item> */}
        <Menu.Divider />
        <Menu.Item
          leftSection={<IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
          onClick={() => signOut()}>
          Đăng xuất
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserMenu;
