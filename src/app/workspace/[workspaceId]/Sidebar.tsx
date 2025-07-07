"use client";

import UserAvtar from "@/app/Features/Auth/Components/UserAvtar";
import WrokspaceSwitcher from "./WorkspaceSwicher";
import SidebarButton from "./SidebarButton";
import { Bell, Home,  MessagesSquare, MoreHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className=" w-[70px] h-full bg-[#481349] flex flex-col gap-y-4 p-[9px] items-center pb-4  ">
      <WrokspaceSwitcher />
      <SidebarButton icon={Home} label="Home" isActive={pathname.includes("/workspace")}/> 
      <SidebarButton icon={MessagesSquare } label="DMs" />
      <SidebarButton icon={Bell} label="Activity" />
      <SidebarButton icon={MoreHorizontal} label="More" />

      <div className=" flex flex-col items-center justify-center gap-y-2 mt-auto">
        <UserAvtar />
      </div>
    </aside>
  );
};

export default Sidebar;
