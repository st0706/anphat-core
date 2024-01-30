"use client";

import FormActions from "@/components/form/FormActions";
import { Select, SimpleGrid, Stack, TextInput, Textarea } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { Patient } from "@prisma/client";
import { FC } from "react";

export const genderOptions = [
  { value: "MALE", label: "Nam" },
  { value: "FEMALE", label: "Nữ" },
  { value: "OTHER", label: "Khác" }
];

interface Props {
  data?: Patient;
  isSubmitting: boolean;
  onSubmit: (values) => void;
  onClose?: () => void;
}

const PatientsForm: FC<Props> = ({ data, isSubmitting, onSubmit, onClose }) => {
  const form = useForm({
    initialValues: { ...data, doB: new Date(Number(data?.doB || "0")), isChecked: false } || {
      patientId: "",
      patientName: "",
      description: "",
      gender: "MALE",
      doB: new Date("01/01/1970"),
      Phone: "",
      Email: "",
      address: ""
    },
    validate: {
      patientId: isNotEmpty("Không được để trống mã bệnh nhân !"),
      patientName: isNotEmpty("Không được để trống tên bệnh nhân !"),
      gender: isNotEmpty("Không được để trống giới tính !"),
      doB: isNotEmpty("Không được để trống ngày sinh !"),
      Phone: (value) => {
        const isValid =
          value && value.length >= 10 && value.length <= 12 && /(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(value);
        if (!isValid) {
          return "Số điện thoại không hợp lệ!";
        }
        return undefined;
      }
    },
    validateInputOnChange: true
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <TextInput
          fw={500}
          size="sm"
          withAsterisk
          label="Mã bệnh nhân"
          placeholder="Nhập mã bệnh nhân"
          {...form.getInputProps("patientId")}
        />
        <TextInput
          fw={500}
          size="sm"
          withAsterisk
          label="Tên bệnh nhân"
          placeholder="Nhập tên bệnh nhân"
          {...form.getInputProps("patientName")}
        />
        <TextInput
          fw={500}
          size="sm"
          withAsterisk={form.values.isChecked}
          type="email"
          label="Email"
          placeholder="Nhập email của bệnh nhân"
          {...form.getInputProps("Email")}
        />

        <TextInput
          fw={500}
          size="sm"
          type="number"
          withAsterisk
          label="Số điện thoại"
          placeholder="Nhập số điện thoại của bệnh nhân"
          {...form.getInputProps("Phone")}
        />
        <Textarea
          size="sm"
          fw={500}
          minRows={1}
          autosize
          label="Địa chỉ"
          placeholder="Nhập địa chỉ của bệnh nhân"
          {...form.getInputProps("address")}
        />
        <Textarea
          fw={500}
          autosize
          minRows={3}
          size="sm"
          label="Mô tả"
          placeholder="Nhập mô tả"
          {...form.getInputProps("description")}
        />
        <SimpleGrid cols={2}>
          <Select
            fw={500}
            label="Giới tính"
            defaultValue={"Nam"}
            data={genderOptions}
            {...form.getInputProps("gender")}
          />
          <DatePickerInput
            valueFormat="DD/MM/YYYY"
            fw={500}
            label="Ngày sinh"
            placeholder="Nhập ngày sinh"
            {...form.getInputProps("doB")}
          />
        </SimpleGrid>
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

export default PatientsForm;
