"use client"

import { cn } from "@/lib/utils";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import { useCuerrntMember } from "../Features/members/api/useCuerrntMember";
import { useWorkspaceId } from "../hooks/useWorkspaceId";
import { Hint } from "./hint";
import EmojiPopover from "./EmojiPopover";
import { MdOutlineAddReaction } from "react-icons/md";

interface ReactionsProps {
  onChange: ( value: string) => void
  data: Array<
      Omit<Doc<"reactions">, "memberId"> & {
        count: number;
        memberIds: Id<"members">[];
      }
    >;
}

const Reactions = ({onChange, data}: ReactionsProps) => {

  const workspaceId =useWorkspaceId();
  const {data: currentMember} = useCuerrntMember({workspaceId});

  const currentMemberId = currentMember?._id ;

  if(data.length === 0 || !currentMemberId){
    return null
  }


  return (
    <div className="flex items-center mb-1 mt-1 gap-1 ">
     {data.map((reaction)=>(
      <Hint
       key={reaction._id}
       label={`${reaction.count} ${reaction.count === 1 ? "person" : "people"} reacted with ${reaction.value}`}
      >
        <button
      onClick={() => onChange(reaction.value)}
      className={cn(" h-6 px-2 rounded-full bg-slate-200/70 border border-transparent text-slate-800 flex items-center gap-x-1",
        reaction.memberIds.includes(currentMemberId) && " bg-blue-100/70 border-blue-500 text-white"
      )}
      >
        {reaction.value}
        <span
        className={cn("text-xs font-semibold text-muted-foreground",
          reaction.memberIds.includes(currentMemberId) && "text-blue-500"
        )}
        >{reaction.count}</span>
      </button>
      </Hint>
      
     ))}

     <EmojiPopover
     hint="Add a Reaction"
     onEmojiSelect={(emoji) => {
       onChange(emoji.native);
     }}
     >
       <button className=" h-7 px-3 rounded-full bg-slate-200/70 border border-transparent hover:border-slate-500 text-slate-800 flex items-center gap-x-1 ">
        <MdOutlineAddReaction className=" size-5  " />
      </button>
     </EmojiPopover>
    </div>
  )
}

export default Reactions
