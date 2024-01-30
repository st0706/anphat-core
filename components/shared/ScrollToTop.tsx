"use client";

import { Affix, Button, Transition, rem } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { IconArrowUp } from "@tabler/icons-react";
import { FC } from "react";

interface Props {
  message: string;
}

const ScrollToTop: FC<Props> = ({ message }) => {
  const [scroll, scrollTo] = useWindowScroll();

  return (
    <Affix position={{ bottom: 20, right: 20 }} zIndex={"1000"}>
      <Transition transition="slide-up" mounted={scroll.y > 0}>
        {(transitionStyles) => (
          <Button
            leftSection={<IconArrowUp style={{ width: rem(16), height: rem(16) }} />}
            style={transitionStyles}
            onClick={() => scrollTo({ y: 0 })}>
            {message}
          </Button>
        )}
      </Transition>
    </Affix>
  );
};

export default ScrollToTop;
