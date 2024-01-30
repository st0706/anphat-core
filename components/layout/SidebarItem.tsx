import clsx from "clsx";
import NextLink from "next/link";
import { FC } from "react";

export interface SidebarMenuItem {
  name: string;
  href: string;
  icon?: any;
  active?: boolean;
  items?: Omit<SidebarMenuItem, "icon" | "items">[];
  className?: string;
}

const SidebarItem: FC<SidebarMenuItem> = ({ href, name, icon, active, className }) => {
  const Icon = icon;

  return (
    <NextLink
      href={href}
      className={clsx(
        active ? "bg-gray-100 font-semibold" : "dark:text-white",
        "flex items-center rounded-lg text-sm text-gray-900 hover:dark:text-black hover:bg-gray-100 p-2",
        className
      )}>
      <div className="flex gap-2">
        {Icon && <Icon className="h-5 w-5" />}
        <span>{name}</span>
      </div>
    </NextLink>
  );
};

export default SidebarItem;
