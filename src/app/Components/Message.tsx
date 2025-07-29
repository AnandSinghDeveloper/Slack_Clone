"use client";

import { Doc, Id } from "../../../convex/_generated/dataModel";
import dynamic from "next/dynamic";
import { format, isToday, isYesterday } from "date-fns";
import { Hint } from "./hint";
import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import Thumbnail from "./Thumbnail";
import Toolbar from "./Toolbar";
import { useUpadateMessage } from "../Features/messages/api/useUpadateMessage";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRemoveMessage } from "../Features/messages/api/useRemoveMessage";
import useConfirm from "../hooks/useConfirm";
import { useReactionToggle } from "../Features/reaction/api/useReactionToggle";
import Reactions from "./Reactions";
import { usePanel } from "../hooks/usePanel";
import ThreadBar from "./ThreadBar";


const Renderer = dynamic(() => import("@/app/Components/Renderer"), {
  ssr: false,
});
const Editor = dynamic(() => import("@/app/Components/Editor"), {
  ssr: false,
});

interface MessageProps {
  id: Id<"messages">;
  memberId: Id<"members">;
  authorImage?: string;
  authorName?: string;
  isAuthor?: boolean;
  reactions: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  body: Doc<"messages">["body"];
  image?: string | undefined | null;
  createdAt: Doc<"messages">["_creationTime"];
  updatedAt: Doc<"messages">["updatedAt"];
  isEditing: boolean;
  isCompact?: boolean;
  hideThreadButton?: boolean;
  setEditingId: (id: Id<"messages"> | null) => void;
  theadTimeStamp?: number;
  threadCount?: number;
  threadImage?: string;
  threadName?: string;
}

const Formatfulltime = (date: Date) => {
  return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "HH:mm:ss")}`;
};

const Message = ({
  id,
  memberId,
  authorImage,
  authorName = "Member",
  isAuthor,
  reactions,
  body,
  image,
  createdAt,
  updatedAt,
  isEditing,
  isCompact,
  hideThreadButton,
  setEditingId,
  theadTimeStamp,
  threadCount,
  threadImage,
  threadName,

}: MessageProps) => {
  const { onOpenMessage, onclose,onOpenProfile, parentMessageId } = usePanel();

  const [ConfirmDailog, confirm] = useConfirm(
    "Delete Message",
    "Are you sure you want to delete this message? This action cannot be undone."
  );
  const { mutate: upadateMessage, isPanding: isUpadateingMessage } =
    useUpadateMessage();
  const { mutate: removeMessage, isPanding: isRemovingMessage } =
    useRemoveMessage();
  const { mutate: toggleReaction, isPanding: isReacting } = useReactionToggle();

  const isPending = isUpadateingMessage ||isReacting;

  const handleReaction = (value: string) => {
    toggleReaction(
      { messageId: id, value },
      {
        OnError: () => {
          toast.error("Failed to add reaction");
        },
      }
    );
  };
  const handleRemove = async () => {
    const ok = await confirm();

    if (!ok) return;

    removeMessage(
      { id },
      {
        OnSuccess: () => {
          toast.success("Message deleted successfully");

          if (parentMessageId === id) {
            onclose();
          }
        },
        OnError: () => {
          toast.error("Failed to delete message");
        },
      }
    );
  };
  const handleUpdate = ({ body }: { body: string }) => {
    upadateMessage(
      { id, body },
      {
        OnSuccess: () => {
          toast.success("Message updated successfully");
          setEditingId(null);
        },
        OnError: () => {
          toast.error("Failed to update message");
        },
      }
    );
  };

  if (isCompact) {
    return (
      <>
        <ConfirmDailog />
        <div
          className={cn(
            "group relative flex items-center gap-2 p-0.5 px-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors rounded-lg",
            isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
            isRemovingMessage &&
              "bg-rose-500/50  transform transition-all scale-y-0 duration-200 origin-bottom "
          )}
        >
          <div className="flex items-center justify-center gap-2">
            <Hint label={Formatfulltime(new Date(createdAt))}>
              <button className="text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hover:underline whitespace-nowrap">
                {format(new Date(createdAt), "HH:mm")}
              </button>
            </Hint>
          </div>
          {isEditing ? (
            <div className="w-full h-full">
              <Editor
                onSubmit={handleUpdate}
                defaultValue={JSON.parse(body)}
                disabled={isPending}
                varient="update"
                onCancel={() => setEditingId(null)}
              />
            </div>
          ) : (
            <div className="flex-1 min-w-0">
              <div className="flex flex-col gap-1">
                <div className="w-full overflow-hidden">
                  <Renderer value={body} />
                  <Thumbnail url={image} />
                </div>
                {updatedAt && (
                  <span className="text-xs text-muted-foreground">
                    (edited)
                  </span>
                )}
                <Reactions data={reactions} onChange={handleReaction} />
                <ThreadBar
                  count={  threadCount}
                  image={threadImage} 
                  name={threadName}
                  timeStamp={theadTimeStamp}
                  onClick={() => onOpenMessage(id)}
                />
              </div>
            </div>
          )}

          {!isEditing && (
            <Toolbar
              isPending={false}
              isAuthor={isAuthor!}
              handleEdit={() => {
                setEditingId(id);
                console.log("Setting editingId to", id);
              }}
              handleDelete={handleRemove}
              handleReaction={handleReaction}
              handleThread={() => onOpenMessage(id)}
              hideThreadButton={hideThreadButton}
            />
          )}
        </div>
      </>
    );
  }

 return (
    <>
      <ConfirmDailog />
      <div
        className={cn(
          "group relative flex items-center gap-2 p-0.5 px-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors rounded-lg",
          isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
          isRemovingMessage &&
            "bg-rose-500/50  transform transition-all scale-y-0 duration-200 origin-bottom "
        )}
      >
        <div className="flex-shrink-0 self-start mt-0.5">
          <Avatar onClick={() => onOpenProfile(memberId)} className="h-10 w-10 rounded-xl border-2 border-white dark:border-gray-700 shadow-sm ring-2 ring-gray-100 dark:ring-gray-800 transition-all duration-200 hover:shadow-md hover:ring-gray-200 dark:hover:ring-gray-600">
            <AvatarImage 
              className="rounded-xl object-cover" 
              src={authorImage} 
            />
            <AvatarFallback className="rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 text-white font-semibold text-sm shadow-inner">
              {authorName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        {isEditing ? (
          <div className="w-full h-full">
            <Editor
              onSubmit={handleUpdate}
              defaultValue={JSON.parse(body)}
              disabled={isPending}
              varient="update"
              onCancel={() => setEditingId(null)}
            />
          </div>
        ) : (
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <button
                onClick={() => onOpenProfile(memberId)}
                className="text-sm font-semibold text-gray-900 dark:text-white hover:underline"
              >
                {authorName}
              </button>

              <Hint label={Formatfulltime(new Date(createdAt))}>
                <span className="text-xs text-gray-500 dark:text-gray-400  transition-opacity">
                  {format(new Date(createdAt), "HH:mm a")}
                </span>
              </Hint>
            </div>

            <div className="mt-1 text-sm text-gray-800 dark:text-gray-200">
              <Renderer value={body} />
              <Thumbnail url={image} />
              {updatedAt ? (
                <span className="text-xs text-muted-foreground">
                  ( editied)
                </span>
              ) : null}
              <Reactions data={reactions} onChange={handleReaction} />
               <ThreadBar
                  count={threadCount}
                  image={threadImage}
                   name={threadName}
                  timeStamp={theadTimeStamp}
                  onClick={() => onOpenMessage(id)}
                />
            </div>
          </div>
        )}

        {!isEditing && (
          <Toolbar
            isPending={isPending}
            isAuthor={isAuthor!}
            handleEdit={() => setEditingId(id)}
            handleDelete={handleRemove}
            handleReaction={handleReaction}
            handleThread={() => onOpenMessage(id)}
            hideThreadButton={hideThreadButton}
          />
        )}
      </div>
    </>
  );
};

export default Message;
