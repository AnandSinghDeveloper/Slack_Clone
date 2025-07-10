" use client ";

import { useWorkspaceId } from "@/app/hooks/useWorkspaceId";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cva ,type VariantProps  } from "class-variance-authority";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { IconType } from "react-icons/lib";


const SidebarItemVerient = cva(
  "flex items-center justify-start font-normal gap-2 rounded-md h-7 px-[18px] text-sm overflow-hidden",
    {
      variants: {
        variant: {
          default: "text-[#f9edffcc]",
          active: "text-[#481349] bg-white/90 hover:bg-white/90",
        },
      },
      defaultVariants: {
        variant: "default",
      },
    }
)
interface SidebarItemProps {
  id :string,
  icon : LucideIcon | IconType,
  label : string
  variant? : VariantProps <typeof SidebarItemVerient>['variant'];

  
}
const SidebarItem = ({icon : Icon , label, id ,variant }: SidebarItemProps) => {
  const workspaceId= useWorkspaceId();
  return (
    <Button
    variant={"ghost"}
    asChild
    size={"sm"}
    className={ cn( SidebarItemVerient({variant : variant}) ) }
    
    >
      <Link href={`/workspace/${workspaceId}/channel/${id}`} className=" flex items-center gap-2 ">
        <Icon className=" text-white " />
        <span className=" text-white text-sm truncate ">{label}</span>
      </Link>
    </Button>
  )
}

export default SidebarItem
