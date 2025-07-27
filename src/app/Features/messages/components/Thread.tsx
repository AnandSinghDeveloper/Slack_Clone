"use client";

import { Button } from "@/components/ui/button";
import { Id } from "../../../../../convex/_generated/dataModel";
import { TriangleAlert, XIcon } from "lucide-react";

import { useGetMessagesById } from "../../messages/api/useGetMessageById";
import { TbLoader3 } from "react-icons/tb";
import Message from "@/app/Components/Message";
import { useCuerrntMember } from "../../members/api/useCuerrntMember";
import { useWorkspaceId } from "@/app/hooks/useWorkspaceId";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useCreateMessage } from "../api/useCreateMessage";
import { useGenratedUploadURL } from "../../upload/api/useGenratedUploadURL";
import { usechannelId } from "@/app/hooks/usechannelId";
import { toast } from "sonner";
import { useGetMessages } from "../api/useGetMessages";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";

const Editor = dynamic(() => import("@/app/Components/Editor"), { ssr: false });

const TIME_THRESHOLD = 10;
type CreateMessageValues = {
  workspaceId: Id<"workspace">;
  channelId: Id<"channels">;
  parentMessageId?: Id<"messages">;
  body: string;
  image?: Id<"_storage"> | undefined;
};

interface ThreadProps {
  messageId: Id<"messages">;
  onclose: () => void;
}

const formatDateLabel = (dateKey: string) => {
  const date = new Date(dateKey);
  if (isToday(date)) {
    return "Today";
  }
  if (isYesterday(date)) {
    return "Yesterday";
  }
  return format(date, "EEEE-MMMM d");
};

const Thread = ({ messageId, onclose }: ThreadProps) => {
  const channelId = usechannelId();
  const workspaceId = useWorkspaceId();

  const { data: currentMember } = useCuerrntMember({ workspaceId });
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
  const { data: message, isLoading: messageLoading } = useGetMessagesById({
    id: messageId,
  });
  const { results, loadMore, status } = useGetMessages({
    channelId,
    parentMessageId: messageId,
  });

  const canLoadMore = status === "CanLoadMore";
  const isLoadingMore = status === "LoadingMore";

  const { mutate: createMessage } = useCreateMessage();
  const { mutate: genrateUploadURL } = useGenratedUploadURL();

  const [isPending, setIsPending] = useState(false);
  const [editorKey, setEditorKey] = useState(0);

  const editorRef = useRef<Quill | null>(null);

  const handleSubmit = async ({
    image,
    body,
  }: {
    image: File | null;
    body: string;
  }) => {
    try {
      setIsPending(true);
      editorRef?.current?.enable(false);

      const values: CreateMessageValues = {
        workspaceId,
        channelId,
        parentMessageId: messageId,
        body,
        image: undefined,
      };

      if (image) {
        const url = await genrateUploadURL({ throwOnError: true });

        if (!url) {
          throw new Error("Failed to genrate upload url");
        }
        const result = await fetch(url, {
          method: "POST",
          body: image,
          headers: {
            "Content-Type": image.type,
          },
        });

        if (!result.ok) {
          throw new Error("Failed to upload image");
        }
        const { storageId } = await result.json();

        values.image = storageId;
      }

      await createMessage(values, { throwOnError: true });
      setEditorKey((prev) => prev + 1);
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
      editorRef?.current?.enable(true);
    }
  };

  const groupedMessages = results?.reduce(
    (groups, messages) => {
      const date = new Date(messages._creationTime);
      const dateKey = format(date, "yyyy-MM-dd");

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].unshift(messages);

      return groups;
    },
    {} as Record<string, typeof results>
  );

  if (messageLoading || status === "LoadingFirstPage") {
    return (
      <div className=" h-full flex flex-col">
        <div className=" flex items-center justify-between h-[49px] px-4 border-b">
          <p className="font-bold text-lg"> Theads</p>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="hover:text-black hover:bg-gray-100/70"
            onClick={onclose}
          >
            <XIcon className="size-5 stroke-1.5" />
          </Button>
        </div>
        <div className=" h-full flex flex-col gap-y-2 items-center justify-center">
          <TbLoader3 className="text-[#5e2c5f] animate-spin size-5  " />
        </div>
      </div>
    );
  }

  if (!message)
    return (
      <div className=" h-full flex flex-col">
        <div className=" flex items-center justify-between h-[49px] px-4 border-b">
          <p className="font-bold text-lg"> Theads</p>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="hover:text-black hover:bg-gray-100/70"
            onClick={onclose}
          >
            <XIcon className="size-5 stroke-1.5" />
          </Button>
        </div>
        <div className=" h-full flex flex-col gap-y-2 items-center justify-center">
          <TriangleAlert className="text-[#5e2c5f] size-7  " />
          <p className=" text-[#5e2c5f] text-sm ">message not found</p>
        </div>
      </div>
    );

  return (
    <div className=" h-full flex flex-col">
      <div className=" flex items-center justify-between h-[49px] px-4 border-b">
        <p className="font-bold text-lg"> Theads</p>
        <Button
          variant={"ghost"}
          size={"sm"}
          className="hover:text-black hover:bg-gray-100/70"
          onClick={onclose}
        >
          <XIcon className="size-5 stroke-1.5" />
        </Button>
      </div>
      <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
        {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
          <div key={dateKey}>
            <div className=" text-center my-2 relative">
              <hr className="absolute border-t left-0 right-0 top-1/2 border-gray-300" />
              <span
                className={
                  "relative inline-block bg-background px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm"
                }
              >
                {formatDateLabel(dateKey)}
              </span>
            </div>
            {messages.map((message, index) => {
              const prevMessage = messages[index - 1];
              const isCompact =
                prevMessage &&
                prevMessage.user?._id === message.user?._id &&
                differenceInMinutes(
                  new Date(message._creationTime),
                  new Date(prevMessage._creationTime)
                ) < TIME_THRESHOLD;

              return (
                <Message
                  key={message._id}
                  id={message._id}
                  memberId={message.memberId}
                  authorName={message.user?.name}
                  authorImage={message.user?.image}
                  reactions={message.reactions}
                  body={message.body}
                  image={message.image}
                  updatedAt={message.updatedAt}
                  createdAt={message._creationTime}
                  threadCount={message.threadCount}
                  threadImage={message.threadImage}
                  theadTimeStamp={message.threadTimeStamp}
                  hideThreadButton
                  isEditing={editingId === message._id}
                  isCompact={isCompact}
                  setEditingId={setEditingId}
                  isAuthor={message.memberId === currentMember?._id}
                />
              );
            })}
          </div>
        ))}

        <div
          className="h-1"
          ref={(el) => {
            if (el) {
              const observer = new IntersectionObserver(
                ([entry]) => {
                  if (entry.isIntersecting && canLoadMore) {
                    loadMore();
                  }
                },
                {
                  threshold: 1.0,
                }
              );

              observer.observe(el);
              return () => observer.disconnect();
            }
          }}
        />

        {isLoadingMore && (
          <div className=" text-center my-2 relative">
            <hr className="absolute border-t left-0 right-0 top-1/2 border-gray-300" />
            <span
              className={
                "relative inline-block bg-background px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm"
              }
            >
              <TbLoader3 className="animate-spin size-5" />
            </span>
          </div>
        )}
        <Message
          hideThreadButton
          memberId={message.memberId}
          authorName={message.user?.name}
          authorImage={message.user?.image}
          isAuthor={message.memberId === currentMember?._id}
          body={message.body}
          image={message.image}
          createdAt={message._creationTime}
          updatedAt={message.updatedAt}
          id={message._id}
          isEditing={editingId === message._id}
          setEditingId={setEditingId}
          reactions={message.reactions}
        />
      </div>
      <div className="px-4 ">
        <Editor
          onSubmit={handleSubmit}
          placeholder="Reply..."
          disabled={isPending}
          key={editorKey}
          innerRef={editorRef}
        />
      </div>
    </div>
  );
};

export default Thread;
