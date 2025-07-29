"use client";

import { useGetChannel } from "@/app/Features/channels/api/useGetChannel";
import { usechannelId } from "@/app/hooks/usechannelId";
import { TriangleAlert } from "lucide-react";
import { TbLoader3 } from "react-icons/tb";
import Header from "./Header";
import ChatInput from "./ChatInput";
import { useGetMessages } from "@/app/Features/messages/api/useGetMessages";
import MessageList from "@/app/Components/MessageList";
import { log } from "node:console";

const ChannelId = () => {

  
  const ChannelId = usechannelId();
  const {results , status , loadMore}= useGetMessages({channelId: ChannelId});
 
 
  
  

  
  const { data: channel, isLoading: channelLoading } = useGetChannel({
    id: ChannelId,
  });

  if (channelLoading || status === "LoadingFirstPage") {
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
      <MessageList
      channelName={channel.name}
      channelCreationTime={channel._creationTime}
      data= {results}
      loadMore={loadMore}
      isLoadingMore={status === "LoadingMore"}
      canLoadMore={status === "CanLoadMore"}

      />
       
       <ChatInput placeholder={`Message # ${channel.name}`} />
    </div>
  );
};

export default ChannelId;
