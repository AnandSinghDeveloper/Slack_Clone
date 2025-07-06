"use client";

import { getUserWorkspace } from "../../Features/workSpaces/api/useGetWorkspace";
import { useWorkspaceId } from "@/app/hooks/useWorkspaceId";
import { Button } from "@/components/ui/button";
import { Info, Search } from "lucide-react";

const Toolbar = () => {
  const workspaceId = useWorkspaceId();
  const { data } = getUserWorkspace({ id: workspaceId });

  return (
    <nav className=" bg-[#481349] h-12 p-1.5 flex items-center justify-between ">
      <div className=" flex-1" />
      <div className="min-w-[280px] max-[642px] shrink grow-[2]">
        <Button
          size={"sm"}
          className=" bg-accent/25 hover:bg-accent/30 w-full justify-start h-7 px-2"
        >
          <Search className="mr-2 h-4 w-4" />
          <span className="text-sm text-white">Search in ' {data?.name} '</span>
        </Button>
      </div>
      <div className=" flex-1 ml-auto flex items-center justify-end">
        <Button variant={"ghost"} className=" tranparent hover:bg-accent/10">
          <Info className=" text-white h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
};

export default Toolbar;
