"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { IconType } from "react-icons/lib"

interface SidebarButtonProps {
  icon:LucideIcon |IconType ,
  label: string,
  isActive?: boolean
}
const SidebarButton = ({ icon : Icon, label , isActive}: SidebarButtonProps) => {


  return (
    <div className=" group flex flex-col items-center justify-center gay-y-cursor-pointer ">
      <Button
      variant={  "ghost"}
      className={cn("size-9 p-2 hover:bg-accent/20 ",
      isActive && "bg-accent/20"
      )}
      >
      <Icon className=" size-5 text-white  group-hover:scale-110 transition-all " />
      </Button>
      <span className=" text-[10px] group-hover:text-accent text-white ">{label}</span>
    </div>
  )
}

export default SidebarButton
