"use client";

import FormActions from "@/components/form/FormActions";
import useNotify, { Action } from "@/hooks/useNotify";
import { defaultHeaders } from "@/lib/common";
import { HOSPITAL, required } from "@/lib/messages";
import { Alert, Stack, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { IconInfoCircle } from "@tabler/icons-react";
import useTeams from "hooks/useTeams";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";

interface Props {
  onClose?: () => void;
}

const CreateTeam: FC<Props> = ({ onClose }) => {
  const { mutateTeams } = useTeams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { notifyResult } = useNotify();

  const form = useForm({
    initialValues: {
      name: ""
    },
    validateInputOnBlur: true,
    validate: {
      name: isNotEmpty(required("tên"))
    }
  });

  async function handleSubmit(values) {
    setIsSubmitting(true);

    const response = await fetch("/api/teams/", {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify(values)
    });

    const json = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      notifyResult(Action.Create, HOSPITAL, false, json.message);
      return;
    }

    form.reset();
    mutateTeams();
    if (onClose) onClose();
    notifyResult(Action.Create, HOSPITAL, true);
    router.push(`/teams/${json.data.slug}/settings`);
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} method="POST">
      <Stack>
        <Alert variant="light" color="blue" title="Chú ý" icon={<IconInfoCircle />}>
          Thành viên của tổ chức có quyền truy cập vào các khu vực cụ thể, chẳng hạn như bản phát hành mới hoặc tính
          năng ứng dụng mới.
        </Alert>
        <TextInput label="Tên bệnh viện" {...form.getInputProps("name")} />

        <FormActions
          isNew
          isSubmitting={isSubmitting}
          canSubmit={form.isDirty() && form.isValid()}
          onClose={() => (onClose ? onClose() : modals.closeAll())}
        />
      </Stack>
    </form>
  );
};

export default CreateTeam;
