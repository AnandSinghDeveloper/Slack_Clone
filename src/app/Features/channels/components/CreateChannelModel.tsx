"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateChannelModalAtom } from "../store/useCreteChannelModel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCreateChannels } from "../api/useCreateChannels";
import { useWorkspaceId } from "@/app/hooks/useWorkspaceId";

const CreateChannelModel = () => {
  const workspaceId = useWorkspaceId();
  const [_open, setOpen] = useCreateChannelModalAtom();
  const { mutate , isPanding }= useCreateChannels();
  const [name , setName] = useState("")

  const handleClose = () => {
    setOpen(false);
    setName("");
  };

 const  handleSubmit = (e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();

    mutate({ name , workspaceId: workspaceId},{ OnSuccess: () => handleClose() });

   
 }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     
     const value = e.target.value.replace(/\s/g, "-").toLowerCase();
     setName(value);

  }

  return (
    <Dialog open={_open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Channel</DialogTitle>
        </DialogHeader>
        <form action="" onSubmit={handleSubmit}>
          <Input
            value={name}
            onChange={handleChange}
            type="text"
            placeholder="e.g Plan-Budget"
            disabled={false}
            required
            max={80}
            min={3}
            autoFocus
          />

          <div className="mt-4 flex justify-end">
            <Button disabled = {false}> Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelModel;
