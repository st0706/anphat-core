"use client";

import {
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Stack,
  Switch,
  Text,
  Title,
  useMantineColorScheme,
  useMantineTheme
} from "@mantine/core";
import { Fragment, useState } from "react";
import classes from "./PricingSection.module.css";
import plans from "./data/pricing.json";

const PricingSection = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const [monthly, setMonthly] = useState(true);

  const handleChange = () => {
    setMonthly(!monthly);
  };

  const dividerStyle = {
    width: "100%",
    borderColor: colorScheme === "dark" ? "gray" : undefined,
    opacity: colorScheme === "dark" ? 0.7 : undefined
  };

  return (
    <section className={classes.wrapper}>
      <Stack gap={40}>
        {/** header section */}
        <Flex direction="column" gap={10} align="center" justify="start">
          <Title order={2} ta="left" className={classes.title}>
            Bảng giá
          </Title>
          <Box
            style={{
              fontWeight: 700,
              color: colorScheme === "dark" ? theme.colors.dark[1] : "hsl(234, 14%, 74%)",
              display: "flex",
              alignItems: "center",
              gap: 19
            }}>
            <Text fz={"sm"}>Hàng năm</Text>
            <Switch checked={monthly} onChange={handleChange} width={45} height={25} />
            <Text fz={"sm"}>Hàng tháng</Text>
          </Box>
        </Flex>
        {/** cards section */}
        <Group justify="center">
          <Flex
            align={"center"}
            direction={{ base: "column", sm: "row" }}
            color={"hsl(232, 13%, 33%)"}
            gap={{ base: "1.5rem", sm: 0 }}>
            {plans.map((plan, index) => (
              <Box
                key={index}
                variant="gradient"
                style={{
                  boxShadow: "0px 30px 50px -7px rgba(0,0,0,0.1)",
                  height: plan.featured ? "25rem" : "22rem",
                  width: plan.featured ? "19rem" : "17rem",
                  paddingInline: "1.5rem",
                  background: plan.featured
                    ? "linear-gradient(to bottom right, var(--mantine-primary-color-filled), var(--mantine-color-cyan-filled))"
                    : colorScheme === "dark"
                      ? theme.colors.dark[5]
                      : "white",
                  borderRadius: plan.featured ? "0.7rem" : index === 0 ? "0.7rem 0 0 0.7rem" : "0 0.7rem 0.7rem 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  "@media (maxWidth: 755px)": {
                    width: "19rem",
                    borderRadius: "0.7rem"
                  },
                  "@media (minWidth: 756px) and (maxWidth: 820px)": {
                    width: "15rem"
                  }
                }}>
                <Stack w="100%" align={"center"} gap={20}>
                  <Text
                    style={{
                      fontWeight: 700,
                      color: plan.featured
                        ? "white"
                        : colorScheme === "dark"
                          ? theme.colors.dark[1]
                          : "hsl(233, 13%, 49%)"
                    }}
                    fz={"md"}>
                    {plan.name}
                  </Text>
                  <Title
                    order={2}
                    style={{
                      color: plan.featured ? "white" : colorScheme === "dark" ? "white" : "hsl(232, 13%, 33%)",
                      fontSize: 40,
                      display: "flex",
                      alignItems: "center",
                      gap: 5
                    }}>
                    {monthly ? plan.monthly : plan.annually}
                  </Title>
                  <Stack
                    w="100%"
                    align="center"
                    gap={10}
                    style={{
                      color: plan.featured ? "white" : colorScheme === "light" ? "hsl(233, 13%, 49%)" : undefined
                    }}>
                    <Divider style={dividerStyle} />
                    {plan.benefits.map((benefit: string, itemIndex: number) => (
                      <Fragment key={`plan-${index}-benefit-${itemIndex}`}>
                        <Text fz={"sm"} fw={600}>
                          {benefit}
                        </Text>
                        <Divider style={dividerStyle} />
                      </Fragment>
                    ))}
                  </Stack>
                  <Button
                    variant="gradient"
                    gradient={
                      plan.featured ? { from: "yellow", to: "orange", deg: 90 } : { from: "blue", to: "cyan", deg: 90 }
                    }
                    w="100%">
                    MUA NGAY
                  </Button>
                </Stack>
              </Box>
            ))}
          </Flex>
        </Group>
      </Stack>
    </section>
  );
};

export default PricingSection;
