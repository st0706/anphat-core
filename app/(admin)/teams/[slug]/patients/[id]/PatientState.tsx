import { Grid, Group, Paper, Text, Title } from "@mantine/core";
import React from "react";

const PatientState = () => {
  return (
    <Grid grow gutter="xs">
      <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
        <Paper withBorder px={"md"}>
          <Group>
            <Title order={3}>Ngày khám gần nhất:</Title>
            <Text fz={20} fw={500} variant="gradient">
              25/11/2023
            </Text>
          </Group>
        </Paper>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
        <Paper withBorder px={"md"}>
          <Group>
            <Title order={3}>Lịch khám:</Title>
            <Text fz={20} fw={500} variant="gradient" gradient={{ from: "blue", to: "cyan", deg: 90 }}>
              6
            </Text>
          </Group>
        </Paper>
      </Grid.Col>
    </Grid>
  );
};

export default PatientState;
