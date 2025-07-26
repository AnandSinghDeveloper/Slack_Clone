"use client";

import { Joan } from "next/font/google";
import { useGetMessagesRequestType } from "../Features/messages/api/useGetMessages";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import Message from "./Message";
import ChannelHero from "./ChannelHero";
import { useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { useWorkspaceId } from "../hooks/useWorkspaceId";
import { useCuerrntMember } from "../Features/members/api/useCuerrntMember";
import { TbLoader2, TbLoader3 } from "react-icons/tb";

const TIME_THRESHOLD = 10;
interface MessageListProps {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreationTime?: number;
  variant?: "channel" | "thread" | "conversation";
  data: useGetMessagesRequestType | undefined;
  loadMore: () => void;
  isLoadingMore: boolean;
  canLoadMore: boolean;
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

const MessageList = ({
  memberName,
  memberImage,
  channelName,
  channelCreationTime,
  variant = "channel",
  data,
  loadMore,
  isLoadingMore,
  canLoadMore,
}: MessageListProps) => {
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

  const workspaceId = useWorkspaceId();
  const { data: CuerrntMember } = useCuerrntMember({ workspaceId });
  
  const groupedMessages = data?.reduce(
    (groups, messages) => {
      const date = new Date(messages._creationTime);
      const dateKey = format(date, "yyyy-MM-dd");

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].unshift(messages);

      return groups;
    },
    {} as Record<string, typeof data>
  );
  return (
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
                hideThreadButton={variant === "thread"}
                isEditing={editingId === message._id}
                isCompact={isCompact}
                setEditingId={setEditingId}
                isAuthor={message.memberId === CuerrntMember?._id}
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
      {variant === "channel" && channelName && channelCreationTime && (
        <ChannelHero name={channelName} creationTime={channelCreationTime} />
      )}
    </div>
  );
};

export default MessageList;
