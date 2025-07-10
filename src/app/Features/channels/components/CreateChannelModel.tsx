"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCreateChannelModalAtom } from "../store/useCreteChannelModel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


const CreateChannelModel = () => {
 const [_open, setOpen] =  useCreateChannelModalAtom()
  
  return (
    <Dialog open={_open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Channel</DialogTitle>
        </DialogHeader>
        <form action="">
          <Input
          value={""}
          onChange={() => {}}
          placeholder="e.g Plan Budget"
          disabled= {false}
          required
          max={80}
          min={3}
          autoFocus

          />

          <div className="mt-4 flex justify-end">
            <Button type="submit"> Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateChannelModel
