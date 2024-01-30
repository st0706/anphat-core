import type { Team } from "@prisma/client";
import {
  IconBinaryTree,
  IconFileSearch,
  IconLockCode,
  IconSettings,
  IconUsers,
  IconWebhook
} from "@tabler/icons-react";
import clsx from "clsx";
import useCanAccess from "hooks/useCanAccess";
import Link from "next/link";
import { TeamFeature } from "types";

interface TeamTabProps {
  activeTab: string;
  team: Team;
  heading?: string;
  teamFeatures: TeamFeature;
}

const TeamTab = ({ activeTab, team, heading, teamFeatures }: TeamTabProps) => {
  const { canAccess } = useCanAccess();

  const navigations = [
    {
      name: "Thiết lập",
      href: `/teams/${team.slug}/settings`,
      active: activeTab === "settings",
      icon: IconSettings
    }
  ];

  if (canAccess("team_member", ["create", "update", "read", "delete"])) {
    navigations.push({
      name: "Thành viên",
      href: `/teams/${team.slug}/members`,
      active: activeTab === "members",
      icon: IconUsers
    });
  }

  if (teamFeatures.auditLog && canAccess("team_audit_log", ["create", "update", "read", "delete"])) {
    navigations.push({
      name: "Nhật ký hoạt động",
      href: `/teams/${team.slug}/audit-logs`,
      active: activeTab === "audit-logs",
      icon: IconFileSearch
    });
  }

  if (teamFeatures.webhook && canAccess("team_webhook", ["create", "update", "read", "delete"])) {
    navigations.push({
      name: "Webhooks",
      href: `/teams/${team.slug}/webhooks`,
      active: activeTab === "webhooks",
      icon: IconWebhook
    });
  }

  if (teamFeatures.apiKey && canAccess("team_api_key", ["create", "update", "read", "delete"])) {
    navigations.push({
      name: "Khóa API",
      href: `/teams/${team.slug}/api-keys`,
      active: activeTab === "api-keys",
      icon: IconLockCode
    });
  }

  if (canAccess("team_organizations", ["create", "update", "read", "delete"])) {
    navigations.push({
      name: "Đơn vị trực thuộc",
      href: `/teams/${team.slug}/organizations`,
      active: activeTab === "organizations",
      icon: IconBinaryTree
    });
  }

  if (canAccess("team_organizations", ["create", "update", "read", "delete"])) {
    navigations.push({
      name: "Nhân sự",
      href: `/teams/${team.slug}/staffs`,
      active: activeTab === "staffs",
      icon: IconBinaryTree
    });
  }

  if (canAccess("team_organizations", ["create", "update", "read", "delete"])) {
    navigations.push({
      name: "Bệnh nhân",
      href: `/teams/${team.slug}/patients`,
      active: activeTab === "patients",
      icon: IconBinaryTree
    });
  }

  if (canAccess("team_organizations", ["create", "update", "read", "delete"])) {
    navigations.push({
      name: "Lịch khám",
      href: `/teams/${team.slug}/schedule`,
      active: activeTab === "schedule",
      icon: IconBinaryTree
    });
  }

  return (
    <div className="flex flex-col pb-6">
      <h2 className="text-xl font-semibold mb-2">{heading ? heading : team.name}</h2>
      <nav className=" flex space-x-5 border-b border-gray-300" aria-label="Tabs">
        {navigations.map((menu) => {
          return (
            <Link
              href={menu.href}
              key={menu.href}
              className={clsx(
                "inline-flex items-center border-b-2 py-4 text-sm font-medium",
                menu.active
                  ? "border-gray-900 text-gray-700 dark:text-gray-100"
                  : "border-transparent text-gray-500 hover:border-gray-300  hover:text-gray-700 hover:dark:text-gray-100"
              )}>
              {menu.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default TeamTab;
