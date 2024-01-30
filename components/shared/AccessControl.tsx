import type { Action, Resource } from "@/lib/permissions";
import useCanAccess from "hooks/useCanAccess";
import { FC } from "react";

interface Props {
  children: React.ReactNode;
  resource: Resource;
  actions: Action[];
}

export const AccessControl: FC<Props> = ({ children, resource, actions }) => {
  const { canAccess } = useCanAccess();

  if (!canAccess(resource, actions)) {
    return null;
  }

  return <>{children}</>;
};
