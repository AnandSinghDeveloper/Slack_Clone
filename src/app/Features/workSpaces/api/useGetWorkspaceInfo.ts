import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

interface getUserWorkspaceInfoProps {
  id: Id<"workspace">;
}

export const getUserWorkspaceInfo = ({ id }: getUserWorkspaceInfoProps) => {
  const data = useQuery(api.workSpaces.getWorkspaceIdInfo, { id: id });
  const isLoading = data === undefined;

  return { data, isLoading };
};
