"use client";

import useCSR from "@/hooks/useCSR";
import { useSession } from "next-auth/react";
import { PropsWithChildren } from "react";
import { Loading } from "../shared";

export const AuthPermissionCheck = ({ children }: PropsWithChildren) => {
  const [isCSR] = useCSR();
  const { status } = useSession();

  if (!isCSR) return null;

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "unauthenticated") {
    return <p>Bạn không có quyền truy cập trang này</p>;
  }

  return children;
};
