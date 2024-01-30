"use client";

import { useState } from "react";
import classes from "./HeaderLinks.module.css";

const links = [
  { link: "#feature", label: "Tính năng" },
  { link: "#pricing", label: "Bảng giá" },
  { link: "#support", label: "Hỗ trợ" },
  { link: "#contact", label: "Liên hệ" }
];

const HeaderLinks = () => {
  const [active, setActive] = useState(links[0].link);
  return (
    <>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.link}
          className={classes.link}
          data-active={active === link.link || undefined}
          onClick={(event) => {
            event.preventDefault();
            setActive(link.link);
          }}>
          {link.label}
        </a>
      ))}
    </>
  );
};

export default HeaderLinks;
