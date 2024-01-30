import React, { FC, useMemo } from "react";
import styles from "./Loading.module.css";

interface Props {
  className?: string;
  loading?: boolean;
  color?: string;
  size?: number;
}

const Loading: FC<Props> = ({ className, loading = true, color = "#df771b", size = 40 }) => {
  const style = useMemo(() => {
    return {
      width: size + "px",
      height: size + "px",
      borderBottom: "2px solid " + color,
      borderLeft: "2px solid " + color,
      borderRadius: "100%"
    } as React.CSSProperties;
  }, [color, loading]);

  return (
    <div className={className ?? styles.absolute_center}>
      <div className={loading ? styles.animate_spin : styles.hidden} style={style} />
    </div>
  );
};

export default Loading;
