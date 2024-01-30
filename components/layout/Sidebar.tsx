"use client";

import { ActionIcon, AppShell, ScrollArea, Tooltip } from "@mantine/core";
import { IconCircleArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { FC } from "react";
import { NavItem } from "./AppLayout";
import classes from "./Sidebar.module.css";

interface Props {
  opened: boolean;
  toggle: () => void;
  activePath: null | string;
  items?: NavItem[];
}

const Sidebar: FC<Props> = ({ opened, toggle, activePath, items }) => {
  if (!items) return null;

  return (
    <AppShell.Navbar>
      <Tooltip label="Ẩn menu">
        <ActionIcon variant="transparent" color="gray" visibleFrom="sm" className={classes.hideNav} onClick={toggle}>
          <IconCircleArrowLeft style={{ width: "90%", height: "90%" }} stroke={1.5} />
        </ActionIcon>
      </Tooltip>
      <ScrollArea p="md" py="xs">
        {items.map((item) => (
          <Link
            className={classes.link}
            data-active={activePath && activePath?.startsWith(item.link) ? true : undefined}
            href={item.link}
            key={item.label}>
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>{item.label}</span>
          </Link>
        ))}
      </ScrollArea>
    </AppShell.Navbar>
  );
};

export default Sidebar;
