import { TrpcProvider } from "@/app/(admin)/TrpcProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import AppLayout from "@/components/layout/AppLayout";
import { getServerAuthSession } from "@/server/auth";
import { PropsWithChildren } from "react";

export default async function AdminLayout({ children }: PropsWithChildren) {
  const session = await getServerAuthSession();

  return (
    <AuthProvider session={session}>
      <TrpcProvider>
        <AppLayout>{children}</AppLayout>
      </TrpcProvider>
    </AuthProvider>
  );
}
