"use client";

import { Alert } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconExclamationCircle } from "@tabler/icons-react";

export enum DeleteAction {
  Delete = "Xóa",
  DeleteAll = "Xoá tất cả",
  Revoke = "Thu hồi",
  Leave = "Rời khỏi"
}

const useModal = () => {
  const confirmDelete = (
    object: string,
    onConfirm: () => void,
    name?: string | null,
    action: DeleteAction = DeleteAction.Delete,
    extraMessage?: string,
    onCancel?: () => void
  ) => {
    const actionLC = action.toLowerCase();
    modals.openConfirmModal({
      title: `Xác nhận ${actionLC} ${object}`,
      centered: true,
      children: (
        <Alert
          variant="light"
          color="red"
          title="Dữ liệu sẽ bị mất và không thể khôi phục!"
          icon={<IconExclamationCircle />}>
          Bạn có chắc chắn muốn {actionLC} {object}
          {name && (
            <>
              {" "}
              <b>{name}</b>
            </>
          )}{" "}
          không?
          {extraMessage && (
            <>
              <br />
              {extraMessage}
            </>
          )}
        </Alert>
      ),
      labels: { confirm: `${action} ${object}`, cancel: "Hủy bỏ" },
      confirmProps: { color: "red" },
      onConfirm,
      onCancel
    });
  };

  return {
    confirmDelete
  };
};

export default useModal;
