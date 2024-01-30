"use client";
import { api } from "@/server/api";
import { Anchor, Avatar, Box, Card, Flex, Grid, Group, Input, List, Stack, Table, Text, Title } from "@mantine/core";
import PatientState from "./PatientState";

interface PatientDetailProps {
  id: number;
}
const elements = [
  { service: "Carbon", scheduledAt: "03/01/2024", practitioner: "John", status: "scheduled" },
  { service: "Nitrogen", scheduledAt: "03/01/2024", practitioner: "Ken", status: "performed" },
  { service: "Yttrium", scheduledAt: "03/01/2024", practitioner: "Peter", status: "performed" },
  { service: "Barium", scheduledAt: "03/01/2024", practitioner: "Jack", status: "performed" },
  { service: "Cerium", scheduledAt: "03/01/2024", practitioner: "Mike", status: "delivered" }
];
const PatientDetail = ({ id }: PatientDetailProps) => {
  const { data: detailPatient } = api.patient.getById.useQuery(id.toString());
  const rows = elements.map((element) => (
    <Table.Tr key={element.service}>
      <Table.Td>{element.service}</Table.Td>
      <Table.Td>{element.scheduledAt}</Table.Td>
      <Table.Td>{element.status}</Table.Td>
      <Table.Td>{element.status}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Grid columns={12}>
      <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
        <Card withBorder shadow="sm" radius="md">
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={200}>Thông tin cá nhân</Text>
            </Group>
          </Card.Section>
          <Card.Section mt="md">
            <Flex mih={50} gap="md" justify="center" align="flex-start" direction="row" wrap="wrap">
              <Avatar size={"lg"} src={null} alt="no image here" />
            </Flex>
          </Card.Section>
          <Card.Section mt="mt" inheritPadding>
            <List>
              <Input.Wrapper label="Mã bệnh nhân">
                <Input
                  readOnly
                  size="md"
                  variant="unstyled"
                  value={`PTID-${detailPatient?.patientId}`}
                  placeholder="Input component"
                />
              </Input.Wrapper>
            </List>
            <List>
              <Input.Wrapper label="Tên bệnh nhân">
                <Input
                  readOnly
                  size="md"
                  variant="unstyled"
                  value={detailPatient?.patientName}
                  placeholder="Input component"
                />
              </Input.Wrapper>
            </List>
            <Stack align="flex-start" justify="flex-start" gap={"xs"}>
              <Text fz={14} fw={500}>
                Giới tính:
              </Text>
              <Text fz={14}>{detailPatient?.gender}</Text>
            </Stack>
            <Stack align="flex-start" justify="flex-start" gap={"xs"}>
              <Text fz={14} fw={500}>
                Số điện thoại:
              </Text>
              <Text fz={14}>{detailPatient?.Phone}</Text>
            </Stack>
            <Stack align="flex-start" justify="flex-start" gap={"xs"}>
              <Text fz={14} fw={500}>
                Email:
              </Text>
              <Text fz={14}>{detailPatient?.Email}</Text>
            </Stack>
            <Stack align="flex-start" justify="flex-start" gap={"xs"}>
              <Text fz={14} fw={500}>
                Địa chỉ:
              </Text>
              <Text fz={14}>{detailPatient?.address}</Text>
            </Stack>
            <Stack align="flex-start" justify="flex-start" gap={"xs"}>
              <Text fz={14} fw={500}>
                Mô tả:
              </Text>
              <Text fz={14}>{detailPatient?.description}</Text>
            </Stack>
          </Card.Section>
        </Card>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6, lg: 9 }}>
        <PatientState />
        <Box mt={15}>
          <Title fz={26} fw={400}>
            Danh sách lịch chụp
          </Title>
          <Table withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Dịch vụ</Table.Th>
                <Table.Th>Thời gian</Table.Th>
                <Table.Th>Kỹ thuật viên</Table.Th>
                <Table.Th>Trạng thái</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Box>
        <Box mt={15}>
          <Title fz={26} fw={400}>
            Danh sách ảnh
          </Title>
        </Box>
      </Grid.Col>
    </Grid>
  );
};

export default PatientDetail;
