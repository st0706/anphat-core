import { Role } from "@prisma/client";

export type RoleType = (typeof Role)[keyof typeof Role];
export type Action = "create" | "update" | "read" | "delete" | "leave";
export type Resource =
  | "team"
  | "team_member"
  | "team_invitation"
  | "team_audit_log"
  | "team_webhook"
  | "team_api_key"
  | "team_organizations"
  | "team_staffs";

export type RolePermissions = {
  [role in RoleType]: Permission[];
};

export type Permission = {
  resource: Resource;
  actions: Action[] | "*";
};

export const availableRoles = [
  {
    id: Role.MEMBER,
    name: "Thành viên"
  },
  {
    id: Role.ADMIN,
    name: "Quản trị viên"
  },
  {
    id: Role.OWNER,
    name: "Chủ sở hữu"
  }
];

export const permissions: RolePermissions = {
  OWNER: [
    {
      resource: "team",
      actions: "*"
    },
    {
      resource: "team_member",
      actions: "*"
    },
    {
      resource: "team_invitation",
      actions: "*"
    },
    {
      resource: "team_audit_log",
      actions: "*"
    },
    {
      resource: "team_webhook",
      actions: "*"
    },
    {
      resource: "team_api_key",
      actions: "*"
    },
    {
      resource: "team_organizations",
      actions: "*"
    },
    {
      resource: "team_staffs",
      actions: "*"
    }
  ],
  ADMIN: [
    {
      resource: "team",
      actions: "*"
    },
    {
      resource: "team_member",
      actions: "*"
    },
    {
      resource: "team_invitation",
      actions: "*"
    },
    {
      resource: "team_audit_log",
      actions: "*"
    },
    {
      resource: "team_webhook",
      actions: "*"
    },
    {
      resource: "team_api_key",
      actions: "*"
    },
    {
      resource: "team_organizations",
      actions: "*"
    },
    {
      resource: "team_staffs",
      actions: "*"
    }
  ],
  MEMBER: [
    {
      resource: "team",
      actions: ["read", "leave"]
    }
  ]
};
