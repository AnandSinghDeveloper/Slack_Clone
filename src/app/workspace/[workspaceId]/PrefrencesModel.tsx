"use client";

import { useRemoveWorkspace } from "@/app/Features/workSpaces/api/useRemoveWorkspace";
import { useUpdateWorkspace } from "@/app/Features/workSpaces/api/useUpdateWorkspace";
import useConfirm from "@/app/hooks/useConfirm";
import { useWorkspaceId } from "@/app/hooks/useWorkspaceId";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TbLoader2 } from "react-icons/tb";
import { toast } from "sonner";

interface PrefrencesModelProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValue: string;
}
const PrefrencesModel = ({
  open,
  setOpen,
  initialValue,
}: PrefrencesModelProps) => {
  const [value, setValue] = useState(initialValue);
  const [editOpen, setEditOpen] = useState(false);
  const workspaceId = useWorkspaceId();
  const { mutate: UpdateWorkspace, isPanding: isUpdatingworkspace } =
    useUpdateWorkspace();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure ?",
    " This action cannot be reversed"
  );
  const { mutate: RemoveWorkspace, isPanding: isRemovingworkspace } =
    useRemoveWorkspace();
  const router = useRouter();

  const handleRemove = async () => {
    const isConfirmed = await confirm();

    if (!isConfirmed) return;

    RemoveWorkspace(
      { id: workspaceId },
      {
        OnSuccess: () => {
          toast.success("Workspace removed successfully");
          router.replace("/");
        },
        OnError: () => {
          toast.error("Something went wrong");
        },
      }
    );
  };
  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    UpdateWorkspace(
      { id: workspaceId, name: value },
      {
        OnSuccess: () => {
          toast.success("Workspace updated successfully");
          setEditOpen(false);
        },
        OnError: () => {
          toast.error("Something went wrong");
        },
      }
    );
  };
  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 bg-white border-b">
            <DialogTitle>{value}</DialogTitle>
          </DialogHeader>
          <div className="gap-y-2 px-4 pb-4 flex flex-col ">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <div className=" px-5 py-4 rounded-md border cursor-pointer bg-white hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className=" text-sm font-semibold">workspace name</p>
                    <p className=" text-sm text-[#1264f1] hover:underline font-semibold ">
                      Edit
                    </p>
                  </div>
                  <p className=" text-sm font-normal">{value}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update workspace name</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleEdit} className="space-y-4">
                  <Input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    required
                    disabled={isUpdatingworkspace}
                    minLength={3}
                    maxLength={50}
                    autoFocus
                    placeholder="workspace name"
                  />
                  <DialogFooter>
                    <DialogClose>
                      <Button
                        variant={"outline"}
                        onClick={() => setEditOpen(false)}
                        disabled={isUpdatingworkspace}
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button disabled={isUpdatingworkspace}>
                      {isUpdatingworkspace ? <TbLoader2 /> : "Update"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <button
              onClick={handleRemove}
              disabled={isRemovingworkspace}
              className="   py-4 px-5 flex items-center  bg-[white] font-semibold rounded-lg border cursor-pointer gap-x-2 text-rose-600  hover:bg-gray-50"
            >
              <Trash2Icon className=" size-5" />
              <p className=" text-sm font-semibold">Delete workspace</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PrefrencesModel;
