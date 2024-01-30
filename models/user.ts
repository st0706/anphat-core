import { ApiError } from "@/lib/errors";
import { Action, Resource, permissions } from "@/lib/permissions";
import { db } from "@/server/db";
import { Role, TeamMember } from "@prisma/client";
import type { Session } from "next-auth";

export const createUser = async (param: { name: string; email: string; password?: string }) => {
  const { name, email, password } = param;

  return await db.user.create({
    data: {
      name,
      email,
      password: password ? password : ""
    }
  });
};

export const getUser = async (key: { id: string } | { email: string }) => {
  return await db.user.findUnique({
    where: key
  });
};

export const getUserBySession = async (session: Session | null) => {
  if (session === null || session.user === null) {
    return null;
  }

  const id = session?.user?.id;

  if (!id) {
    return null;
  }

  return await getUser({ id });
};

export const deleteUser = async (key: { id: string } | { email: string }) => {
  return await db.user.delete({
    where: key
  });
};

export const isAllowed = (role: Role, resource: Resource, action: Action) => {
  const rolePermissions = permissions[role];

  if (!rolePermissions) {
    return false;
  }

  for (const permission of rolePermissions) {
    if (permission.resource === resource) {
      if (permission.actions === "*" || permission.actions.includes(action)) {
        return true;
      }
    }
  }

  return false;
};

export const throwIfNotAllowed = (teamMember: TeamMember, resource: Resource, action: Action) => {
  if (isAllowed(teamMember.role, resource, action)) {
    return true;
  }

  throw new ApiError(403, `Bạn không được phép ${action} ${resource}`);
};
