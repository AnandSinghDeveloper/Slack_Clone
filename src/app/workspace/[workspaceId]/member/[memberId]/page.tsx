"use client";

import { useCreateOrGetConversation } from "@/app/Features/Conversations/api/useCreateOrGetAPI";
import { useMemberId } from "@/app/hooks/useMemberId";
import { useWorkspaceId } from "@/app/hooks/useWorkspaceId";
import { TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { TbLoader3 } from "react-icons/tb";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import Conversations from "./Conversations";

const MemberIdPage = () => {
  const memberId = useMemberId();
  const workspaceId = useWorkspaceId();
  
  const [conversationId, setConversationId] = useState<Id<"conversations"> | null>( null);
  const { data, mutate, isPanding } = useCreateOrGetConversation();

  useEffect(() => {
    mutate({ workspaceId: workspaceId, memberId: memberId } ,{
      OnSuccess(data) {
        setConversationId(data)
      },
      OnError() {
        toast.error("Failed to get or create conversation");
      },
    });
  }, [workspaceId, memberId, mutate]);

  if (isPanding)
    return (
      <div className="h-full flex items-center justify-center ">
        <TbLoader3 className="text-[#5e2c5f] size-7 animate-spin " />
      </div>
    );

  if (!conversationId)
    return (
      <div className="h-full flex flex-col gap-y-2 items-center justify-center ">
        <TriangleAlert className=" size-7  " />
        <p className=" font-medium text-muted-foreground ">
          Conversation not found
        </p>
      </div>
    );

  return <Conversations id={conversationId}/>
};

export default MemberIdPage;
