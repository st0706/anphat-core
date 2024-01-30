import { db } from "@/server/db";
import { Role } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

export const getInvitations = async (teamId: string) => {
  return await db.invitation.findMany({
    where: {
      teamId
    }
  });
};

export const getInvitation = async (key: { token: string } | { id: string }) => {
  return await db.invitation.findUniqueOrThrow({
    where: key,
    include: {
      team: true
    }
  });
};

export const createInvitation = async (param: { teamId: string; invitedBy: string; email: string; role: Role }) => {
  const { teamId, invitedBy, email, role } = param;

  return await db.invitation.create({
    data: {
      token: uuidv4(),
      expires: new Date(),
      teamId,
      invitedBy,
      email,
      role
    }
  });
};

export const deleteInvitation = async (key: { token: string } | { id: string }) => {
  return await db.invitation.delete({
    where: key
  });
};
