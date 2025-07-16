"use client";

import { useGetChannel } from "@/app/Features/channels/api/useGetChannel";
import { usechannelId } from "@/app/hooks/usechannelId";
import { TriangleAlert } from "lucide-react";
import { TbLoader3 } from "react-icons/tb";
import Header from "./Header";

const ChannelId = () => {
  const ChannelId = usechannelId();
  const { data: channel, isLoading: channelLoading } = useGetChannel({
    id: ChannelId,
  });

  if (channelLoading) {
    return (
      <div className=" flex flex-col h-full  items-center justify-center">
        <TbLoader3 className="text-muted-foreground size-7 animate-spin " />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className=" flex flex-col h-full  items-center justify-center">
        <TriangleAlert className="text-muted-foreground size-7  " />
        <p className=" text-muted-foreground text-sm ">channel not found</p>
      </div>
    );
  }

  return (
    <div className=" flex flex-col h-full">
      <Header title={channel.name} />
    </div>
  );
};

export default ChannelId;
