"use client";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef } from "react";

const Editor = dynamic(() => import("@/app/Components/Editor"), { ssr: false });
interface ChatInputProps {
  placeholder: string;
}
const ChatInput = ({placeholder}:ChatInputProps) => {
  const editorRef = useRef<Quill | null>(null);
  return (
    <div className="px-5 w-full">
      <Editor
        varient="create"
        placeholder={placeholder}
        innerRef={editorRef}
        onSubmit={() => {}}
      />
    </div>
  );
};

export default ChatInput;
