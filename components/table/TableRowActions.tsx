import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { IconEdit, IconEye, IconTrashXFilled } from "@tabler/icons-react";
import { FC } from "react";

interface Props {
  onView?: () => void;
  onUpdate?: () => void;
  onDelete?: () => void;
}

const TableRowActions: FC<Props> = ({ onView, onUpdate, onDelete }) => {
  return (
    <Group gap={4}>
      {onView && (
        <Tooltip label="Xem chi tiết">
          <ActionIcon variant="transparent" color="gray" onClick={onView}>
            <IconEye size={20} />
          </ActionIcon>
        </Tooltip>
      )}
      {onUpdate && (
        <Tooltip label="Chỉnh sửa">
          <ActionIcon variant="transparent" color="gray" onClick={onUpdate}>
            <IconEdit size={20} />
          </ActionIcon>
        </Tooltip>
      )}
      {onDelete && (
        <Tooltip label="Xoá">
          <ActionIcon variant="transparent" color="gray" onClick={onDelete}>
            <IconTrashXFilled size={20} />
          </ActionIcon>
        </Tooltip>
      )}
    </Group>
  );
};

export default TableRowActions;
