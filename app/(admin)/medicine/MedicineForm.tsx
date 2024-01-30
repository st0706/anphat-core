"use client";

import FormActions from "@/components/form/FormActions";
import { required } from "@/lib/messages";
import { Grid, Stack, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { Medicine } from "@prisma/client";
import { useRouter } from "next/navigation";

interface IMedicineForm {
  onSubmit: (values: any) => void;
  data?: Medicine;
  isSubmitting: boolean;
}

const MedicineForm = (props: IMedicineForm) => {
  const router = useRouter();
  const { onSubmit, data, isSubmitting } = props;

  const form = useForm({
    initialValues: data || { content: "" },
    validateInputOnBlur: true,
    validate: {
      registrationNumber: isNotEmpty(required("số đăng ký")),
      name: isNotEmpty(required("tên thuốc")),
      ingredientCode: isNotEmpty(required("mã hoạt chất")),
      ingredient: isNotEmpty(required("tên hoạt chất")),
      ingredientRegistration: isNotEmpty(required("hoạt chất (theo số đăng ký)")),
      sugarCode: isNotEmpty(required("mã đường dùng")),
      sugar: isNotEmpty(required("đường dùng")),
      pack: isNotEmpty(required("đóng gói")),
      manufacture: isNotEmpty(required("hãng sản xuất")),
      country: isNotEmpty(required("nước sản xuất"))
    }
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <TextInput style={{ display: "none" }} {...form.getInputProps("id")} />
        <Grid>
          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <TextInput withAsterisk label="Số đăng ký" {...form.getInputProps("registrationNumber")} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 9 }}>
            <TextInput withAsterisk label="Tên thuốc" {...form.getInputProps("name")} />
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col span={{ base: 12, md: 3, lg: 3 }}>
            <TextInput withAsterisk label="Mã hoạt chất" {...form.getInputProps("ingredientCode")} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4.5, lg: 4.5 }}>
            <TextInput withAsterisk label="Hoạt chất" {...form.getInputProps("ingredient")} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4.5, lg: 4.5 }}>
            <TextInput
              withAsterisk
              label="Hoạt chất (theo số đăng ký)"
              {...form.getInputProps("ingredientRegistration")}
            />
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col span={{ base: 12, md: 3, lg: 3 }}>
            <TextInput withAsterisk label="Mã đường dùng" {...form.getInputProps("sugarCode")} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 9, lg: 9 }}>
            <TextInput withAsterisk label="Đường dùng" {...form.getInputProps("sugar")} />
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col span={{ base: 12, md: 3, lg: 3 }}>
            <TextInput label="Hàm lượng" {...form.getInputProps("content")} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 9, lg: 9 }}>
            <TextInput withAsterisk label="Đóng gói" {...form.getInputProps("pack")} />
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col span={{ base: 12, md: 3, lg: 3 }}>
            <TextInput withAsterisk label="Nước sản xuất" {...form.getInputProps("country")} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 9, lg: 9 }}>
            <TextInput withAsterisk label="Hãng sản xuất" {...form.getInputProps("manufacture")} />
          </Grid.Col>
        </Grid>
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

export default MedicineForm;
