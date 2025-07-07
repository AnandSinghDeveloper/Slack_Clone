"use client";

import { getUserWorkspaces } from "@/app/Features/workSpaces/api/getUserWorkspaces";
import { getUserWorkspace } from "@/app/Features/workSpaces/api/useGetWorkspace";
import { createWorkspaceModalAtom } from "@/app/Features/workSpaces/store/useCreateWorkspaceModel";
import { useWorkspaceId } from "@/app/hooks/useWorkspaceId";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { TbLoader3 } from "react-icons/tb";

const WorkspaceSwicher = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [open, setOpen] = createWorkspaceModalAtom();
  const { data: workspace, isLoading: workspaceLoading } = getUserWorkspace({
    id: workspaceId,
  });
  const { data: workspaces, isLoading: workspacesLoading } =
    getUserWorkspaces();

  const filteredWorkspaces = workspaces?.filter(
    (workspace) => workspace._id !== workspaceId
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-9 overflow-hidden relative bg-[#ababad] hover:bg-[#ababad]/80 text-slate-800 text-xl font-semibold ">
          {workspacesLoading ? (
            <TbLoader3 className="animate-spin size-5 shrink-0" />
          ) : (
            workspace?.name.charAt(0).toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" side="bottom" align="start">
        <DropdownMenuItem
          onClick={() => router.push(`/workspace/${workspaceId}`)}
          className="cursor-pointer flex-col justify-start items-start gap-0.5 capitalize"
        >
          {workspace?.name}
          <span className=" text-xs text-muted-foreground">
            Active Workspace
          </span>
        </DropdownMenuItem>
        {filteredWorkspaces?.map((workspace) => (
          <DropdownMenuItem
            key={workspace._id}
            onClick={() => router.push(`/workspace/${workspace._id}`)}
            className="cursor-pointer   capitalize overflow-hidden"
          >
            <div className=" shrink-0 size-9 required overflow-hidden bg-[#616061] text-slate-100 font-semibold rounded-md flex items-center justify-center mr-2 text-lg">
              {workspace.name.charAt(0).toUpperCase()}
            </div>
            <p className=" truncate ">{workspace.name}</p>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          className="cursor-pointer "
          onClick={() => setOpen(true)}
        >
          <div className=" size-9 required overflow-hidden bg-[#f2f2f2] text-slate-800 font-semibold rounded-md flex items-center justify-center mr-2 text-lg">
            <Plus />
          </div>
          <span className="  text font-basic"> Create New Workspace</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WorkspaceSwicher;
