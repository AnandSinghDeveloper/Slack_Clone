"use client";

import { useDeleteChannel } from "@/app/Features/channels/api/useDeleteChannel";
import { useUpdateChannels } from "@/app/Features/channels/api/useUpdatechannel";
import { useCuerrntMember } from "@/app/Features/members/api/useCuerrntMember";
import { usechannelId } from "@/app/hooks/usechannelId";
import useConfirm from "@/app/hooks/useConfirm";
import { useWorkspaceId } from "@/app/hooks/useWorkspaceId";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { FaChevronDown } from "react-icons/fa";
import { TbLoader2 } from "react-icons/tb";
import { toast } from "sonner";

interface HeaderProps {
  title: string;
}
const Header = ({ title }: HeaderProps) => {
  const [editopen, setEditopen] = useState(false);
  const [value, setValue] = useState(title);
  const channelId = usechannelId();
  const workspaceId = useWorkspaceId();
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete This Channel ? ",
    "Are you sure you want to delete this channel? This action cannot be undone."
  );
  const { data: member } = useCuerrntMember({ workspaceId });
  const { mutate: Updatechannel, isPanding: isUpdatingchannel } =
    useUpdateChannels();
  const { mutate: Removechannel, isPanding: isRemovingchannel } =
    useDeleteChannel();
  const router = useRouter();

  const handleEditOpen = (value: boolean) => {
    if (member?.role !== "admin") {
     
      return;
    };

    setEditopen(true);
  };

  const handleRemove = async () => {
    const ok = await confirm();

    if (!ok) return;

    Removechannel(
      { id: channelId },
      {
        OnSuccess: () => {
          toast.success("Channel deleted successfully");
          router.replace(`/workspace/${workspaceId}`);
        },
        OnError: () => {
          toast.error("Failed to delete channel");
        },
      }
    );
  };

  const handleEdit = () => {
    Updatechannel(
      { id: channelId, name: value },
      {
        OnSuccess: () => {
          toast.success("Channel updated successfully");
          setEditopen(false);
        },
        OnError: () => {
          toast.error("Failed to update channel");
        },
      }
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, "-").toLowerCase();
    setValue(value);
  };

  return (
    <div className=" bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
      <ConfirmDialog />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant={"ghost"}
            size={"sm"}
            className=" overflow-hidden w-auto font-semibold px-2 text-lg hover:text-accent-foreground hover:bg-accent/90"
          >
            <span className=" truncate "># {title}</span>
            <FaChevronDown className="ml-2  size-3" />
          </Button>
        </DialogTrigger>
        <DialogContent className=" bg-gray-50 p-0 overflow-hidden ">
          <DialogHeader className=" border-b bg-white p-4">
            <DialogTitle># {title}</DialogTitle>
          </DialogHeader>

          <div className=" px-4 pb-4 flex flex-col gap-y-2 ">
            <Dialog open={editopen} onOpenChange={handleEditOpen}>
              <DialogTrigger asChild>
                <div className=" px-5 py-4 bg-white  rounded-lg hover:bg-gray-50 border cursor-pointer ">
                  <div className="flex items-center justify-between">
                    <p className=" text-md font-semibold "> Channel name</p>
                  { member?.role == "admin" && (
                    <span className=" text-sm font-semibold text-blue-700 hover:underline">
                      Edit
                    </span>
                    )}
                  </div>
                  <p className=" text-sm font-semibold "># {title}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename This Channel</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleEdit} className="space-y-4">
                  <Input
                    value={value}
                    onChange={handleChange}
                    required
                    disabled={isUpdatingchannel}
                    minLength={3}
                    maxLength={50}
                    autoFocus
                    placeholder="e.g. general-plan"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        variant={"outline"}
                        onClick={() => {}}
                        disabled={isUpdatingchannel}
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button disabled={isUpdatingchannel}>
                      {false ? <TbLoader2 /> : "Save"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            {member?.role == "admin" && (
              
            <button
              onClick={handleRemove}
              disabled={isRemovingchannel}
              className=" flex items-center gap-x-2 px-5 py-4 bg-white  rounded-lg hover:bg-gray-50 border cursor-pointer  text-rose-600"
            >
              <Trash2Icon className=" text-red-600 size-4 hover:text-red-700 " />
              <p className="text-sm font-semibold ">Delete Channel</p>
            </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Header;
