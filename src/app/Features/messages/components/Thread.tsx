"use client";

import { Button } from "@/components/ui/button";
import { Id } from "../../../../../convex/_generated/dataModel";
import { TriangleAlert, XIcon } from "lucide-react";
import { useGetMessagesById } from "../../messages/api/useGetMessageById";
import { TbLoader3 } from "react-icons/tb";
import Message from "@/app/Components/Message";
import { useCuerrntMember } from "../../members/api/useCuerrntMember";
import { useWorkspaceId } from "@/app/hooks/useWorkspaceId";
import { useState } from "react";

interface ThreadProps {
  messageId: Id<"messages">;
  onclose: () => void;
}

const Thread = ({ messageId, onclose }: ThreadProps) => {

  const workspaceId = useWorkspaceId();
  const { data : currentMember}= useCuerrntMember({workspaceId})

  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

  const {data : message , isLoading : messageLoading}=useGetMessagesById({id:messageId})

  if(messageLoading) {
    return (
     <div className=" h-full flex flex-col">
      <div className=" flex items-center justify-between h-[49px] px-4 border-b">
        <p className="font-bold text-lg"> Theads</p>
        <Button 
        variant={"ghost"}
        size={"sm"}
        className="hover:text-black hover:bg-gray-100/70" 
        onClick={onclose}
        >
          <XIcon className="size-5 stroke-1.5"  />
        </Button>
      </div>
      <div className=" h-full flex flex-col gap-y-2 items-center justify-center">
        <TbLoader3 className="text-[#5e2c5f] animate-spin size-5  " />
        
      </div>
    </div>

    )
  }

  if(!message) return (
 <div className=" h-full flex flex-col">
      <div className=" flex items-center justify-between h-[49px] px-4 border-b">
        <p className="font-bold text-lg"> Theads</p>
        <Button 
        variant={"ghost"}
        size={"sm"}
        className="hover:text-black hover:bg-gray-100/70" 
        onClick={onclose}
        >
          <XIcon className="size-5 stroke-1.5"  />
        </Button>
      </div>
      <div className=" h-full flex flex-col gap-y-2 items-center justify-center">
        <TriangleAlert className="text-[#5e2c5f] size-7  " />
        <p className=" text-[#5e2c5f] text-sm ">message not found</p>
      </div>
    </div>
  )


  return (
    <div className=" h-full flex flex-col">
      <div className=" flex items-center justify-between h-[49px] px-4 border-b">
        <p className="font-bold text-lg"> Theads</p>
        <Button 
        variant={"ghost"}
        size={"sm"}
        className="hover:text-black hover:bg-gray-100/70" 
        onClick={onclose}
        >
          <XIcon className="size-5 stroke-1.5"  />
        </Button>
      </div>
      <div>
        <Message
        hideThreadButton
        memberId={message.memberId}
        authorName={message.user?.name}
        authorImage={message.user?.image}
        isAuthor={message.memberId === currentMember?._id}
        body={message.body}
        image={message.image}
        createdAt={message._creationTime}
        updatedAt={message.updatedAt}
        id={message._id}
        isEditing={editingId === message._id}
         setEditingId={setEditingId}
         reactions={message.reactions}
        />
      </div>
    </div>
  )
}

export default Thread
