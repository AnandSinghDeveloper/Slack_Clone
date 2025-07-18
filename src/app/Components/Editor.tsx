"use client";
import Quill, { Delta, Op, QuillOptions } from "quill";
import "quill/dist/quill.snow.css";
import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Hint } from "./hint";
import { Button } from "@/components/ui/button";
import { PiTextAa } from "react-icons/pi";
import { ImageIcon, Key, Smile } from "lucide-react";
import { MdSend } from "react-icons/md";
import { cn } from "@/lib/utils";

type EditorValue = {
  image: File | null;
  body: string;
};
interface EditorProps {
  varient?: "create" | "update";
  onSubmit: ({ image, body }: EditorValue) => void;
  onCancel?: () => void;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>;
  placeholder?: string;
}
const Editor = ({
  varient = "create",
  onSubmit,
  onCancel,
  defaultValue = [],
  disabled = false,
  innerRef,
  placeholder = "Write something...",
}: EditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef(onSubmit);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const placeholderRef = useRef(placeholder);
  const disabledRef = useRef(disabled);

  const [text, setText] = useState("");
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    defaultValueRef.current = defaultValue;
    placeholderRef.current = placeholder;
    disabledRef.current = disabled;
  });

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const container = containerRef.current;

    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    const option: QuillOptions = {
      theme: "snow",
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          ["link"],
          ["blockquote", "code-block"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }, { script: "super" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                return;
              },
            },
            shift_enter: {
              key: "Enter",
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, "\n");
              },
            },
          },
        },
      },
    };

    const quill = new Quill(editorContainer, option);

    quillRef.current = quill;
    quillRef.current.focus();

    if (innerRef) {
      innerRef.current = quill;
    }

    quill.setContents(defaultValueRef.current);
    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });

    return () => {
      quill.off(Quill.events.TEXT_CHANGE);
      if (container) {
        container.innerHTML = "";
      }
      if (quillRef.current) {
        quillRef.current = null;
      }
      if (innerRef) {
        innerRef.current = null;
      }
    };
  }, [innerRef]);

  const toogleToolbar = () => {
    setIsToolbarVisible((prev) => !prev);
    const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");

    if (toolbarElement) {
      toolbarElement.classList.toggle("hidden");
    }
  };

  const isEmpty = text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

  return (
    <div className=" flex flex-col">
      <div className=" flex flex-col  border border-slate-200 rounded-md focus-within:border-slate-400 overflow-hidden focus-within:shadow-sm bg-white  transition ">
        <div ref={containerRef} className=" h-full ql-custom" />
        <div className="px-2 pb-2 flex z-[5]">
          <Hint label={isToolbarVisible ? "Hide toolbar" : "Show toolbar"}>
            <Button
              variant={"ghost"}
              size={"sm"}
              disabled={disabled}
              onClick={toogleToolbar}
              className="hover:text-accent-foreground hover:bg-accent/90"
            >
              <PiTextAa size={5} />
            </Button>
          </Hint>

          <Hint label="Emoji">
            <Button
              variant={"ghost"}
              size={"sm"}
              disabled={disabled}
              onClick={() => {}}
              className="hover:text-accent-foreground hover:bg-accent/90"
            >
              <Smile size={5} />
            </Button>
          </Hint>
          {varient === "create" && (
            <Hint label="Image">
              <Button
                variant={"ghost"}
                size={"sm"}
                disabled={disabled}
                onClick={() => {}}
                className="hover:text-accent-foreground hover:bg-accent/90"
              >
                <ImageIcon size={5} />
              </Button>
            </Hint>
          )}

          {varient === "update" && (
            <div className=" ml-auto gap-x-2 flex items-center bg-[#007a5a] hover:bg-[#007a5a]/90 text-white ] ">
              <Button variant={"outline"} disabled={false} onClick={() => {}}>
                Cancel
              </Button>
              <Button disabled={disabled} onClick={() => {}}>
                Save
              </Button>
            </div>
          )}

          {varient === "create" && (
            <Button
              disabled={disabled || isEmpty}
              size={"sm"}
              onClick={() => {}}
              className={cn(
                "ml-auto",
                isEmpty
                  ? "bg-white hover:bg-white text-accent-foreground cursor-not-allowed"
                  : " bg-[#007a5a] hover:bg-[#007a5a]/90  text-white"
              )}
            >
              <MdSend />
            </Button>
          )}
        </div>
      </div>
      <div className=" text-sm p-2 flex justify-end  text-muted-foreground">
        <strong>Shift + Retrun </strong>&nbsp; to add a new line
      </div>
    </div>
  );
};

export default Editor;
