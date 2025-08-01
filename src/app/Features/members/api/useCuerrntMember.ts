import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

interface useCuerrntMemberProps {
  workspaceId: Id<"workspace">;
}
export const useCuerrntMember = ({ workspaceId }: useCuerrntMemberProps) => {
  const data = useQuery(api.members.current, { workspaceId });
  const isLoading = data === undefined;

  return { data, isLoading };
};
