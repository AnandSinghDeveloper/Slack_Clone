"use client";

import { Button } from "@/components/ui/button";
import { Id } from "../../../../convex/_generated/dataModel";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useWorkspaceId } from "@/app/hooks/useWorkspaceId";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const userItemVerient = cva(
  "flex items-center justify-start font-normal gap-2 rounded-md h-7 px-4 text-sm overflow-hidden",
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
);

interface UserItemProps {
  id: Id<"members">;
  label?: string;
  image?: string;
  variant?: VariantProps<typeof userItemVerient>["variant"];
}

const UserItem = ({ id, label = "Member", image, variant }: UserItemProps) => {
  const workspaceId = useWorkspaceId();
  return (
    <Button
      variant={"ghost"}
      className={cn(userItemVerient({ variant: variant }))}
      size={"sm"}
      asChild
    >
      <Link href={`/workspace/${workspaceId}/member/${id}`}>
      <Avatar className=" size-5 mr-1 rounded-sm">
        <AvatarImage className="rounded-sm" src={image!} />
        <AvatarFallback className=" rounded-sm  bg-sky-500 text-xs text-white">
         {label.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className=" text-sm  truncate">{label}</span>
      </Link>
    </Button>
  );
};

export default UserItem;
