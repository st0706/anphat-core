"use client";

import { Button, Modal, Pagination, createTheme } from "@mantine/core";

export const theme = createTheme({
  colors: {
    purple: [
      "#efedff",
      "#dbd7fc",
      "#b3acf0",
      "#9E96EB",
      "#897fe6",
      "#786CE2",
      "#6658dd",
      "#4f3fd8",
      "#4333d6",
      "#3425bf"
    ]
  },
  primaryColor: "purple",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji",
  components: {
    Button: Button.extend({
      defaultProps: {
        fw: "normal"
      }
    }),
    Pagination: Pagination.extend({
      defaultProps: {
        radius: "xl",
        getControlProps: () => ({
          border: "none"
        }),
        getItemProps: () => ({
          border: "none"
        })
      }
    }),
    ModalTitle: Modal.Title.extend({
      defaultProps: {
        color: "red",
        fw: 500,
        fz: "var(--mantine-font-size-lg)"
      }
    })
  }
});
