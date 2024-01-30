"use client";

import { rem } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAlertTriangle, IconCheck, IconExclamationCircle, IconInfoCircle } from "@tabler/icons-react";
import { ReactNode } from "react";

export enum Action {
  Create = "Thêm mới",
  Update = "Cập nhật",
  Delete = "Xóa",
  DeleteAll = "Xoá tất cả",
  Import = "Nhập dữ liệu",
  Submit = "Gửi",
  Upload = "Tải lên"
}

export enum Variant {
  Error = "red",
  Warning = "orange",
  Info = "blue",
  Success = "green"
}

const useNotify = () => {
  const notify = (message: string, variant: Variant = Variant.Success, title?: string, icon?: ReactNode) => {
    if (!icon) {
      switch (variant) {
        case Variant.Success:
          icon = <IconCheck style={{ width: rem(18), height: rem(18) }} />;
          break;
        case Variant.Error:
          icon = <IconExclamationCircle style={{ width: rem(18), height: rem(18) }} />;
          break;
        case Variant.Warning:
          icon = <IconAlertTriangle style={{ width: rem(18), height: rem(18) }} />;
          break;
        case Variant.Info:
          icon = <IconInfoCircle style={{ width: rem(18), height: rem(18) }} />;
          break;
      }
    }

    notifications.show({
      color: variant,
      icon,
      title,
      message,
      withBorder: true
    });
  };

  const notifyResult = (action: Action, object: string, isSuccess: boolean, extraMessage?: string) => {
    const message = isSuccess
      ? `Đã ${action.toLowerCase()} ${object} thành công.`
      : `Có lỗi xảy ra khi ${action.toLowerCase()} ${object}.`;

    notifications.show({
      color: isSuccess ? "green" : "red",
      icon: isSuccess ? (
        <IconCheck style={{ width: rem(18), height: rem(18) }} />
      ) : (
        <IconExclamationCircle style={{ width: rem(18), height: rem(18) }} />
      ),
      title: `${action} ${object}`,
      message: extraMessage ? (
        <>
          {message}
          <br />
          {extraMessage}
        </>
      ) : (
        message
      ),
      withBorder: true,
      autoClose: isSuccess ? 6000 : 12000
    });
  };

  return {
    notify,
    notifyResult
  };
};

export default useNotify;
