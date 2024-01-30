import useNotify from "@/hooks/useNotify";
import { copyToClipboard } from "@/lib/common";
import { ActionIcon, Tooltip } from "@mantine/core";
import { IconCopy } from "@tabler/icons-react";
import { FC } from "react";

interface Props {
  value: string;
}

const CopyToClipboardButton: FC<Props> = ({ value }) => {
  const { notify } = useNotify();

  const handleCopy = () => {
    copyToClipboard(value);
    notify("Đã sao chép vào khay nhớ tạm");
  };

  return (
    <Tooltip label="Sao chép">
      <ActionIcon onClick={handleCopy} variant="light">
        <IconCopy className="w-5 h-5 text-secondary" />
      </ActionIcon>
    </Tooltip>
  );
};

export default CopyToClipboardButton;
