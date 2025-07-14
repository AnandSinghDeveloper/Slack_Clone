import { useNewJoinCode } from "@/app/Features/workSpaces/api/useNewJoinCode";
import useConfirm from "@/app/hooks/useConfirm";
import { useWorkspaceId } from "@/app/hooks/useWorkspaceId";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

import { CopyIcon, RefreshCcw, RefreshCwIcon } from "lucide-react";
import { toast } from "sonner";

interface InviteModelProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  joinCode: string;
}

const InviteModel = ({ open, setOpen, name, joinCode }: InviteModelProps) => {
  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;

    navigator.clipboard.writeText(inviteLink).then(() => {
      toast.success("Copied to clipboard");
    });
  };
  const workspaceId = useWorkspaceId();
  const { mutate, isPanding } = useNewJoinCode();
  const [ConfirmDialog, confirm] = useConfirm(
    "New Code",
    "Are you sure you want to generate a Invite link?"
  );

  const handleNewCode = async () => {
    const isConfirmed = await confirm();

    if (!isConfirmed) return;

    mutate(
      { workspaceId },
      {
        OnSuccess(data) {
          toast.success("New Invite code generated");
        },
      }
    );
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite to People in {name} </DialogTitle>
            <DialogDescription>
              Use this code given blow to invite others to your workspace
            </DialogDescription>
          </DialogHeader>
          <div className=" flex flex-col gap-4 items-center justify-center py-10">
            <p className=" text-4xl font-bold tracking-widest uppercase">
              {joinCode}
            </p>
            <Button onClick={handleCopy} variant={"outline"} className=" ">
              Copy Link
              <CopyIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="flex justify-between items-center w-full">
            <Button variant={"outline"} className="" onClick={handleNewCode}>
              New code
              <RefreshCwIcon className="ml-2 h-4 w-4" />
            </Button>
            <DialogClose asChild>
              <Button className="">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InviteModel;
