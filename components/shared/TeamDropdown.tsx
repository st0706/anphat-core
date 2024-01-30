import { IconFolderPlus, IconFolders, IconSelector, IconUserCircle } from "@tabler/icons-react";
import useTeams from "hooks/useTeams";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

const TeamDropdown = () => {
  const { teams } = useTeams();
  const { data } = useSession();
  const { slug } = useParams();

  const currentTeam = (teams || []).find((team) => team.slug === slug);

  const menus = [
    {
      id: 2,
      name: "Bệnh viện",
      items: (teams || []).map((team) => ({
        id: team.id,
        name: team.name,
        href: `/teams/${team.slug}/settings`,
        icon: IconFolders
      }))
    },
    {
      id: 1,
      name: "Hồ sơ",
      items: [
        {
          id: data?.user.id,
          name: data?.user?.name,
          href: "/settings/account",
          icon: IconUserCircle
        }
      ]
    },
    {
      id: 3,
      name: "",
      items: [
        {
          id: "all-teams",
          name: "Bệnh viện",
          href: "/teams",
          icon: IconFolders
        },
        {
          id: "new-team",
          name: "Thêm bệnh viện",
          href: "/teams?newTeam=true",
          icon: IconFolderPlus
        }
      ]
    }
  ];

  return (
    <div className="px-4 py-2">
      <div className="flex">
        <div className="dropdown w-full">
          <div
            tabIndex={0}
            className="border border-gray-300 dark:border-gray-600 flex h-10 items-center px-4 justify-between cursor-pointer rounded text-sm font-bold">
            {currentTeam?.name || data?.user?.name} <IconSelector className="w-5 h-5" />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content dark:border-gray-600 p-2 shadow-md bg-base-100 w-full rounded border px-2">
            {menus.map(({ id, name, items }) => {
              return (
                <React.Fragment key={id}>
                  {name && (
                    <li className="text-xs text-gray-500 py-1 px-2" key={`${id}-name`}>
                      {name}
                    </li>
                  )}
                  {items.map((item) => (
                    <li
                      key={`${id}-${item.id}`}
                      onClick={() => {
                        if (document.activeElement) {
                          (document.activeElement as HTMLElement).blur();
                        }
                      }}>
                      <Link href={item.href}>
                        <div className="flex hover:bg-gray-100 hover:dark:text-black focus:bg-gray-100 focus:outline-none py-2 px-2 rounded text-sm font-medium gap-2 items-center">
                          <item.icon className="w-5 h-5" /> {item.name}
                        </div>
                      </Link>
                    </li>
                  ))}
                  {name && <li className="divider m-0" key={`${id}-divider`} />}
                </React.Fragment>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TeamDropdown;
