"use client";

import useCSR from "@/hooks/useCSR";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

type Props = {
  session?: Session | null;
  children?: React.ReactNode;
};

export const AuthProvider = ({ session, children }: Props) => {
  const [isCSR] = useCSR();

  if (!isCSR) return null;

  return <SessionProvider session={session}>{children}</SessionProvider>;
};
