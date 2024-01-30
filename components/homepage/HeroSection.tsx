import { Button, Container, Overlay, Text, Title } from "@mantine/core";
import clsx from "clsx";
import classes from "./HeroSection.module.css";

const HeroSection = () => {
  return (
    <section className={classes.wrapper}>
      <Overlay color="#000" opacity={0.65} zIndex={1} />

      <div className={classes.inner}>
        <Title className={classes.title}>AnPhat Core</Title>

        <Container size={640}>
          <Text size="lg" className={classes.description}>
            Giải pháp quản lý bệnh viện một cách toàn diện và thông minh <br />
            ứng dụng trí tuệ nhân tạo và điện toán đám mây.
          </Text>
        </Container>

        <div className={classes.controls}>
          <Button component="a" href="/auth/join" className={classes.control} variant="white" size="lg">
            Dùng thử
          </Button>
          <Button component="a" href="/" className={clsx(classes.control, classes.secondaryControl)} size="lg">
            Mua ngay
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
