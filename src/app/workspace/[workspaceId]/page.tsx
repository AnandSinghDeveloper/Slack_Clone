"use client";
import { useGetChannels } from "@/app/Features/channels/api/useGetChannels";
import { useCreateChannelModalAtom } from "@/app/Features/channels/store/useCreteChannelModel";
import { useCuerrntMember } from "@/app/Features/members/api/useCuerrntMember";
import { getUserWorkspace } from "@/app/Features/workSpaces/api/useGetWorkspace";
import { useWorkspaceId } from "@/app/hooks/useWorkspaceId";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { TbLoader3 } from "react-icons/tb";

const WorkspaceIdpage = () => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const [open, setOpen] = useCreateChannelModalAtom();
  const { data: workspace, isLoading: workspaceLoading } = getUserWorkspace({
    id: workspaceId,
  });
  1;
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  });
  const { data: member, isLoading: memberLoading } = useCuerrntMember({
    workspaceId,
  });

  const ChannelId = useMemo(() => channels?.[0]?._id, [channels]);
  const isAdmin = useMemo(() => member?.role === "admin", [member?.role]);

  useEffect(() => {
    if (
      workspaceLoading ||
      channelsLoading ||
      memberLoading ||
      !member ||
      !workspace
    )
      return;
    if (ChannelId) {
      router.push(`/workspace/${workspaceId}/channel/${ChannelId}`);
    } else if (!open && isAdmin) {
      setOpen(true);
    }
  }, [
    isAdmin,
    memberLoading,
    member,
    workspaceId,
    ChannelId,
    router,
    open,
    setOpen,
    workspaceLoading,
    channelsLoading,
  ]);

  if (workspaceLoading || channelsLoading || memberLoading)
    return (
      <div className=" flex flex-col h-full  bg-[#5e2c5f] items-center justify-center">
        <TbLoader3 className="text-white size-5 animate-spin " />
      </div>
    );

  if (!workspace || !member)
    return (
      <div className=" flex flex-col h-full space-y-1   bg-[#5e2c5f] items-center justify-center">
        <AlertTriangle className="text-white size-5 " />
        <p className=" text-white text-sm ">workspace not found</p>
      </div>
    );

  return (
    <div className=" flex flex-col h-full space-y-1    items-center justify-center">
      <AlertTriangle className="text-muted-foreground size-6 " />
      <p className=" text-muted-foreground text-sm font-medium ">No channel found</p>
    </div>
  );
};

export default WorkspaceIdpage;
