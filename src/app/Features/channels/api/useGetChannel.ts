import { useQuery } from "convex/react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { api } from "../../../../../convex/_generated/api";

interface getChannelProps {
  id: Id<"channels">;
}

export const useGetChannel = ({ id }: getChannelProps) => {
  const data = useQuery(api.channels.getById, { id });
  const isLoading = data === undefined;

  return { data, isLoading };
};
