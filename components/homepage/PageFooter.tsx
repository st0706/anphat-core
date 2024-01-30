import app from "@/lib/app";
import { ActionIcon, Container, Group, Image, Text } from "@mantine/core";
import { IconBrandInstagram, IconBrandTwitter, IconBrandYoutube } from "@tabler/icons-react";
import classes from "./PageFooter.module.css";

const data = [
  {
    title: "Giới thiệu",
    links: [
      { label: "Tính năng", link: "#feature" },
      { label: "Bảng giá", link: "#" },
      { label: "Hỗ trợ", link: "#" },
      { label: "Liên hệ", link: "#" }
    ]
  },
  {
    title: "Sản phẩm",
    links: [
      { label: "PACS", link: "#" },
      { label: "RIS", link: "#" },
      { label: "Quản lý thiết bị", link: "#" },
      { label: "Quản lý nhân sự", link: "#" }
    ]
  },
  {
    title: "Cộng đồng",
    links: [
      { label: "Join Discord", link: "#" },
      { label: "Follow on Twitter", link: "#" },
      { label: "Email newsletter", link: "#" },
      { label: "GitHub discussions", link: "#" }
    ]
  }
];

export function PageFooter() {
  const groups = data.map((group) => {
    const links = group.links.map((link, index) => (
      <Text<"a"> key={index} className={classes.link} component="a" href={link.link}>
        {link.label}
      </Text>
    ));

    return (
      <div className={classes.wrapper} key={group.title}>
        <Text className={classes.title}>{group.title}</Text>
        {links}
      </div>
    );
  });

  return (
    <footer className={classes.footer}>
      <Container className={classes.inner}>
        <div className={classes.logo}>
          <Image src={app.logoUrl} alt={app.name} width={120} height={41} />
          <Text size="xs" c="dimmed" className={classes.description}>
            Quản lý bệnh viện thông minh với sức mạnh của trí tuệ nhân tạo và điện toán đám mây
          </Text>
        </div>
        <div className={classes.groups}>{groups}</div>
      </Container>
      <Container className={classes.afterFooter}>
        <Text c="dimmed" size="sm"></Text>

        <Group gap={0} className={classes.social} justify="flex-end" wrap="nowrap">
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandTwitter style={{ width: 24, height: 24 }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandYoutube style={{ width: 24, height: 24 }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandInstagram style={{ width: 24, height: 24 }} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Container>
    </footer>
  );
}
