import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { JSX } from "react/jsx-runtime";



type ConfirmHookReturn = [() =>JSX.Element, () => Promise<boolean>];

const useConfirm = (title: string, message: string): ConfirmHookReturn => {
  const [promise, setPromise] = useState<{ resolve: (value: boolean) => void; reject: () => void } | null>(null);
  const [isOpen, setIsOpen] = useState(false); // Control dialog visibility

  
  const confirm = () => new Promise<boolean>((resolve, reject) => {
    setPromise({ resolve, reject });
    setIsOpen(true); 
  });

  const handleClose = () => {
    setPromise(null);
    setIsOpen(false); 
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  
  const ConfirmDialog = () => (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
     
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-2">
          <DialogClose asChild>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleConfirm}>
              Confirm
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmDialog, confirm];
};

export default useConfirm;