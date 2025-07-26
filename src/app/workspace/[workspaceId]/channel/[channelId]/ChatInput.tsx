"use client";
import { useCreateMessage } from "@/app/Features/messages/api/useCreateMessage";
import { useGenratedUploadURL } from "@/app/Features/upload/api/useGenratedUploadURL";

import { usechannelId } from "@/app/hooks/usechannelId";
import { useWorkspaceId } from "@/app/hooks/useWorkspaceId";

import dynamic from "next/dynamic";
import Quill from "quill";

import { useRef, useState } from "react";

import { toast } from "sonner";
import { Id } from "../../../../../../convex/_generated/dataModel";

const Editor = dynamic(() => import("@/app/Components/Editor"), { ssr: false });
interface ChatInputProps {
  placeholder: string;
}

const TIME_THRESHOLD = 10;
type CreateMessageValues = {
  workspaceId: Id<"workspace">;
  channelId: Id<"channels">;
  body: string;
  image?: Id<"_storage"> | undefined;
};

const ChatInput = ({ placeholder }: ChatInputProps) => {
  const workspaceId = useWorkspaceId();
  const channelId = usechannelId();

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

      await createMessage(
        values,
        { throwOnError: true }
      );
      setEditorKey((prev) => prev + 1);
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
      editorRef?.current?.enable(true);
    }

    console.log({ image, body });
  };

  return (
    <div className="px-5 w-full">
      <Editor
        key={editorKey}
        varient="create"
        placeholder={placeholder}
        innerRef={editorRef}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ChatInput;
