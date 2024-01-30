import { Avatar, MantineColor, MantineSize } from "@mantine/core";
import { FC } from "react";

interface Props {
  name?: string;
  color?: MantineColor;
  size?: MantineSize | string | number;
  url?: string | undefined | null;
}

const LetterAvatar: FC<Props> = ({ name, color, size, url }) => {
  return (
    <Avatar src={url} color={color || "cyan"} size={size} style={{ borderRadius: "50%" }}>
      {name && name.length > 0 && name.charAt(0).toUpperCase()}
    </Avatar>
  );
};

export default LetterAvatar;
