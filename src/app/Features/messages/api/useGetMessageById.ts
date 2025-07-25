import { useQuery } from "convex/react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { api } from "../../../../../convex/_generated/api";

interface useGetMessagesByIdProps {
  id: Id<"messages">;
}

export const useGetMessagesById = ({ id }: useGetMessagesByIdProps ) => {
  const data = useQuery(api.messages.getById, { id });
  const isLoading = data === undefined;

  return { data, isLoading };
};
