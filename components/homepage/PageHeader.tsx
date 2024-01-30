import app from "@/lib/app";
import { getServerAuthSession } from "@/server/auth";
import env from "@/lib/env";
import { getUserBySession } from "@/models/user";
import { Button, Container, Group, Image } from "@mantine/core";
import Link from "next/link";
import { ThemeToggle } from "../shared/ThemeToggle";
import UserMenu from "../shared/UserMenu";
import HeaderLinks from "./HeaderLinks";
import HeaderMenu from "./HeaderMenu";
import classes from "./PageHeader.module.css";

const PageHeader = async () => {
  const session = await getServerAuthSession();
  const user = await getUserBySession(session);

  return (
    <header className={classes.header}>
      <Container size="lg">
        <Group justify="space-between" h="100%">
          <Link href="/">
            <Image src={app.logoUrl} alt={app.name} width={168} height={48} w={168} h={48} />
          </Link>

          <Group gap={5} visibleFrom="xs">
            <HeaderLinks />
          </Group>

          <Group visibleFrom="sm">
            {env.darkModeEnabled && <ThemeToggle />}
            {user ? (
              <UserMenu user={user} />
            ) : (
              <>
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
              </>
            )}
          </Group>

          <HeaderMenu />
        </Group>
      </Container>
    </header>
  );
};

export default PageHeader;
