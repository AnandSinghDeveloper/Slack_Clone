"use client";

import { useCuerrntMember } from "@/app/Features/members/api/useCuerrntMember";
import { getUserWorkspace } from "@/app/Features/workSpaces/api/useGetWorkspace";
import { useWorkspaceId } from "@/app/hooks/useWorkspaceId";
import { AlertTriangle } from "lucide-react";
import { TbLoader, TbLoader3 } from "react-icons/tb";
import WorkspaceHeader from "./WorkspaceHeader";

const WorkSpceSidebar = () => {
  const workspaceId = useWorkspaceId();

  const { data: member, isLoading: memberLoading } = useCuerrntMember({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceLoading } = getUserWorkspace({
    id: workspaceId,
  });

  if(memberLoading || workspaceLoading) {
    return <div className=" flex flex-col h-full  bg-[#5e2c5f] items-center justify-center">
      
      <TbLoader3 className="text-white size-5 animate-spin "/>
    </div>;
  }
   if(!workspace || !member) {
    return <div className=" flex flex-col h-full space-y-1   bg-[#5e2c5f] items-center justify-center">
      
     <AlertTriangle className="text-white size-5 "/>
     <p className=" text-white text-sm ">
      workspace not found
     </p>
    </div>;
  }

  return <div className=" flex flex-col h-full  bg-[#5e2c5f]">
    <WorkspaceHeader workspace={workspace} isAdmin={member.role === "admin"} />
    </div>;
};

export default WorkSpceSidebar;
