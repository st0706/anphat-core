import { Container, SimpleGrid, Text, ThemeIcon, Title } from "@mantine/core";
import { IconCookie, IconGauge, IconLock, IconMessage2, IconUser } from "@tabler/icons-react";
import classes from "./FeatureSection.module.css";

export const MOCKDATA = [
  {
    icon: IconGauge,
    title: "PACS Storage",
    description:
      "Hệ thống lưu trữ PACS với khả năng xử lý dữ liệu lớn và hiệu suất cao, dễ dàng tích hợp với các hệ thống khác"
  },
  {
    icon: IconUser,
    title: "PACS Workstation",
    description: "Trạm làm việc dành cho bác sĩ chuyên khoa, hỗ trợ chuẩn đoán bệnh với trí tuệ nhân tạo"
  },
  {
    icon: IconUser,
    title: "Quản lý nhân sự",
    description: "Giải pháp quản lý nhân sự chuyên biệt và tối ưu cho bệnh viện"
  },
  {
    icon: IconCookie,
    title: "Quản lý thiết bị",
    description: "Quản lý thiết bị bệnh viện chuyên nghiệp và hiệu quả"
  },
  {
    icon: IconLock,
    title: "Bảo mật",
    description: "Bảo mật là ưu tiên hàng đầu của An Phát nhằm bảo vệ dữ liệu và thông tin của khách hàng"
  },
  {
    icon: IconMessage2,
    title: "Hỗ trợ 24/7",
    description: "Đội ngũ triển khai, hỗ trợ chuyên nghiệp, hoạt động 24/7"
  }
];

interface FeatureProps {
  icon: React.FC<any>;
  title: React.ReactNode;
  description: React.ReactNode;
}

export function Feature({ icon: Icon, title, description }: FeatureProps) {
  return (
    <div>
      <ThemeIcon variant="light" size={40} radius={40}>
        <Icon style={{ width: 24, height: 24 }} stroke={1.5} />
      </ThemeIcon>
      <Text mt="sm" mb={7}>
        {title}
      </Text>
      <Text size="sm" c="dimmed" lh={1.6}>
        {description}
      </Text>
    </div>
  );
}

export function FeatureSection() {
  const features = MOCKDATA.map((feature, index) => <Feature {...feature} key={index} />);

  return (
    <Container className={classes.wrapper}>
      <Title className={classes.title}>Tính năng nổi bật</Title>

      <Container size={560} p={0}>
        <Text size="sm" className={classes.description}>
          AnPhat Core được phát triển dựa trên các công nghệ tiên tiến nhất <br />
          và sự thấu hiểu nghiệp vụ quản lý bệnh viện.
        </Text>
      </Container>

      <SimpleGrid
        mt={60}
        cols={{ base: 1, sm: 2, md: 3 }}
        spacing={{ base: "xl", md: 50 }}
        verticalSpacing={{ base: "xl", md: 50 }}>
        {features}
      </SimpleGrid>
    </Container>
  );
}

export default FeatureSection;
