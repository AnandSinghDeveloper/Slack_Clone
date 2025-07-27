"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { FaChevronDown } from "react-icons/fa";


interface HeaderProps {
   memberName?: string;
   memberImage?: string;
   onClick?: () => void
}
const Header = ({ memberName ="Member", memberImage, onClick }: HeaderProps) => {
   
   const avatarFallback = memberName.charAt(0).toUpperCase();

  return (
    <div className=" bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
      <Button 
      variant={"ghost"}
      className=" overflow-hidden w-auto px-2 font-semibold hover:text-black hover:bg-gray-100/70  text-lg"
      onClick={onClick}
      >
        <Avatar className=" size-8 mr-2 ">
            <AvatarImage className=" w-full h-full rounded-md" src={memberImage!}
            />
            <AvatarFallback className=" flex w-full h-full justify-center items-center bg-sky-500 text-white rounded-lg ">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        <span className="truncate">{memberName}</span>
          <FaChevronDown  className=" size-2.5 ml-2"/>
       

      </Button>
    
    </div>
  );
};

export default Header;
