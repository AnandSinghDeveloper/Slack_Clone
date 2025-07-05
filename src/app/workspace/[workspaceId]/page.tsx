// interface WorkspaceIdpageProps {
//   params: {
//     workspaceId: string
//   }
// }
"use client";
import { getUserWorkspace } from "@/app/Features/workSpaces/api/getUserWorkspaces";
import { useWorkspaceId } from "@/app/hooks/useWorkspaceId";

const WorkspaceIdpage = () => {
  const workspaceId = useWorkspaceId();
  const {data}= getUserWorkspace({ id: workspaceId });
  return <div>Data : {JSON.stringify(data)}</div>;
};

export default WorkspaceIdpage;
