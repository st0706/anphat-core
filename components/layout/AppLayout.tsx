"use client";

import { ActionIcon, AppShell, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBuildingHospital,
  IconCategory2,
  IconCircleArrowRight,
  IconDroplet,
  IconLock,
  IconPill,
  IconSettings,
  IconUserCircle,
  IconVirus,
  TablerIconsProps
} from "@tabler/icons-react";
import { useParams, usePathname } from "next/navigation";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { AuthPermissionCheck } from "../auth";
import AppHeader from "./AppHeader";
import Sidebar from "./Sidebar";

export type NavItem = {
  link: string;
  label: string;
  icon: (props: TablerIconsProps) => JSX.Element;
  subItems?: NavItem[];
};

const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  const pathName = usePathname();
  const [activePath, setActivePath] = useState<null | string>(null);
  const { slug } = useParams();

  useEffect(() => {
    if (pathName) {
      const activePathname = new URL(pathName, location.href).pathname;
      setActivePath(activePathname);
    }
  }, [pathName]);

  const navLinks: NavItem[] = [
    { link: "/teams", label: "Bệnh viện", icon: IconBuildingHospital },
    { link: "/settings/account", label: "Tài khoản", icon: IconUserCircle },
    { link: "/settings/password", label: "Mật khẩu", icon: IconLock },
    ...(slug
      ? [
          {
            link: `/teams/${slug}/settings`,
            label: "Thiết lập",
            icon: IconSettings
          }
        ]
      : []),
    { link: "/category", label: "Đơn vị hành chính", icon: IconCategory2 },
    { link: "/medicine", label: "Thuốc tân dược", icon: IconPill },
    { link: "/disease", label: "Các loại bệnh", icon: IconVirus },
    { link: "/bloodCode", label: "Mã máu", icon: IconDroplet }
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 250, breakpoint: "sm", collapsed: { mobile: !mobileOpened, desktop: !desktopOpened } }}
      padding="md">
      <AppHeader opened={mobileOpened} toggle={toggleMobile} items={navLinks} activePath={activePath} />
      <Sidebar opened={desktopOpened} toggle={toggleDesktop} items={navLinks} activePath={activePath} />
      <AppShell.Main style={{ position: "relative", backgroundColor: "#F8F8F8" }}>
        {!desktopOpened && (
          <Tooltip label="Hiện menu">
            <ActionIcon
              variant="transparent"
              color="gray"
              visibleFrom="sm"
              onClick={toggleDesktop}
              style={{ position: "fixed", bottom: 4, left: 4, zIndex: 1 }}>
              <IconCircleArrowRight style={{ width: "90%", height: "90%" }} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        )}
        <AuthPermissionCheck>{children}</AuthPermissionCheck>
      </AppShell.Main>
      {/* <AppShell.Footer>
        <Container>
          <Text c="dimmed" size="sm">
            © 2020 An Phat Smart Medical. All rights reserved.
          </Text>
        </Container>
      </AppShell.Footer> */}
    </AppShell>
  );
};

export default AppLayout;
