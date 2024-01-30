import { useEffect, useState } from "react";

/**
 * Can be used to walk around React hydration error: https://nextjs.org/docs/messages/react-hydration-error
 * @example
 * const [isCSR] = useCSR();
 * if (!isCSR) {
 *   ClientSideOnlyRendering();
 * }
 */
export default function useCSR() {
  const [isCSR, setIsCSR] = useState(false);

  useEffect(() => {
    setIsCSR(true);
  }, []);

  return [isCSR];
}
