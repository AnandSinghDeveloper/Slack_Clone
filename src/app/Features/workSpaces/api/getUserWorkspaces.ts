import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";



export const getUserWorkspaces = () => {
  const data = useQuery(api.workSpaces.get,);
  const isLoading = data === undefined;

  return { data, isLoading };
};
