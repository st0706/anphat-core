import { required } from "@/lib/messages";
import { Button, Divider, Group, Modal, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import type { WebookFormSchema } from "types";
import EventTypes from "./EventTypes";

const Form = ({
  visible,
  setVisible,
  initialValues,
  handleSubmit,
  isSubmitting,
  title
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  initialValues: WebookFormSchema;
  handleSubmit: (values, form) => void;
  isSubmitting: boolean;
  title: string;
}) => {
  const form = useForm({
    initialValues,
    validateInputOnBlur: true,
    validate: {
      name: (val) => (val.length === 0 ? required("mô tả") : null),
      url: (val) => (val.length === 0 ? required("đường dẫn") : null),
      eventTypes: (val) => (val.length < 1 ? required("loại sự kiện", "chọn ít nhất một") : null)
    }
  });

  const toggleVisible = () => {
    setVisible(!visible);
    form.reset();
  };

  return (
    <Modal opened={visible} onClose={toggleVisible} title={title}>
      <form onSubmit={form.onSubmit((values) => handleSubmit(values, form))} method="POST">
        <div className="mt-2 flex flex-col space-y-4">
          <p>Tạo webhook để bắt sự kiện từ ứng dụng.</p>
          <div className="flex flex-col space-y-2">
            <TextInput
              name="name"
              label="Mô tả"
              placeholder="Mô tả mục đích sử dụng của endpoint này."
              {...form.getInputProps("name")}
            />
            <TextInput
              name="url"
              label="Đường dẫn"
              placeholder="https://api.example.com/svix-webhooks"
              description="Đường dẫn endpoint phải là HTTPS"
              {...form.getInputProps("url")}
            />
            <Divider my="md" />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Sự kiện cần gửi</span>
              </label>
              <p className="ml-1 mb-3 text-sm font-normal text-gray-500">
                Bạn có thể chọn sự kiện nào sẽ được gửi đến điểm cuối nào. Theo mặc định, tất cả tin nhắn sẽ được gửi
                đến tất cả điểm cuối.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <EventTypes values={initialValues["eventTypes"]} {...form.getInputProps("eventTypes")} />
              </div>
            </div>
          </div>
        </div>
        <Group justify="flex-end" mt="md">
          <Button type="submit" loading={isSubmitting} disabled={!form.isDirty}>
            Tạo webhook
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default Form;
