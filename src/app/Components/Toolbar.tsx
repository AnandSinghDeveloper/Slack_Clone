"use client";

import { Button } from "@/components/ui/button";
import { MessageSquare, PencilIcon, Smile, Trash2 } from "lucide-react";
import { Hint } from "./hint";
import EmojiPopover from "./EmojiPopover";

interface ToolbarProps {
  isAuthor: boolean;
  isPending: boolean;
  handleDelete: () => void;
  handleEdit: () => void;
  handleReaction: (value: string) => void;
  handleThread: () => void;
  hideThreadButton?: boolean;
}

const Toolbar = ({
  isAuthor,
  isPending,
  handleDelete,
  handleEdit,
  handleReaction,
  handleThread,
  hideThreadButton,
}: ToolbarProps) => {
  return (
    <div className="absolute top-0 right-5">
      <div className=" group-hover:opacity-100 opacity-0 transition-opacity border rounded-md shadow-sm bg-white ">
        <EmojiPopover
          hint="Add a Reaction"
          onEmojiSelect={(emoji) => {
            handleReaction(emoji.native);
          }}
        >
          <Button
            disabled={isPending}
            className=" hover:text-black "
            size={"sm"}
            variant={"ghost"}
          >
            <Smile
              className=" size-4"
              onClick={() => handleReaction("smile")}
            />
          </Button>
        </EmojiPopover>

        {!hideThreadButton && (
          <Hint label="Reply Message">
            <Button
              // disabled={isPending}
              className=" hover:text-black "
              size={"sm"}
              variant={"ghost"}
            >
              <MessageSquare className=" size-4" onClick={handleThread} />
            </Button>
          </Hint>
        )}

        {isAuthor && (
          <Hint label="Edit Message">
            <Button
              disabled={isPending}
              className="hover:text-black"
              size="sm"
              variant="ghost"
              onClick={handleEdit} // ✅ Correct: click triggers function
            >
              <PencilIcon className="size-4" />
            </Button>
          </Hint>
        )}

        {isAuthor && (
          <Hint label="Delete Message">
            <Button
              disabled={isPending}
              className=" hover:text-black "
              size="sm"
              variant="ghost"
              onClick={handleDelete}
            >
              <Trash2 className=" size-4"  />
            </Button>
          </Hint>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
