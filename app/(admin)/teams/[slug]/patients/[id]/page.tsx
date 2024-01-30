"use client";
import { Button, Group, Stack } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import PatientDetail from "./patientDetail";

const PatientDetailPage = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  return (
    <Stack>
      <Group gap="xs">
        <Button variant="default" onClick={() => router.back()} leftSection={<IconArrowLeft size={14} />}>
          Quay lại
        </Button>
      </Group>
      <Stack>
        <PatientDetail id={params.id} />
      </Stack>
    </Stack>
  );
};

export default PatientDetailPage;
