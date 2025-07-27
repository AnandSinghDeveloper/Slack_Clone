"use client";

import { useMemberId } from "@/app/hooks/useMemberId";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useGetMember } from "@/app/Features/members/api/useGetMember";
import { useGetMessages } from "@/app/Features/messages/api/useGetMessages";
import { TbLoader3 } from "react-icons/tb";
import Header from "./Header";
import ChatInput from "./ChatInput";
import MessageList from "@/app/Components/MessageList";

interface ConversationsProps {
  id: Id<"conversations">;
}

const Conversations = ({ id }: ConversationsProps) => {
  const memberId = useMemberId();

  const { data: member, isLoading: memberLoading } = useGetMember({ id: memberId });
  const { results, status, loadMore } = useGetMessages({  conversationId:id });

  console.log(results);
  

  if (memberLoading || status === "LoadingFirstPage") {
    return (
      <div className=" flex flex-col h-full  items-center justify-center">
        <TbLoader3 className="text-muted-foreground size-7 animate-spin " />
      </div>
    );
  }

  return (
    <div className=" flex flex-col h-full">
      <Header
        memberName={member?.user?.name}
        memberImage={member?.user?.image}
        onClick={() => {}}
      />
      <MessageList
      data={results}
      variant="conversation"
      memberImage={member?.user?.image}
      memberName={member?.user?.name}
      loadMore={loadMore}
      isLoadingMore={status === "LoadingMore"}
      canLoadMore= {status === "CanLoadMore"}
      />
      <ChatInput
        placeholder={`Message ${member?.user?.name}`}
        conversationId={id}
      />
    </div>
  );
};

export default Conversations;
