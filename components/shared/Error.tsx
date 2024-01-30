import { Alert } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { FC, ReactNode } from "react";

interface Props {
  icon?: ReactNode;
  title?: string;
  message?: string;
}

const Error: FC<Props> = ({ message, title, icon }) => {
  return (
    <Alert variant="filled" color="red" title={title} icon={icon || <IconInfoCircle />} className="my-2">
      {message || "Lỗi không xác định"}
    </Alert>
  );
};

export default Error;
