"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "../api/useCurrentUser";
import { TbLoader3 } from "react-icons/tb";
import { LoaderCircle  , LogOut } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
const UserAvtar = () => {
  const { data, isLoading } = useCurrentUser();
  const { signOut } = useAuthActions();
  if (isLoading)
    return <TbLoader3   className=" size-7 animate-spin text-muted-foreground" />;
  if (!data) return null;

  const { image, name } = data;
  const Avatarfallback = name!.charAt(0).toUpperCase();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className=" outline-none relative">
        <Avatar className=" size-10 hover:opacity-75 transition">
          <AvatarImage src={image!} alt={name!} />
          <AvatarFallback className=" bg-sky-500 font-medium text-white">
            {Avatarfallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" side="right" className="w-56">
        <DropdownMenuItem
          onClick={signOut}
          className=" cursor-pointer font-medium h-10"
        >
          <LogOut className=" size-5 mr-2 " />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvtar;
