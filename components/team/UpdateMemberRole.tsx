import useNotify, { Action } from "@/hooks/useNotify";
import { defaultHeaders } from "@/lib/common";
import { availableRoles } from "@/lib/permissions";
import { Team, TeamMember } from "@prisma/client";
import type { ApiResponse } from "types";

interface UpdateMemberRoleProps {
  team: Team;
  member: TeamMember;
}

const UpdateMemberRole = ({ team, member }: UpdateMemberRoleProps) => {
  const { notifyResult } = useNotify();

  const updateRole = async (member: TeamMember, role: string) => {
    const response = await fetch(`/api/teams/${team.slug}/members`, {
      method: "PATCH",
      headers: defaultHeaders,
      body: JSON.stringify({
        memberId: member.userId,
        role
      })
    });

    const json = (await response.json()) as ApiResponse;

    if (!response.ok) {
      notifyResult(Action.Update, "vai trò thành viên", false, json.error?.message);
      return;
    }

    notifyResult(Action.Update, "vai trò thành viên", true);
  };

  return (
    <select className="select select-bordered select-sm rounded" onChange={(e) => updateRole(member, e.target.value)}>
      {availableRoles.map((role) => (
        <option value={role.id} key={role.id} selected={role.id == member.role}>
          {role.id}
        </option>
      ))}
    </select>
  );
};

export default UpdateMemberRole;
