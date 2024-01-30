"use client";

import FormActions from "@/components/form/FormActions";
import { required } from "@/lib/messages";
import { Flex, Stack, TextInput, Textarea } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { BloodCode } from "@prisma/client";
import { FC } from "react";

interface Props {
  data?: BloodCode;
  isSubmitting: boolean;
  onSubmit: (values) => void;
  onClose?: () => void;
}

const BloodCodeForm: FC<Props> = ({ data, isSubmitting, onSubmit, onClose }) => {
  const form = useForm({
    initialValues: data || { note: "" },
    validateInputOnBlur: true,
    validate: {
      bloodCode: isNotEmpty(required("mã máu")),
      unitsPreparations: isNotEmpty(required("điều chế và chế phẩm")),
      actualVolume: isNotEmpty(required("thể tích thực"))
    }
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <Flex gap="md" direction={{ base: "column", sm: "row" }}>
          <TextInput w="100%" withAsterisk label="Mã máu" {...form.getInputProps("bloodCode")} />
          <TextInput w="100%" withAsterisk label="Thể tích thực" {...form.getInputProps("actualVolume")} />
        </Flex>
        <TextInput withAsterisk label="Điều chế và chế phẩm" {...form.getInputProps("unitsPreparations")} />
        <Textarea label="Ghi chú" autosize minRows={4} maxRows={8} {...form.getInputProps("note")} />

        <FormActions
          isNew={!data || !data.id}
          isSubmitting={isSubmitting}
          canSubmit={form.isDirty() && form.isValid()}
          onClose={() => (onClose ? onClose() : modals.closeAll())}
        />
      </Stack>
    </form>
  );
};

export default BloodCodeForm;
