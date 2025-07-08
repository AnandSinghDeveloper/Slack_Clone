"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { ChevronDown, ListFilter, SquarePen } from "lucide-react";
import { Hint } from "@/app/Components/hint";
import PrefrencesModel from "./PrefrencesModel";
import { useState } from "react";

interface WorkspaceHeaderProps {
  workspace: Doc<"workspace">;
  isAdmin: boolean;
}
const WorkspaceHeader = ({ workspace, isAdmin }: WorkspaceHeaderProps) => {
  const [prefrenceOpen, setPrefrenceOpen] = useState(false);

  return (
    <>
      <PrefrencesModel open={prefrenceOpen} setOpen={setPrefrenceOpen} initialValue={workspace.name} />
      <div className="flex items-center justify-between gap-0.5 px-4 h-[49px]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={"ghost"}
              className=" max-w-[200px] font-semibold text-white hover:text-accent hover:bg-accent/10 text-lg p-1.5 w-auto overflow-hidden "
              size={"sm"}
            >
              <span className=" truncate ">{workspace?.name}</span>
              <ChevronDown className="ml-1 shrink-0 size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="start" className="w-64">
            <DropdownMenuItem className="cursor-pointer capitalize">
              <div className="size-9  relative  overflow-hidden text-white font-semibold bg-[#6e6e6e] text-xl mr-2 flex items-center justify-center rounded-md">
                {workspace?.name.charAt(0).toUpperCase()}
              </div>
              <div className=" flex flex-col items-start">
                <p className="font-bold">{workspace?.name}</p>
                <p className=" text-xm text-muted-foreground">
                  {" "}
                  Active workspace
                </p>
              </div>
            </DropdownMenuItem>
            {isAdmin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer py-2 "
                  onClick={() => {}}
                >
                  Invite members to {workspace?.name}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer py-2 font-base "
                  onClick={() => { setPrefrenceOpen(true) }}
                >
                  Prefrence
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center gap-0.5 z-10 ">
          <Hint label="Filter workspace" side="bottom">
            <Button
              size={"icon"}
              variant={"ghost"}
              className=" text-amber-50 size-9 e hover:bg-accent/10 hover:text-accent"
            >
              <ListFilter className=" size-4 " />
            </Button>
          </Hint>
          <Hint label="Edit workspace" side="bottom">
            <Button
              size={"icon"}
              variant={"ghost"}
              className=" text-amber-50 size-9  hover:bg-accent/10 hover:text-accent"
            >
              <SquarePen className=" size-4 " />
            </Button>
          </Hint>
        </div>
      </div>
    </>
  );
};

export default WorkspaceHeader;
