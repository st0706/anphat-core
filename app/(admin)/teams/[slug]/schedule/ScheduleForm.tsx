"use client";
import { api } from "@/server/api";
import { MultiSelect, Select, SimpleGrid, Stack, TextInput } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { FC, useState } from "react";
import { isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import FormActions from "./FormAction";
import useNotify, { Action } from "@/hooks/useNotify";
import useModal from "@/hooks/useModal";
import { SCHEDULE } from "@/lib/messages";

interface Props {
  data?: any;
  isSubmiting?: boolean;
  onSubmit: (values) => void;
  onClose?: () => void;
  onDelete?: () => void;
}

export const scheduleStatusOptine = [
  { value: "SCHEDULED", label: "Đã lên lịch" },
  { value: "CANCELED", label: "Đã hủy" },
  { value: "PERFORMED", label: "Đã thực hiện" }
];

const ScheduleForm: FC<Props> = ({ data, isSubmiting, onSubmit, onClose, onDelete }) => {
  const trpcContext = api.useUtils();
  const { notifyResult } = useNotify();
  const { confirmDelete } = useModal();
  const { data: dataPatient, isLoading: isLoadingPatient, isError: isErrorPatient } = api.patient.getAll.useQuery();

  const {
    data: dataPractitioner,
    isLoading: isLoadingPractitioner,
    isError: isErrorPractitioner
  } = api.schedule.getAllPractitioner.useQuery();

  const form = useForm({
    initialValues: data
      ? {
          ...data,
          atTime: new Date(Number(data?.atTime || "0")),
          scheduleDateTime: new Date(Number(data?.scheduleDateTime || "0")),
          practitioners: data.practitioners?.map((item) => item)[0].practitionerId || "",
          patientId: data.patientId.toString()
        }
      : {
          id: "",
          scheduleDateTime: undefined,
          atTime: undefined,
          status: "SCHEDULED",
          patientId: "",
          description: "",
          createdBy: "",
          observationId: "",
          modalitys: [],
          practitioners: ""
        },
    validate: {
      practitioners: isNotEmpty("Không được để trống bác sĩ!"),
      patientId: isNotEmpty("Không được để trống bệnh nhân"),
      status: isNotEmpty("Không được để trống tình trạng"),
      atTime: isNotEmpty("Không được để trống thời gian bắt đầu"),
      scheduleDateTime: isNotEmpty("Không được để trống thời gian kết thúc"),
      validateInputOnChange: true
    }
  });

  const handleDelete = (id: string) => confirmDelete(SCHEDULE, () => deleteSchedule({ id: id }), id);

  const { mutateAsync: deleteSchedule, isLoading: isDeleting } = api.schedule.delete.useMutation({
    onSuccess: async () => {
      await trpcContext.invalidate();
      modals.close("update-schedule");
      notifyResult(Action.Delete, SCHEDULE, true);
    },
    onError: (e) => {
      notifyResult(Action.Delete, SCHEDULE, false, e.message);
    }
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Select
        withAsterisk
        searchable
        data={dataPractitioner?.map((practitioner) => {
          return { value: practitioner.id, label: practitioner.name };
        })}
        fw={500}
        size="sm"
        label="Bác sĩ"
        placeholder="Chọn bác sĩ"
        {...form.getInputProps("practitioners")}
      />
      <Stack>
        <SimpleGrid cols={2}>
          <Select
            withAsterisk
            fw={500}
            label="Tình trạng"
            defaultValue={"Đã đăng ký"}
            placeholder="Chọn tình trạng"
            data={scheduleStatusOptine}
            {...form.getInputProps("status")}
          />
          <Select
            withAsterisk
            searchable
            data={dataPatient?.map((patient) => {
              return { value: patient.id.toString(), label: patient.patientName };
            })}
            fw={500}
            size="sm"
            label="Bệnh nhân"
            placeholder="Chọn bệnh nhân"
            {...form.getInputProps("patientId")}
          />
        </SimpleGrid>

        <SimpleGrid cols={2}>
          <DateTimePicker
            required
            clearable
            defaultValue={new Date()}
            label="Thời gian tạo"
            placeholder="Chọn thời gian tạo"
            {...form.getInputProps("atTime")}
          />

          <DateTimePicker
            required
            clearable
            defaultValue={new Date()}
            label="Thời gian dự kiến"
            placeholder="Chọn thời gian dự kiến"
            {...form.getInputProps("scheduleDateTime")}
          />
        </SimpleGrid>

        <TextInput
          fw={500}
          size="sm"
          label="Ghi chú"
          placeholder="Nhập ghi chú"
          {...form.getInputProps("description")}
        />
        <FormActions
          isNew={!data || !data.id}
          isSubmitting={isSubmiting}
          canSubmit={form.isDirty() && form.isValid()}
          onClose={() => (onClose ? onClose() : modals.closeAll())}
          onDelete={data ? () => handleDelete(data.id) : undefined}
        />
      </Stack>
    </form>
  );
};
export default ScheduleForm;
