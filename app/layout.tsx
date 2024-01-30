import app from "@/lib/app";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import "@mantine/nprogress/styles.css";
import type { Metadata } from "next";
import { PropsWithChildren } from "react";
import "./globals.css";
import { theme } from "./theme";
import { ModalsProvider } from "@mantine/modals";

export const metadata: Metadata = {
  title: app.name,
  description: app.description
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="vi">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no" />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Notifications autoClose={5000} />
          <ModalsProvider labels={{ confirm: "Xác nhận", cancel: "Hủy bỏ" }}>{children}</ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
