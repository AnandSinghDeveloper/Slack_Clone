"use client"

import { AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { format } from "date-fns";

interface ConversationHeroProps {
  memberImage?: string;
  memberName?: string
}
const ConversationHero = ({memberImage, memberName} : ConversationHeroProps) => {
  return (
    <div className=" mt-[88px] mx-5 mb-4 ">
        <div className=" mb-2 gap-x-1 flex items-center ">
     
        <Avatar className=" size-14 mr-2 ">
            <AvatarImage className=" w-full h-full rounded-md" src={memberImage!}
            />
            <AvatarFallback className=" flex w-full h-full justify-center items-center bg-sky-500 text-white text-xl font-semibold rounded-lg ">
              {memberName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
       <p className="text-2xl font-bold">
        {memberName}
       </p>
       

     
    
    </div>
         <p className="mb-4 text-slate-800 font-normal">
          The Conversation just between you and <strong>{memberName}</strong> 
          </p>
       </div>
  )
}

export default ConversationHero
