import { Button, Group } from "@mantine/core";
import { IconCircleCheck, IconX } from "@tabler/icons-react";
import { FC } from "react";

interface Props {
  isNew?: boolean;
  isSubmitting?: boolean;
  onClose?: () => void;
  centered?: boolean;
  canSubmit?: boolean;
}

const FormActions: FC<Props> = ({ isNew, isSubmitting, onClose, centered, canSubmit }) => {
  return (
    <Group justify={centered ? "center" : "flex-end"}>
      {onClose && (
        <Button variant="light" color="default" onClick={onClose} leftSection={<IconX size={16} />} fw="normal">
          Hủy bỏ
        </Button>
      )}
      <Button
        type="submit"
        color="teal"
        disabled={!canSubmit}
        loading={isSubmitting}
        leftSection={<IconCircleCheck size={18} />}>
        {isNew ? "Thêm mới" : "Cập nhật"}
      </Button>
    </Group>
  );
};

export default FormActions;
