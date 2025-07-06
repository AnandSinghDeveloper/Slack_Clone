// interface WorkspaceIdpageProps {
//   params: {
//     workspaceId: string
//   }
// }
"use client";
import { getUserWorkspace } from "@/app/Features/workSpaces/api/useGetWorkspace";
import { useWorkspaceId } from "@/app/hooks/useWorkspaceId";

const WorkspaceIdpage = () => {
  const workspaceId = useWorkspaceId();
  const {data}= getUserWorkspace({ id: workspaceId });
  return <div>workspaceId </div>;
};

export default WorkspaceIdpage;
