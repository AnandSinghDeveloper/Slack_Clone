"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createWorkspaceModalAtom } from "../store/useCreateWorkspaceModel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateWorkspaces } from "../api/useCreateWorkspaces";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CreateWorkspaceModel = () => {
  const router = useRouter();
  const [open, setOpen] = createWorkspaceModalAtom();
  const [name, setName] = useState("");

  const { mutate , isPanding } = useCreateWorkspaces();
  const handleClose = () => {
    setOpen(false);
    setName("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { 
    e.preventDefault();
    mutate({ 
      name
     },{
      OnSuccess(data) {
        handleClose();
        router.replace(`/workspace/${data}`);
        
      }
     });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new workspace</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className=" space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPanding}
            autoFocus
            required
            minLength={3}
            placeholder="Workspace name e.g. 'Work ' 'Personal' 'Home'"
          />
          <div className=" flex justify-end">
            <Button disabled={isPanding}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkspaceModel;
