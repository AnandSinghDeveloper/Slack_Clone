import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

interface getUserWorkspaceProps {
  id : Id<"workspace">
}

export const getUserWorkspace = ({ id }: getUserWorkspaceProps) => {
  const data = useQuery(api.workSpaces.getWorkspace, { workspaceId: id });
  const isLoading = data === undefined;

  return { data, isLoading };
};
