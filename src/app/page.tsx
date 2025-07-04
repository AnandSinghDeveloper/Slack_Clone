"use client";
import {  useEffect, useMemo } from "react";
import UserAvtar from "./Features/Auth/Components/UserAvtar";
import { getUserWorkspaces } from "./Features/workSpaces/api/getUserWorkspaces";1
import { createWorkspaceModalAtom}  from "./Features/workSpaces/store/useCreateWorkspaceModel";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  const { data, isLoading } = getUserWorkspaces();
  const workspacesId =  useMemo(()=> data?.[0]?._id, [data]);

  const [open, setOpen] = createWorkspaceModalAtom();

   useEffect(() => {
    if (isLoading) return;

    if (workspacesId) {
     router.replace(`/workspace/${workspacesId}`);
      
    }  else if (!open) {
      setOpen(true);
    }


   },[workspacesId, isLoading , open, setOpen, router]);
     

  return (
    <div>
      <UserAvtar />
    </div>
  );
}
