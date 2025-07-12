import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";

interface InviteModelProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  joinCode: string;
}

const InviteModel = ({ open, setOpen, name, joinCode }: InviteModelProps) => {
  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${joinCode}`;

    navigator.clipboard
      .writeText(inviteLink)
      .then(() => {
        toast.success("Copied to clipboard");
      })
      .catch((error) => {
        toast.error("Failed to copy to clipboard");
      });
  };

  return (
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
      </DialogContent>
    </Dialog>
  );
};

export default InviteModel;
