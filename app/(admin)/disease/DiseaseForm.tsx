"use client";

import FormActions from "@/components/form/FormActions";
import { required } from "@/lib/messages";
import { Grid, Group, Stack, TextInput, Textarea } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { Disease } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FC } from "react";

interface Props {
  onSubmit: (values: any) => void;
  data?: Disease;
  isSubmitting?: boolean;
}

const DiseaseForm: FC<Props> = ({ onSubmit, data, isSubmitting }) => {
  const router = useRouter();

  const form = useForm({
    initialValues: {
      id: data?.id || "",
      chapternumber: data?.chapternumber || "",
      chaptercode: data?.chaptercode || "",
      chaptername1: data?.chaptername1 || "",
      chaptername2: data?.chaptername2 || "",
      maingroupcode: data?.maingroupcode || "",
      maingroupname1: data?.maingroupname1 || "",
      maingroupname2: data?.maingroupname2 || "",
      subgroupcode1: data?.subgroupcode1 || "",
      subgroupname1: data?.subgroupname1 || "",
      subgroupname11: data?.subgroupname11 || "",
      subgroupcode2: data?.subgroupcode2 || "",
      subgroupname2: data?.subgroupname2 || "",
      subgroupname22: data?.subgroupname22 || "",
      typecode: data?.typecode || "",
      typename1: data?.typename1 || "",
      typename2: data?.typename2 || "",
      diseasecode: data?.diseasecode || "",
      name1: data?.name1,
      name2: data?.name2,
      teamcode: data?.teamcode || "",
      detailcode: data?.detailcode || "",
      description1: data?.description1 || "",
      description2: data?.description2 || ""
    },
    validateInputOnBlur: true,
    validate: {
      name1: isNotEmpty(required("tên bệnh")),
      name2: isNotEmpty(required("tên bệnh"))
    }
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <Grid>
          <Grid.Col span={6}>
            <TextInput label="STT chương" {...form.getInputProps("chapternumber")} />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput label="Mã chương" {...form.getInputProps("chaptercode")} />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput label="CHAPTER NAME" {...form.getInputProps("chaptername1")} />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput label="Tên chương" {...form.getInputProps("chaptername2")} />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput label="Mã nhóm chính" {...form.getInputProps("maingroupcode")} />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput label="MAIN GROUP NAME I" {...form.getInputProps("maingroupname1")} />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput label="Tên nhóm chính" {...form.getInputProps("maingroupname2")} />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput label="Mã nhóm phụ I" {...form.getInputProps("subgroupcode1")} />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput label="SUB GROUP NAME I" {...form.getInputProps("subgroupname1")} />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput label="Tên nhóm phụ I" {...form.getInputProps("subgroupname11")} />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput label="Mã nhóm phụ II" {...form.getInputProps("subgroupcode1")} />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput label="SUB GROUP NAME II" {...form.getInputProps("subgroupname1")} />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput label="Tên nhóm phụ II" {...form.getInputProps("subgroupname11")} />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput label="Mã loại" {...form.getInputProps("typecode")} />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput label="TYPE NAME" {...form.getInputProps("typename1")} />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput label="Tên loại" {...form.getInputProps("typename2")} />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput label="Mã bệnh" {...form.getInputProps("diseasecode")} />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput withAsterisk label="DISEASE NAME" {...form.getInputProps("name1")} />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput withAsterisk label="Tên bệnh" {...form.getInputProps("name2")} />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput withAsterisk label="Mã nhóm b/c bộ y tế" {...form.getInputProps("teamcode")} />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput withAsterisk label="Mã nhóm cần chi tiết hơn" {...form.getInputProps("detailcode")} />
          </Grid.Col>
        </Grid>
        <Stack gap={"xs"}>
          <Textarea label="Ghi chú I" autosize minRows={4} maxRows={8} {...form.getInputProps("description1")} />
          <Textarea label="Ghi chú II" autosize minRows={4} maxRows={8} {...form.getInputProps("description2")} />
        </Stack>
        <FormActions
          centered
          isNew={!data || !data.id}
          isSubmitting={isSubmitting}
          canSubmit={form.isDirty() && form.isValid()}
          onClose={() => router.back()}
        />
      </Stack>
    </form>
  );
};

export default DiseaseForm;
