import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { findOrCreateApp } from "@/lib/svix";
import { Prisma, Role, Team } from "@prisma/client";

export const createTeam = async (param: { userId: string; name: string; slug: string }) => {
  const { userId, name, slug } = param;

  const team = await db.team.create({
    data: {
      name,
      slug
    }
  });

  await addTeamMember(team.id, userId, Role.OWNER);

  await findOrCreateApp(team.name, team.id);

  return team;
};

export const getTeam = async (key: { id: string } | { slug: string }) => {
  return await db.team.findUniqueOrThrow({
    where: key
  });
};

export const deleteTeam = async (key: { id: string } | { slug: string }) => {
  return await db.team.delete({
    where: key
  });
};

export const addTeamMember = async (teamId: string, userId: string, role: Role) => {
  return await db.teamMember.upsert({
    create: {
      teamId,
      userId,
      role
    },
    update: {
      role
    },
    where: {
      teamId_userId: {
        teamId,
        userId
      }
    }
  });
};

export const removeTeamMember = async (teamId: string, userId: string) => {
  return await db.teamMember.delete({
    where: {
      teamId_userId: {
        teamId,
        userId
      }
    }
  });
};

export const getTeams = async (userId: string) => {
  return await db.team.findMany({
    where: {
      members: {
        some: {
          userId
        }
      }
    },
    include: {
      _count: {
        select: { members: true }
      }
    }
  });
};

export async function getTeamRoles(userId: string) {
  const teamRoles = await db.teamMember.findMany({
    where: {
      userId
    },
    select: {
      teamId: true,
      role: true
    }
  });

  return teamRoles;
}

// Check if the user is an admin or owner of the team
export async function isTeamAdmin(userId: string, teamId: string) {
  const teamMember = await db.teamMember.findFirstOrThrow({
    where: {
      userId,
      teamId
    }
  });

  return teamMember.role === Role.ADMIN || teamMember.role === Role.OWNER;
}

export const getTeamMembers = async (slug: string) => {
  return await db.teamMember.findMany({
    where: {
      team: {
        slug
      }
    },
    include: {
      user: true
    }
  });
};

export const updateTeam = async (slug: string, data: Partial<Team>) => {
  try {
    return await db.team.update({
      where: {
        slug
      },
      data: data
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === "P2002") {
        const match = e.message.match(/:\s*\(`(.*)`\)/);
        if (match) {
          e.message = `Trường sau đây đã tồn tại : ${
            match[1] === "slug" ? "Đường dẫn" : "Tên miền"
          }.\nVui lòng kiểm tra lại !`;
          throw e;
        }
      }
    }
    throw e;
  }
};

export const isTeamExists = async (condition: any) => {
  return await db.team.count({
    where: {
      OR: condition
    }
  });
};

// Check if the current user has access to the team
// Should be used in API routes to check if the user has access to the team
export const throwIfNoTeamAccess = async (req, slug) => {
  const session = await getServerAuthSession();
  if (!session) {
    throw new Error("Không có quyền truy cập");
  }

  const teamMember = await getTeamMember(session.user.id, slug as string);

  if (!teamMember) {
    throw new Error("Bạn không có quyền truy cập vào tổ chức này");
  }

  return {
    ...teamMember,
    user: {
      ...session.user
    }
  };
};

// Get the current user's team member object
export const getTeamMember = async (userId: string, slug: string) => {
  const teamMember = await db.teamMember.findFirstOrThrow({
    where: {
      userId,
      team: {
        slug
      },
      role: {
        in: ["ADMIN", "MEMBER", "OWNER"]
      }
    },
    include: {
      team: true
    }
  });

  return teamMember;
};
