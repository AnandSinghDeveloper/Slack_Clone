"use client";

import { Hint } from "@/app/Components/hint";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { FaCaretDown } from "react-icons/fa";
import { useToggle } from "react-use";


interface WorkspaceSectionProps {
children: React.ReactNode
 label: string ,
 hint : string ,
onNew?: () => void
}
const WorkspaceSection = ({ children, label, hint ,onNew}:WorkspaceSectionProps) => {
  const [on , toggle] = useToggle(true)
  return (
    <div className=" flex flex-col mt-2 px-2 ">
      <div className="flex items-center px-3.5 group"> 
        <Button
        variant={"ghost"}
        onClick={toggle}
        className="size-6 shrink-0 text-sm p-0.5 text-[#f9edffcc]"
        >
        <FaCaretDown className={cn("size-4 transition-transform", !on && "-rotate-90") }/>
        </Button>
        <Button
        variant={"ghost"}
        size={"sm"}
        className=" text-sm p-1.5 text-[#f9edffcc] group h-[28px] justify-start overflow-hidden items-center"
        >
        <div className=" truncate">{label}</div>
        </Button>
        {onNew &&
        <Hint label={hint} side="top" align="center">
        <Button
        variant={"ghost"}
        size="sm"
        className=" text-sm p-1.5 text-[#f9edffcc] group  opacity-0 group-hover:opacity-100 transition-opacity ml-auto shrink-0 size-6" 
        onClick={onNew}
        >
       <PlusIcon className=" size-5 " />
        </Button>
        </Hint>
        }
      </div>
       { on && children}
    </div>
  )
}

export default WorkspaceSection
