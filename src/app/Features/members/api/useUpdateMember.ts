import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Id } from "../../../../../convex/_generated/dataModel";

type RequestType = {
  id: Id<"members">;
  role: "admin" | "member";
};
type ResponseType = Id<"members"> | null;
type Options = {
  OnSuccess?: (data: ResponseType) => void;
  OnError?: (error: Error) => void;
  OnSettle?: () => void;
  throwOnError?: boolean;
};

export const useUpadateMember = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);

  const [status, setStatus] = useState<
    "success" | "error" | "pending" | "settled" | null
  >(null);

  const isPanding = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutation = useMutation(api.members.update);
  const mutate = useCallback(
    async (values: RequestType, options?: Options) => {
      try {
        setStatus("pending");

        setData(null);
        setError(null);

        const response = await mutation(values);
        options?.OnSuccess?.(response);
        return response;
      } catch (error) {
        options?.OnError?.(error as Error);
        if (options?.throwOnError) throw error;
      } finally {
        setStatus("settled");
        options?.OnSettle?.();
      }
    },
    [mutation]
  );
  return { mutate, data, error, isPanding, isSuccess, isError, isSettled };
};
