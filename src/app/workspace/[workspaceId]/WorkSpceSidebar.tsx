"use client";

import { useCuerrntMember } from "@/app/Features/members/api/useCuerrntMember";

import { getUserWorkspace } from "@/app/Features/workSpaces/api/useGetWorkspace";
import { useWorkspaceId } from "@/app/hooks/useWorkspaceId";
import {
  AlertTriangle,
  HashIcon,
  MessageSquareText,
  SendHorizonal,
} from "lucide-react";
import { TbLoader, TbLoader3 } from "react-icons/tb";
import WorkspaceHeader from "./WorkspaceHeader";
import SidebarItem from "./SidebarItem";
import { useGetChannels } from "@/app/Features/channels/api/useGetChannels";
import WorkspaceSection from "./WorkspaceSection";
import { useGetMembers } from "@/app/Features/members/api/usrGerMembers";
import UserItem from "./UserItem";
import { useCreateChannelModalAtom } from "@/app/Features/channels/store/useCreteChannelModel";

const WorkSpceSidebar = () => {
  const workspaceId = useWorkspaceId();

  const [_open, setOpen]= useCreateChannelModalAtom();

  const { data: member, isLoading: memberLoading } = useCuerrntMember({workspaceId,});
  const { data: workspace, isLoading: workspaceLoading } = getUserWorkspace({ id: workspaceId, });
  const { data: channels, isLoading: channelsLoading } = useGetChannels({ workspaceId});
  const { data: members, isLoading: membersLoading } = useGetMembers({ workspaceId,});

  console.log( members);
  

  if (memberLoading || workspaceLoading) {
    return (
      <div className=" flex flex-col h-full  bg-[#5e2c5f] items-center justify-center">
        <TbLoader3 className="text-white size-5 animate-spin " />
      </div>
    );
  }
  if (!workspace || !member) {
    return (
      <div className=" flex flex-col h-full space-y-1   bg-[#5e2c5f] items-center justify-center">
        <AlertTriangle className="text-white size-5 " />
        <p className=" text-white text-sm ">workspace not found</p>
      </div>
    );
  }

  return (
    <div className=" flex flex-col h-full  bg-[#5e2c5f]">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />
      <div className=" flex flex-col px-2 mt-3">
        <SidebarItem label="Threads" icon={MessageSquareText} id="threads" />
        <SidebarItem label="Drft & Sent" icon={SendHorizonal} id="draft" />
      </div>
      <WorkspaceSection label="Channels" hint=" New Channels" onNew={member.role === "admin" ? () => {setOpen(true) } : undefined}>
        {channels?.map((items) => (
          <SidebarItem
            key={items._id}
            label={items.name}
            icon={HashIcon}
            id={items._id}
          />
        ))}
      </WorkspaceSection>
         <WorkspaceSection label="Direct Messages" hint=" New Direct Messages" onNew={() => {}}>
      { 
        members?.map((items) => (
        <UserItem
        key={items?._id}
        id={items?._id}
        image={items?.user?.image}
        label={items?.user?.name}
        />
        ))
      }
      </WorkspaceSection>
    </div>
  );
};

export default WorkSpceSidebar;
